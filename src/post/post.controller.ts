/* eslint-disable no-useless-return */
/* eslint-disable @typescript-eslint/prefer-optional-chain */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { request, response, type Request, type Response } from 'express'
import { PostService, postService } from './post.service'
import { type Prisma } from '@prisma/client'
// import { GoogleService } from '../google/google.service'
// import { GoogleService } from '../Services/google.service'
import { logger } from '../Services/logger.service';
import { type ClassificationArray } from '../Entities'
import {
  type GenericResponseObject,
  ResponseObject,
  GoogleError,
  TokenError,
  NeverAuthError
} from '../Services/google.errors'
import {
  type CreatePostType,
  type GetPostsType,
  type GetPostById,
  type UpdatePostType,
  type ImagesSchema,
  type VideoUpload,
  type VideoEraseType
} from './post.schema'
import { io } from '../app'
import { GoogleService } from '../Services/google.service'
import { PrismaError } from '../Services/prisma.errors'
import { prismaClient } from '../Services/database.service'
import { UserNotAuthenticated } from '../auth/auth.errors';
import {facebookService} from '../auth/auth.controller';
import { AddAudioError, FileMissingError, MissingParamError, PostError, VideoUploadError } from './post.error';

export class PostController {
  constructor (
    protected service = postService,
    protected prisma = prismaClient.prisma,
    protected googleService = new GoogleService(),
    //protected facebookService = new FacebookService(),

  ) {
    this.videoUpload=this.videoUpload.bind(this)
    this.eraseVideo=  this.eraseVideo.bind(this)
    this.eraseAudio=this.eraseAudio.bind(this)
    this.uploadAudio= this.uploadAudio.bind(this)
    this.showPost=this.showPost.bind(this)
    this.hidePost=this.hidePost.bind(this)
    this.deletePost=this.deletePost.bind(this)
    this.checkPhotosAge=this.checkPhotosAge.bind(this)
    this.getPostById=this.getPostById.bind(this)
    this.get30DaysPosts=this.get30DaysPosts.bind(this)
    this.getAllPosts=this.getAllPosts.bind(this)
    this.getPostsIds=this.getPostsIds.bind(this)
    this.createPost=this.createPost.bind(this)
    this.updatePost=this.updatePost.bind(this)
    this.addAudio=this.addAudio.bind(this)
    this.eraseLocalAudio=this.eraseLocalAudio.bind(this)
  }
  async eraseLocalAudio(req:Request<any,any,{path:string,id:string}>,res:Response){
    if (req.body.path === undefined ) return res.status(401).send(new MissingParamError('Path as string is missing'))
    if (req.body.id === undefined ) return res.status(401).send(new MissingParamError('ID as string is missing'))
      const response =await  this.service.eraseLocalAudio(req.body.path)
    if (response instanceof PostError) return res.status(500).send(response)
    const dbResponse = await this.service.eraseAudioFromDB(req.body.id)
  if (dbResponse instanceof PrismaError) return res.status(500).send(dbResponse)
    return res.status(200).send({file:req.body.path,ok:true,data:dbResponse})
}
  
 async updatePost  (
    req: Request<GetPostById['params'], any, UpdatePostType['body']>,
    res: Response
  ) {
    try {
      logger.debug({ body: req.body, function: 'updatePost.controller' })
      const files = req.files
      let { dbImages, title, heading, classification } = req.body
      const { id } = req.params
      let imagesArray: ImagesSchema[] | undefined
      logger.debug({ dbImages, files, body: req.body })
      if (dbImages !== undefined && typeof dbImages === 'string') {
        imagesArray = JSON.parse(dbImages)
      }
      // hasta aca, tengo que en imagesArray o hay un array de imagenes o tengo undefined
      // como manejo el hecho de que me lleguen imagenes ya cargadas y filas nuevas agregadas?
      let nuevoArray: ImagesSchema[] | undefined
      if (files !== undefined && files.length !== 0) {
      // aqui valido si hay files de multer para agregar.
        nuevoArray = await this.service.photoGenerator(
          files as Express.Multer.File[]
        )
        if (nuevoArray != null && imagesArray != null) { nuevoArray = [...nuevoArray, ...imagesArray] } else if (imagesArray != null) nuevoArray = imagesArray
      // logger.debug({ function: 'postController.updade', nuevoArray })
      } else nuevoArray = imagesArray
      let body = req.body
      if (body !== null && typeof body === 'object' && 'dbImages' in body) {
        body = { ...body, dbImages: undefined }
      }
      const updateDbResponse = await this.service.updatePost(
        body as any, // as Prisma.PostsUpdateInput,
        id,
        nuevoArray
      )
      if (title === undefined) {
        title = updateDbResponse.data.title as string
      }
      if (heading === undefined) {
        heading = updateDbResponse.data.heading as string
      }
      if (classification === undefined) {
        if (updateDbResponse.data.classification !== undefined) {
          classification = updateDbResponse.data
            .classification as (typeof ClassificationArray)[number]
        } else classification = 'Municipales'
      }
      // ACA DEBO VER LA LOGICA PARA QUE GENERE UN MERGE DE LOS DATOS QUE YA ESTAN EN LA DB Y LO QUE SE VA A ACTUALIZAR
      if (nuevoArray !== undefined && 'fbid' in updateDbResponse.data) {
        if (req.user === undefined ||typeof req.user !== "object" || !("id" in req.user)) throw new UserNotAuthenticated()
        
        await facebookService.updateFacebookPost(
          updateDbResponse.data.fbid as string,
          {
            title,
            heading,
            classification,
            newspaperID: id,
            images: nuevoArray?.map((id) => id.fbid)
          }
        )
      }
      //      io.emit('postUpdate', { ...updateDbResponse, images: nuevoArray })
      res.send({ ...updateDbResponse.data, images: nuevoArray })
    } catch (error) {
      logger.error({ function: 'postController.update', error })
      res.status(500).send(error)
    }
  }
  async createPost  (
    req: Request<any, any, CreatePostType['body']>,
    res: Response
  ) {
    
    const body = req.body
    const files = req.files
    const dataEmitted = { active: true, body }
    console.log(body, 'enviado')
    io.emit('postLoader', dataEmitted)
    try {
      let imagesArray
      if (files !== undefined && Array.isArray(files) && files?.length > 0) {
        imagesArray = await this.service.photoGenerator(files)
      }
      if (
        req.user !== undefined &&
        'id' in req.user &&
        typeof req.user.id === 'string'

      ) {
        const responseDB = await this.service.createPost(
          body,
          req.user.id,
          imagesArray as Array<{ fbid: string, url: string }>
        )
        io.emit('postUpdate', {
          ...responseDB,
          images: imagesArray,
          stamp: Date.now()
        })

        if (

          responseDB !== undefined &&
          typeof responseDB === 'object' &&
          responseDB !== null &&
          'id' in responseDB &&
          typeof responseDB.id === 'string'
        ) {
          if (imagesArray === undefined) {
            res.status(200).send(responseDB)
            return
          }
          const facebookFeedResponse =
            await facebookService.facebookFeed(
              body,
              imagesArray,
              responseDB.id
            )

          if (
            facebookFeedResponse !== undefined &&
            facebookFeedResponse.ok &&
            'id' in facebookFeedResponse.data.data
          ) {
            const fbidUpdate = await this.service.addFBIDtoDatabase(
              facebookFeedResponse?.data.data.id as string,
              responseDB.id
            )
            res.status(200).send(fbidUpdate)
          } else throw new Error('Error Updating Facebook Page Post')
        } else throw new Error('Error updating Database')
      }
    } catch (error) {
      logger.error({ function: 'PostController.createPost', error })
      res.status(404).send(error)
    }
  } 
async getPostsIds  (
    req: Request<any, any, any>,
    res: Response
  ) {
    const response = await this.service.getIds()
    if (response === undefined) {
      res.status(500).send('No posts found')
      return
    }
    res.status(200).send(response)
  }
  async getAllPosts  (
    req: Request<any, any, any, GetPostsType['query']>,
    res: Response
  )  {
    const { cursor, title, search, minDate, maxDate, category } = req.query
    const query: Prisma.PostsFindManyArgs['where'] & {
      AND: Array<Prisma.PostsFindManyArgs['where']>
    } = { AND: [] }

    if (title !== undefined) {
      query.AND.push({
        title: { contains: title }
      })
    }
    if (category !== undefined) {
      query.AND.push({ classification: { contains: category as string } })
    }
    if (search !== undefined) {
      query.AND.push({
        OR: [
          {
            title: search
          },
          {
            text: search
          },
          { heading: search },
          { subTitle: search }
        ]
      })
    }
    if (minDate !== undefined || maxDate !== undefined) {
      query.AND.push({
        AND: []
      })
    }
    if (minDate !== undefined && query !== undefined && 'AND' in query) {
      const data = query.AND[query.AND.length - 1]
      if (data !== undefined && 'AND' in data && Array.isArray(data.AND)) {
        data.AND.push({ createdAt: { gte: new Date(minDate) } })
      }
    }
    if (maxDate !== undefined) {
      const data = query.AND[query.AND.length - 1]
      if (
        data !== undefined &&
        'AND' in data &&
        data?.AND !== undefined &&
        Array.isArray(data.AND)
      ) {
        data.AND.push({ createdAt: { lte: new Date(maxDate) } })
      }
    }
    this.service
      .getPosts(
        {
          cursor:
            cursor === undefined
              ? undefined
              : { createdAt: new Date(cursor) },
          pagination: 50
        },
        query
      )
      .then(async (response) => {
        if (response !== undefined && response.ok) {
          const data = response.data
          const checkedResponse = await Promise.all(
            data.map(async (post: any) => {
              return await this.checkPhotosAge(
                post?.images // as Prisma.PhotosCreateInput[]
              )
                .then((checkedPhotos) => {
                  if (checkedPhotos.data !== undefined) {
                    const finalData: Prisma.PhotosCreateInput[] =
                      checkedPhotos.data // as Prisma.PhotosCreateNestedManyWithoutPostsInput
                    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
                    post = {
                      ...post,
                      images:
                        finalData.length === 1 && finalData[0] === undefined
                          ? []
                          : finalData
                    } // Prisma.PostsCreateInput
                    return post
                  }
                })

                .catch((error) =>
                  logger.error({
                    function: 'PostController.getAllPosts',
                    error
                  })
                )
            })
          )
          console.log(checkedResponse, 'texto')
          res.status(200).send(checkedResponse)
        }
      })
      .catch((error) => {
        logger.error({ function: 'PostController.getAllPosts', error })
        res.status(404).send(error)
      })
  }
  async get30DaysPosts  (req: Request<any, any, any, { page?: string }>,
    res: Response
  )  {
    try {
      const { page } = req.query

      const response = await postService.get30DaysPosts(page !== undefined ? parseInt(page) : undefined)
      if (response instanceof PrismaError) {
        res.status(500).send(response)
        return
      } else {
        res.status(200).send(response)
        return
      }
    } catch (error) {
      logger.error({ function: 'PostController.get30DaysPosts', error })
      res.status(500).send(error)
      return
    }
  }

  async getPostById  (
    req: Request<GetPostById['params']>,
    res: Response
  )  {
    const { id } = req.params
    this.service
      .getPost(id)
      .then(async (response) => {
        if (
          response !== undefined &&
          response !== null &&
          'images' in response &&
          Array.isArray(response.images)
        ) {
          this.checkPhotosAge(
            response?.images as Prisma.PhotosCreateInput[]
          )
            .then(
              async (
                checkedPhotos: GenericResponseObject<
                Prisma.PhotosCreateInput[]
                >
              ) => {
                // aca saqe el ..data hay que ver si sigue funcionando
                if ('images' in response) {
                  const data = {
                    ...response,
                    images: checkedPhotos.data
                  }
                  res.status(200).send({ error: null, ok: true, data })
                }
              }
            )
            .catch((error: any) =>
              logger.error({ function: 'PostController.getByid', error })
            )
        } else res.status(404).send(response)
      })
      .catch((error) => {
        logger.error({ function: 'PostController.getPostById', error })
        res.status(404).send(error)
      })
  }
  async checkPhotosAge  (
    photosObject: Prisma.PhotosCreateInput[]
  ): Promise<GenericResponseObject<Prisma.PhotosCreateInput[]>>  {
    if (Array.isArray(photosObject)) {
      try {
        let idArray
        let updatedLinksArray
        let dbResponse: unknown[]
        const photoArray = photosObject.filter((photo) => {
          if (
            photo.createdAt !== undefined &&
            Date.now() >
              new Date(photo.createdAt).getTime() + 1000 * 60 * 60 * 24 * 2
          ) {
            return true
          } else return false
        })
        if (Array.isArray(photoArray) && photoArray.length > 0) {
          idArray = photoArray.map((photo) => ({ id: photo.fbid }))
          updatedLinksArray = await facebookService.getLinkFromId(
            idArray
          )
          dbResponse = await Promise.all(
            updatedLinksArray.data.map(async (photo) => {
              const response = await this.prisma.$transaction([
                this.prisma.photos.updateMany({
                  where: { fbid: photo.fbid },
                  data: { url: photo.url }

                }),
                this.prisma.photos.findMany({ where: { fbid: photo.fbid } })
              ])
              return response[1][0]
            })
          )
        } else dbResponse = photosObject

        return new ResponseObject(null, true, dbResponse)
      } catch (error) {
        logger.error({ function: 'PostController.checkedPhotos', error })
        return new ResponseObject(error, false, null)
      }
    }
    return new ResponseObject(
      new Error('Error updating photos'),
      false,
      null
    )
  }
  
  async deletePost  (req: Request<GetPostById['params']>, res: Response): Promise<void>  {
    const { id } = req.params
    try {
      const { data } = await this.service.deleteById(id)
      const { audio } = data
      if (Array.isArray(audio) && audio.length > 0) {
        audio.forEach(async item => await this.googleService.fileRemove(item.driveId))
      }
      let fbResponse
      if (data.fbid !== null && typeof data.fbid === 'string') fbResponse = await facebookService.deleteFacebookPost(data.fbid)
      logger.debug({ function: 'PostController.deletePost', response, fbResponse })
      res.status(200).send(response)
    } catch (error) { logger.error({ function: 'postController.deletePost', error }) }
  }
  async hidePost  (req: Request<GetPostById['params']>, res: Response): Promise<void> {
    const { id } = req.params
    try {
      const response = await this.service.hidePost(id)
      logger.debug({ function: 'PostController.hidePost', response })
      res.status(200).send(response)
    } catch (error) { logger.error({ function: 'postController.hidePost', error }) }
  }
  async showPost  (req: Request<GetPostById['params']>, res: Response): Promise<void>  {
    const { id } = req.params
    try {
      const response = await this.service.showPost(id)
      logger.debug({ function: 'PostController.showPost', response })
      res.status(200).send(response)
    } catch (error) { logger.error({ function: 'postController.showPost', error }) }
  }
  async addAudio (req: Request, res: Response){
    console.log(req.files,"dada" )
    if (req.files=== undefined || !Array.isArray(req.files)|| req.files.length <1) return res.status(404).send(new FileMissingError())
    const errores:AddAudioError[]=[]
  const responses:{driveId:string,id:string,createdAt:Date,updatedAt:Date}[]=[]
      const promises = req.files.map(async(file)=>{
      const response = await this.service.addLocalAudioToDB(file.path)
      if (response instanceof PrismaError) errores.push(new AddAudioError(file.path))
        else responses.push(response)
      return response

    })
    await Promise.all(promises)
    if (errores.length>0) return res.status(500).send(errores)
      return res.status(200).send(responses)
    
  }
  async uploadAudio  (req: Request, res: Response)  {
    try {
      if (req.files !== undefined && Array.isArray(req.files)) {
        req.files?.forEach(async (file) => {
          const id = await this.googleService.fileUpload('audio', file.path)
          if (id instanceof TokenError || id instanceof NeverAuthError) {
            res.status(401).json(id)
            return
          } else if (id instanceof GoogleError) {
            res.status(500).json(id)
            return
          }
          if (id !== undefined) {
            const response = await this.service.addAudioToDB(id)
            if (!(response instanceof Error)) {
              res.status(200).json(response)
            } else if (response instanceof PrismaError) res.status(500).send(response)
          } else res.json(500).send(new Error('Couldnt upload file'))
        })
      }
    } catch (error) {
      logger.error({ function: 'postController.uploadAudio', error })
      res.status(500).json(error)
    }
  }
  async eraseAudio  (req: Request<any, any, any, { id: string }>, res: Response)  {
      try {
        const { id } = req.query
        const driveId = await this.prisma.audio.delete({ where: { id }, select: { driveId: true } })
        if (driveId === undefined || typeof driveId !== 'object') throw new Error('Unable to erase from database')
        const response = await this.googleService.fileRemove(driveId.driveId)
        if (response !== undefined || response !== null) res.status(200).send(response)
        else throw new Error('Unable to erase de drive Image')
      } catch (error) {
        logger.error({ function: 'postController.eraseAudio', error })
        res.status(500).send(error)
      }
    }
  async videoUpload  (req: Request<any, any, VideoUpload['body']>, res: Response)  {
    try {
      const { file, body: { title, description, tags, url } } = req
      const { username } = req.user as any
      console.log('subiendo', file, title, description, tags, url, username, req.body)
      if (url !== undefined) {
         const createResponse =await this.service.addVideoToDB(url,username)
        console.log(createResponse, 'datos ')
        if (createResponse instanceof PrismaError) return res.status(500).send(createResponse)
        return res.status(200).send(createResponse)  
      }
      if (file === undefined) {
        res.status(404).send({
          error: new MissingParamError(undefined,"Debes enviar una URL o un archivo")
        })
        return
      }
      // ARREGLAR ACA
      if (title !== undefined && (description !== undefined && description !== null && typeof description === 'string')) {
        console.log('Subir el Archivo opcion')
        const response=await this.service.subirVideo(file,title,description,tags)
        console.log(response, 'termino upload')
        if (response instanceof GoogleError) {
          res.status(500).send(response)
          return
        }
        if (typeof response === 'string') {
          const dbResponse =await this.service.addVideoToDB(response,username)
          //await this.service.prisma.video.create({ data: { youtubeId: response, author: { connect: { username } } } })
          if (dbResponse instanceof PrismaError) {
            res.status(500).send(dbResponse)
            return
          } else {
            res.status(200).send(dbResponse)
            return
          }
        }
      } else return res.status(404).send(new MissingParamError(undefined,"Debes enviar una URL o un archivo"))
    } catch (error) {
      logger.error({ function: 'postController.videoUpload', error })
      return res.status(500).send(new VideoUploadError(error))
    }
  }
  async eraseVideo  (req: Request<any, any, any, VideoEraseType['query']>, res: Response)  {
    try {
      const { youtubeId } = req.query
      const dbResponse = await this.service.prisma.video.delete({ where: { id: youtubeId } })
      console.log(dbResponse, 'data')
      if (dbResponse !== undefined) {
        const response = await this.googleService.videoRm(dbResponse.youtubeId as string)
        if (response instanceof GoogleError) {
          res.status(500).send(response)
          return
        } else res.status(200).send(response)
      }
    } catch (error) {
      logger.error({ function: 'postController.eraseVideo', error })
      res.status(500).send(error)
    }
  }

}

/* eslint-disable @typescript-eslint/no-confusing-void-expression */
/* eslint-disable @typescript-eslint/promise-function-async */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { DatabaseHandler, prismaClient } from '../Services/database.service'
import { Prisma } from '@prisma/client'
import { logger } from '../Services/logger.service'
import { type MyCursor, type GenericResponseObject, ResponseObject, GoogleError } from '../Entities'
import { UpdatePostType, type CreatePostType, type ImagesSchema } from './post.schema'
import { facebookService  } from '../auth/auth.controller'
import { GoogleService } from '../Services/google.service'
import { ColumnPrismaError, NotFoundPrismaError, UniqueRestraintError, UnknownPrismaError } from '../Services/prisma.errors'
import { ValidatePrismaError, FileMissingError } from './post.error';
import {promises} from 'fs'
export class PostService  {
  constructor (
    protected prisma = prismaClient.prisma,
    protected googleService = new GoogleService(),

  ) {
    this.eraseAudioFromDB=this.eraseAudioFromDB.bind(this)
    this.eraseLocalAudio=this.eraseLocalAudio.bind(this);
    this.photoGenerator=this.photoGenerator.bind(this)
    this.getIds=this.getIds.bind(this)
    this.get30DaysPosts=this.get30DaysPosts.bind(this)
    this.addAudioToDB=this.addAudioToDB.bind(this)
    this.showPost=this.showPost.bind(this)
    this.deleteById=this.deleteById.bind(this)
    this.hidePost=this.hidePost.bind(this)
    this.addFBIDtoDatabase=this.addFBIDtoDatabase.bind(this)
    this.updatePost=this.updatePost.bind(this)
    this.updatePhoto=this.updatePhoto.bind(this)
    this.getPost=this.getPost.bind(this)
    this.getPosts=this.getPosts.bind(this)
    this.createPost=this.createPost.bind(this)
    this.addVideoToDB=this.addVideoToDB.bind(this)
    this.subirVideo=this.subirVideo.bind(this)
  }
  async subirVideo(file:Express.Multer.File,title:string,description:string,tags?:string[]){
   try{
    console.log('Subir el Archivo opcion')
    const response: unknown | string | GoogleError =
    await this.googleService.uploadVideo(
      file.path,
      title,
      description,
      process.env.YOUTUBE_CHANNEL,
      tags)
    console.log(response, 'termino upload')
    return response
  }catch(err){

  }
    // if (typeof response === 'string') {
    //   const dbResponse = await this.service.prisma.video.create({ data: { youtubeId: response, author: { connect: { username } } } })
    //   if (dbResponse !== undefined && dbResponse !== null) {
    //     res.status(200).send(dbResponse)
    //     return
    //   } else {
    //     res.status(500).send({
    //       error: new Error('Error al escribir la base de datos'),
    //       code: 4001
    //     })
    //     return
    //   }
    // }

  }
  async addVideoToDB (url:string,username:string){
    try{
const response =  await this.prisma.video.create(
  {
    data:
    {
      url,
      youtubeId: url.split('watch?v=')[1],
      author:
      {
        connect:
        { username }
      }
    }
  })
return response
    }catch(err){
      const error= ValidatePrismaError(err as any)
      logger.error({function:'PostService.addVideoToDB',error})
      return error
    }
  }

  async eraseAudioFromDB(id:string){
    try{
      const response = await this.prisma.audio.delete({where:{id}})
      return response
    }catch(e){
      const error = ValidatePrismaError(e as any)
      logger.error({function:'PostService.eraseAudioFromDB',error})
      return error
    }
  }
  async createPost  (body: CreatePostType['body'], id: string, dataArray: Array<{ url: string, fbid: string }>)  {
    const { title, text, heading, classification, importance, audio, video } = body
    let numberImportance = 0
    let audioArray: Array<{ driveId: string, id: string }> = []
    let videoArray: Array<{ youtubeId: string, id: string }> = []
    if (audio !== undefined && Array.isArray(JSON.parse(audio ?? ''))) {
      audioArray = JSON.parse(audio)
    } else
    if (audio !== undefined) audioArray = [JSON.parse(audio)]
    if (video !== undefined && Array.isArray(JSON.parse(video))) { videoArray = JSON.parse(video) } else
    if (video !== undefined) videoArray = [JSON.parse(video)]
    if (importance !== undefined && typeof importance === 'string') numberImportance = parseInt(importance)
    console.log(videoArray, 'videoArray')
    return await this.prisma.posts.create({
      data: {
        isVisible: true,
        classification,
        heading,
        title,
        text,
        importance: numberImportance,
        images: { create: dataArray },
        author: { connect: { id } },
        audio: { connect: (audio !== undefined) ? audioArray.map(item => ({ id: item.id })) : [] },
        video: { connect: (video !== undefined) ? videoArray.map(item => ({ id: item.id })) : [] }

      },
      include: { author: { select: { lastName: true, name: true, username: true } } }
    }) // gCreate({ author: { connect: { id } }, isVisible: true, classification, heading, title, text, importance: numberImportance, images: { create: dataArray } })
  }
  async getPosts  (paginationOptions?:
    { cursor?: Partial< MyCursor>, pagination: number },
    queryOptions?: Prisma.PostsFindManyArgs['where']
    ) /*: Promise<GenericResponseObject<Prisma.PostsCreateInput[]> | undefined> */  {
      try {
        logger.debug({ queryOptions })
        const data = await this.prisma.posts.gGetAll({ images: true, author: true }, paginationOptions, queryOptions as any)
        // logger.debug({ function: 'PostService.getPosts', data })
        return data
      } catch (error) { logger.error({ function: 'PostService.getPosts', error }) }
    }
  async  getPost  (id: string)  {
    try {
      const response = await this.prisma.posts.findUnique(
        {
          where: { id },
          include: {
            author:
                    {
                      select:
                        {
                          avatar: true,
                          lastName: true,
                          name: true,
                          id: true
                        }
                    },
            images:
                  {
                    select:
                    {
                      fbid: true,
                      url: true,
                      updatedAt: true,
                      id: true
                    }
                  },
            audio: {
              select: {
                id: true,
                driveId: true
              }
            },
            video:
                  {
                    select:
                    {
                      id: true,
                      youtubeId: true,
                      url: true
                    }
                  }
          }
        })
      const latestNews = await this.prisma.posts.findMany({ where: {}, orderBy: { createdAt: 'desc' }, take: 4, include: { video: { select: { youtubeId: true, id: true } }, images: { select: { url: true, id: true } }, audio: { select: { driveId: true, id: true } } } })
      logger.debug({ function: 'PostService.getPost', data: response })
      return {
        ...response,
        latestNews: latestNews.map(({ audio, heading, id, images, title, video, createdAt, classification }) => {
          return { audio, heading, id, images, title, video, createdAt, classification }
        })
      }
    } catch (error) { logger.error({ function: 'PostService.getPost', error }) }
  }
  async updatePhoto  (photo: Prisma.PhotosCreateInput)  {
    try {
      const data = await this.prisma.photos.update({ where: { id: photo.id }, data: { ...photo, updatedAt: undefined } })
      logger.debug({ function: 'PostService.updatePhoto', data })
      return data
    } catch (error) { logger.error({ function: 'PostService.updatePhoto', error }) }
  }
  async updatePost  (postObject: UpdatePostType["body"]/*Omit<Prisma.PostsCreateInput, 'images' | 'audio' | 'importance'> & { audio?: string | undefined, importance: '1' | '2' | '3' | '4' | '5' }*/, idParam: string, photoObject: ImagesSchema[] | undefined): Promise<GenericResponseObject<Prisma.PostsUpdateInput>>  {
    let ids
    
    let ids2: string[] | undefined
    let photoObjectNoUndefinedFalse: ImagesSchema[]
    let photoObjectNoUndef: ImagesSchema[]
    const audioFromDB: Array<{ id: string, driveId: string }> =
    postObject.audio !== undefined &&
    JSON.parse(postObject.audio) !== null
      ? Array.isArray(postObject.audio)
        ? JSON.parse(postObject.audio)
        : [JSON.parse(postObject.audio)]
      : undefined
    const videoFromDb: Array<{ youtubeId: string, id: string }> | undefined = (postObject?.video !== undefined) ? Array.isArray(postObject.video) ? postObject.video as unknown as Array<{ youtubeId: string, id: string }> : [postObject.video as { youtubeId: string, id: string }] : undefined
    console.log(postObject.video, videoFromDb, 'Vodeo data')
    if ('jwt' in postObject) {
      postObject.jwt = undefined
    }
    logger.debug({ photoObject, function: 'updatePost.service' })
    if (photoObject !== undefined) {
      ids = photoObject.map((photo): string | undefined => {
        if (typeof photo === 'object' && photo !== null && 'id' in photo && photo.id !== undefined && typeof photo.id === 'string') { return photo?.id } else return undefined
      })
      ids2 = ids.filter((img: string | undefined) => img !== undefined) as string[] | undefined
      photoObjectNoUndefinedFalse = photoObject.map((photo) => {
        if (photo !== undefined && photo !== null) {
          return { fbid: photo.fbid, url: photo.url, id: photo.id }
          // if (typeof photo === 'object' && 'id' in photo && 'fbid' in photo && 'url' in photo) { return { fbid: photo.fbid, url: photo.url, id: photo.id } }
        }
        return { fbid: 'false', url: 'false', id: 'false' }
      })
      photoObjectNoUndef = photoObjectNoUndefinedFalse.filter(img => img.fbid !== 'false') as Array<{ id?: string, fbid: string, url: string }>
      try {
        const author: string = postObject.author as string
        /* aca debo hacer distintas ramas en el caso de que se tenga imagenes para borrar, tenga imagenes para agregar  */
        if (author === undefined) throw new Error('No author specified')
        const videosFromDbId =(await this.prisma.video.findMany({where:{postsId:idParam as string},select:{youtubeId:true}}))
      const arrayIds= videosFromDbId.map(item=>item.youtubeId !== null ?item.youtubeId : "") 
        const videosToAdd =videoFromDb?.map(video=>{
          if (!arrayIds.includes(video.youtubeId)) return JSON.parse(video as any)
        }).filter(videos=>videos !== undefined) as {youtubeId:string,id:string}[]
        console.log({arrayIds,videosToAdd,videosFromDbId,postId:idParam,postObject})
        const deleteAudioResponse = await this.prisma.audio.deleteMany({ where: { postsId: postObject.id as string } })
        //const deleteVideoResponse = await this.prisma.video.deleteMany({ where: { postsId: postObject.id as string } })
        const audioMap:Prisma.AudioUncheckedUpdateManyWithoutPostsNestedInput|undefined= (audioFromDB !== undefined) ? { connectOrCreate: audioFromDB.map(item => ({ create:{ driveId: item.driveId ,id:item.id},where:{driveId:item.driveId,id:item.id} })) } : undefined
        const videoMap = (videosToAdd !== undefined) ? { connect: videosToAdd.map(item => ({ id:item.id })) } : undefined
        console.log({videoMap,id:videoMap?.connect,videosToAdd})
        const imageMap = photoObjectNoUndef.map(photo => {
          return { ...photo }
        })
        const data = await this.prisma.posts.update(
          {
            where: { id: idParam },
            data: {
              ...postObject,
              isVisible: true,
              updatedAt: undefined,
              author: { connect: { id: author } },
              importance: parseInt(postObject.importance as string),
              audio: audioMap  ,
              video: videoMap,
              images: {
                deleteMany:
                  {
                  },
                create: imageMap

              }
            },
            include: { audio: { select: { driveId: true, id: true } }, images: { select: { url: true, fbid: true, id: true } }, video: { select: { youtubeId: true } } }
          })
        console.log(deleteAudioResponse, data)
        // const data = transaction

        logger.debug({ function: 'PostService.updatePost', data })
        return new ResponseObject(null, true, data)
      } catch (error) {
        logger.error({ function: 'PostService.updatePost', error })
        return new ResponseObject(error, false, null)
      }
    } else {
      try {
        const transactionResponse = await this.prisma.$transaction([
          this.prisma.audio.deleteMany({ where: { postsId: postObject.id as any } }),
          this.prisma.posts.update(
            {
              where: { id: idParam },
              data: {
                ...postObject,
                updatedAt: undefined,
                importance: parseInt(postObject.importance as string),
                author: { connect: { id: postObject.author as string } },
                images: {
                  deleteMany: {
                    NOT: {
                      id: {
                        in: ids2
                      }
                    }
                  }

                },
                audio: (audioFromDB !== undefined) ? { create: audioFromDB.map(item => ({ driveId: item.driveId })) } : undefined,
                video: (videoFromDb !== undefined) ? { connect: videoFromDb.map(item => ({ youtubeId: item.youtubeId })) } : undefined
              }
            })
        ])
        const [,data] = transactionResponse
        logger.debug({ function: 'PostService.updatePost', data })
        return new ResponseObject(null, true, data)
        // va el codigo si no hay cambios en las photos
      } catch (error) {
        logger.error({ function: 'PostService.updatePost', error })
        return new ResponseObject(null, false, error)
      }
    }
  }
  async addFBIDtoDatabase  (fbid: string, id: string)  {
    try {
      const response = await this.prisma.posts.update({ where: { id }, data: { fbid } })
      return response
    } catch (error) {
      logger.error({ function: 'PostService.addFBIDtoDB', error })
      return new ResponseObject(error, false, null)
    }
  }
  async deleteById  (id: string): Promise<GenericResponseObject<Prisma.PostsUpdateInput>>  {
    try {
      const response = await this.prisma.posts.delete({ where: { id }, include: { audio: true, images: true } })// .gDelete(id)
      return new ResponseObject(null, true, response)
    } catch (error) {
      logger.error({ function: 'PostService.deleteById', error })
      return new ResponseObject(error, false, null)
    }
  }
  async  hidePost  (id: string): Promise<GenericResponseObject<Prisma.PostsUpdateInput>>  {
    try {
      const response = await this.prisma.posts.update({ where: { id }, data: { isVisible: { set: false } } })
      return new ResponseObject(null, true, response)
    } catch (error) {
      logger.error({ function: 'PostService.hidePost', error })
      return new ResponseObject(error, false, null)
    }
  }
  async  showPost (id: string): Promise<GenericResponseObject<Prisma.PostsUpdateInput>>  {
    try {
      const response = await this.prisma.posts.update({ where: { id }, data: { isVisible: { set: true } } })
      return new ResponseObject(null, true, response)
    } catch (error) {
      logger.error({ function: 'PostService.showPost', error })
      return new ResponseObject(error, false, null)
    }
  }
  async addLocalAudioToDB(path:string){
    try{
      const response = await this.prisma.audio.create({data:{driveId:path.slice(7,path.length)}})
      return response

    }catch(err){
      const error = ValidatePrismaError(err as any)
      logger.error({function:'PostService.addLocalAudioToDB',error})
      return error
    }
  }
  async eraseLocalAudio(path:string){
    try{
       await promises.unlink('public/'+ path)
       return

    }catch(err){
      logger.error({function:"PostService",error:new FileMissingError(err)})
      return new FileMissingError(err)

    }
  }
  async addAudioToDB  (driveId: string)  {
    try {
      const response = await this.prisma.audio.create({ data: { driveId } })
      return response
    } catch (error) {
      logger.error({ function: 'PostService.addAudioToDB', error })
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
          case 'P2002':
            return new UniqueRestraintError(error, error.meta)
          case 'P2000':
            return new ColumnPrismaError(error, error.meta)
          case 'P2001':
            return new NotFoundPrismaError(error, error.meta)
          default:
            return new UnknownPrismaError(error, error.meta)
        }
      } else return error as Error
    }
  }
  async get30DaysPosts  (page: number = 1)  {
    try {
      const fromDate = new Date()
      fromDate.setDate(fromDate.getDate() - 30 * page)
      const toDate = new Date(fromDate)
      toDate.setDate(toDate.getDate() + 30)

      const response = await this.prisma.posts.findMany({
        orderBy: { createdAt: 'desc' },
        where: { createdAt: { gt: fromDate, lte: toDate } },
        include: {
          images: { select: { fbid: true, id: true, url: true, updatedAt: true } },
          video: { select: { id: true, url: true, youtubeId: true } },
          audio: { select: { id: true, driveId: true } },
          author: {
            select: {
              avatar: true,
              birthDate: true,
              lastName: true,
              name: true,
              isVerified: true
            }
          }

        }

      })
      const arrayId: any[] = []
      response.forEach(async (res) => {
        if (Array.isArray(res.images) && res.images.length > 0) {
          res.images.forEach(image => {
            if (new Date(image.updatedAt).getMilliseconds() < new Date().getMilliseconds() - 86400000 * 2) {
              arrayId.push({ id: image.fbid })
              console.log(image.fbid, image.updatedAt, 'entro')
            }
          })
          if (Array.isArray(arrayId) && arrayId.length > 0) {
            const images = await facebookService.getLinkFromId(arrayId)
            if (images.ok) {
              await this.prisma.$transaction(async (prisma) => {
                for (const image of images.data) {
                  const modd = res.images.find(imageDB => {
                    console.log(image.fbid, imageDB.id)
                    return imageDB.fbid === image.fbid
                  })
                  if (modd !== undefined) {
                    modd.url = image.url
                  }

                  await prisma.photos.updateMany({ where: { fbid: image.fbid }, data: { url: image.url } })
                }
              })
            }
          }
        }
      })

      return response
    } catch (error) {
      logger.error({ function: 'PostService.get30DaysPosts', error })
      return new UnknownPrismaError(error)
    }
  }

  async photoGenerator  (files: Express.Multer.File[], imagesParam?: ImagesSchema[]) {
    let photoArray: Array<{ id: string } | undefined> = []
    let images: ImagesSchema[] | undefined = imagesParam
    console.log(facebookService,"facebookService")
    if (files !== undefined && Array.isArray(files)) {
      photoArray = await Promise.all(files.map(async (file) => {
        const data = await facebookService.postPhoto(file)
        if (data.ok && 'id' in data.data && data.data.id !== undefined) { return data.data as { id: string } } else return undefined
      }))
      // else throw new Error(JSON.stringify({ error: 'No se enviaron imagenes', images }))
      if (photoArray !== null && Array.isArray(photoArray)) {
        const response = await facebookService.getLinkFromId(photoArray)
        // aqui se asigna a imagesArray todas las imagenes que debera tener el post ya sean las que no se eliminaron y las que se agreguen si hubiere
        if (response.ok) {
          if (images !== null && Array.isArray(images)) images = [...images, ...response.data]
          else images = [...response.data]
        }
      }
      if (images !== undefined && Array.isArray(images)) {
        photoArray = [...photoArray, ...images?.map(image => ({ id: image.fbid }))]
      }
    }
    logger.debug({ function: 'pOSTsERVICE.photoGenerator', images })
    return images
  }
  
  async getIds  ()  {
      try {
        const response = await this.prisma.posts.findMany({ select: { id: true } })
        return response
      } catch (error) {
        logger.error({ function: 'PostService.getIds', error })
      }
    }

}

export const postService = new PostService()
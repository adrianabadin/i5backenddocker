import { DatabaseHandler, prismaClient } from '../Services/database.service'
import { logger } from '../Services/logger.service'
import { type Users } from '@prisma/client'
import { type Request } from 'express'
import argon2 from 'argon2'
import jwt from 'jsonwebtoken'
import fs from 'fs'
import dotenv from 'dotenv'
import { type IResponseObject, type DoneType } from '../Entities'
import { encrypt, decrypt } from '../Services/keypair.service'
import { userLogged } from '../app'
import { FacebookService } from '../Services/facebook.service'
import { UsersService } from '../users/users.service'
import { PrismaError } from '../Services/prisma.errors'
import { type SignUpType } from './signUp.schema'
import { AuthError, UserCreateError, UserExistsError } from './auth.errors'
dotenv.config()
const simetricKey = process.env.SIMETRICKEY
const privateKey = fs.readFileSync('./src/auth/privateKey.pem', 'utf-8')
const userServicePM = new UsersService()
export class AuthService  {
  constructor (
    public prisma = prismaClient.prisma,
    protected crypt = { encrypt, decrypt },
    public facebookService = new FacebookService(),
    public usersService = userServicePM


  ) { 
    this.findFBUserOrCreate=this.findFBUserOrCreate.bind(this)
    this.isFacebookAdmin=this.isFacebookAdmin.bind(this)
    this.googleAuthVerify=this.googleAuthVerify.bind(this)
    this.jwtLoginVerify=this.jwtLoginVerify.bind(this)
    this.tokenIssuance=this.tokenIssuance.bind(this)
    this.localLoginVerify=this.localLoginVerify.bind(this) 
    this.localSignUpVerify=this.localSignUpVerify.bind(this)
    this.prisma.dataConfig.findUnique({where:{id:1}}).then(response=>{
      if (response === null) 
        {
          console.log("es null")
          this.prisma.dataConfig
            .create({data:{id:1,facebookToken:"",refreshToken:""}})
            .then(res=>console.log("cosas de dataconig",res))
            .catch(e=>console.log(e))
        }
          }).catch(e=>console.log(e))
  
   }
   
   async localSignUpVerify (req: Request<any, any, SignUpType>, username: string, password: string, done: DoneType) {
    try {
      const user = await this.usersService.findByUserName(username)
      if (user === null || user instanceof PrismaError) {
        const body: SignUpType & { hash: string, avatar?: string } =
        { ...req.body, hash: await argon2.hash(password), avatar: req.file?.path,birthDate:(new Date(req.body.birthDate as string)).toISOString() }
        const newUser = await this.usersService.createUser(body)
        if (newUser instanceof PrismaError) throw newUser
        if (newUser?.id !== undefined) {
          console.log('llego al final')
          done(null, newUser)
        } else {
          throw new UserCreateError()
        }
      } else throw new UserExistsError()
    } catch (error) {
      logger.error({
        function: 'AuthService.localSignUpVerify', error
      })
      if (error instanceof AuthError || error instanceof PrismaError) { done(error, false, { message: error.message }) } else done(error, false)
    }
  }
   async localLoginVerify  (req: Request, username: string, password: string, done: DoneType) {
    try {
      const user = await this.usersService.findByUserName(username)// await this.prisma.users.findUniqueOrThrow({ where: { username }, select: { isVerified: true, lastName: true, id: true, username: true, name: true, rol: true, hash: true } }) as any
      if (user instanceof PrismaError) done(user, false)
      if (user !== undefined && 'username' in user && user.username !== null) {
        logger.debug({
          function: 'AuthService.localLoginVerify', user: { ...user, hash: null }
        })

        let isValid: boolean = false
        if ('hash' in user && user.hash !== null && user.hash !== undefined) { isValid = await argon2.verify(user.hash, password) }
        if (isValid) {
          if (user !== null && 'id' in user && user.id !== undefined) {
            console.log('some', user)
            delete user.hash
            done(null, user, { message: 'Successfully Logged In' })
          } else done(null, false, { message: 'Password doesent match' })
        } else done(null, false, { message: 'username doesnt exist' })
      }
    } catch (error) {
      logger.error({ function: 'AuthService.localLoginVerify', error })
      done(error, false, { message: 'Database Error' })
    }
  }
    tokenIssuance  (id: string): string {
    const jwToken = jwt.sign({ sub: id }, privateKey, { algorithm: 'RS256', expiresIn: process.env.TKN_EXPIRATION })
    if (simetricKey !== undefined) { return this.crypt.encrypt(jwToken, simetricKey) } else throw new Error('simetricKey is undefined')
  }
   async jwtLoginVerify  (req: Request, jwtPayload: string, done: DoneType) {
    try {
      const id = jwtPayload.sub as unknown as string
      const userResponse = await this.prisma.users.findUnique({ where: { id } })
      // await this.prisma.users.gFindById(id, { isVerified: true, lastName: true, id: true, username: true, name: true, rol: true, accessToken: true })
      if (userResponse !== undefined && userResponse !== null) {
        const user = { ...userResponse, rol: userResponse.rol, gender: userResponse.gender }
        userLogged.accessToken = user.accessToken
        userLogged.id = user.id
        userLogged.isVerified = user.isVerified
        userLogged.lastName = user.lastName
        userLogged.name = user.name
        userLogged.rol = user.rol
        userLogged.username = user.username
        if ('username' in user && user.username !== undefined && user.username !== null) {
          logger.debug({ function: 'jwtLoginVerify', message: 'Successfully logged in' })
          done(null, user, { message: 'Successfully Logged In' })
        } else {
          logger.debug({ function: 'jwtLoginVerify', message: 'ID doesent match any registred users' })
          done(null, false, { message: 'ID doesnt match any registred users' })
        }
      }
    } catch (error) {
      logger.error({ function: 'AuthService.jwtLoginVerify', error })
      done(error, false, { message: 'Database Error' })
    }
  }
   async googleAuthVerify  (req: Request, accessToken: string, refreshToken: string, profile: any, done: DoneType) {
    try {
      console.log(accessToken, 'refresh', refreshToken)
      const { email } = profile
      this.prisma.users.findUnique({ where: { username: email }, select: { isVerified: true, lastName: true, name: true, id: true, username: true, rol: true, accessToken: true, refreshToken: true } })
        .then(user => {
          if (user?.username != null) {
            console.log(user, 'user')
            if (refreshToken !== undefined) {
              this.prisma.users.update({ where: { username: email as string }, data: { refreshToken }, select: { isVerified: true, lastName: true, name: true, id: true, username: true, rol: true, accessToken: true, refreshToken: true } })
                .then(response => {
                  return done(null, response as any, { message: 'Successfully Logged in!' })
                })
                .catch(error => {
                  logger.error({ function: 'AuthService.googleAuthVerify', error })
                  return done(null, false, { message: 'Error updating refreshToken' })
                })
            }
            return done(null, user as any, { message: 'Successfully Logged in!' })
          } else {
            req.flash('at', accessToken)
            req.flash('rt', refreshToken)
            return done(null, false, { message: 'username doesnt exist' })
          }
        }).catch(error => {
          logger.error({ function: 'AuthService.googleAuthVerify', error })
          done(error, false, { message: 'Database Error' })
        })
    } catch (error) {
      logger.error({ function: 'AuthService.googleAuthVerify', error })
      done(error, false, { message: 'Database Error' })
    }
  }
   async isFacebookAdmin  (token: string): Promise<boolean>  {
    let bool: boolean = false
    try {
      const resp = await fetch(`https://graph.facebook.com/me/accounts?access_token=${token}`)
      const response = await resp.json()
      if ('data' in response && Array.isArray(response.data)) {
        response.data.forEach((page: any) => {
          if ('id' in page && page.id === process.env.FACEBOOK_PAGE) bool = true
        })
      }
    } catch (error) {
      logger.error({ function: 'isFacebookAdmin.authService', error })
    }
    return bool
  }
  async findFBUserOrCreate  (email: string,
    profile: any,
    accessToken: string,
    birthDay?: string,
    phone?: string,
    gender?: 'MALE' | 'FEMALE' | 'NOT_BINARY') {
    const admin = await this.isFacebookAdmin(accessToken)
    let finalAccessToken: string | undefined = ''
    if (admin) finalAccessToken = await this.facebookService.getLongliveAccessToken(accessToken, profile.id)
    console.log(finalAccessToken,"Long lived token")
      const user = await this.usersService.findByUserName(email) // this.prisma.users.findUnique({ where: { username: email } })
      console.log(user,"Usuarios",admin)
      if (user instanceof PrismaError) throw user
    if (user != null) { // usuario existe
      console.log("user exist",user.rol,admin)
      if (user.rol !== 'ADMIN' && admin ===true) { // el rol del usuario no es admin, pero administra la pagina
        console.log("algo")
        const response =
          await this.prisma.users.update({
            where: { username: email },
            data: {
              accessToken: finalAccessToken,
              isVerified: true,
              avatar: profile.photos[0].value,
              fbid: profile.id,
              rol: 'ADMIN'
            }

          })
          console.log(response,"updated",accessToken)
        return { ...response, rol: response.rol }
      } else if (user.rol === 'ADMIN' && !admin) {
        const response = await this.prisma.users.update(
          {
            where: { username: email },
            data: {
              isVerified: true,
              accessToken: finalAccessToken,
              avatar: profile.photos[0].value,
              fbid: profile.id,
              rol: 'USER'
            }

          })
        return { ...response, rol: response.rol }
      } else if (user.accessToken === null || user.avatar === null || user.fbid === null || (user.isVerified === undefined || !user.isVerified)) {
        const response = await this.prisma.users.update({ where: { username: email }, data: { accessToken: finalAccessToken, isVerified: true, avatar: profile.photos[0].value, fbid: profile.id } })
        return response
      }
      return user
    } else { // usuario no existe valida si es admin o user y si tiene la informacion lo crea
      if (gender !== null && phone !== undefined && birthDay !== null) {
        // cambiar para usar userService
        const response = await this.usersService.createUser({
          birthDate: birthDay,
          gender,
          phone,
          username: email,
          avatar: profile.photos[0].value,
          name: profile.name.givenName as string,
          lastName: profile.name.familName as string,
          hash: '',
          password: ''

        }, profile.id, accessToken)
        

        return response
      } // no se pasaron los datos opcionales ala funcion entonces devuelve un undefined y vuelve  a la strategy para continuar flujo
    }
  }

}

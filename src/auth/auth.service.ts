import { DatabaseHandler, prismaClient } from '../Services/database.service'
import { logger } from '../Services/logger.service'
import { type Users } from '@prisma/client'
import { type Request } from 'express'
import argon2 from 'argon2'
import jwt from 'jsonwebtoken'
import { JWTLoginError, LocalLoginError, PasswordMissMatchError, TokenExpiredError, TokenUndefinedError, UserDoesntExistError } from './auth.errors';
import fs from 'fs'
import dotenv from 'dotenv'
import { type IResponseObject, type DoneType } from '../Entities'
import { encrypt, decrypt } from '../Services/keypair.service'
import { userLogged } from '../app'
import { facebookService } from './auth.controller'
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
    public usersService = userServicePM


  ) { 
    this.findFBUserOrCreate=this.findFBUserOrCreate.bind(this)
    this.isFacebookAdmin=this.isFacebookAdmin.bind(this)
    this.googleAuthVerify=this.googleAuthVerify.bind(this)
    this.jwtLoginVerify=this.jwtLoginVerify.bind(this)
    this.tokenIssuance=this.tokenIssuance.bind(this)
    this.localLoginVerify=this.localLoginVerify.bind(this) 
    this.localSignUpVerify=this.localSignUpVerify.bind(this)
    this.checkDataConfig=this.checkDataConfig.bind(this)
    this.getLongliveAccessToken=this.getLongliveAccessToken.bind(this)
  
   }
   async  getLongliveAccessToken  (accessToken: string, userId: string) {
    let response = await fetch(`https://graph.facebook.com/oauth/access_token?grant_type=fb_exchange_token&client_id=${process.env.FACEBOOK_APP_ID}&client_secret=${process.env.FACEBOOK_APP_SECRET}&fb_exchange_token=${accessToken}`)
    const longUserToken = (await response.json()).access_token as string
    response = await fetch(`https://graph.facebook.com/${userId}/accounts?
  access_token=${longUserToken}`) // console.log(await response.json())
    const streamResponse = (await response.json())
    let data: string = ''
    if (streamResponse !== null && 'data' in streamResponse && Array.isArray(streamResponse?.data)) {
      streamResponse.data.forEach((page: any) => {
       // console.log(page, process.env.FACEBOOK_APP_ID)
        if (page.id === process.env.FACEBOOK_PAGE) data = page.access_token
      })
    }
    if (data !== '') return data
  }
  
   async checkDataConfig (){
    console.log("ejecudando autoejecutable")
     try{
      
     const response = await prismaClient.prisma.dataConfig.findUniqueOrThrow({where:{id:1}})
     console.log("hay daaconfig",response)
   }catch(e){
     console.log("creando dataconfig")
     const response= await prismaClient.prisma.dataConfig.create({data:{id:1,facebookToken:"",refreshToken:""}})
   console.log(response)
   }
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
          return done(null, newUser)
        } else {
          throw new UserCreateError()
        }
      } else throw new UserExistsError()
    } catch (error) {
      logger.error({
        function: 'AuthService.localSignUpVerify', error
      })
      if (error instanceof AuthError || error instanceof PrismaError) { return done(error, false, { message: error.message }) } else return done(error, false)
    }
  }


   async localLoginVerify  (req: Request, username: string, password: string, done: DoneType) {
    try {
      const user = await this.usersService.findByUserName(username)// await this.prisma.users.findUniqueOrThrow({ where: { username }, select: { isVerified: true, lastName: true, id: true, username: true, name: true, rol: true, hash: true } }) as any
      if (user instanceof PrismaError)  return done(new UserDoesntExistError(), false,{message:'El Usuario no existe'})
      if (user === undefined || user ===null) return done(new UserDoesntExistError(), false,{message:'El Usuario no existe'})
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
            return done(null, user, { message: 'Successfully Logged In' })
          } else return done(new UserDoesntExistError(), false, { message: 'El usuario no esta registrado' })
        } else return done(new PasswordMissMatchError(), false, { message: 'Usuario y contraseña no coinciden' })
      }
    } catch (error) {
      logger.error({ function: 'AuthService.localLoginVerify', error })
      return done( new LocalLoginError(error), false, { message: 'Database Error' })
    }
  }
    tokenIssuance  (id: string): string {
    const jwToken = jwt.sign({ sub: id }, privateKey, { algorithm: 'RS256', expiresIn: process.env.TKN_EXPIRATION })
    if (simetricKey !== undefined) { return jwToken/*this.crypt.encrypt(jwToken, simetricKey)*/ } else throw new Error('simetricKey is undefined')
  }
   async jwtLoginVerify  (req: Request, jwtPayload: string, done: DoneType) {
    console.log("llega al verify",jwtPayload)
    try {
      if (jwtPayload === "Token Undefined") return done(new TokenUndefinedError(),false,{message:"Undefined Token"})  
      if (jwtPayload === "Token Expired") return done(new TokenExpiredError(),false,{message:"Invalid Token"})
      const id = jwtPayload.sub as unknown as string
      console.log(id,"ingreso")
      const userResponse = await this.prisma.users.findUnique({ where: { id } })
      console.log(userResponse,"usuario")
      // await this.prisma.users.gFindById(id, { isVerified: true, lastName: true, id: true, username: true, name: true, rol: true, accessToken: true })
      if (userResponse !== undefined && userResponse !== null) {
        const user = { ...userResponse, rol: userResponse.rol, gender: userResponse.gender }
        console.log(user,"usuario",userResponse)
        userLogged.accessToken = user.accessToken
        userLogged.id = user.id
        userLogged.isVerified = user.isVerified
        userLogged.lastName = user.lastName
        userLogged.name = user.name
        userLogged.rol = user.rol
        userLogged.username = user.username
        if ('username' in user && user.username !== undefined && user.username !== null) {
          logger.debug({ function: 'jwtLoginVerify', message: 'Successfully logged in' })
          return done(null, user, { message: 'Successfully Logged In' })
        } else {
          logger.debug({ function: 'jwtLoginVerify', message: 'ID doesent match any registred users' })
          return done(new JWTLoginError(), false, { message: 'ID doesnt match any registred users' })
        }
      }
    } catch (error) {
      logger.error({ function: 'AuthService.jwtLoginVerify', error })
      return done(new JWTLoginError(), false, { message: 'Database Error' })
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
    if (admin) finalAccessToken = await this.getLongliveAccessToken(accessToken, profile.id)
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

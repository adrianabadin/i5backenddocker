import { type NextFunction, type Request, type Response } from 'express'
import { AuthService } from './auth.service'
import { encrypt, decrypt } from '../Services/keypair.service'
import dotenv from 'dotenv'
import { userLogged } from '../app'
import * as jwt from 'jsonwebtoken'
import fs from 'fs'
import { FacebookService } from '../Services/facebook.service'
import { GoogleService, oauthClient } from '../Services/google.service'
import { logger } from '../Services/logger.service'
import { prismaClient } from '../Services/database.service'
import passport from 'passport'
import {type Prisma} from "@prisma/client"
import { AuthError, TokenExpiredError, TokenUndefinedError } from './auth.errors'
dotenv.config()
const simetricKey = (process.env.SIMETRICKEY !== undefined) ? process.env.SIMETRICKEY : ''
export let facebookService:FacebookService
export class AuthController {
  constructor (
    public service = new AuthService(),
    public cryptService = { encrypt, decrypt }
  ) {
    this.authState=this.authState.bind(this)
    this.gOAuthLogin=this.gOAuthLogin.bind(this)
    this.facebookLogin=this.facebookLogin.bind(this)
    this.isRTValid=this.isRTValid.bind(this)
    this.innerToken=this.innerToken.bind(this)
    this.localLogin=this.localLogin.bind(this)
    this.jwtLogin=this.jwtLogin.bind(this)
    this.issueJWT=this.issueJWT.bind(this)
    this.sendAuthData=this.sendAuthData.bind(this)
    this.jwtRenewalToken=this.jwtRenewalToken.bind(this)
    this.Guard=this.Guard.bind(this)
    this.isAuth=this.isAuth.bind(this)
  }
   Guard  (req: Request, res: Response, next: NextFunction) {
    let id
    if (req.user !== undefined && 'id' in req.user) {
      id = req.user.id
    } else return
    if (id !== undefined && id !== null) {
      const jwt = this.service.tokenIssuance(id as string)
      res.clearCookie('jwt')
      res.cookie('jwt', jwt)
      next()
    }
  }
   jwtRenewalToken (req: Request, res: Response, next: NextFunction) {
    console.log("llego aqui")
    if (req.isAuthenticated()) {
      console.log(req.cookies)
      if ('id' in req.user) {
        const token = this.service.tokenIssuance(req.user.id as string)
        //aca debe haber un errorr con el access token 
        console.log(req.user,"user")
        if ("accessToken" in req.user){
          facebookService= new FacebookService(req.user.accessToken as string)
          console.log({facebookService},"data")
        }
        res.clearCookie('jwt')
        res.cookie('jwt', token,{sameSite:"lax",secure:true,httpOnly:true,path:"*"})
        next()
      }
    }
  }
  async sendAuthData  (req: Request, res: Response) {
    if (req.isAuthenticated()) {
      let refreshToken
      if ("accessToken" in req.user){
        facebookService= new FacebookService(req.user.accessToken as string)
      }

      try {
       
        if ('rol' in req.user && req.user.rol === 'ADMIN') {
          await this.service.checkDataConfig()
          refreshToken = (await this.service.prisma.dataConfig.findUniqueOrThrow({ where: { id: 1 }, select: { refreshToken: true } })).refreshToken
        }
        console.log(refreshToken)
        res.status(200).json({ ...req.user, refreshToken })
      } catch (error) { logger.error({ function: 'AuthController.sendAuthData', error }) }
    } else res.status(401).send({data:{text:"Error al ingresar " }})
  }
  isAuth(req: Request, res: Response, next: NextFunction){
    passport.authenticate('jwt',(err:AuthError|null,user:Prisma.UsersCreateInput |false,info:any)=>{
      console.log({err,user,info},info.message,info instanceof Error)
      if (err instanceof AuthError) return  res.status(401).send(err)
      if (err !== null) return res.status(500).send({ok:false,text:"Fallo al Autenticar Token"})
      if (err === null && info instanceof Error && info.message==='No auth token') {console.log("por aca papa "); return res.status(401).send(new TokenUndefinedError())}
      if (err === null && info instanceof Error && info.message==='jwt expired') {console.log("expiro "); return res.status(401).send(new TokenExpiredError())}
      if (!user ) return res.status(401).send({ok:false,text:"Usuario NO encontrado"})
      req.logIn(user,{session:false} as any)  
      const token = this.service.tokenIssuance(user.id as string)
      res.clearCookie("jwt")
      res.cookie('jwt',token)
      console.log("Autenticado")
      return next()
    })(req,res,next)
  }
   issueJWT  (req: Request, res: Response, next: NextFunction) {
    console.log('issuing')
    if (req.isAuthenticated()) {
      console.log('authenticated')
      if ("accessToken" in req.user){
        facebookService= new FacebookService(req.user.accessToken as string)
      }

      if ('id' in req?.user) {
        const jwt = this.service.tokenIssuance(req.user.id as string)
        const encriptedToken = this.cryptService.encrypt(jwt, simetricKey)

        res.status(200).send(encriptedToken)
      }
    }
    console.log('finished')
    next()
  }
   jwtLogin (req: Request, res: Response, next: NextFunction) {
    if (req.isAuthenticated()) {
      if ("accessToken" in req.user){
        facebookService= new FacebookService(req.user.accessToken as string)
      }

      console.log('is Auth')
      if ('id' in req?.user) {
        const token = this.service.tokenIssuance(req.user.id as string)
        res.clearCookie('jwt')
        res.status(200).send({ ...req.user, token, hash: undefined, refreshToken: undefined, accessToken: undefined })
      } else res.status(401).send({ ok: false })
    } else res.status(401).send({ ok: false })
  }
  async localLogin (req: Request, res: Response) {
    console.log(req.user, 'Login', req.body)
    try {
      if (req.isAuthenticated() && 'id' in req?.user && req.user.id !== null && typeof req.user.id === 'string') {
        if ("accessToken" in req.user){
          facebookService= new FacebookService(req.user.accessToken as string)
        }

        const token = this.service.tokenIssuance(req.user.id)
        res.clearCookie('jwt')
        res.cookie('jwt', token)
        let refreshToken
        if ('rol' in req.user && req.user.rol !== null && req.user.rol === 'ADMIN') {
          await this.service.checkDataConfig()
          refreshToken = await this.service.prisma.dataConfig.findUniqueOrThrow({ where: { id: 1 } })
        }
        res.status(200).send({ ...req.user, password: null, token, refreshToken })
      } else res.status(404).send({ ok: false, message: 'Invalid Credentials' })
    } catch (error) {
      logger.error({ function: 'AuthController.localLogin', error })
      return res.status(500).json(error)
    }
  }
  async innerToken  (req: Request<any, any, any, { code: string }>, res: Response) {
    try {
      let response
      const { code } = req.query
      if (code !== undefined) {
        const { tokens } = await oauthClient.getToken(code)
        if (tokens.refresh_token !== undefined) {
          oauthClient.setCredentials(tokens)
          GoogleService.rt = tokens.refresh_token
          await this.service.checkDataConfig()
          response = (await this.service.prisma.dataConfig.upsert({ where: { id: 1 }, update: { refreshToken: tokens.refresh_token }, create: { refreshToken: tokens.refresh_token } })).refreshToken
        }
      }
      res.status(200).send({ token: response, ok: true })
    } catch (error) {
      logger.error({ function: 'AuthController.innerToken', error })
      res.status(401).send(error)
    }
  }
  async isRTValid (req: Request<any, any, any, { code: string }>, res: Response) {
    try {
      await this.service.checkDataConfig()
      const refreshToken = (await this.service.prisma.dataConfig.findUnique({ where: { id: 1 }, select: { refreshToken: true } }))?.refreshToken
      oauthClient.setCredentials({ refresh_token: refreshToken })
      const data = await oauthClient.getAccessToken()
      console.log(data)
      res.send(data)
    } catch (error) {
      console.log(error)
      res.redirect('/auth/innerAuth')
    }
  }
   facebookLogin (req: Request, res: Response) {
    if (req.isAuthenticated() && 'id' in req?.user && req.user.id !== null && typeof req.user.id === 'string') {
      if ("accessToken" in req.user){
        facebookService= new FacebookService(req.user.accessToken as string)
      }

      const token = this.service.tokenIssuance(req.user.id)
      res.clearCookie('jwt')
      res.cookie('jwt', token)
      console.log(JSON.parse(req.query.state as string).cbURL as string)
      res.redirect(JSON.parse(req.query.state as string).cbURL as string)
    } else res.status(404).send({ ok: false, message: 'Invalid Credentials', code: '404' })
  }
   gOAuthLogin (req: Request, res: Response) {
    if (req.isAuthenticated() && 'id' in req?.user && req.user.id !== null && typeof req.user.id === 'string') {
      if ("accessToken" in req.user){
        facebookService= new FacebookService(req.user.accessToken as string)
      }
      const token = this.service.tokenIssuance(req.user.id)
      res.clearCookie('jwt')
      res.cookie('jwt', token)
      res.redirect('http://localhost:3000')
      // res.status(200).send({ message: 'Authenticated', token })
    } else res.status(401).send({ message: 'unAuthorized' })
  }
  async authState (req: Request, _res: Response, next: NextFunction) {
    if (userLogged.id === '' && req.cookies.jwt !== null) {
      let tempJwt = req.cookies.jwt
      tempJwt = tempJwt !== undefined ? tempJwt : req.body.jwt !== undefined ? req.body.jwt : undefined
      if (tempJwt !== undefined) {
        const simetricKey = process.env.SIMETRICKEY
        const publicKey = fs.readFileSync(`${process.env.KEYS_PATH}/publicKey.pem`, 'utf-8')
        const jwtoken = decrypt(req.cookies.jwt, simetricKey)
        const token = jwt.verify(jwtoken, publicKey)
        const prisma = prismaClient// new PrismaClient()
        if (token !== undefined) {
          const user = await prisma.prisma.users.findUnique({ where: { id: token.sub as string }, select: { fbid: true, username: true, accessToken: true, id: true, isVerified: true, rol: true, lastName: true, name: true } })
          if (user !== null) {
            facebookService = new FacebookService(user.accessToken as string)
            if (user.accessToken !== null) { userLogged.accessToken = await facebookService.assertValidToken(user.accessToken) }
            userLogged.id = user.id
            userLogged.isVerified = user.isVerified
            userLogged.lastName = user.lastName
            userLogged.name = user.name
            userLogged.rol = user.rol as any
            userLogged.username = user.username
            if (user.fbid !== null) userLogged.fbid = user.fbid
            req.user = userLogged
          }
        }
      }
      req.user = userLogged
    }
    next()
  }
}
//@ts-ignore
export default facebookService
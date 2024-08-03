/* eslint-disable @typescript-eslint/no-misused-promises */
import { Strategy, ExtractJwt } from 'passport-jwt'
import passport from 'passport'
import { AuthService } from './auth.service'
import { decrypt } from '../Services/keypair.service'
import jwt from  "jsonwebtoken"
import { Response, type Request } from 'express'
import fs from 'fs'
import dotenv from 'dotenv'
import { TokenExpiredError, TokenUndefinedError } from './auth.errors'
// import * as jwt from 'jsonwebtoken'
dotenv.config()
const publicKey = fs.readFileSync(`${process.env.KEYS_PATH}/publicKey.pem`, 'utf-8')
const simetricKey = '+vdKrc3rEqncv+pgGy9WmhZXoQfWsPiAuc1UA5yfujE='// process.env.SIMETRICKEY

const authService = new AuthService()
export const cookieExtractor = (req: Request,res:Response) => {
  let { jwt: token } = req.cookies
  //if ('jwt' in req.body && req.body.jwt !== null && token === undefined) { token = req.body.jwt }
  console.log(token,"token")
  if (token !== undefined ) {
    //console.log("key",decrypt(token,simetricKey))
    //if (simetricKey !== undefined) {
    if (jwt.verify(token,publicKey)){  
    console.log("llega al return")
      return token}
      else res.status(401).send(new TokenExpiredError())
   // else throw new Error('simetricKey is undefined')
  } else res.status(401).send(new TokenUndefinedError())
}
//ExtractJwt.fromExtractors([cookieExtractor])
passport.use(new Strategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: publicKey,
  algorithms: ['RS256'],
  passReqToCallback: true
}, authService.jwtLoginVerify))

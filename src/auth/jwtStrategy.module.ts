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
export const cookieExtractor = (req: Request) => {
  let { jwt: token } = req.cookies
  console.log(token,"token")
  if (token !== undefined ) {
    return token
  } else return null
}
//ExtractJwt.fromExtractors([cookieExtractor])
passport.use(new Strategy({
  jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
  secretOrKey: publicKey,
  algorithms: ['RS256'],
  passReqToCallback: true
}, authService.jwtLoginVerify))

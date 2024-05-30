/* eslint-disable @typescript-eslint/no-misused-promises */
import express, { type NextFunction, type Request, type Response } from 'express'
import cookieParser from 'cookie-parser'
import passport from 'passport'
import './auth/localStrategy.module'
import './auth/googleOauth2.module'
import './auth/jwtStrategy.module'
import './auth/facebook.module'

import { routeHandler } from './app.routes'
import cors from 'cors'

import morgan from 'morgan'

// const authService = new AuthService()
export const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser()) // "Whether 'tis nobler in the mind to suffer"

app.use(morgan('dev'))
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3000/managment'],
  credentials: true,
  preflightContinue: true
}))
app.use(express.static('public'))

// const store = new PrismaSessionStore(prismaClient, {
//   checkPeriod: 2 * 60 * 1000, // ms
//   dbRecordIdIsSessionId: true,
//   dbRecordIdFunction: undefined,
//   ttl: 60 * 60 * 1000 * 24
// })
// const sessionMiddleware = Session({

//   resave: false,
//   saveUninitialized: false,
//   cookie: { sameSite: 'none', secure: true, httpOnly: false },
//   secret: 'Dilated flakes of fire fall, like snow in the Alps when there is no wind'

// })

// app.use(sessionMiddleware)
// app.use(flash())
app.use(passport.initialize())
// app.use(passport.session())
// passport.serializeUser(authService.serialize)
// passport.deserializeUser(authService.deSerialize)
routeHandler(app)

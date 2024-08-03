/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
import { NextFunction, Response, Router, type Request } from 'express'
import multer from 'multer'
import { PostController } from './post.controller'
import passport from 'passport'
import { getPostById, createPostSchema, videoUploadSchema, videoEraseSchema } from './post.schema'
import { schemaValidator } from '../middlewares/zod.validate'
import { AuthController } from '../auth/auth.controller'
import cookieParser from 'cookie-parser';
const authController = new AuthController()
const postController = new PostController()
const storage = multer.diskStorage({
  destination: function (
    _req: Request,
    _file: Express.Multer.File,
    cb: (...arg: any) => any
  ) {
    cb(null, './public')
  },
  filename: function (
    _req: Request,
    file: Express.Multer.File,
    cb: (...args: any) => any
  ) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname)
  }
})
export const upload = multer({ storage })
export const postRouter = Router()
/**
 * AUDIO ROUTES
 */
postRouter.post("/audiolocal",authController.isAuth,upload.array('audio'),postController.addAudio)
postRouter.post('/audio',authController.isAuth, upload.array('audio'), postController.uploadAudio)
postRouter.delete('/audioRemove',authController.isAuth, postController.eraseAudio)
postRouter.get(
  '/getPostById/:id',
  schemaValidator(getPostById),
  postController.getPostById
)
postRouter.delete('/audiolocal',authController.isAuth,upload.array('audio'),postController.eraseLocalAudio)
/**
 * VIDEO ROUTES
 */
postRouter.post(
  '/videoAdd',
  authController.isAuth,
  upload.single('video'),

  postController.videoUpload)
postRouter.delete('/videoRm',
  authController.isAuth,
  schemaValidator(videoEraseSchema),
  postController.eraseVideo)

/**
 * POST ROUTES
 */
postRouter.post(
  '/create',
  authController.isAuth,
  upload.array('images'),
  schemaValidator(createPostSchema),
  postController.createPost
)
postRouter.get('/getIds', postController.getPostsIds)
postRouter.get(
  '/getPosts',
  /* schemaValidator(getPostsSchema), */
  postController.getAllPosts
)
postRouter.get('/get30days', postController.get30DaysPosts)
postRouter.put(
  '/updatePost/:id', authController.isAuth,
  upload.array('images'),
  postController.updatePost
)
// postRouter.put('/hidePost/:id', passport.authenticate('jwt', { session: false }), authController.jwtRenewalToken, postController.hidePost)
postRouter.delete('/deletePost/:id', authController.isAuth, schemaValidator(getPostById), postController.deletePost)
postRouter.put('/hidePost/:id', authController.isAuth, schemaValidator(getPostById), postController.hidePost)
postRouter.put('/showPost/:id', authController.isAuth, schemaValidator(getPostById), postController.showPost)

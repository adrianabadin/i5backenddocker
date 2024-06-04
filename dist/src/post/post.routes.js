"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postRouter = exports.upload = void 0;
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const post_controller_1 = require("./post.controller");
const passport_1 = __importDefault(require("passport"));
const post_schema_1 = require("./post.schema");
const zod_validate_1 = require("../middlewares/zod.validate");
const auth_controller_1 = require("../auth/auth.controller");
const authController = new auth_controller_1.AuthController();
const postController = new post_controller_1.PostController();
const storage = multer_1.default.diskStorage({
    destination: function (_req, _file, cb) {
        cb(null, './public/temp');
    },
    filename: function (_req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname);
    }
});
exports.upload = (0, multer_1.default)({ storage });
exports.postRouter = (0, express_1.Router)();
/**
 * AUDIO ROUTES
 */
exports.postRouter.post('/audio', exports.upload.array('audio'), postController.uploadAudio);
exports.postRouter.delete('/audioRemove', postController.eraseAudio);
exports.postRouter.get('/getPostById/:id', (0, zod_validate_1.schemaValidator)(post_schema_1.getPostById), postController.getPostById);
/**
 * VIDEO ROUTES
 */
exports.postRouter.post('/videoAdd', exports.upload.single('video'), passport_1.default.authenticate('jwt', { session: false }), authController.jwtRenewalToken, postController.videoUpload);
exports.postRouter.delete('/videoRm', (0, zod_validate_1.schemaValidator)(post_schema_1.videoEraseSchema), passport_1.default.authenticate('jwt', { session: false }), postController.eraseVideo);
/**
 * POST ROUTES
 */
exports.postRouter.post('/create', exports.upload.array('images', 5), passport_1.default.authenticate('jwt', { session: false }), authController.jwtRenewalToken, (0, zod_validate_1.schemaValidator)(post_schema_1.createPostSchema), postController.createPost);
exports.postRouter.get('/getIds', postController.getPostsIds);
exports.postRouter.get('/getPosts', 
/* schemaValidator(getPostsSchema), */
postController.getAllPosts);
exports.postRouter.get('/get30days', postController.get30DaysPosts);
exports.postRouter.put('/updatePost/:id', passport_1.default.authenticate('jwt', { session: false }), authController.jwtRenewalToken, exports.upload.array('images', 5), postController.updatePost);
// postRouter.put('/hidePost/:id', passport.authenticate('jwt', { session: false }), authController.jwtRenewalToken, postController.hidePost)
exports.postRouter.delete('/deletePost/:id', passport_1.default.authenticate('jwt', { session: false }), authController.jwtRenewalToken, (0, zod_validate_1.schemaValidator)(post_schema_1.getPostById), postController.deletePost);
exports.postRouter.put('/hidePost/:id', passport_1.default.authenticate('jwt', { session: false }), authController.jwtRenewalToken, (0, zod_validate_1.schemaValidator)(post_schema_1.getPostById), postController.hidePost);
exports.postRouter.put('/showPost/:id', passport_1.default.authenticate('jwt', { session: false }), authController.jwtRenewalToken, (0, zod_validate_1.schemaValidator)(post_schema_1.getPostById), postController.showPost);

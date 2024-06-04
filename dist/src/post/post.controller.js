"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostController = void 0;
/* eslint-disable no-useless-return */
/* eslint-disable @typescript-eslint/prefer-optional-chain */
/* eslint-disable @typescript-eslint/no-misused-promises */
const express_1 = require("express");
const post_service_1 = require("./post.service");
// import { GoogleService } from '../google/google.service'
// import { GoogleService } from '../Services/google.service'
const facebook_service_1 = require("../Services/facebook.service");
const logger_service_1 = require("../Services/logger.service");
const google_errors_1 = require("../Services/google.errors");
const app_1 = require("../app");
const google_service_1 = require("../Services/google.service");
const prisma_errors_1 = require("../Services/prisma.errors");
const database_service_1 = require("../Services/database.service");
class PostController {
    constructor(service = post_service_1.postService, prisma = database_service_1.prismaClient.prisma, googleService = new google_service_1.GoogleService(), facebookService = new facebook_service_1.FacebookService()) {
        this.service = service;
        this.prisma = prisma;
        this.googleService = googleService;
        this.facebookService = facebookService;
        this.videoUpload = this.videoUpload.bind(this);
        this.eraseVideo = this.eraseVideo.bind(this);
        this.eraseAudio = this.eraseAudio.bind(this);
        this.uploadAudio = this.uploadAudio.bind(this);
        this.showPost = this.showPost.bind(this);
        this.hidePost = this.hidePost.bind(this);
        this.deletePost = this.deletePost.bind(this);
        this.checkPhotosAge = this.checkPhotosAge.bind(this);
        this.getPostById = this.getPostById.bind(this);
        this.get30DaysPosts = this.get30DaysPosts.bind(this);
        this.getAllPosts = this.getAllPosts.bind(this);
        this.getPostsIds = this.getPostsIds.bind(this);
        this.createPost = this.createPost.bind(this);
        this.updatePost = this.updatePost.bind(this);
    }
    updatePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                logger_service_1.logger.debug({ body: req.body, function: 'updatePost.controller' });
                const files = req.files;
                let { dbImages, title, heading, classification } = req.body;
                const { id } = req.params;
                let imagesArray;
                logger_service_1.logger.debug({ dbImages, files, body: req.body });
                if (dbImages !== undefined && typeof dbImages === 'string') {
                    imagesArray = JSON.parse(dbImages);
                }
                // hasta aca, tengo que en imagesArray o hay un array de imagenes o tengo undefined
                // como manejo el hecho de que me lleguen imagenes ya cargadas y filas nuevas agregadas?
                let nuevoArray;
                if (files !== undefined && files.length !== 0) {
                    // aqui valido si hay files de multer para agregar.
                    nuevoArray = yield this.service.photoGenerator(files);
                    if (nuevoArray != null && imagesArray != null) {
                        nuevoArray = [...nuevoArray, ...imagesArray];
                    }
                    else if (imagesArray != null)
                        nuevoArray = imagesArray;
                    // logger.debug({ function: 'postController.updade', nuevoArray })
                }
                else
                    nuevoArray = imagesArray;
                let body = req.body;
                if (body !== null && typeof body === 'object' && 'dbImages' in body) {
                    body = Object.assign(Object.assign({}, body), { dbImages: undefined });
                }
                const updateDbResponse = yield this.service.updatePost(body, // as Prisma.PostsUpdateInput,
                id, nuevoArray);
                if (title === undefined) {
                    title = updateDbResponse.data.title;
                }
                if (heading === undefined) {
                    heading = updateDbResponse.data.heading;
                }
                if (classification === undefined) {
                    if (updateDbResponse.data.classification !== undefined) {
                        classification = updateDbResponse.data
                            .classification;
                    }
                    else
                        classification = 'Municipales';
                }
                // ACA DEBO VER LA LOGICA PARA QUE GENERE UN MERGE DE LOS DATOS QUE YA ESTAN EN LA DB Y LO QUE SE VA A ACTUALIZAR
                if (nuevoArray !== undefined && 'fbid' in updateDbResponse.data) {
                    yield this.facebookService.updateFacebookPost(updateDbResponse.data.fbid, {
                        title,
                        heading,
                        classification,
                        newspaperID: id,
                        images: nuevoArray === null || nuevoArray === void 0 ? void 0 : nuevoArray.map((id) => id.fbid)
                    });
                }
                //      io.emit('postUpdate', { ...updateDbResponse, images: nuevoArray })
                res.send(Object.assign(Object.assign({}, updateDbResponse.data), { images: nuevoArray }));
            }
            catch (error) {
                logger_service_1.logger.error({ function: 'postController.update', error });
                res.status(500).send(error);
            }
        });
    }
    createPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            const files = req.files;
            const dataEmitted = { active: true, body };
            console.log(body, 'enviado');
            app_1.io.emit('postLoader', dataEmitted);
            try {
                let imagesArray;
                if (files !== undefined && Array.isArray(files) && (files === null || files === void 0 ? void 0 : files.length) > 0) {
                    imagesArray = yield this.service.photoGenerator(files);
                }
                if (req.user !== undefined &&
                    'id' in req.user &&
                    typeof req.user.id === 'string') {
                    const responseDB = yield this.service.createPost(body, req.user.id, imagesArray);
                    app_1.io.emit('postUpdate', Object.assign(Object.assign({}, responseDB), { images: imagesArray, stamp: Date.now() }));
                    if (responseDB !== undefined &&
                        typeof responseDB === 'object' &&
                        responseDB !== null &&
                        'id' in responseDB &&
                        typeof responseDB.id === 'string') {
                        if (imagesArray === undefined) {
                            res.status(200).send(responseDB);
                            return;
                        }
                        const facebookFeedResponse = yield this.facebookService.facebookFeed(body, imagesArray, responseDB.id);
                        if (facebookFeedResponse !== undefined &&
                            facebookFeedResponse.ok &&
                            'id' in facebookFeedResponse.data.data) {
                            const fbidUpdate = yield this.service.addFBIDtoDatabase(facebookFeedResponse === null || facebookFeedResponse === void 0 ? void 0 : facebookFeedResponse.data.data.id, responseDB.id);
                            res.status(200).send(fbidUpdate);
                        }
                        else
                            throw new Error('Error Updating Facebook Page Post');
                    }
                    else
                        throw new Error('Error updating Database');
                }
            }
            catch (error) {
                logger_service_1.logger.error({ function: 'PostController.createPost', error });
                res.status(404).send(error);
            }
        });
    }
    getPostsIds(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.service.getIds();
            if (response === undefined) {
                res.status(500).send('No posts found');
                return;
            }
            res.status(200).send(response);
        });
    }
    getAllPosts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { cursor, title, search, minDate, maxDate, category } = req.query;
            const query = { AND: [] };
            if (title !== undefined) {
                query.AND.push({
                    title: { contains: title }
                });
            }
            if (category !== undefined) {
                query.AND.push({ classification: { contains: category } });
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
                });
            }
            if (minDate !== undefined || maxDate !== undefined) {
                query.AND.push({
                    AND: []
                });
            }
            if (minDate !== undefined && query !== undefined && 'AND' in query) {
                const data = query.AND[query.AND.length - 1];
                if (data !== undefined && 'AND' in data && Array.isArray(data.AND)) {
                    data.AND.push({ createdAt: { gte: new Date(minDate) } });
                }
            }
            if (maxDate !== undefined) {
                const data = query.AND[query.AND.length - 1];
                if (data !== undefined &&
                    'AND' in data &&
                    (data === null || data === void 0 ? void 0 : data.AND) !== undefined &&
                    Array.isArray(data.AND)) {
                    data.AND.push({ createdAt: { lte: new Date(maxDate) } });
                }
            }
            this.service
                .getPosts({
                cursor: cursor === undefined
                    ? undefined
                    : { createdAt: new Date(cursor) },
                pagination: 50
            }, query)
                .then((response) => __awaiter(this, void 0, void 0, function* () {
                if (response !== undefined && response.ok) {
                    const data = response.data;
                    const checkedResponse = yield Promise.all(data.map((post) => __awaiter(this, void 0, void 0, function* () {
                        return yield this.checkPhotosAge(post === null || post === void 0 ? void 0 : post.images // as Prisma.PhotosCreateInput[]
                        )
                            .then((checkedPhotos) => {
                            if (checkedPhotos.data !== undefined) {
                                const finalData = checkedPhotos.data; // as Prisma.PhotosCreateNestedManyWithoutPostsInput
                                // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
                                post = Object.assign(Object.assign({}, post), { images: finalData.length === 1 && finalData[0] === undefined
                                        ? []
                                        : finalData }); // Prisma.PostsCreateInput
                                return post;
                            }
                        })
                            .catch((error) => logger_service_1.logger.error({
                            function: 'PostController.getAllPosts',
                            error
                        }));
                    })));
                    console.log(checkedResponse, 'texto');
                    res.status(200).send(checkedResponse);
                }
            }))
                .catch((error) => {
                logger_service_1.logger.error({ function: 'PostController.getAllPosts', error });
                res.status(404).send(error);
            });
        });
    }
    get30DaysPosts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { page } = req.query;
                const response = yield post_service_1.postService.get30DaysPosts(page !== undefined ? parseInt(page) : undefined);
                if (response instanceof prisma_errors_1.PrismaError) {
                    res.status(500).send(response);
                    return;
                }
                else {
                    res.status(200).send(response);
                    return;
                }
            }
            catch (error) {
                logger_service_1.logger.error({ function: 'PostController.get30DaysPosts', error });
                res.status(500).send(error);
                return;
            }
        });
    }
    getPostById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            this.service
                .getPost(id)
                .then((response) => __awaiter(this, void 0, void 0, function* () {
                if (response !== undefined &&
                    response !== null &&
                    'images' in response &&
                    Array.isArray(response.images)) {
                    this.checkPhotosAge(response === null || response === void 0 ? void 0 : response.images)
                        .then((checkedPhotos) => __awaiter(this, void 0, void 0, function* () {
                        // aca saqe el ..data hay que ver si sigue funcionando
                        if ('images' in response) {
                            const data = Object.assign(Object.assign({}, response), { images: checkedPhotos.data });
                            res.status(200).send({ error: null, ok: true, data });
                        }
                    }))
                        .catch((error) => logger_service_1.logger.error({ function: 'PostController.getByid', error }));
                }
                else
                    res.status(404).send(response);
            }))
                .catch((error) => {
                logger_service_1.logger.error({ function: 'PostController.getPostById', error });
                res.status(404).send(error);
            });
        });
    }
    checkPhotosAge(photosObject) {
        return __awaiter(this, void 0, void 0, function* () {
            if (Array.isArray(photosObject)) {
                try {
                    let idArray;
                    let updatedLinksArray;
                    let dbResponse;
                    const photoArray = photosObject.filter((photo) => {
                        if (photo.createdAt !== undefined &&
                            Date.now() >
                                new Date(photo.createdAt).getTime() + 1000 * 60 * 60 * 24 * 2) {
                            return true;
                        }
                        else
                            return false;
                    });
                    if (Array.isArray(photoArray) && photoArray.length > 0) {
                        idArray = photoArray.map((photo) => ({ id: photo.fbid }));
                        updatedLinksArray = yield this.facebookService.getLinkFromId(idArray);
                        dbResponse = yield Promise.all(updatedLinksArray.data.map((photo) => __awaiter(this, void 0, void 0, function* () {
                            const response = yield this.prisma.$transaction([
                                this.prisma.photos.updateMany({
                                    where: { fbid: photo.fbid },
                                    data: { url: photo.url }
                                }),
                                this.prisma.photos.findMany({ where: { fbid: photo.fbid } })
                            ]);
                            return response[1][0];
                        })));
                    }
                    else
                        dbResponse = photosObject;
                    return new google_errors_1.ResponseObject(null, true, dbResponse);
                }
                catch (error) {
                    logger_service_1.logger.error({ function: 'PostController.checkedPhotos', error });
                    return new google_errors_1.ResponseObject(error, false, null);
                }
            }
            return new google_errors_1.ResponseObject(new Error('Error updating photos'), false, null);
        });
    }
    deletePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const { data } = yield this.service.deleteById(id);
                const { audio } = data;
                if (Array.isArray(audio) && audio.length > 0) {
                    audio.forEach((item) => __awaiter(this, void 0, void 0, function* () { return yield this.googleService.fileRemove(item.driveId); }));
                }
                let fbResponse;
                if (data.fbid !== null && typeof data.fbid === 'string')
                    fbResponse = yield this.facebookService.deleteFacebookPost(data.fbid);
                logger_service_1.logger.debug({ function: 'PostController.deletePost', response: express_1.response, fbResponse });
                res.status(200).send(express_1.response);
            }
            catch (error) {
                logger_service_1.logger.error({ function: 'postController.deletePost', error });
            }
        });
    }
    hidePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const response = yield this.service.hidePost(id);
                logger_service_1.logger.debug({ function: 'PostController.hidePost', response });
                res.status(200).send(response);
            }
            catch (error) {
                logger_service_1.logger.error({ function: 'postController.hidePost', error });
            }
        });
    }
    showPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const response = yield this.service.showPost(id);
                logger_service_1.logger.debug({ function: 'PostController.showPost', response });
                res.status(200).send(response);
            }
            catch (error) {
                logger_service_1.logger.error({ function: 'postController.showPost', error });
            }
        });
    }
    uploadAudio(req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (req.files !== undefined && Array.isArray(req.files)) {
                    (_a = req.files) === null || _a === void 0 ? void 0 : _a.forEach((file) => __awaiter(this, void 0, void 0, function* () {
                        const id = yield this.googleService.fileUpload('audio', file.path);
                        if (id instanceof google_errors_1.TokenError || id instanceof google_errors_1.NeverAuthError) {
                            res.status(401).json(id);
                            return;
                        }
                        else if (id instanceof google_errors_1.GoogleError) {
                            res.status(500).json(id);
                            return;
                        }
                        if (id !== undefined) {
                            const response = yield this.service.addAudioToDB(id);
                            if (!(response instanceof Error)) {
                                res.status(200).json(response);
                            }
                            else if (response instanceof prisma_errors_1.PrismaError)
                                res.status(500).send(response);
                        }
                        else
                            res.json(500).send(new Error('Couldnt upload file'));
                    }));
                }
            }
            catch (error) {
                logger_service_1.logger.error({ function: 'postController.uploadAudio', error });
                res.status(500).json(error);
            }
        });
    }
    eraseAudio(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.query;
                const driveId = yield this.prisma.audio.delete({ where: { id }, select: { driveId: true } });
                if (driveId === undefined || typeof driveId !== 'object')
                    throw new Error('Unable to erase from database');
                const response = yield this.googleService.fileRemove(driveId.driveId);
                if (response !== undefined || response !== null)
                    res.status(200).send(response);
                else
                    throw new Error('Unable to erase de drive Image');
            }
            catch (error) {
                logger_service_1.logger.error({ function: 'postController.eraseAudio', error });
                res.status(500).send(error);
            }
        });
    }
    videoUpload(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { file, body: { title, description, tags, url } } = req;
                const { username } = req.user;
                console.log('subiendo', file, title, description, tags, url, username, req.body);
                if (url !== undefined) {
                    const createResponse = yield this.service.prisma.video.create({
                        data: {
                            url,
                            youtubeId: url.split('watch?v=')[1],
                            author: {
                                connect: { username }
                            }
                        }
                    });
                    console.log(createResponse, 'datos ');
                    if (createResponse !== undefined && createResponse !== null) {
                        res.status(200).send(createResponse);
                        return;
                    }
                    else {
                        res.status(500).send({
                            error: new Error('Error al escribir la base de datos'),
                            code: 4001
                        });
                    }
                    return;
                }
                if (file === undefined) {
                    res.status(404).send({
                        error: new Error('Error al escribir la base de datos'),
                        code: 4002
                    });
                    return;
                }
                if (title !== undefined && (description !== undefined && description !== null && typeof description === 'string')) {
                    console.log('Subir el Archivo opcion');
                    const response = yield this.googleService.uploadVideo(file.path, title, description, process.env.YOUTUBE_CHANNEL, tags);
                    console.log(response, 'termino upload');
                    if (response instanceof google_errors_1.GoogleError) {
                        res.status(500).send(response);
                        return;
                    }
                    if (typeof response === 'string') {
                        const dbResponse = yield this.service.prisma.video.create({ data: { youtubeId: response, author: { connect: { username } } } });
                        if (dbResponse !== undefined && dbResponse !== null) {
                            res.status(200).send(dbResponse);
                            return;
                        }
                        else {
                            res.status(500).send({
                                error: new Error('Error al escribir la base de datos'),
                                code: 4001
                            });
                            return;
                        }
                    }
                }
            }
            catch (error) {
                logger_service_1.logger.error({ function: 'postController.videoUpload', error });
            }
        });
    }
    eraseVideo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { youtubeId } = req.query;
                const dbResponse = yield this.service.prisma.video.delete({ where: { id: youtubeId } });
                console.log(dbResponse, 'data');
                if (dbResponse !== undefined) {
                    const response = yield this.googleService.videoRm(dbResponse.youtubeId);
                    if (response instanceof google_errors_1.GoogleError) {
                        res.status(500).send(response);
                        return;
                    }
                    else
                        res.status(200).send(response);
                }
            }
            catch (error) {
                logger_service_1.logger.error({ function: 'postController.eraseVideo', error });
                res.status(500).send(error);
            }
        });
    }
}
exports.PostController = PostController;

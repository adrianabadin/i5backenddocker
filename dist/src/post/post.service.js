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
exports.postService = exports.PostService = void 0;
/* eslint-disable @typescript-eslint/no-confusing-void-expression */
/* eslint-disable @typescript-eslint/promise-function-async */
/* eslint-disable @typescript-eslint/no-misused-promises */
const database_service_1 = require("../Services/database.service");
const client_1 = require("@prisma/client");
const logger_service_1 = require("../Services/logger.service");
const Entities_1 = require("../Entities");
const facebook_service_1 = require("../Services/facebook.service");
const google_service_1 = require("../Services/google.service");
const prisma_errors_1 = require("../Services/prisma.errors");
class PostService {
    constructor(prisma = database_service_1.prismaClient.prisma, facebookService = new facebook_service_1.FacebookService(), googleService = new google_service_1.GoogleService()) {
        this.prisma = prisma;
        this.facebookService = facebookService;
        this.googleService = googleService;
        this.photoGenerator = this.photoGenerator.bind(this);
        this.getIds = this.getIds.bind(this);
        this.get30DaysPosts = this.get30DaysPosts.bind(this);
        this.addAudioToDB = this.addAudioToDB.bind(this);
        this.showPost = this.showPost.bind(this);
        this.deleteById = this.deleteById.bind(this);
        this.hidePost = this.hidePost.bind(this);
        this.addFBIDtoDatabase = this.addFBIDtoDatabase.bind(this);
        this.updatePost = this.updatePost.bind(this);
        this.updatePhoto = this.updatePhoto.bind(this);
        this.getPost = this.getPost.bind(this);
        this.getPosts = this.getPosts.bind(this);
        this.createPost = this.createPost.bind(this);
    }
    createPost(body, id, dataArray) {
        return __awaiter(this, void 0, void 0, function* () {
            const { title, text, heading, classification, importance, audio, video } = body;
            let numberImportance = 0;
            let audioArray = [];
            let videoArray = [];
            if (audio !== undefined && Array.isArray(JSON.parse(audio !== null && audio !== void 0 ? audio : ''))) {
                audioArray = JSON.parse(audio);
            }
            else if (audio !== undefined)
                audioArray = [JSON.parse(audio)];
            if (video !== undefined && Array.isArray(JSON.parse(video))) {
                videoArray = JSON.parse(video);
            }
            else if (video !== undefined)
                videoArray = [JSON.parse(video)];
            if (importance !== undefined && typeof importance === 'string')
                numberImportance = parseInt(importance);
            console.log(videoArray, 'videoArray');
            return yield this.prisma.posts.create({
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
            }); // gCreate({ author: { connect: { id } }, isVisible: true, classification, heading, title, text, importance: numberImportance, images: { create: dataArray } })
        });
    }
    getPosts(paginationOptions, queryOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                logger_service_1.logger.debug({ queryOptions });
                const data = yield this.prisma.posts.gGetAll({ images: true, author: true }, paginationOptions, queryOptions);
                // logger.debug({ function: 'PostService.getPosts', data })
                return data;
            }
            catch (error) {
                logger_service_1.logger.error({ function: 'PostService.getPosts', error });
            }
        });
    }
    getPost(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.prisma.posts.findUnique({
                    where: { id },
                    include: {
                        author: {
                            select: {
                                avatar: true,
                                lastName: true,
                                name: true,
                                id: true
                            }
                        },
                        images: {
                            select: {
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
                        video: {
                            select: {
                                id: true,
                                youtubeId: true,
                                url: true
                            }
                        }
                    }
                });
                const latestNews = yield this.prisma.posts.findMany({ where: {}, orderBy: { createdAt: 'desc' }, take: 4, include: { video: { select: { youtubeId: true, id: true } }, images: { select: { url: true, id: true } }, audio: { select: { driveId: true, id: true } } } });
                logger_service_1.logger.debug({ function: 'PostService.getPost', data: response });
                return Object.assign(Object.assign({}, response), { latestNews: latestNews.map(({ audio, heading, id, images, title, video, createdAt, classification }) => {
                        return { audio, heading, id, images, title, video, createdAt, classification };
                    }) });
            }
            catch (error) {
                logger_service_1.logger.error({ function: 'PostService.getPost', error });
            }
        });
    }
    updatePhoto(photo) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.prisma.photos.update({ where: { id: photo.id }, data: Object.assign(Object.assign({}, photo), { updatedAt: undefined }) });
                logger_service_1.logger.debug({ function: 'PostService.updatePhoto', data });
                return data;
            }
            catch (error) {
                logger_service_1.logger.error({ function: 'PostService.updatePhoto', error });
            }
        });
    }
    updatePost(postObject, idParam, photoObject) {
        return __awaiter(this, void 0, void 0, function* () {
            let ids;
            let ids2;
            let photoObjectNoUndefinedFalse;
            let photoObjectNoUndef;
            const audioFromDB = postObject.audio !== undefined &&
                JSON.parse(postObject.audio) !== null
                ? Array.isArray(postObject.audio)
                    ? JSON.parse(postObject.audio)
                    : [JSON.parse(postObject.audio)]
                : undefined;
            const videoFromDb = ((postObject === null || postObject === void 0 ? void 0 : postObject.video) !== undefined) ? Array.isArray(postObject.video) ? postObject.video : [postObject.video] : undefined;
            console.log(postObject.video, videoFromDb, 'Vodeo data');
            if ('jwt' in postObject) {
                postObject.jwt = undefined;
            }
            logger_service_1.logger.debug({ photoObject, function: 'updatePost.service' });
            if (photoObject !== undefined) {
                ids = photoObject.map((photo) => {
                    if (typeof photo === 'object' && photo !== null && 'id' in photo && photo.id !== undefined && typeof photo.id === 'string') {
                        return photo === null || photo === void 0 ? void 0 : photo.id;
                    }
                    else
                        return undefined;
                });
                ids2 = ids.filter((img) => img !== undefined);
                photoObjectNoUndefinedFalse = photoObject.map((photo) => {
                    if (photo !== undefined && photo !== null) {
                        return { fbid: photo.fbid, url: photo.url, id: photo.id };
                        // if (typeof photo === 'object' && 'id' in photo && 'fbid' in photo && 'url' in photo) { return { fbid: photo.fbid, url: photo.url, id: photo.id } }
                    }
                    return { fbid: 'false', url: 'false', id: 'false' };
                });
                photoObjectNoUndef = photoObjectNoUndefinedFalse.filter(img => img.fbid !== 'false');
                try {
                    const author = postObject.author;
                    /* aca debo hacer distintas ramas en el caso de que se tenga imagenes para borrar, tenga imagenes para agregar  */
                    if (author === undefined)
                        throw new Error('No author specified');
                    const deleteAudioResponse = yield this.prisma.audio.deleteMany({ where: { postsId: postObject.id } });
                    const deleteVideoResponse = yield this.prisma.video.deleteMany({ where: { postsId: postObject.id } });
                    const audioMap = (audioFromDB !== undefined) ? { create: audioFromDB.map(item => ({ driveId: item.driveId })) } : undefined;
                    const videoMap = (videoFromDb !== undefined) ? { connect: videoFromDb.map(item => ({ youtubeId: item.youtubeId })) } : undefined;
                    const imageMap = photoObjectNoUndef.map(photo => {
                        return Object.assign({}, photo);
                    });
                    const data = yield this.prisma.posts.update({
                        where: { id: idParam },
                        data: Object.assign(Object.assign({}, postObject), { isVisible: true, updatedAt: undefined, author: { connect: { id: author } }, importance: parseInt(postObject.importance), audio: audioMap, video: videoMap, images: {
                                deleteMany: {},
                                create: imageMap
                            } }),
                        include: { audio: { select: { driveId: true, id: true } }, images: { select: { url: true, fbid: true, id: true } }, video: { select: { youtubeId: true } } }
                    });
                    console.log(deleteAudioResponse, deleteVideoResponse, data);
                    // const data = transaction
                    logger_service_1.logger.debug({ function: 'PostService.updatePost', data });
                    return new Entities_1.ResponseObject(null, true, data);
                }
                catch (error) {
                    logger_service_1.logger.error({ function: 'PostService.updatePost', error });
                    return new Entities_1.ResponseObject(error, false, null);
                }
            }
            else {
                try {
                    const transactionResponse = yield this.prisma.$transaction([
                        this.prisma.audio.deleteMany({ where: { postsId: postObject.id } }),
                        this.prisma.posts.update({
                            where: { id: idParam },
                            data: Object.assign(Object.assign({}, postObject), { updatedAt: undefined, importance: parseInt(postObject.importance), author: { connect: { id: postObject.author } }, images: {
                                    deleteMany: {
                                        NOT: {
                                            id: {
                                                in: ids2
                                            }
                                        }
                                    }
                                }, audio: (audioFromDB !== undefined) ? { create: audioFromDB.map(item => ({ driveId: item.driveId })) } : undefined, video: (videoFromDb !== undefined) ? { connect: videoFromDb.map(item => ({ youtubeId: item.youtubeId })) } : undefined })
                        })
                    ]);
                    const [, data] = transactionResponse;
                    logger_service_1.logger.debug({ function: 'PostService.updatePost', data });
                    return new Entities_1.ResponseObject(null, true, data);
                    // va el codigo si no hay cambios en las photos
                }
                catch (error) {
                    logger_service_1.logger.error({ function: 'PostService.updatePost', error });
                    return new Entities_1.ResponseObject(null, false, error);
                }
            }
        });
    }
    addFBIDtoDatabase(fbid, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.prisma.posts.update({ where: { id }, data: { fbid } });
                return response;
            }
            catch (error) {
                logger_service_1.logger.error({ function: 'PostService.addFBIDtoDB', error });
                return new Entities_1.ResponseObject(error, false, null);
            }
        });
    }
    deleteById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.prisma.posts.delete({ where: { id }, include: { audio: true, images: true } }); // .gDelete(id)
                return new Entities_1.ResponseObject(null, true, response);
            }
            catch (error) {
                logger_service_1.logger.error({ function: 'PostService.deleteById', error });
                return new Entities_1.ResponseObject(error, false, null);
            }
        });
    }
    hidePost(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.prisma.posts.update({ where: { id }, data: { isVisible: { set: false } } });
                return new Entities_1.ResponseObject(null, true, response);
            }
            catch (error) {
                logger_service_1.logger.error({ function: 'PostService.hidePost', error });
                return new Entities_1.ResponseObject(error, false, null);
            }
        });
    }
    showPost(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.prisma.posts.update({ where: { id }, data: { isVisible: { set: true } } });
                return new Entities_1.ResponseObject(null, true, response);
            }
            catch (error) {
                logger_service_1.logger.error({ function: 'PostService.showPost', error });
                return new Entities_1.ResponseObject(error, false, null);
            }
        });
    }
    addAudioToDB(driveId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.prisma.audio.create({ data: { driveId } });
                return response;
            }
            catch (error) {
                logger_service_1.logger.error({ function: 'PostService.addAudioToDB', error });
                if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                    switch (error.code) {
                        case 'P2002':
                            return new prisma_errors_1.UniqueRestraintError(error, error.meta);
                        case 'P2000':
                            return new prisma_errors_1.ColumnPrismaError(error, error.meta);
                        case 'P2001':
                            return new prisma_errors_1.NotFoundPrismaError(error, error.meta);
                        default:
                            return new prisma_errors_1.UnknownPrismaError(error, error.meta);
                    }
                }
                else
                    return error;
            }
        });
    }
    get30DaysPosts(page = 1) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const fromDate = new Date();
                fromDate.setDate(fromDate.getDate() - 30 * page);
                const toDate = new Date(fromDate);
                toDate.setDate(toDate.getDate() + 30);
                const response = yield this.prisma.posts.findMany({
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
                });
                const arrayId = [];
                response.forEach((res) => __awaiter(this, void 0, void 0, function* () {
                    if (Array.isArray(res.images) && res.images.length > 0) {
                        res.images.forEach(image => {
                            if (new Date(image.updatedAt).getMilliseconds() < new Date().getMilliseconds() - 86400000 * 2) {
                                arrayId.push({ id: image.fbid });
                                console.log(image.fbid, image.updatedAt, 'entro');
                            }
                        });
                        if (Array.isArray(arrayId) && arrayId.length > 0) {
                            const images = yield this.facebookService.getLinkFromId(arrayId);
                            if (images.ok) {
                                yield this.prisma.$transaction((prisma) => __awaiter(this, void 0, void 0, function* () {
                                    for (const image of images.data) {
                                        const modd = res.images.find(imageDB => {
                                            console.log(image.fbid, imageDB.id);
                                            return imageDB.fbid === image.fbid;
                                        });
                                        if (modd !== undefined) {
                                            modd.url = image.url;
                                        }
                                        yield prisma.photos.updateMany({ where: { fbid: image.fbid }, data: { url: image.url } });
                                    }
                                }));
                            }
                        }
                    }
                }));
                return response;
            }
            catch (error) {
                logger_service_1.logger.error({ function: 'PostService.get30DaysPosts', error });
                return new prisma_errors_1.UnknownPrismaError(error);
            }
        });
    }
    photoGenerator(files, imagesParam) {
        return __awaiter(this, void 0, void 0, function* () {
            let photoArray = [];
            let images = imagesParam;
            if (files !== undefined && Array.isArray(files)) {
                photoArray = yield Promise.all(files.map((file) => __awaiter(this, void 0, void 0, function* () {
                    const data = yield this.facebookService.postPhoto(file);
                    if (data.ok && 'id' in data.data && data.data.id !== undefined) {
                        return data.data;
                    }
                    else
                        return undefined;
                })));
                // else throw new Error(JSON.stringify({ error: 'No se enviaron imagenes', images }))
                if (photoArray !== null && Array.isArray(photoArray)) {
                    const response = yield this.facebookService.getLinkFromId(photoArray);
                    // aqui se asigna a imagesArray todas las imagenes que debera tener el post ya sean las que no se eliminaron y las que se agreguen si hubiere
                    if (response.ok) {
                        if (images !== null && Array.isArray(images))
                            images = [...images, ...response.data];
                        else
                            images = [...response.data];
                    }
                }
                if (images !== undefined && Array.isArray(images)) {
                    photoArray = [...photoArray, ...images === null || images === void 0 ? void 0 : images.map(image => ({ id: image.fbid }))];
                }
            }
            logger_service_1.logger.debug({ function: 'pOSTsERVICE.photoGenerator', images });
            return images;
        });
    }
    getIds() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.prisma.posts.findMany({ select: { id: true } });
                return response;
            }
            catch (error) {
                logger_service_1.logger.error({ function: 'PostService.getIds', error });
            }
        });
    }
}
exports.PostService = PostService;
exports.postService = new PostService();

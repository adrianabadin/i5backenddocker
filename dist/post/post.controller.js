/* eslint-disable no-useless-return */ /* eslint-disable @typescript-eslint/prefer-optional-chain */ /* eslint-disable @typescript-eslint/no-misused-promises */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "PostController", {
    enumerable: true,
    get: function() {
        return PostController;
    }
});
const _express = require("express");
const _postservice = require("./post.service");
const _facebookservice = require("../Services/facebook.service");
const _loggerservice = require("../Services/logger.service");
const _googleerrors = require("../Services/google.errors");
const _app = require("../app");
const _googleservice = require("../Services/google.service");
const _prismaerrors = require("../Services/prisma.errors");
const _databaseservice = require("../Services/database.service");
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg);
        var value = info.value;
    } catch (error) {
        reject(error);
        return;
    }
    if (info.done) {
        resolve(value);
    } else {
        Promise.resolve(value).then(_next, _throw);
    }
}
function _async_to_generator(fn) {
    return function() {
        var self = this, args = arguments;
        return new Promise(function(resolve, reject) {
            var gen = fn.apply(self, args);
            function _next(value) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
            }
            function _throw(err) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
            }
            _next(undefined);
        });
    };
}
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _object_spread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _define_property(target, key, source[key]);
        });
    }
    return target;
}
function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        if (enumerableOnly) {
            symbols = symbols.filter(function(sym) {
                return Object.getOwnPropertyDescriptor(object, sym).enumerable;
            });
        }
        keys.push.apply(keys, symbols);
    }
    return keys;
}
function _object_spread_props(target, source) {
    source = source != null ? source : {};
    if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
        ownKeys(Object(source)).forEach(function(key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
    }
    return target;
}
var _this = void 0;
var _this1 = void 0;
var _this2 = void 0;
var _this3 = void 0;
var _this4 = void 0;
var _this5 = void 0;
var _this6 = void 0;
var _this7 = void 0;
var _this8 = void 0;
var _this9 = void 0;
var _this10 = void 0;
var _this11 = void 0;
class PostController {
    constructor(service = new _postservice.PostService(), prisma = _databaseservice.prismaClient.prisma, googleService = new _googleservice.GoogleService(), facebookService = new _facebookservice.FacebookService(), updatePost = function() {
        var _ref = _async_to_generator(function*(req, res) {
            try {
                _loggerservice.logger.debug({
                    body: req.body,
                    function: 'updatePost.controller'
                });
                const files = req.files;
                let { dbImages, title, heading, classification } = req.body;
                const { id } = req.params;
                let imagesArray;
                _loggerservice.logger.debug({
                    dbImages,
                    files,
                    body: req.body
                });
                if (dbImages !== undefined && typeof dbImages === 'string') {
                    imagesArray = JSON.parse(dbImages);
                }
                // hasta aca, tengo que en imagesArray o hay un array de imagenes o tengo undefined
                // como manejo el hecho de que me lleguen imagenes ya cargadas y filas nuevas agregadas?
                let nuevoArray;
                if (files !== undefined && files.length !== 0) {
                    // aqui valido si hay files de multer para agregar.
                    nuevoArray = yield _this.service.photoGenerator(files);
                    if (nuevoArray != null && imagesArray != null) {
                        nuevoArray = [
                            ...nuevoArray,
                            ...imagesArray
                        ];
                    } else if (imagesArray != null) nuevoArray = imagesArray;
                // logger.debug({ function: 'postController.updade', nuevoArray })
                } else nuevoArray = imagesArray;
                let body = req.body;
                if (body !== null && typeof body === 'object' && 'dbImages' in body) {
                    body = _object_spread_props(_object_spread({}, body), {
                        dbImages: undefined
                    });
                }
                const updateDbResponse = yield _this.service.updatePost(body, id, nuevoArray);
                if (title === undefined) {
                    title = updateDbResponse.data.title;
                }
                if (heading === undefined) {
                    heading = updateDbResponse.data.heading;
                }
                if (classification === undefined) {
                    if (updateDbResponse.data.classification !== undefined) {
                        classification = updateDbResponse.data.classification;
                    } else classification = 'Municipales';
                }
                // ACA DEBO VER LA LOGICA PARA QUE GENERE UN MERGE DE LOS DATOS QUE YA ESTAN EN LA DB Y LO QUE SE VA A ACTUALIZAR
                if (nuevoArray !== undefined && 'fbid' in updateDbResponse.data) {
                    yield _this.facebookService.updateFacebookPost(updateDbResponse.data.fbid, {
                        title,
                        heading,
                        classification,
                        newspaperID: id,
                        images: nuevoArray === null || nuevoArray === void 0 ? void 0 : nuevoArray.map((id)=>id.fbid)
                    });
                }
                //      io.emit('postUpdate', { ...updateDbResponse, images: nuevoArray })
                res.send(_object_spread_props(_object_spread({}, updateDbResponse.data), {
                    images: nuevoArray
                }));
            } catch (error) {
                _loggerservice.logger.error({
                    function: 'postController.update',
                    error
                });
                res.status(500).send(error);
            }
        });
        return function(req, res) {
            return _ref.apply(this, arguments);
        };
    }(), createPost = function() {
        var _ref = _async_to_generator(function*(req, res) {
            const body = req.body;
            const files = req.files;
            const dataEmitted = {
                active: true,
                body
            };
            console.log(body, 'enviado');
            _app.io.emit('postLoader', dataEmitted);
            try {
                let imagesArray;
                if (files !== undefined && Array.isArray(files) && (files === null || files === void 0 ? void 0 : files.length) > 0) {
                    imagesArray = yield _this1.service.photoGenerator(files);
                }
                if (req.user !== undefined && 'id' in req.user && typeof req.user.id === 'string') {
                    const responseDB = yield _this1.service.createPost(body, req.user.id, imagesArray);
                    _app.io.emit('postUpdate', _object_spread_props(_object_spread({}, responseDB), {
                        images: imagesArray,
                        stamp: Date.now()
                    }));
                    if (responseDB !== undefined && typeof responseDB === 'object' && responseDB !== null && 'id' in responseDB && typeof responseDB.id === 'string') {
                        if (imagesArray === undefined) {
                            res.status(200).send(responseDB);
                            return;
                        }
                        const facebookFeedResponse = yield _this1.facebookService.facebookFeed(body, imagesArray, responseDB.id);
                        if (facebookFeedResponse !== undefined && facebookFeedResponse.ok && 'id' in facebookFeedResponse.data.data) {
                            const fbidUpdate = yield _this1.service.addFBIDtoDatabase(facebookFeedResponse === null || facebookFeedResponse === void 0 ? void 0 : facebookFeedResponse.data.data.id, responseDB.id);
                            res.status(200).send(fbidUpdate);
                        } else throw new Error('Error Updating Facebook Page Post');
                    } else throw new Error('Error updating Database');
                }
            } catch (error) {
                _loggerservice.logger.error({
                    function: 'PostController.createPost',
                    error
                });
                res.status(404).send(error);
            }
        });
        return function(req, res) {
            return _ref.apply(this, arguments);
        };
    }(), getPostsIds = function() {
        var _ref = _async_to_generator(function*(req, res) {
            const response = yield _this2.service.getIds();
            if (response === undefined) {
                res.status(500).send('No posts found');
                return;
            }
            res.status(200).send(response);
        });
        return function(req, res) {
            return _ref.apply(this, arguments);
        };
    }(), getAllPosts = (req, res)=>{
        const { cursor, title, search, minDate, maxDate, category } = req.query;
        const query = {
            AND: []
        };
        if (title !== undefined) {
            query.AND.push({
                title: {
                    contains: title
                }
            });
        }
        if (category !== undefined) {
            query.AND.push({
                classification: {
                    contains: category
                }
            });
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
                    {
                        heading: search
                    },
                    {
                        subTitle: search
                    }
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
                data.AND.push({
                    createdAt: {
                        gte: new Date(minDate)
                    }
                });
            }
        }
        if (maxDate !== undefined) {
            const data = query.AND[query.AND.length - 1];
            if (data !== undefined && 'AND' in data && (data === null || data === void 0 ? void 0 : data.AND) !== undefined && Array.isArray(data.AND)) {
                data.AND.push({
                    createdAt: {
                        lte: new Date(maxDate)
                    }
                });
            }
        }
        var _this = this;
        this.service.getPosts({
            cursor: cursor === undefined ? undefined : {
                createdAt: new Date(cursor)
            },
            pagination: 50
        }, query).then(function() {
            var _ref = _async_to_generator(function*(response) {
                if (response !== undefined && response.ok) {
                    const data = response.data;
                    const checkedResponse = yield Promise.all(data.map(function() {
                        var _ref = _async_to_generator(function*(post) {
                            return yield _this.checkPhotosAge(post === null || post === void 0 ? void 0 : post.images // as Prisma.PhotosCreateInput[]
                            ).then((checkedPhotos)=>{
                                if (checkedPhotos.data !== undefined) {
                                    const finalData = checkedPhotos.data // as Prisma.PhotosCreateNestedManyWithoutPostsInput
                                    ;
                                    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
                                    post = _object_spread_props(_object_spread({}, post), {
                                        images: finalData.length === 1 && finalData[0] === undefined ? [] : finalData
                                    }) // Prisma.PostsCreateInput
                                    ;
                                    return post;
                                }
                            }).catch((error)=>_loggerservice.logger.error({
                                    function: 'PostController.getAllPosts',
                                    error
                                }));
                        });
                        return function(post) {
                            return _ref.apply(this, arguments);
                        };
                    }()));
                    console.log(checkedResponse, 'texto');
                    res.status(200).send(checkedResponse);
                }
            });
            return function(response) {
                return _ref.apply(this, arguments);
            };
        }()).catch((error)=>{
            _loggerservice.logger.error({
                function: 'PostController.getAllPosts',
                error
            });
            res.status(404).send(error);
        });
    }, get30DaysPosts = function() {
        var _ref = _async_to_generator(function*(req, res) {
            try {
                const { page } = req.query;
                const response = yield _this3.service.get30DaysPosts(page !== undefined ? parseInt(page) : undefined);
                if (response instanceof _prismaerrors.PrismaError) {
                    res.status(500).send(response);
                    return;
                } else {
                    res.status(200).send(response);
                    return;
                }
            } catch (error) {
                _loggerservice.logger.error({
                    function: 'PostController.get30DaysPosts',
                    error
                });
                res.status(500).send(error);
                return;
            }
        });
        return function(req, res) {
            return _ref.apply(this, arguments);
        };
    }(), getPostById = (req, res)=>{
        const { id } = req.params;
        var _this = this;
        this.service.getPost(id).then(function() {
            var _ref = _async_to_generator(function*(response) {
                if (response !== undefined && response !== null && 'images' in response && Array.isArray(response.images)) {
                    _this.checkPhotosAge(response === null || response === void 0 ? void 0 : response.images).then(function() {
                        var _ref = _async_to_generator(function*(checkedPhotos) {
                            // aca saqe el ..data hay que ver si sigue funcionando
                            if ('images' in response) {
                                const data = _object_spread_props(_object_spread({}, response), {
                                    images: checkedPhotos.data
                                });
                                res.status(200).send({
                                    error: null,
                                    ok: true,
                                    data
                                });
                            }
                        });
                        return function(checkedPhotos) {
                            return _ref.apply(this, arguments);
                        };
                    }()).catch((error)=>_loggerservice.logger.error({
                            function: 'PostController.getByid',
                            error
                        }));
                } else res.status(404).send(response);
            });
            return function(response) {
                return _ref.apply(this, arguments);
            };
        }()).catch((error)=>{
            _loggerservice.logger.error({
                function: 'PostController.getPostById',
                error
            });
            res.status(404).send(error);
        });
    }, checkPhotosAge = function() {
        var _ref = _async_to_generator(function*(photosObject) {
            if (Array.isArray(photosObject)) {
                try {
                    let idArray;
                    let updatedLinksArray;
                    let dbResponse;
                    const photoArray = photosObject.filter((photo)=>{
                        if (photo.createdAt !== undefined && Date.now() > new Date(photo.createdAt).getTime() + 1000 * 60 * 60 * 24 * 2) {
                            return true;
                        } else return false;
                    });
                    if (Array.isArray(photoArray) && photoArray.length > 0) {
                        idArray = photoArray.map((photo)=>({
                                id: photo.fbid
                            }));
                        updatedLinksArray = yield _this4.facebookService.getLinkFromId(idArray);
                        dbResponse = yield Promise.all(updatedLinksArray.data.map(function() {
                            var _ref = _async_to_generator(function*(photo) {
                                const response = yield _this4.prisma.$transaction([
                                    _this4.prisma.photos.updateMany({
                                        where: {
                                            fbid: photo.fbid
                                        },
                                        data: {
                                            url: photo.url
                                        }
                                    }),
                                    _this4.prisma.photos.findMany({
                                        where: {
                                            fbid: photo.fbid
                                        }
                                    })
                                ]);
                                return response[1][0];
                            });
                            return function(photo) {
                                return _ref.apply(this, arguments);
                            };
                        }()));
                    } else dbResponse = photosObject;
                    return new _googleerrors.ResponseObject(null, true, dbResponse);
                } catch (error) {
                    _loggerservice.logger.error({
                        function: 'PostController.checkedPhotos',
                        error
                    });
                    return new _googleerrors.ResponseObject(error, false, null);
                }
            }
            return new _googleerrors.ResponseObject(new Error('Error updating photos'), false, null);
        });
        return function(photosObject) {
            return _ref.apply(this, arguments);
        };
    }(), deletePost = function() {
        var _ref = _async_to_generator(function*(req, res) {
            const { id } = req.params;
            try {
                const { data } = yield _this5.service.deleteById(id);
                const { audio } = data;
                if (Array.isArray(audio) && audio.length > 0) {
                    audio.forEach(function() {
                        var _ref = _async_to_generator(function*(item) {
                            return yield _this5.googleService.fileRemove(item.driveId);
                        });
                        return function(item) {
                            return _ref.apply(this, arguments);
                        };
                    }());
                }
                let fbResponse;
                if (data.fbid !== null && typeof data.fbid === 'string') fbResponse = yield _this5.facebookService.deleteFacebookPost(data.fbid);
                _loggerservice.logger.debug({
                    function: 'PostController.deletePost',
                    response: _express.response,
                    fbResponse
                });
                res.status(200).send(_express.response);
            } catch (error) {
                _loggerservice.logger.error({
                    function: 'postController.deletePost',
                    error
                });
            }
        });
        return function(req, res) {
            return _ref.apply(this, arguments);
        };
    }(), hidePost = function() {
        var _ref = _async_to_generator(function*(req, res) {
            const { id } = req.params;
            try {
                const response = yield _this6.service.hidePost(id);
                _loggerservice.logger.debug({
                    function: 'PostController.hidePost',
                    response
                });
                res.status(200).send(response);
            } catch (error) {
                _loggerservice.logger.error({
                    function: 'postController.hidePost',
                    error
                });
            }
        });
        return function(req, res) {
            return _ref.apply(this, arguments);
        };
    }(), showPost = function() {
        var _ref = _async_to_generator(function*(req, res) {
            const { id } = req.params;
            try {
                const response = yield _this7.service.showPost(id);
                _loggerservice.logger.debug({
                    function: 'PostController.showPost',
                    response
                });
                res.status(200).send(response);
            } catch (error) {
                _loggerservice.logger.error({
                    function: 'postController.showPost',
                    error
                });
            }
        });
        return function(req, res) {
            return _ref.apply(this, arguments);
        };
    }(), uploadAudio = function() {
        var _ref = _async_to_generator(function*(req, res) {
            try {
                if (req.files !== undefined && Array.isArray(req.files)) {
                    var _req_files;
                    (_req_files = req.files) === null || _req_files === void 0 ? void 0 : _req_files.forEach(function() {
                        var _ref = _async_to_generator(function*(file) {
                            const id = yield _this8.googleService.fileUpload('audio', file.path);
                            if (id instanceof _googleerrors.TokenError || id instanceof _googleerrors.NeverAuthError) {
                                res.status(401).json(id);
                                return;
                            } else if (id instanceof _googleerrors.GoogleError) {
                                res.status(500).json(id);
                                return;
                            }
                            if (id !== undefined) {
                                const response = yield _this8.service.addAudioToDB(id);
                                if (!(response instanceof Error)) {
                                    res.status(200).json(response);
                                } else if (response instanceof _prismaerrors.PrismaError) res.status(500).send(response);
                            } else res.json(500).send(new Error('Couldnt upload file'));
                        });
                        return function(file) {
                            return _ref.apply(this, arguments);
                        };
                    }());
                }
            } catch (error) {
                _loggerservice.logger.error({
                    function: 'postController.uploadAudio',
                    error
                });
                res.status(500).json(error);
            }
        });
        return function(req, res) {
            return _ref.apply(this, arguments);
        };
    }(), eraseAudio = function() {
        var _ref = _async_to_generator(function*(req, res) {
            try {
                const { id } = req.query;
                const driveId = yield _this9.prisma.audio.delete({
                    where: {
                        id
                    },
                    select: {
                        driveId: true
                    }
                });
                if (driveId === undefined || typeof driveId !== 'object') throw new Error('Unable to erase from database');
                const response = yield _this9.googleService.fileRemove(driveId.driveId);
                if (response !== undefined || response !== null) res.status(200).send(response);
                else throw new Error('Unable to erase de drive Image');
            } catch (error) {
                _loggerservice.logger.error({
                    function: 'postController.eraseAudio',
                    error
                });
                res.status(500).send(error);
            }
        });
        return function(req, res) {
            return _ref.apply(this, arguments);
        };
    }(), videoUpload = function() {
        var _ref = _async_to_generator(function*(req, res) {
            try {
                const { file, body: { title, description, tags, url } } = req;
                const { username } = req.user;
                console.log('subiendo', file, title, description, tags, url, username, req.body);
                if (url !== undefined) {
                    const createResponse = yield _this10.service.prisma.video.create({
                        data: {
                            url,
                            youtubeId: url.split('watch?v=')[1],
                            author: {
                                connect: {
                                    username
                                }
                            }
                        }
                    });
                    console.log(createResponse, 'datos ');
                    if (createResponse !== undefined && createResponse !== null) {
                        res.status(200).send(createResponse);
                        return;
                    } else {
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
                if (title !== undefined && description !== undefined && description !== null && typeof description === 'string') {
                    console.log('Subir el Archivo opcion');
                    const response = yield _this10.googleService.uploadVideo(file.path, title, description, process.env.YOUTUBE_CHANNEL, tags);
                    console.log(response, 'termino upload');
                    if (response instanceof _googleerrors.GoogleError) {
                        res.status(500).send(response);
                        return;
                    }
                    if (typeof response === 'string') {
                        const dbResponse = yield _this10.service.prisma.video.create({
                            data: {
                                youtubeId: response,
                                author: {
                                    connect: {
                                        username
                                    }
                                }
                            }
                        });
                        if (dbResponse !== undefined && dbResponse !== null) {
                            res.status(200).send(dbResponse);
                            return;
                        } else {
                            res.status(500).send({
                                error: new Error('Error al escribir la base de datos'),
                                code: 4001
                            });
                            return;
                        }
                    }
                }
            } catch (error) {
                _loggerservice.logger.error({
                    function: 'postController.videoUpload',
                    error
                });
            }
        });
        return function(req, res) {
            return _ref.apply(this, arguments);
        };
    }(), eraseVideo = function() {
        var _ref = _async_to_generator(function*(req, res) {
            try {
                const { youtubeId } = req.query;
                const dbResponse = yield _this11.service.prisma.video.delete({
                    where: {
                        id: youtubeId
                    }
                });
                console.log(dbResponse, 'data');
                if (dbResponse !== undefined) {
                    const response = yield _this11.googleService.videoRm(dbResponse.youtubeId);
                    if (response instanceof _googleerrors.GoogleError) {
                        res.status(500).send(response);
                        return;
                    } else res.status(200).send(response);
                }
            } catch (error) {
                _loggerservice.logger.error({
                    function: 'postController.eraseVideo',
                    error
                });
                res.status(500).send(error);
            }
        });
        return function(req, res) {
            return _ref.apply(this, arguments);
        };
    }()){
        _define_property(this, "service", void 0);
        _define_property(this, "prisma", void 0);
        _define_property(this, "googleService", void 0);
        _define_property(this, "facebookService", void 0);
        _define_property(this, "updatePost", void 0);
        _define_property(this, "createPost", void 0);
        _define_property(this, "getPostsIds", void 0);
        _define_property(this, "getAllPosts", void 0);
        _define_property(this, "get30DaysPosts", void 0);
        _define_property(this, "getPostById", void 0);
        _define_property(this, "checkPhotosAge", void 0);
        _define_property(this, "deletePost", void 0);
        _define_property(this, "hidePost", void 0);
        _define_property(this, "showPost", void 0);
        _define_property(this, "uploadAudio", void 0);
        _define_property(this, "eraseAudio", void 0);
        _define_property(this, "videoUpload", void 0);
        _define_property(this, "eraseVideo", void 0);
        this.service = service;
        this.prisma = prisma;
        this.googleService = googleService;
        this.facebookService = facebookService;
        this.updatePost = updatePost;
        this.createPost = createPost;
        this.getPostsIds = getPostsIds;
        this.getAllPosts = getAllPosts;
        this.get30DaysPosts = get30DaysPosts;
        this.getPostById = getPostById;
        this.checkPhotosAge = checkPhotosAge;
        this.deletePost = deletePost;
        this.hidePost = hidePost;
        this.showPost = showPost;
        this.uploadAudio = uploadAudio;
        this.eraseAudio = eraseAudio;
        this.videoUpload = videoUpload;
        this.eraseVideo = eraseVideo;
    }
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9wb3N0L3Bvc3QuY29udHJvbGxlci50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKiBlc2xpbnQtZGlzYWJsZSBuby11c2VsZXNzLXJldHVybiAqL1xyXG4vKiBlc2xpbnQtZGlzYWJsZSBAdHlwZXNjcmlwdC1lc2xpbnQvcHJlZmVyLW9wdGlvbmFsLWNoYWluICovXHJcbi8qIGVzbGludC1kaXNhYmxlIEB0eXBlc2NyaXB0LWVzbGludC9uby1taXN1c2VkLXByb21pc2VzICovXHJcbmltcG9ydCB7IHJlc3BvbnNlLCB0eXBlIFJlcXVlc3QsIHR5cGUgUmVzcG9uc2UgfSBmcm9tICdleHByZXNzJ1xyXG5pbXBvcnQgeyBQb3N0U2VydmljZSB9IGZyb20gJy4vcG9zdC5zZXJ2aWNlJ1xyXG5pbXBvcnQgeyB0eXBlIFByaXNtYSB9IGZyb20gJ0BwcmlzbWEvY2xpZW50J1xyXG4vLyBpbXBvcnQgeyBHb29nbGVTZXJ2aWNlIH0gZnJvbSAnLi4vZ29vZ2xlL2dvb2dsZS5zZXJ2aWNlJ1xyXG4vLyBpbXBvcnQgeyBHb29nbGVTZXJ2aWNlIH0gZnJvbSAnLi4vU2VydmljZXMvZ29vZ2xlLnNlcnZpY2UnXHJcbmltcG9ydCB7IEZhY2Vib29rU2VydmljZSB9IGZyb20gJy4uL1NlcnZpY2VzL2ZhY2Vib29rLnNlcnZpY2UnXHJcbmltcG9ydCB7IGxvZ2dlciB9IGZyb20gJy4uL1NlcnZpY2VzL2xvZ2dlci5zZXJ2aWNlJ1xyXG5pbXBvcnQgeyB0eXBlIENsYXNzaWZpY2F0aW9uQXJyYXkgfSBmcm9tICcuLi9FbnRpdGllcydcclxuaW1wb3J0IHtcclxuICB0eXBlIEdlbmVyaWNSZXNwb25zZU9iamVjdCxcclxuICBSZXNwb25zZU9iamVjdCxcclxuICBHb29nbGVFcnJvcixcclxuICBUb2tlbkVycm9yLFxyXG4gIE5ldmVyQXV0aEVycm9yXHJcbn0gZnJvbSAnLi4vU2VydmljZXMvZ29vZ2xlLmVycm9ycydcclxuaW1wb3J0IHtcclxuICB0eXBlIENyZWF0ZVBvc3RUeXBlLFxyXG4gIHR5cGUgR2V0UG9zdHNUeXBlLFxyXG4gIHR5cGUgR2V0UG9zdEJ5SWQsXHJcbiAgdHlwZSBVcGRhdGVQb3N0VHlwZSxcclxuICB0eXBlIEltYWdlc1NjaGVtYSxcclxuICB0eXBlIFZpZGVvVXBsb2FkLFxyXG4gIHR5cGUgVmlkZW9FcmFzZVR5cGVcclxufSBmcm9tICcuL3Bvc3Quc2NoZW1hJ1xyXG5pbXBvcnQgeyBpbyB9IGZyb20gJy4uL2FwcCdcclxuaW1wb3J0IHsgR29vZ2xlU2VydmljZSB9IGZyb20gJy4uL1NlcnZpY2VzL2dvb2dsZS5zZXJ2aWNlJ1xyXG5pbXBvcnQgeyBQcmlzbWFFcnJvciB9IGZyb20gJy4uL1NlcnZpY2VzL3ByaXNtYS5lcnJvcnMnXHJcbmltcG9ydCB7IHByaXNtYUNsaWVudCB9IGZyb20gJy4uL1NlcnZpY2VzL2RhdGFiYXNlLnNlcnZpY2UnXHJcbmV4cG9ydCBjbGFzcyBQb3N0Q29udHJvbGxlciB7XHJcbiAgY29uc3RydWN0b3IgKFxyXG4gICAgcHJvdGVjdGVkIHNlcnZpY2UgPSBuZXcgUG9zdFNlcnZpY2UoKSxcclxuICAgIHByb3RlY3RlZCBwcmlzbWEgPSBwcmlzbWFDbGllbnQucHJpc21hLFxyXG4gICAgcHJvdGVjdGVkIGdvb2dsZVNlcnZpY2UgPSBuZXcgR29vZ2xlU2VydmljZSgpLFxyXG4gICAgcHJvdGVjdGVkIGZhY2Vib29rU2VydmljZSA9IG5ldyBGYWNlYm9va1NlcnZpY2UoKSxcclxuICAgIHB1YmxpYyB1cGRhdGVQb3N0ID0gYXN5bmMgKFxyXG4gICAgICByZXE6IFJlcXVlc3Q8R2V0UG9zdEJ5SWRbJ3BhcmFtcyddLCBhbnksIFVwZGF0ZVBvc3RUeXBlWydib2R5J10+LFxyXG4gICAgICByZXM6IFJlc3BvbnNlXHJcbiAgICApID0+IHtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICBsb2dnZXIuZGVidWcoeyBib2R5OiByZXEuYm9keSwgZnVuY3Rpb246ICd1cGRhdGVQb3N0LmNvbnRyb2xsZXInIH0pXHJcbiAgICAgICAgY29uc3QgZmlsZXMgPSByZXEuZmlsZXNcclxuICAgICAgICBsZXQgeyBkYkltYWdlcywgdGl0bGUsIGhlYWRpbmcsIGNsYXNzaWZpY2F0aW9uIH0gPSByZXEuYm9keVxyXG4gICAgICAgIGNvbnN0IHsgaWQgfSA9IHJlcS5wYXJhbXNcclxuICAgICAgICBsZXQgaW1hZ2VzQXJyYXk6IEltYWdlc1NjaGVtYVtdIHwgdW5kZWZpbmVkXHJcbiAgICAgICAgbG9nZ2VyLmRlYnVnKHsgZGJJbWFnZXMsIGZpbGVzLCBib2R5OiByZXEuYm9keSB9KVxyXG4gICAgICAgIGlmIChkYkltYWdlcyAhPT0gdW5kZWZpbmVkICYmIHR5cGVvZiBkYkltYWdlcyA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgIGltYWdlc0FycmF5ID0gSlNPTi5wYXJzZShkYkltYWdlcylcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gaGFzdGEgYWNhLCB0ZW5nbyBxdWUgZW4gaW1hZ2VzQXJyYXkgbyBoYXkgdW4gYXJyYXkgZGUgaW1hZ2VuZXMgbyB0ZW5nbyB1bmRlZmluZWRcclxuICAgICAgICAvLyBjb21vIG1hbmVqbyBlbCBoZWNobyBkZSBxdWUgbWUgbGxlZ3VlbiBpbWFnZW5lcyB5YSBjYXJnYWRhcyB5IGZpbGFzIG51ZXZhcyBhZ3JlZ2FkYXM/XHJcbiAgICAgICAgbGV0IG51ZXZvQXJyYXk6IEltYWdlc1NjaGVtYVtdIHwgdW5kZWZpbmVkXHJcbiAgICAgICAgaWYgKGZpbGVzICE9PSB1bmRlZmluZWQgJiYgZmlsZXMubGVuZ3RoICE9PSAwKSB7XHJcbiAgICAgICAgLy8gYXF1aSB2YWxpZG8gc2kgaGF5IGZpbGVzIGRlIG11bHRlciBwYXJhIGFncmVnYXIuXHJcbiAgICAgICAgICBudWV2b0FycmF5ID0gYXdhaXQgdGhpcy5zZXJ2aWNlLnBob3RvR2VuZXJhdG9yKFxyXG4gICAgICAgICAgICBmaWxlcyBhcyBFeHByZXNzLk11bHRlci5GaWxlW11cclxuICAgICAgICAgIClcclxuICAgICAgICAgIGlmIChudWV2b0FycmF5ICE9IG51bGwgJiYgaW1hZ2VzQXJyYXkgIT0gbnVsbCkgeyBudWV2b0FycmF5ID0gWy4uLm51ZXZvQXJyYXksIC4uLmltYWdlc0FycmF5XSB9IGVsc2UgaWYgKGltYWdlc0FycmF5ICE9IG51bGwpIG51ZXZvQXJyYXkgPSBpbWFnZXNBcnJheVxyXG4gICAgICAgIC8vIGxvZ2dlci5kZWJ1Zyh7IGZ1bmN0aW9uOiAncG9zdENvbnRyb2xsZXIudXBkYWRlJywgbnVldm9BcnJheSB9KVxyXG4gICAgICAgIH0gZWxzZSBudWV2b0FycmF5ID0gaW1hZ2VzQXJyYXlcclxuICAgICAgICBsZXQgYm9keSA9IHJlcS5ib2R5XHJcbiAgICAgICAgaWYgKGJvZHkgIT09IG51bGwgJiYgdHlwZW9mIGJvZHkgPT09ICdvYmplY3QnICYmICdkYkltYWdlcycgaW4gYm9keSkge1xyXG4gICAgICAgICAgYm9keSA9IHsgLi4uYm9keSwgZGJJbWFnZXM6IHVuZGVmaW5lZCB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IHVwZGF0ZURiUmVzcG9uc2UgPSBhd2FpdCB0aGlzLnNlcnZpY2UudXBkYXRlUG9zdChcclxuICAgICAgICAgIGJvZHkgYXMgYW55LCAvLyBhcyBQcmlzbWEuUG9zdHNVcGRhdGVJbnB1dCxcclxuICAgICAgICAgIGlkLFxyXG4gICAgICAgICAgbnVldm9BcnJheVxyXG4gICAgICAgIClcclxuICAgICAgICBpZiAodGl0bGUgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgdGl0bGUgPSB1cGRhdGVEYlJlc3BvbnNlLmRhdGEudGl0bGUgYXMgc3RyaW5nXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChoZWFkaW5nID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgIGhlYWRpbmcgPSB1cGRhdGVEYlJlc3BvbnNlLmRhdGEuaGVhZGluZyBhcyBzdHJpbmdcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGNsYXNzaWZpY2F0aW9uID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgIGlmICh1cGRhdGVEYlJlc3BvbnNlLmRhdGEuY2xhc3NpZmljYXRpb24gIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBjbGFzc2lmaWNhdGlvbiA9IHVwZGF0ZURiUmVzcG9uc2UuZGF0YVxyXG4gICAgICAgICAgICAgIC5jbGFzc2lmaWNhdGlvbiBhcyAodHlwZW9mIENsYXNzaWZpY2F0aW9uQXJyYXkpW251bWJlcl1cclxuICAgICAgICAgIH0gZWxzZSBjbGFzc2lmaWNhdGlvbiA9ICdNdW5pY2lwYWxlcydcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gQUNBIERFQk8gVkVSIExBIExPR0lDQSBQQVJBIFFVRSBHRU5FUkUgVU4gTUVSR0UgREUgTE9TIERBVE9TIFFVRSBZQSBFU1RBTiBFTiBMQSBEQiBZIExPIFFVRSBTRSBWQSBBIEFDVFVBTElaQVJcclxuICAgICAgICBpZiAobnVldm9BcnJheSAhPT0gdW5kZWZpbmVkICYmICdmYmlkJyBpbiB1cGRhdGVEYlJlc3BvbnNlLmRhdGEpIHtcclxuICAgICAgICAgIGF3YWl0IHRoaXMuZmFjZWJvb2tTZXJ2aWNlLnVwZGF0ZUZhY2Vib29rUG9zdChcclxuICAgICAgICAgICAgdXBkYXRlRGJSZXNwb25zZS5kYXRhLmZiaWQgYXMgc3RyaW5nLFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgdGl0bGUsXHJcbiAgICAgICAgICAgICAgaGVhZGluZyxcclxuICAgICAgICAgICAgICBjbGFzc2lmaWNhdGlvbixcclxuICAgICAgICAgICAgICBuZXdzcGFwZXJJRDogaWQsXHJcbiAgICAgICAgICAgICAgaW1hZ2VzOiBudWV2b0FycmF5Py5tYXAoKGlkKSA9PiBpZC5mYmlkKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICApXHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vICAgICAgaW8uZW1pdCgncG9zdFVwZGF0ZScsIHsgLi4udXBkYXRlRGJSZXNwb25zZSwgaW1hZ2VzOiBudWV2b0FycmF5IH0pXHJcbiAgICAgICAgcmVzLnNlbmQoeyAuLi51cGRhdGVEYlJlc3BvbnNlLmRhdGEsIGltYWdlczogbnVldm9BcnJheSB9KVxyXG4gICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgIGxvZ2dlci5lcnJvcih7IGZ1bmN0aW9uOiAncG9zdENvbnRyb2xsZXIudXBkYXRlJywgZXJyb3IgfSlcclxuICAgICAgICByZXMuc3RhdHVzKDUwMCkuc2VuZChlcnJvcilcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIHB1YmxpYyBjcmVhdGVQb3N0ID0gYXN5bmMgKFxyXG4gICAgICByZXE6IFJlcXVlc3Q8YW55LCBhbnksIENyZWF0ZVBvc3RUeXBlWydib2R5J10+LFxyXG4gICAgICByZXM6IFJlc3BvbnNlXHJcbiAgICApID0+IHtcclxuICAgICAgY29uc3QgYm9keSA9IHJlcS5ib2R5XHJcbiAgICAgIGNvbnN0IGZpbGVzID0gcmVxLmZpbGVzXHJcbiAgICAgIGNvbnN0IGRhdGFFbWl0dGVkID0geyBhY3RpdmU6IHRydWUsIGJvZHkgfVxyXG4gICAgICBjb25zb2xlLmxvZyhib2R5LCAnZW52aWFkbycpXHJcbiAgICAgIGlvLmVtaXQoJ3Bvc3RMb2FkZXInLCBkYXRhRW1pdHRlZClcclxuICAgICAgdHJ5IHtcclxuICAgICAgICBsZXQgaW1hZ2VzQXJyYXlcclxuICAgICAgICBpZiAoZmlsZXMgIT09IHVuZGVmaW5lZCAmJiBBcnJheS5pc0FycmF5KGZpbGVzKSAmJiBmaWxlcz8ubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgaW1hZ2VzQXJyYXkgPSBhd2FpdCB0aGlzLnNlcnZpY2UucGhvdG9HZW5lcmF0b3IoZmlsZXMpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChcclxuICAgICAgICAgIHJlcS51c2VyICE9PSB1bmRlZmluZWQgJiZcclxuICAgICAgICAgICdpZCcgaW4gcmVxLnVzZXIgJiZcclxuICAgICAgICAgIHR5cGVvZiByZXEudXNlci5pZCA9PT0gJ3N0cmluZydcclxuXHJcbiAgICAgICAgKSB7XHJcbiAgICAgICAgICBjb25zdCByZXNwb25zZURCID0gYXdhaXQgdGhpcy5zZXJ2aWNlLmNyZWF0ZVBvc3QoXHJcbiAgICAgICAgICAgIGJvZHksXHJcbiAgICAgICAgICAgIHJlcS51c2VyLmlkLFxyXG4gICAgICAgICAgICBpbWFnZXNBcnJheSBhcyBBcnJheTx7IGZiaWQ6IHN0cmluZywgdXJsOiBzdHJpbmcgfT5cclxuICAgICAgICAgIClcclxuICAgICAgICAgIGlvLmVtaXQoJ3Bvc3RVcGRhdGUnLCB7XHJcbiAgICAgICAgICAgIC4uLnJlc3BvbnNlREIsXHJcbiAgICAgICAgICAgIGltYWdlczogaW1hZ2VzQXJyYXksXHJcbiAgICAgICAgICAgIHN0YW1wOiBEYXRlLm5vdygpXHJcbiAgICAgICAgICB9KVxyXG5cclxuICAgICAgICAgIGlmIChcclxuXHJcbiAgICAgICAgICAgIHJlc3BvbnNlREIgIT09IHVuZGVmaW5lZCAmJlxyXG4gICAgICAgICAgICB0eXBlb2YgcmVzcG9uc2VEQiA9PT0gJ29iamVjdCcgJiZcclxuICAgICAgICAgICAgcmVzcG9uc2VEQiAhPT0gbnVsbCAmJlxyXG4gICAgICAgICAgICAnaWQnIGluIHJlc3BvbnNlREIgJiZcclxuICAgICAgICAgICAgdHlwZW9mIHJlc3BvbnNlREIuaWQgPT09ICdzdHJpbmcnXHJcbiAgICAgICAgICApIHtcclxuICAgICAgICAgICAgaWYgKGltYWdlc0FycmF5ID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICByZXMuc3RhdHVzKDIwMCkuc2VuZChyZXNwb25zZURCKVxyXG4gICAgICAgICAgICAgIHJldHVyblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnN0IGZhY2Vib29rRmVlZFJlc3BvbnNlID1cclxuICAgICAgICAgICAgICBhd2FpdCB0aGlzLmZhY2Vib29rU2VydmljZS5mYWNlYm9va0ZlZWQoXHJcbiAgICAgICAgICAgICAgICBib2R5LFxyXG4gICAgICAgICAgICAgICAgaW1hZ2VzQXJyYXksXHJcbiAgICAgICAgICAgICAgICByZXNwb25zZURCLmlkXHJcbiAgICAgICAgICAgICAgKVxyXG5cclxuICAgICAgICAgICAgaWYgKFxyXG4gICAgICAgICAgICAgIGZhY2Vib29rRmVlZFJlc3BvbnNlICE9PSB1bmRlZmluZWQgJiZcclxuICAgICAgICAgICAgICBmYWNlYm9va0ZlZWRSZXNwb25zZS5vayAmJlxyXG4gICAgICAgICAgICAgICdpZCcgaW4gZmFjZWJvb2tGZWVkUmVzcG9uc2UuZGF0YS5kYXRhXHJcbiAgICAgICAgICAgICkge1xyXG4gICAgICAgICAgICAgIGNvbnN0IGZiaWRVcGRhdGUgPSBhd2FpdCB0aGlzLnNlcnZpY2UuYWRkRkJJRHRvRGF0YWJhc2UoXHJcbiAgICAgICAgICAgICAgICBmYWNlYm9va0ZlZWRSZXNwb25zZT8uZGF0YS5kYXRhLmlkIGFzIHN0cmluZyxcclxuICAgICAgICAgICAgICAgIHJlc3BvbnNlREIuaWRcclxuICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgICAgcmVzLnN0YXR1cygyMDApLnNlbmQoZmJpZFVwZGF0ZSlcclxuICAgICAgICAgICAgfSBlbHNlIHRocm93IG5ldyBFcnJvcignRXJyb3IgVXBkYXRpbmcgRmFjZWJvb2sgUGFnZSBQb3N0JylcclxuICAgICAgICAgIH0gZWxzZSB0aHJvdyBuZXcgRXJyb3IoJ0Vycm9yIHVwZGF0aW5nIERhdGFiYXNlJylcclxuICAgICAgICB9XHJcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgbG9nZ2VyLmVycm9yKHsgZnVuY3Rpb246ICdQb3N0Q29udHJvbGxlci5jcmVhdGVQb3N0JywgZXJyb3IgfSlcclxuICAgICAgICByZXMuc3RhdHVzKDQwNCkuc2VuZChlcnJvcilcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIHB1YmxpYyBnZXRQb3N0c0lkcyA9IGFzeW5jIChcclxuICAgICAgcmVxOiBSZXF1ZXN0PGFueSwgYW55LCBhbnk+LFxyXG4gICAgICByZXM6IFJlc3BvbnNlXHJcbiAgICApID0+IHtcclxuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCB0aGlzLnNlcnZpY2UuZ2V0SWRzKClcclxuICAgICAgaWYgKHJlc3BvbnNlID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICByZXMuc3RhdHVzKDUwMCkuc2VuZCgnTm8gcG9zdHMgZm91bmQnKVxyXG4gICAgICAgIHJldHVyblxyXG4gICAgICB9XHJcbiAgICAgIHJlcy5zdGF0dXMoMjAwKS5zZW5kKHJlc3BvbnNlKVxyXG4gICAgfSxcclxuICAgIHB1YmxpYyBnZXRBbGxQb3N0cyA9IChcclxuICAgICAgcmVxOiBSZXF1ZXN0PGFueSwgYW55LCBhbnksIEdldFBvc3RzVHlwZVsncXVlcnknXT4sXHJcbiAgICAgIHJlczogUmVzcG9uc2VcclxuICAgICkgPT4ge1xyXG4gICAgICBjb25zdCB7IGN1cnNvciwgdGl0bGUsIHNlYXJjaCwgbWluRGF0ZSwgbWF4RGF0ZSwgY2F0ZWdvcnkgfSA9IHJlcS5xdWVyeVxyXG4gICAgICBjb25zdCBxdWVyeTogUHJpc21hLlBvc3RzRmluZE1hbnlBcmdzWyd3aGVyZSddICYge1xyXG4gICAgICAgIEFORDogQXJyYXk8UHJpc21hLlBvc3RzRmluZE1hbnlBcmdzWyd3aGVyZSddPlxyXG4gICAgICB9ID0geyBBTkQ6IFtdIH1cclxuXHJcbiAgICAgIGlmICh0aXRsZSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgcXVlcnkuQU5ELnB1c2goe1xyXG4gICAgICAgICAgdGl0bGU6IHsgY29udGFpbnM6IHRpdGxlIH1cclxuICAgICAgICB9KVxyXG4gICAgICB9XHJcbiAgICAgIGlmIChjYXRlZ29yeSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgcXVlcnkuQU5ELnB1c2goeyBjbGFzc2lmaWNhdGlvbjogeyBjb250YWluczogY2F0ZWdvcnkgYXMgc3RyaW5nIH0gfSlcclxuICAgICAgfVxyXG4gICAgICBpZiAoc2VhcmNoICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICBxdWVyeS5BTkQucHVzaCh7XHJcbiAgICAgICAgICBPUjogW1xyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgdGl0bGU6IHNlYXJjaFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgdGV4dDogc2VhcmNoXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHsgaGVhZGluZzogc2VhcmNoIH0sXHJcbiAgICAgICAgICAgIHsgc3ViVGl0bGU6IHNlYXJjaCB9XHJcbiAgICAgICAgICBdXHJcbiAgICAgICAgfSlcclxuICAgICAgfVxyXG4gICAgICBpZiAobWluRGF0ZSAhPT0gdW5kZWZpbmVkIHx8IG1heERhdGUgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIHF1ZXJ5LkFORC5wdXNoKHtcclxuICAgICAgICAgIEFORDogW11cclxuICAgICAgICB9KVxyXG4gICAgICB9XHJcbiAgICAgIGlmIChtaW5EYXRlICE9PSB1bmRlZmluZWQgJiYgcXVlcnkgIT09IHVuZGVmaW5lZCAmJiAnQU5EJyBpbiBxdWVyeSkge1xyXG4gICAgICAgIGNvbnN0IGRhdGEgPSBxdWVyeS5BTkRbcXVlcnkuQU5ELmxlbmd0aCAtIDFdXHJcbiAgICAgICAgaWYgKGRhdGEgIT09IHVuZGVmaW5lZCAmJiAnQU5EJyBpbiBkYXRhICYmIEFycmF5LmlzQXJyYXkoZGF0YS5BTkQpKSB7XHJcbiAgICAgICAgICBkYXRhLkFORC5wdXNoKHsgY3JlYXRlZEF0OiB7IGd0ZTogbmV3IERhdGUobWluRGF0ZSkgfSB9KVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICBpZiAobWF4RGF0ZSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgY29uc3QgZGF0YSA9IHF1ZXJ5LkFORFtxdWVyeS5BTkQubGVuZ3RoIC0gMV1cclxuICAgICAgICBpZiAoXHJcbiAgICAgICAgICBkYXRhICE9PSB1bmRlZmluZWQgJiZcclxuICAgICAgICAgICdBTkQnIGluIGRhdGEgJiZcclxuICAgICAgICAgIGRhdGE/LkFORCAhPT0gdW5kZWZpbmVkICYmXHJcbiAgICAgICAgICBBcnJheS5pc0FycmF5KGRhdGEuQU5EKVxyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgZGF0YS5BTkQucHVzaCh7IGNyZWF0ZWRBdDogeyBsdGU6IG5ldyBEYXRlKG1heERhdGUpIH0gfSlcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgdGhpcy5zZXJ2aWNlXHJcbiAgICAgICAgLmdldFBvc3RzKFxyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICBjdXJzb3I6XHJcbiAgICAgICAgICAgICAgY3Vyc29yID09PSB1bmRlZmluZWRcclxuICAgICAgICAgICAgICAgID8gdW5kZWZpbmVkXHJcbiAgICAgICAgICAgICAgICA6IHsgY3JlYXRlZEF0OiBuZXcgRGF0ZShjdXJzb3IpIH0sXHJcbiAgICAgICAgICAgIHBhZ2luYXRpb246IDUwXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgcXVlcnlcclxuICAgICAgICApXHJcbiAgICAgICAgLnRoZW4oYXN5bmMgKHJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgICBpZiAocmVzcG9uc2UgIT09IHVuZGVmaW5lZCAmJiByZXNwb25zZS5vaykge1xyXG4gICAgICAgICAgICBjb25zdCBkYXRhID0gcmVzcG9uc2UuZGF0YVxyXG4gICAgICAgICAgICBjb25zdCBjaGVja2VkUmVzcG9uc2UgPSBhd2FpdCBQcm9taXNlLmFsbChcclxuICAgICAgICAgICAgICBkYXRhLm1hcChhc3luYyAocG9zdDogYW55KSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5jaGVja1Bob3Rvc0FnZShcclxuICAgICAgICAgICAgICAgICAgcG9zdD8uaW1hZ2VzIC8vIGFzIFByaXNtYS5QaG90b3NDcmVhdGVJbnB1dFtdXHJcbiAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgICAgICAgIC50aGVuKChjaGVja2VkUGhvdG9zKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNoZWNrZWRQaG90b3MuZGF0YSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBjb25zdCBmaW5hbERhdGE6IFByaXNtYS5QaG90b3NDcmVhdGVJbnB1dFtdID1cclxuICAgICAgICAgICAgICAgICAgICAgICAgY2hlY2tlZFBob3Rvcy5kYXRhIC8vIGFzIFByaXNtYS5QaG90b3NDcmVhdGVOZXN0ZWRNYW55V2l0aG91dFBvc3RzSW5wdXRcclxuICAgICAgICAgICAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvY29uc2lzdGVudC10eXBlLWFzc2VydGlvbnNcclxuICAgICAgICAgICAgICAgICAgICAgIHBvc3QgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC4uLnBvc3QsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGltYWdlczpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBmaW5hbERhdGEubGVuZ3RoID09PSAxICYmIGZpbmFsRGF0YVswXSA9PT0gdW5kZWZpbmVkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IFtdXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IGZpbmFsRGF0YVxyXG4gICAgICAgICAgICAgICAgICAgICAgfSAvLyBQcmlzbWEuUG9zdHNDcmVhdGVJbnB1dFxyXG4gICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBvc3RcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgICAgICAgICAgICAuY2F0Y2goKGVycm9yKSA9PlxyXG4gICAgICAgICAgICAgICAgICAgIGxvZ2dlci5lcnJvcih7XHJcbiAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbjogJ1Bvc3RDb250cm9sbGVyLmdldEFsbFBvc3RzJyxcclxuICAgICAgICAgICAgICAgICAgICAgIGVycm9yXHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIClcclxuICAgICAgICAgICAgY29uc29sZS5sb2coY2hlY2tlZFJlc3BvbnNlLCAndGV4dG8nKVxyXG4gICAgICAgICAgICByZXMuc3RhdHVzKDIwMCkuc2VuZChjaGVja2VkUmVzcG9uc2UpXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgICAgICAuY2F0Y2goKGVycm9yKSA9PiB7XHJcbiAgICAgICAgICBsb2dnZXIuZXJyb3IoeyBmdW5jdGlvbjogJ1Bvc3RDb250cm9sbGVyLmdldEFsbFBvc3RzJywgZXJyb3IgfSlcclxuICAgICAgICAgIHJlcy5zdGF0dXMoNDA0KS5zZW5kKGVycm9yKVxyXG4gICAgICAgIH0pXHJcbiAgICB9LFxyXG4gICAgcHVibGljIGdldDMwRGF5c1Bvc3RzID0gYXN5bmMgKHJlcTogUmVxdWVzdDxhbnksIGFueSwgYW55LCB7IHBhZ2U/OiBzdHJpbmcgfT4sXHJcbiAgICAgIHJlczogUmVzcG9uc2VcclxuICAgICkgPT4ge1xyXG4gICAgICB0cnkge1xyXG4gICAgICAgIGNvbnN0IHsgcGFnZSB9ID0gcmVxLnF1ZXJ5XHJcblxyXG4gICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgdGhpcy5zZXJ2aWNlLmdldDMwRGF5c1Bvc3RzKHBhZ2UgIT09IHVuZGVmaW5lZCA/IHBhcnNlSW50KHBhZ2UpIDogdW5kZWZpbmVkKVxyXG4gICAgICAgIGlmIChyZXNwb25zZSBpbnN0YW5jZW9mIFByaXNtYUVycm9yKSB7XHJcbiAgICAgICAgICByZXMuc3RhdHVzKDUwMCkuc2VuZChyZXNwb25zZSlcclxuICAgICAgICAgIHJldHVyblxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICByZXMuc3RhdHVzKDIwMCkuc2VuZChyZXNwb25zZSlcclxuICAgICAgICAgIHJldHVyblxyXG4gICAgICAgIH1cclxuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICBsb2dnZXIuZXJyb3IoeyBmdW5jdGlvbjogJ1Bvc3RDb250cm9sbGVyLmdldDMwRGF5c1Bvc3RzJywgZXJyb3IgfSlcclxuICAgICAgICByZXMuc3RhdHVzKDUwMCkuc2VuZChlcnJvcilcclxuICAgICAgICByZXR1cm5cclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIHB1YmxpYyBnZXRQb3N0QnlJZCA9IChcclxuICAgICAgcmVxOiBSZXF1ZXN0PEdldFBvc3RCeUlkWydwYXJhbXMnXT4sXHJcbiAgICAgIHJlczogUmVzcG9uc2VcclxuICAgICkgPT4ge1xyXG4gICAgICBjb25zdCB7IGlkIH0gPSByZXEucGFyYW1zXHJcbiAgICAgIHRoaXMuc2VydmljZVxyXG4gICAgICAgIC5nZXRQb3N0KGlkKVxyXG4gICAgICAgIC50aGVuKGFzeW5jIChyZXNwb25zZSkgPT4ge1xyXG4gICAgICAgICAgaWYgKFxyXG4gICAgICAgICAgICByZXNwb25zZSAhPT0gdW5kZWZpbmVkICYmXHJcbiAgICAgICAgICAgIHJlc3BvbnNlICE9PSBudWxsICYmXHJcbiAgICAgICAgICAgICdpbWFnZXMnIGluIHJlc3BvbnNlICYmXHJcbiAgICAgICAgICAgIEFycmF5LmlzQXJyYXkocmVzcG9uc2UuaW1hZ2VzKVxyXG4gICAgICAgICAgKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2hlY2tQaG90b3NBZ2UoXHJcbiAgICAgICAgICAgICAgcmVzcG9uc2U/LmltYWdlcyBhcyBQcmlzbWEuUGhvdG9zQ3JlYXRlSW5wdXRbXVxyXG4gICAgICAgICAgICApXHJcbiAgICAgICAgICAgICAgLnRoZW4oXHJcbiAgICAgICAgICAgICAgICBhc3luYyAoXHJcbiAgICAgICAgICAgICAgICAgIGNoZWNrZWRQaG90b3M6IEdlbmVyaWNSZXNwb25zZU9iamVjdDxcclxuICAgICAgICAgICAgICAgICAgUHJpc21hLlBob3Rvc0NyZWF0ZUlucHV0W11cclxuICAgICAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgIC8vIGFjYSBzYXFlIGVsIC4uZGF0YSBoYXkgcXVlIHZlciBzaSBzaWd1ZSBmdW5jaW9uYW5kb1xyXG4gICAgICAgICAgICAgICAgICBpZiAoJ2ltYWdlcycgaW4gcmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBkYXRhID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgLi4ucmVzcG9uc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICBpbWFnZXM6IGNoZWNrZWRQaG90b3MuZGF0YVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICByZXMuc3RhdHVzKDIwMCkuc2VuZCh7IGVycm9yOiBudWxsLCBvazogdHJ1ZSwgZGF0YSB9KVxyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICAgIC5jYXRjaCgoZXJyb3I6IGFueSkgPT5cclxuICAgICAgICAgICAgICAgIGxvZ2dlci5lcnJvcih7IGZ1bmN0aW9uOiAnUG9zdENvbnRyb2xsZXIuZ2V0QnlpZCcsIGVycm9yIH0pXHJcbiAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgfSBlbHNlIHJlcy5zdGF0dXMoNDA0KS5zZW5kKHJlc3BvbnNlKVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmNhdGNoKChlcnJvcikgPT4ge1xyXG4gICAgICAgICAgbG9nZ2VyLmVycm9yKHsgZnVuY3Rpb246ICdQb3N0Q29udHJvbGxlci5nZXRQb3N0QnlJZCcsIGVycm9yIH0pXHJcbiAgICAgICAgICByZXMuc3RhdHVzKDQwNCkuc2VuZChlcnJvcilcclxuICAgICAgICB9KVxyXG4gICAgfSxcclxuICAgIHByb3RlY3RlZCBjaGVja1Bob3Rvc0FnZSA9IGFzeW5jIChcclxuICAgICAgcGhvdG9zT2JqZWN0OiBQcmlzbWEuUGhvdG9zQ3JlYXRlSW5wdXRbXVxyXG4gICAgKTogUHJvbWlzZTxHZW5lcmljUmVzcG9uc2VPYmplY3Q8UHJpc21hLlBob3Rvc0NyZWF0ZUlucHV0W10+PiA9PiB7XHJcbiAgICAgIGlmIChBcnJheS5pc0FycmF5KHBob3Rvc09iamVjdCkpIHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgbGV0IGlkQXJyYXlcclxuICAgICAgICAgIGxldCB1cGRhdGVkTGlua3NBcnJheVxyXG4gICAgICAgICAgbGV0IGRiUmVzcG9uc2U6IHVua25vd25bXVxyXG4gICAgICAgICAgY29uc3QgcGhvdG9BcnJheSA9IHBob3Rvc09iamVjdC5maWx0ZXIoKHBob3RvKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChcclxuICAgICAgICAgICAgICBwaG90by5jcmVhdGVkQXQgIT09IHVuZGVmaW5lZCAmJlxyXG4gICAgICAgICAgICAgIERhdGUubm93KCkgPlxyXG4gICAgICAgICAgICAgICAgbmV3IERhdGUocGhvdG8uY3JlYXRlZEF0KS5nZXRUaW1lKCkgKyAxMDAwICogNjAgKiA2MCAqIDI0ICogMlxyXG4gICAgICAgICAgICApIHtcclxuICAgICAgICAgICAgICByZXR1cm4gdHJ1ZVxyXG4gICAgICAgICAgICB9IGVsc2UgcmV0dXJuIGZhbHNlXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkocGhvdG9BcnJheSkgJiYgcGhvdG9BcnJheS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIGlkQXJyYXkgPSBwaG90b0FycmF5Lm1hcCgocGhvdG8pID0+ICh7IGlkOiBwaG90by5mYmlkIH0pKVxyXG4gICAgICAgICAgICB1cGRhdGVkTGlua3NBcnJheSA9IGF3YWl0IHRoaXMuZmFjZWJvb2tTZXJ2aWNlLmdldExpbmtGcm9tSWQoXHJcbiAgICAgICAgICAgICAgaWRBcnJheVxyXG4gICAgICAgICAgICApXHJcbiAgICAgICAgICAgIGRiUmVzcG9uc2UgPSBhd2FpdCBQcm9taXNlLmFsbChcclxuICAgICAgICAgICAgICB1cGRhdGVkTGlua3NBcnJheS5kYXRhLm1hcChhc3luYyAocGhvdG8pID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgdGhpcy5wcmlzbWEuJHRyYW5zYWN0aW9uKFtcclxuICAgICAgICAgICAgICAgICAgdGhpcy5wcmlzbWEucGhvdG9zLnVwZGF0ZU1hbnkoe1xyXG4gICAgICAgICAgICAgICAgICAgIHdoZXJlOiB7IGZiaWQ6IHBob3RvLmZiaWQgfSxcclxuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7IHVybDogcGhvdG8udXJsIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICAgICAgICB0aGlzLnByaXNtYS5waG90b3MuZmluZE1hbnkoeyB3aGVyZTogeyBmYmlkOiBwaG90by5mYmlkIH0gfSlcclxuICAgICAgICAgICAgICAgIF0pXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzcG9uc2VbMV1bMF1cclxuICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICApXHJcbiAgICAgICAgICB9IGVsc2UgZGJSZXNwb25zZSA9IHBob3Rvc09iamVjdFxyXG5cclxuICAgICAgICAgIHJldHVybiBuZXcgUmVzcG9uc2VPYmplY3QobnVsbCwgdHJ1ZSwgZGJSZXNwb25zZSlcclxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgbG9nZ2VyLmVycm9yKHsgZnVuY3Rpb246ICdQb3N0Q29udHJvbGxlci5jaGVja2VkUGhvdG9zJywgZXJyb3IgfSlcclxuICAgICAgICAgIHJldHVybiBuZXcgUmVzcG9uc2VPYmplY3QoZXJyb3IsIGZhbHNlLCBudWxsKVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gbmV3IFJlc3BvbnNlT2JqZWN0KFxyXG4gICAgICAgIG5ldyBFcnJvcignRXJyb3IgdXBkYXRpbmcgcGhvdG9zJyksXHJcbiAgICAgICAgZmFsc2UsXHJcbiAgICAgICAgbnVsbFxyXG4gICAgICApXHJcbiAgICB9LFxyXG4gICAgcHVibGljIGRlbGV0ZVBvc3QgPSBhc3luYyAocmVxOiBSZXF1ZXN0PEdldFBvc3RCeUlkWydwYXJhbXMnXT4sIHJlczogUmVzcG9uc2UpOiBQcm9taXNlPHZvaWQ+ID0+IHtcclxuICAgICAgY29uc3QgeyBpZCB9ID0gcmVxLnBhcmFtc1xyXG4gICAgICB0cnkge1xyXG4gICAgICAgIGNvbnN0IHsgZGF0YSB9ID0gYXdhaXQgdGhpcy5zZXJ2aWNlLmRlbGV0ZUJ5SWQoaWQpXHJcbiAgICAgICAgY29uc3QgeyBhdWRpbyB9ID0gZGF0YVxyXG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KGF1ZGlvKSAmJiBhdWRpby5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICBhdWRpby5mb3JFYWNoKGFzeW5jIGl0ZW0gPT4gYXdhaXQgdGhpcy5nb29nbGVTZXJ2aWNlLmZpbGVSZW1vdmUoaXRlbS5kcml2ZUlkKSlcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IGZiUmVzcG9uc2VcclxuICAgICAgICBpZiAoZGF0YS5mYmlkICE9PSBudWxsICYmIHR5cGVvZiBkYXRhLmZiaWQgPT09ICdzdHJpbmcnKSBmYlJlc3BvbnNlID0gYXdhaXQgdGhpcy5mYWNlYm9va1NlcnZpY2UuZGVsZXRlRmFjZWJvb2tQb3N0KGRhdGEuZmJpZClcclxuICAgICAgICBsb2dnZXIuZGVidWcoeyBmdW5jdGlvbjogJ1Bvc3RDb250cm9sbGVyLmRlbGV0ZVBvc3QnLCByZXNwb25zZSwgZmJSZXNwb25zZSB9KVxyXG4gICAgICAgIHJlcy5zdGF0dXMoMjAwKS5zZW5kKHJlc3BvbnNlKVxyXG4gICAgICB9IGNhdGNoIChlcnJvcikgeyBsb2dnZXIuZXJyb3IoeyBmdW5jdGlvbjogJ3Bvc3RDb250cm9sbGVyLmRlbGV0ZVBvc3QnLCBlcnJvciB9KSB9XHJcbiAgICB9LFxyXG4gICAgcHVibGljIGhpZGVQb3N0ID0gYXN5bmMgKHJlcTogUmVxdWVzdDxHZXRQb3N0QnlJZFsncGFyYW1zJ10+LCByZXM6IFJlc3BvbnNlKTogUHJvbWlzZTx2b2lkPiA9PiB7XHJcbiAgICAgIGNvbnN0IHsgaWQgfSA9IHJlcS5wYXJhbXNcclxuICAgICAgdHJ5IHtcclxuICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHRoaXMuc2VydmljZS5oaWRlUG9zdChpZClcclxuICAgICAgICBsb2dnZXIuZGVidWcoeyBmdW5jdGlvbjogJ1Bvc3RDb250cm9sbGVyLmhpZGVQb3N0JywgcmVzcG9uc2UgfSlcclxuICAgICAgICByZXMuc3RhdHVzKDIwMCkuc2VuZChyZXNwb25zZSlcclxuICAgICAgfSBjYXRjaCAoZXJyb3IpIHsgbG9nZ2VyLmVycm9yKHsgZnVuY3Rpb246ICdwb3N0Q29udHJvbGxlci5oaWRlUG9zdCcsIGVycm9yIH0pIH1cclxuICAgIH0sXHJcbiAgICBwdWJsaWMgc2hvd1Bvc3QgPSBhc3luYyAocmVxOiBSZXF1ZXN0PEdldFBvc3RCeUlkWydwYXJhbXMnXT4sIHJlczogUmVzcG9uc2UpOiBQcm9taXNlPHZvaWQ+ID0+IHtcclxuICAgICAgY29uc3QgeyBpZCB9ID0gcmVxLnBhcmFtc1xyXG4gICAgICB0cnkge1xyXG4gICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgdGhpcy5zZXJ2aWNlLnNob3dQb3N0KGlkKVxyXG4gICAgICAgIGxvZ2dlci5kZWJ1Zyh7IGZ1bmN0aW9uOiAnUG9zdENvbnRyb2xsZXIuc2hvd1Bvc3QnLCByZXNwb25zZSB9KVxyXG4gICAgICAgIHJlcy5zdGF0dXMoMjAwKS5zZW5kKHJlc3BvbnNlKVxyXG4gICAgICB9IGNhdGNoIChlcnJvcikgeyBsb2dnZXIuZXJyb3IoeyBmdW5jdGlvbjogJ3Bvc3RDb250cm9sbGVyLnNob3dQb3N0JywgZXJyb3IgfSkgfVxyXG4gICAgfSxcclxuICAgIHB1YmxpYyB1cGxvYWRBdWRpbyA9IGFzeW5jIChyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UpID0+IHtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICBpZiAocmVxLmZpbGVzICE9PSB1bmRlZmluZWQgJiYgQXJyYXkuaXNBcnJheShyZXEuZmlsZXMpKSB7XHJcbiAgICAgICAgICByZXEuZmlsZXM/LmZvckVhY2goYXN5bmMgKGZpbGUpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgaWQgPSBhd2FpdCB0aGlzLmdvb2dsZVNlcnZpY2UuZmlsZVVwbG9hZCgnYXVkaW8nLCBmaWxlLnBhdGgpXHJcbiAgICAgICAgICAgIGlmIChpZCBpbnN0YW5jZW9mIFRva2VuRXJyb3IgfHwgaWQgaW5zdGFuY2VvZiBOZXZlckF1dGhFcnJvcikge1xyXG4gICAgICAgICAgICAgIHJlcy5zdGF0dXMoNDAxKS5qc29uKGlkKVxyXG4gICAgICAgICAgICAgIHJldHVyblxyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGlkIGluc3RhbmNlb2YgR29vZ2xlRXJyb3IpIHtcclxuICAgICAgICAgICAgICByZXMuc3RhdHVzKDUwMCkuanNvbihpZClcclxuICAgICAgICAgICAgICByZXR1cm5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoaWQgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgdGhpcy5zZXJ2aWNlLmFkZEF1ZGlvVG9EQihpZClcclxuICAgICAgICAgICAgICBpZiAoIShyZXNwb25zZSBpbnN0YW5jZW9mIEVycm9yKSkge1xyXG4gICAgICAgICAgICAgICAgcmVzLnN0YXR1cygyMDApLmpzb24ocmVzcG9uc2UpXHJcbiAgICAgICAgICAgICAgfSBlbHNlIGlmIChyZXNwb25zZSBpbnN0YW5jZW9mIFByaXNtYUVycm9yKSByZXMuc3RhdHVzKDUwMCkuc2VuZChyZXNwb25zZSlcclxuICAgICAgICAgICAgfSBlbHNlIHJlcy5qc29uKDUwMCkuc2VuZChuZXcgRXJyb3IoJ0NvdWxkbnQgdXBsb2FkIGZpbGUnKSlcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgfVxyXG4gICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgIGxvZ2dlci5lcnJvcih7IGZ1bmN0aW9uOiAncG9zdENvbnRyb2xsZXIudXBsb2FkQXVkaW8nLCBlcnJvciB9KVxyXG4gICAgICAgIHJlcy5zdGF0dXMoNTAwKS5qc29uKGVycm9yKVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgcHVibGljIGVyYXNlQXVkaW8gPSBhc3luYyAocmVxOiBSZXF1ZXN0PGFueSwgYW55LCBhbnksIHsgaWQ6IHN0cmluZyB9PiwgcmVzOiBSZXNwb25zZSkgPT4ge1xyXG4gICAgICB0cnkge1xyXG4gICAgICAgIGNvbnN0IHsgaWQgfSA9IHJlcS5xdWVyeVxyXG4gICAgICAgIGNvbnN0IGRyaXZlSWQgPSBhd2FpdCB0aGlzLnByaXNtYS5hdWRpby5kZWxldGUoeyB3aGVyZTogeyBpZCB9LCBzZWxlY3Q6IHsgZHJpdmVJZDogdHJ1ZSB9IH0pXHJcbiAgICAgICAgaWYgKGRyaXZlSWQgPT09IHVuZGVmaW5lZCB8fCB0eXBlb2YgZHJpdmVJZCAhPT0gJ29iamVjdCcpIHRocm93IG5ldyBFcnJvcignVW5hYmxlIHRvIGVyYXNlIGZyb20gZGF0YWJhc2UnKVxyXG4gICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgdGhpcy5nb29nbGVTZXJ2aWNlLmZpbGVSZW1vdmUoZHJpdmVJZC5kcml2ZUlkKVxyXG4gICAgICAgIGlmIChyZXNwb25zZSAhPT0gdW5kZWZpbmVkIHx8IHJlc3BvbnNlICE9PSBudWxsKSByZXMuc3RhdHVzKDIwMCkuc2VuZChyZXNwb25zZSlcclxuICAgICAgICBlbHNlIHRocm93IG5ldyBFcnJvcignVW5hYmxlIHRvIGVyYXNlIGRlIGRyaXZlIEltYWdlJylcclxuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICBsb2dnZXIuZXJyb3IoeyBmdW5jdGlvbjogJ3Bvc3RDb250cm9sbGVyLmVyYXNlQXVkaW8nLCBlcnJvciB9KVxyXG4gICAgICAgIHJlcy5zdGF0dXMoNTAwKS5zZW5kKGVycm9yKVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgcHVibGljIHZpZGVvVXBsb2FkID0gYXN5bmMgKHJlcTogUmVxdWVzdDxhbnksIGFueSwgVmlkZW9VcGxvYWRbJ2JvZHknXT4sIHJlczogUmVzcG9uc2UpID0+IHtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICBjb25zdCB7IGZpbGUsIGJvZHk6IHsgdGl0bGUsIGRlc2NyaXB0aW9uLCB0YWdzLCB1cmwgfSB9ID0gcmVxXHJcbiAgICAgICAgY29uc3QgeyB1c2VybmFtZSB9ID0gcmVxLnVzZXIgYXMgYW55XHJcbiAgICAgICAgY29uc29sZS5sb2coJ3N1YmllbmRvJywgZmlsZSwgdGl0bGUsIGRlc2NyaXB0aW9uLCB0YWdzLCB1cmwsIHVzZXJuYW1lLCByZXEuYm9keSlcclxuICAgICAgICBpZiAodXJsICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgIGNvbnN0IGNyZWF0ZVJlc3BvbnNlID1cclxuICAgICAgICAgICAgYXdhaXQgdGhpcy5zZXJ2aWNlLnByaXNtYS52aWRlby5jcmVhdGUoXHJcbiAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgZGF0YTpcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgdXJsLFxyXG4gICAgICAgICAgICAgICAgICB5b3V0dWJlSWQ6IHVybC5zcGxpdCgnd2F0Y2g/dj0nKVsxXSxcclxuICAgICAgICAgICAgICAgICAgYXV0aG9yOlxyXG4gICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29ubmVjdDpcclxuICAgICAgICAgICAgICAgICAgICB7IHVzZXJuYW1lIH1cclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICBjb25zb2xlLmxvZyhjcmVhdGVSZXNwb25zZSwgJ2RhdG9zICcpXHJcbiAgICAgICAgICBpZiAoY3JlYXRlUmVzcG9uc2UgIT09IHVuZGVmaW5lZCAmJiBjcmVhdGVSZXNwb25zZSAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICByZXMuc3RhdHVzKDIwMCkuc2VuZChjcmVhdGVSZXNwb25zZSlcclxuICAgICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXMuc3RhdHVzKDUwMCkuc2VuZCh7XHJcbiAgICAgICAgICAgICAgZXJyb3I6IG5ldyBFcnJvcignRXJyb3IgYWwgZXNjcmliaXIgbGEgYmFzZSBkZSBkYXRvcycpLFxyXG4gICAgICAgICAgICAgIGNvZGU6IDQwMDFcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHJldHVyblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGZpbGUgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgcmVzLnN0YXR1cyg0MDQpLnNlbmQoe1xyXG4gICAgICAgICAgICBlcnJvcjogbmV3IEVycm9yKCdFcnJvciBhbCBlc2NyaWJpciBsYSBiYXNlIGRlIGRhdG9zJyksXHJcbiAgICAgICAgICAgIGNvZGU6IDQwMDJcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgICByZXR1cm5cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRpdGxlICE9PSB1bmRlZmluZWQgJiYgKGRlc2NyaXB0aW9uICE9PSB1bmRlZmluZWQgJiYgZGVzY3JpcHRpb24gIT09IG51bGwgJiYgdHlwZW9mIGRlc2NyaXB0aW9uID09PSAnc3RyaW5nJykpIHtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKCdTdWJpciBlbCBBcmNoaXZvIG9wY2lvbicpXHJcbiAgICAgICAgICBjb25zdCByZXNwb25zZTogdW5rbm93biB8IHN0cmluZyB8IEdvb2dsZUVycm9yID1cclxuICAgICAgICAgIGF3YWl0IHRoaXMuZ29vZ2xlU2VydmljZS51cGxvYWRWaWRlbyhcclxuICAgICAgICAgICAgZmlsZS5wYXRoLFxyXG4gICAgICAgICAgICB0aXRsZSxcclxuICAgICAgICAgICAgZGVzY3JpcHRpb24sXHJcbiAgICAgICAgICAgIHByb2Nlc3MuZW52LllPVVRVQkVfQ0hBTk5FTCxcclxuICAgICAgICAgICAgdGFncylcclxuICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlLCAndGVybWlubyB1cGxvYWQnKVxyXG4gICAgICAgICAgaWYgKHJlc3BvbnNlIGluc3RhbmNlb2YgR29vZ2xlRXJyb3IpIHtcclxuICAgICAgICAgICAgcmVzLnN0YXR1cyg1MDApLnNlbmQocmVzcG9uc2UpXHJcbiAgICAgICAgICAgIHJldHVyblxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgaWYgKHR5cGVvZiByZXNwb25zZSA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgICAgY29uc3QgZGJSZXNwb25zZSA9IGF3YWl0IHRoaXMuc2VydmljZS5wcmlzbWEudmlkZW8uY3JlYXRlKHsgZGF0YTogeyB5b3V0dWJlSWQ6IHJlc3BvbnNlLCBhdXRob3I6IHsgY29ubmVjdDogeyB1c2VybmFtZSB9IH0gfSB9KVxyXG4gICAgICAgICAgICBpZiAoZGJSZXNwb25zZSAhPT0gdW5kZWZpbmVkICYmIGRiUmVzcG9uc2UgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgICByZXMuc3RhdHVzKDIwMCkuc2VuZChkYlJlc3BvbnNlKVxyXG4gICAgICAgICAgICAgIHJldHVyblxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIHJlcy5zdGF0dXMoNTAwKS5zZW5kKHtcclxuICAgICAgICAgICAgICAgIGVycm9yOiBuZXcgRXJyb3IoJ0Vycm9yIGFsIGVzY3JpYmlyIGxhIGJhc2UgZGUgZGF0b3MnKSxcclxuICAgICAgICAgICAgICAgIGNvZGU6IDQwMDFcclxuICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgIHJldHVyblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgIGxvZ2dlci5lcnJvcih7IGZ1bmN0aW9uOiAncG9zdENvbnRyb2xsZXIudmlkZW9VcGxvYWQnLCBlcnJvciB9KVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgcHVibGljIGVyYXNlVmlkZW8gPSBhc3luYyAocmVxOiBSZXF1ZXN0PGFueSwgYW55LCBhbnksIFZpZGVvRXJhc2VUeXBlWydxdWVyeSddPiwgcmVzOiBSZXNwb25zZSkgPT4ge1xyXG4gICAgICB0cnkge1xyXG4gICAgICAgIGNvbnN0IHsgeW91dHViZUlkIH0gPSByZXEucXVlcnlcclxuICAgICAgICBjb25zdCBkYlJlc3BvbnNlID0gYXdhaXQgdGhpcy5zZXJ2aWNlLnByaXNtYS52aWRlby5kZWxldGUoeyB3aGVyZTogeyBpZDogeW91dHViZUlkIH0gfSlcclxuICAgICAgICBjb25zb2xlLmxvZyhkYlJlc3BvbnNlLCAnZGF0YScpXHJcbiAgICAgICAgaWYgKGRiUmVzcG9uc2UgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCB0aGlzLmdvb2dsZVNlcnZpY2UudmlkZW9SbShkYlJlc3BvbnNlLnlvdXR1YmVJZCBhcyBzdHJpbmcpXHJcbiAgICAgICAgICBpZiAocmVzcG9uc2UgaW5zdGFuY2VvZiBHb29nbGVFcnJvcikge1xyXG4gICAgICAgICAgICByZXMuc3RhdHVzKDUwMCkuc2VuZChyZXNwb25zZSlcclxuICAgICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgICB9IGVsc2UgcmVzLnN0YXR1cygyMDApLnNlbmQocmVzcG9uc2UpXHJcbiAgICAgICAgfVxyXG4gICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgIGxvZ2dlci5lcnJvcih7IGZ1bmN0aW9uOiAncG9zdENvbnRyb2xsZXIuZXJhc2VWaWRlbycsIGVycm9yIH0pXHJcbiAgICAgICAgcmVzLnN0YXR1cyg1MDApLnNlbmQoZXJyb3IpXHJcbiAgICAgIH1cclxuICAgIH1cclxuICApIHt9XHJcbn1cclxuIl0sIm5hbWVzIjpbIlBvc3RDb250cm9sbGVyIiwiY29uc3RydWN0b3IiLCJzZXJ2aWNlIiwiUG9zdFNlcnZpY2UiLCJwcmlzbWEiLCJwcmlzbWFDbGllbnQiLCJnb29nbGVTZXJ2aWNlIiwiR29vZ2xlU2VydmljZSIsImZhY2Vib29rU2VydmljZSIsIkZhY2Vib29rU2VydmljZSIsInVwZGF0ZVBvc3QiLCJyZXEiLCJyZXMiLCJsb2dnZXIiLCJkZWJ1ZyIsImJvZHkiLCJmdW5jdGlvbiIsImZpbGVzIiwiZGJJbWFnZXMiLCJ0aXRsZSIsImhlYWRpbmciLCJjbGFzc2lmaWNhdGlvbiIsImlkIiwicGFyYW1zIiwiaW1hZ2VzQXJyYXkiLCJ1bmRlZmluZWQiLCJKU09OIiwicGFyc2UiLCJudWV2b0FycmF5IiwibGVuZ3RoIiwicGhvdG9HZW5lcmF0b3IiLCJ1cGRhdGVEYlJlc3BvbnNlIiwiZGF0YSIsInVwZGF0ZUZhY2Vib29rUG9zdCIsImZiaWQiLCJuZXdzcGFwZXJJRCIsImltYWdlcyIsIm1hcCIsInNlbmQiLCJlcnJvciIsInN0YXR1cyIsImNyZWF0ZVBvc3QiLCJkYXRhRW1pdHRlZCIsImFjdGl2ZSIsImNvbnNvbGUiLCJsb2ciLCJpbyIsImVtaXQiLCJBcnJheSIsImlzQXJyYXkiLCJ1c2VyIiwicmVzcG9uc2VEQiIsInN0YW1wIiwiRGF0ZSIsIm5vdyIsImZhY2Vib29rRmVlZFJlc3BvbnNlIiwiZmFjZWJvb2tGZWVkIiwib2siLCJmYmlkVXBkYXRlIiwiYWRkRkJJRHRvRGF0YWJhc2UiLCJFcnJvciIsImdldFBvc3RzSWRzIiwicmVzcG9uc2UiLCJnZXRJZHMiLCJnZXRBbGxQb3N0cyIsImN1cnNvciIsInNlYXJjaCIsIm1pbkRhdGUiLCJtYXhEYXRlIiwiY2F0ZWdvcnkiLCJxdWVyeSIsIkFORCIsInB1c2giLCJjb250YWlucyIsIk9SIiwidGV4dCIsInN1YlRpdGxlIiwiY3JlYXRlZEF0IiwiZ3RlIiwibHRlIiwiZ2V0UG9zdHMiLCJwYWdpbmF0aW9uIiwidGhlbiIsImNoZWNrZWRSZXNwb25zZSIsIlByb21pc2UiLCJhbGwiLCJwb3N0IiwiY2hlY2tQaG90b3NBZ2UiLCJjaGVja2VkUGhvdG9zIiwiZmluYWxEYXRhIiwiY2F0Y2giLCJnZXQzMERheXNQb3N0cyIsInBhZ2UiLCJwYXJzZUludCIsIlByaXNtYUVycm9yIiwiZ2V0UG9zdEJ5SWQiLCJnZXRQb3N0IiwicGhvdG9zT2JqZWN0IiwiaWRBcnJheSIsInVwZGF0ZWRMaW5rc0FycmF5IiwiZGJSZXNwb25zZSIsInBob3RvQXJyYXkiLCJmaWx0ZXIiLCJwaG90byIsImdldFRpbWUiLCJnZXRMaW5rRnJvbUlkIiwiJHRyYW5zYWN0aW9uIiwicGhvdG9zIiwidXBkYXRlTWFueSIsIndoZXJlIiwidXJsIiwiZmluZE1hbnkiLCJSZXNwb25zZU9iamVjdCIsImRlbGV0ZVBvc3QiLCJkZWxldGVCeUlkIiwiYXVkaW8iLCJmb3JFYWNoIiwiaXRlbSIsImZpbGVSZW1vdmUiLCJkcml2ZUlkIiwiZmJSZXNwb25zZSIsImRlbGV0ZUZhY2Vib29rUG9zdCIsImhpZGVQb3N0Iiwic2hvd1Bvc3QiLCJ1cGxvYWRBdWRpbyIsImZpbGUiLCJmaWxlVXBsb2FkIiwicGF0aCIsIlRva2VuRXJyb3IiLCJOZXZlckF1dGhFcnJvciIsImpzb24iLCJHb29nbGVFcnJvciIsImFkZEF1ZGlvVG9EQiIsImVyYXNlQXVkaW8iLCJkZWxldGUiLCJzZWxlY3QiLCJ2aWRlb1VwbG9hZCIsImRlc2NyaXB0aW9uIiwidGFncyIsInVzZXJuYW1lIiwiY3JlYXRlUmVzcG9uc2UiLCJ2aWRlbyIsImNyZWF0ZSIsInlvdXR1YmVJZCIsInNwbGl0IiwiYXV0aG9yIiwiY29ubmVjdCIsImNvZGUiLCJ1cGxvYWRWaWRlbyIsInByb2Nlc3MiLCJlbnYiLCJZT1VUVUJFX0NIQU5ORUwiLCJlcmFzZVZpZGVvIiwidmlkZW9SbSJdLCJyYW5nZU1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzsiLCJtYXBwaW5ncyI6IkFBQUEsb0NBQW9DLEdBQ3BDLDJEQUEyRCxHQUMzRCx5REFBeUQ7Ozs7K0JBNkI1Q0E7OztlQUFBQTs7O3lCQTVCeUM7NkJBQzFCO2lDQUlJOytCQUNUOzhCQVFoQjtxQkFVWTsrQkFDVzs4QkFDRjtpQ0FDQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7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
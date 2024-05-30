/* eslint-disable @typescript-eslint/no-confusing-void-expression */ /* eslint-disable @typescript-eslint/promise-function-async */ /* eslint-disable @typescript-eslint/no-misused-promises */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "PostService", {
    enumerable: true,
    get: function() {
        return PostService;
    }
});
const _databaseservice = require("../Services/database.service");
const _client = require("@prisma/client");
const _loggerservice = require("../Services/logger.service");
const _Entities = require("../Entities");
const _facebookservice = require("../Services/facebook.service");
const _googleservice = require("../Services/google.service");
const _prismaerrors = require("../Services/prisma.errors");
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
var _this12 = void 0;
class PostService extends _databaseservice.DatabaseHandler {
    constructor(facebookService = new _facebookservice.FacebookService(), googleService = new _googleservice.GoogleService(), photoGenerator = function() {
        var _ref = _async_to_generator(function*(files, imagesParam) {
            let photoArray = [];
            let images = imagesParam;
            if (files !== undefined && Array.isArray(files)) {
                photoArray = yield Promise.all(files.map(function() {
                    var _ref = _async_to_generator(function*(file) {
                        const data = yield _this.facebookService.postPhoto(file);
                        if (data.ok && 'id' in data.data && data.data.id !== undefined) {
                            return data.data;
                        } else return undefined;
                    });
                    return function(file) {
                        return _ref.apply(this, arguments);
                    };
                }()));
                // else throw new Error(JSON.stringify({ error: 'No se enviaron imagenes', images }))
                if (photoArray !== null && Array.isArray(photoArray)) {
                    const response = yield _this.facebookService.getLinkFromId(photoArray);
                    // aqui se asigna a imagesArray todas las imagenes que debera tener el post ya sean las que no se eliminaron y las que se agreguen si hubiere
                    if (response.ok) {
                        if (images !== null && Array.isArray(images)) images = [
                            ...images,
                            ...response.data
                        ];
                        else images = [
                            ...response.data
                        ];
                    }
                }
                if (images !== undefined && Array.isArray(images)) {
                    photoArray = [
                        ...photoArray,
                        ...images === null || images === void 0 ? void 0 : images.map((image)=>({
                                id: image.fbid
                            }))
                    ];
                }
            }
            _loggerservice.logger.debug({
                function: 'pOSTsERVICE.photoGenerator',
                images
            });
            return images;
        });
        return function(files, imagesParam) {
            return _ref.apply(this, arguments);
        };
    }(), createPost = function() {
        var _ref = _async_to_generator(function*(body, id, dataArray) {
            const { title, text, heading, classification, importance, audio, video } = body;
            let numberImportance = 0;
            let audioArray = [];
            let videoArray = [];
            if (audio !== undefined && Array.isArray(JSON.parse(audio !== null && audio !== void 0 ? audio : ''))) {
                audioArray = JSON.parse(audio);
            } else if (audio !== undefined) audioArray = [
                JSON.parse(audio)
            ];
            if (video !== undefined && Array.isArray(JSON.parse(video))) {
                videoArray = JSON.parse(video);
            } else if (video !== undefined) videoArray = [
                JSON.parse(video)
            ];
            if (importance !== undefined && typeof importance === 'string') numberImportance = parseInt(importance);
            console.log(videoArray, 'videoArray');
            return yield _this1.prisma.posts.create({
                data: {
                    isVisible: true,
                    classification,
                    heading,
                    title,
                    text,
                    importance: numberImportance,
                    images: {
                        create: dataArray
                    },
                    author: {
                        connect: {
                            id
                        }
                    },
                    audio: {
                        connect: audio !== undefined ? audioArray.map((item)=>({
                                id: item.id
                            })) : []
                    },
                    video: {
                        connect: video !== undefined ? videoArray.map((item)=>({
                                id: item.id
                            })) : []
                    }
                },
                include: {
                    author: {
                        select: {
                            lastName: true,
                            name: true,
                            username: true
                        }
                    }
                }
            }) // gCreate({ author: { connect: { id } }, isVisible: true, classification, heading, title, text, importance: numberImportance, images: { create: dataArray } })
            ;
        });
        return function(body, id, dataArray) {
            return _ref.apply(this, arguments);
        };
    }(), getPosts = function() {
        var _ref = _async_to_generator(function*(paginationOptions, queryOptions) {
            try {
                _loggerservice.logger.debug({
                    queryOptions
                });
                const data = yield _this2.prisma.posts.gGetAll({
                    images: true,
                    author: true
                }, paginationOptions, queryOptions);
                // logger.debug({ function: 'PostService.getPosts', data })
                return data;
            } catch (error) {
                _loggerservice.logger.error({
                    function: 'PostService.getPosts',
                    error
                });
            }
        });
        return function(paginationOptions, queryOptions) {
            return _ref.apply(this, arguments);
        };
    }(), getPost = function() {
        var _ref = _async_to_generator(function*(id) {
            try {
                const response = yield _this3.prisma.posts.findUnique({
                    where: {
                        id
                    },
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
                const latestNews = yield _this3.prisma.posts.findMany({
                    where: {},
                    orderBy: {
                        createdAt: 'desc'
                    },
                    take: 4,
                    include: {
                        video: {
                            select: {
                                youtubeId: true,
                                id: true
                            }
                        },
                        images: {
                            select: {
                                url: true,
                                id: true
                            }
                        },
                        audio: {
                            select: {
                                driveId: true,
                                id: true
                            }
                        }
                    }
                });
                /**
 * debo revalidar las imagenes de la pagina solicitada y de las ultimas noticias
 */ // const data = await this.prisma.posts.findUnique(
                //   {
                //     where: { id },
                //     include: {
                //       author:
                //             {
                //               select:
                //                 {
                //                   avatar: true,
                //                   lastName: true,
                //                   name: true,
                //                   id: true
                //                 }
                //             },
                //       images:
                //           {
                //             select:
                //             {
                //               fbid: true,
                //               url: true,
                //               updatedAt: true,
                //               id: true
                //             }
                //           },
                //       audio: {
                //         select: {
                //           id: true,
                //           driveId: true
                //         }
                //       },
                //       video:
                //           {
                //             select:
                //             {
                //               id: true,
                //               youtubeId: true,
                //               url: true
                //             }
                //           }
                //     }
                //   }) // gFindById(id, field as any)
                _loggerservice.logger.debug({
                    function: 'PostService.getPost',
                    data: response
                });
                return _object_spread_props(_object_spread({}, response), {
                    latestNews: latestNews.map(({ audio, heading, id, images, title, video, createdAt, classification })=>{
                        return {
                            audio,
                            heading,
                            id,
                            images,
                            title,
                            video,
                            createdAt,
                            classification
                        };
                    })
                });
            } catch (error) {
                _loggerservice.logger.error({
                    function: 'PostService.getPost',
                    error
                });
            }
        });
        return function(id) {
            return _ref.apply(this, arguments);
        };
    }(), updatePhoto = function() {
        var _ref = _async_to_generator(function*(photo) {
            try {
                const data = yield _this4.prisma.photos.update({
                    where: {
                        id: photo.id
                    },
                    data: _object_spread_props(_object_spread({}, photo), {
                        updatedAt: undefined
                    })
                });
                _loggerservice.logger.debug({
                    function: 'PostService.updatePhoto',
                    data
                });
                return data;
            } catch (error) {
                _loggerservice.logger.error({
                    function: 'PostService.updatePhoto',
                    error
                });
            }
        });
        return function(photo) {
            return _ref.apply(this, arguments);
        };
    }(), updatePost = function() {
        var _ref = _async_to_generator(function*(postObject, idParam, photoObject) {
            let ids;
            let ids2;
            let photoObjectNoUndefinedFalse;
            let photoObjectNoUndef;
            const audioFromDB = postObject.audio !== undefined && JSON.parse(postObject.audio) !== null ? Array.isArray(postObject.audio) ? JSON.parse(postObject.audio) : [
                JSON.parse(postObject.audio)
            ] : undefined;
            const videoFromDb = (postObject === null || postObject === void 0 ? void 0 : postObject.video) !== undefined ? Array.isArray(postObject.video) ? postObject.video : [
                postObject.video
            ] : undefined;
            console.log(postObject.video, videoFromDb, 'Vodeo data');
            if ('jwt' in postObject) {
                postObject.jwt = undefined;
            }
            _loggerservice.logger.debug({
                photoObject,
                function: 'updatePost.service'
            });
            if (photoObject !== undefined) {
                ids = photoObject.map((photo)=>{
                    if (typeof photo === 'object' && photo !== null && 'id' in photo && photo.id !== undefined && typeof photo.id === 'string') {
                        return photo === null || photo === void 0 ? void 0 : photo.id;
                    } else return undefined;
                });
                ids2 = ids.filter((img)=>img !== undefined);
                photoObjectNoUndefinedFalse = photoObject.map((photo)=>{
                    if (photo !== undefined && photo !== null) {
                        return {
                            fbid: photo.fbid,
                            url: photo.url,
                            id: photo.id
                        };
                    // if (typeof photo === 'object' && 'id' in photo && 'fbid' in photo && 'url' in photo) { return { fbid: photo.fbid, url: photo.url, id: photo.id } }
                    }
                    return {
                        fbid: 'false',
                        url: 'false',
                        id: 'false'
                    };
                });
                photoObjectNoUndef = photoObjectNoUndefinedFalse.filter((img)=>img.fbid !== 'false');
                try {
                    const author = postObject.author;
                    /* aca debo hacer distintas ramas en el caso de que se tenga imagenes para borrar, tenga imagenes para agregar  */ if (author === undefined) throw new Error('No author specified');
                    /**
 * creo que el error esta en que deleteMany esta mal implementado. De ultima sacamos el deleteMany
 *
 */ const deleteAudioResponse = yield _this5.prisma.audio.deleteMany({
                        where: {
                            postsId: postObject.id
                        }
                    });
                    const deleteVideoResponse = yield _this5.prisma.video.deleteMany({
                        where: {
                            postsId: postObject.id
                        }
                    });
                    const audioMap = audioFromDB !== undefined ? {
                        create: audioFromDB.map((item)=>({
                                driveId: item.driveId
                            }))
                    } : undefined;
                    const videoMap = videoFromDb !== undefined ? {
                        connect: videoFromDb.map((item)=>({
                                youtubeId: item.youtubeId
                            }))
                    } : undefined;
                    const imageMap = photoObjectNoUndef.map((photo)=>{
                        return _object_spread({}, photo);
                    });
                    const data = yield _this5.prisma.posts.update({
                        where: {
                            id: idParam
                        },
                        data: _object_spread_props(_object_spread({}, postObject), {
                            isVisible: true,
                            updatedAt: undefined,
                            author: {
                                connect: {
                                    id: author
                                }
                            },
                            importance: parseInt(postObject.importance),
                            audio: audioMap,
                            video: videoMap,
                            images: {
                                deleteMany: {},
                                create: imageMap
                            }
                        }),
                        include: {
                            audio: {
                                select: {
                                    driveId: true,
                                    id: true
                                }
                            },
                            images: {
                                select: {
                                    url: true,
                                    fbid: true,
                                    id: true
                                }
                            },
                            video: {
                                select: {
                                    youtubeId: true
                                }
                            }
                        }
                    });
                    console.log(deleteAudioResponse, deleteVideoResponse, data);
                    // const data = transaction
                    _loggerservice.logger.debug({
                        function: 'PostService.updatePost',
                        data
                    });
                    return new _Entities.ResponseObject(null, true, data);
                } catch (error) {
                    _loggerservice.logger.error({
                        function: 'PostService.updatePost',
                        error
                    });
                    return new _Entities.ResponseObject(error, false, null);
                }
            } else {
                try {
                    const transactionResponse = yield _this5.prisma.$transaction([
                        _this5.prisma.audio.deleteMany({
                            where: {
                                postsId: postObject.id
                            }
                        }),
                        _this5.prisma.posts.update({
                            where: {
                                id: idParam
                            },
                            data: _object_spread_props(_object_spread({}, postObject), {
                                updatedAt: undefined,
                                importance: parseInt(postObject.importance),
                                author: {
                                    connect: {
                                        id: postObject.author
                                    }
                                },
                                images: {
                                    deleteMany: {
                                        NOT: {
                                            id: {
                                                in: ids2
                                            }
                                        }
                                    }
                                },
                                audio: audioFromDB !== undefined ? {
                                    create: audioFromDB.map((item)=>({
                                            driveId: item.driveId
                                        }))
                                } : undefined,
                                video: videoFromDb !== undefined ? {
                                    connect: videoFromDb.map((item)=>({
                                            youtubeId: item.youtubeId
                                        }))
                                } : undefined
                            })
                        })
                    ]);
                    const [, data] = transactionResponse;
                    _loggerservice.logger.debug({
                        function: 'PostService.updatePost',
                        data
                    });
                    return new _Entities.ResponseObject(null, true, data);
                // va el codigo si no hay cambios en las photos
                } catch (error) {
                    _loggerservice.logger.error({
                        function: 'PostService.updatePost',
                        error
                    });
                    return new _Entities.ResponseObject(null, false, error);
                }
            }
        });
        return function(postObject, idParam, photoObject) {
            return _ref.apply(this, arguments);
        };
    }(), addFBIDtoDatabase = function() {
        var _ref = _async_to_generator(function*(fbid, id) {
            try {
                const response = yield _this6.prisma.posts.update({
                    where: {
                        id
                    },
                    data: {
                        fbid
                    }
                });
                return response;
            } catch (error) {
                _loggerservice.logger.error({
                    function: 'PostService.addFBIDtoDB',
                    error
                });
                return new _Entities.ResponseObject(error, false, null);
            }
        });
        return function(fbid, id) {
            return _ref.apply(this, arguments);
        };
    }(), deleteById = function() {
        var _ref = _async_to_generator(function*(id) {
            try {
                const response = yield _this7.prisma.posts.delete({
                    where: {
                        id
                    },
                    include: {
                        audio: true,
                        images: true
                    }
                }) // .gDelete(id)
                ;
                return new _Entities.ResponseObject(null, true, response);
            } catch (error) {
                _loggerservice.logger.error({
                    function: 'PostService.deleteById',
                    error
                });
                return new _Entities.ResponseObject(error, false, null);
            }
        });
        return function(id) {
            return _ref.apply(this, arguments);
        };
    }(), hidePost = function() {
        var _ref = _async_to_generator(function*(id) {
            try {
                const response = yield _this8.prisma.posts.update({
                    where: {
                        id
                    },
                    data: {
                        isVisible: {
                            set: false
                        }
                    }
                });
                return new _Entities.ResponseObject(null, true, response);
            } catch (error) {
                _loggerservice.logger.error({
                    function: 'PostService.hidePost',
                    error
                });
                return new _Entities.ResponseObject(error, false, null);
            }
        });
        return function(id) {
            return _ref.apply(this, arguments);
        };
    }(), showPost = function() {
        var _ref = _async_to_generator(function*(id) {
            try {
                const response = yield _this9.prisma.posts.update({
                    where: {
                        id
                    },
                    data: {
                        isVisible: {
                            set: true
                        }
                    }
                });
                return new _Entities.ResponseObject(null, true, response);
            } catch (error) {
                _loggerservice.logger.error({
                    function: 'PostService.showPost',
                    error
                });
                return new _Entities.ResponseObject(error, false, null);
            }
        });
        return function(id) {
            return _ref.apply(this, arguments);
        };
    }(), addAudioToDB = function() {
        var _ref = _async_to_generator(function*(driveId) {
            try {
                const response = yield _this10.prisma.audio.create({
                    data: {
                        driveId
                    }
                });
                return response;
            } catch (error) {
                _loggerservice.logger.error({
                    function: 'PostService.addAudioToDB',
                    error
                });
                if (error instanceof _client.Prisma.PrismaClientKnownRequestError) {
                    switch(error.code){
                        case 'P2002':
                            return new _prismaerrors.UniqueRestraintError(error, error.meta);
                        case 'P2000':
                            return new _prismaerrors.ColumnPrismaError(error, error.meta);
                        case 'P2001':
                            return new _prismaerrors.NotFoundPrismaError(error, error.meta);
                        default:
                            return new _prismaerrors.UnknownPrismaError(error, error.meta);
                    }
                } else return error;
            }
        });
        return function(driveId) {
            return _ref.apply(this, arguments);
        };
    }(), get30DaysPosts = /*#__PURE__*/ _async_to_generator(function*(page = 1) {
        try {
            const fromDate = new Date();
            fromDate.setDate(fromDate.getDate() - 30 * page);
            const toDate = new Date(fromDate);
            toDate.setDate(toDate.getDate() + 30);
            const response = yield _this11.prisma.posts.findMany({
                orderBy: {
                    createdAt: 'desc'
                },
                where: {
                    createdAt: {
                        gt: fromDate,
                        lte: toDate
                    }
                },
                include: {
                    images: {
                        select: {
                            fbid: true,
                            id: true,
                            url: true,
                            updatedAt: true
                        }
                    },
                    video: {
                        select: {
                            id: true,
                            url: true,
                            youtubeId: true
                        }
                    },
                    audio: {
                        select: {
                            id: true,
                            driveId: true
                        }
                    },
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
            response.forEach(function() {
                var _ref = _async_to_generator(function*(res) {
                    if (Array.isArray(res.images) && res.images.length > 0) {
                        res.images.forEach((image)=>{
                            if (new Date(image.updatedAt).getMilliseconds() < new Date().getMilliseconds() - 86400000 * 2) {
                                arrayId.push({
                                    id: image.fbid
                                });
                                console.log(image.fbid, image.updatedAt, 'entro');
                            }
                        });
                        if (Array.isArray(arrayId) && arrayId.length > 0) {
                            const images = yield _this11.facebookService.getLinkFromId(arrayId);
                            if (images.ok) {
                                yield _this11.prisma.$transaction(function() {
                                    var _ref = _async_to_generator(function*(prisma) {
                                        for (const image of images.data){
                                            const modd = res.images.find((imageDB)=>{
                                                console.log(image.fbid, imageDB.id);
                                                return imageDB.fbid === image.fbid;
                                            });
                                            if (modd !== undefined) {
                                                modd.url = image.url;
                                            }
                                            yield prisma.photos.updateMany({
                                                where: {
                                                    fbid: image.fbid
                                                },
                                                data: {
                                                    url: image.url
                                                }
                                            });
                                        }
                                    });
                                    return function(prisma) {
                                        return _ref.apply(this, arguments);
                                    };
                                }());
                            }
                        }
                    }
                });
                return function(res) {
                    return _ref.apply(this, arguments);
                };
            }());
            return response;
        } catch (error) {
            _loggerservice.logger.error({
                function: 'PostService.get30DaysPosts',
                error
            });
            return new _prismaerrors.UnknownPrismaError(error);
        }
    }), getIds = /*#__PURE__*/ _async_to_generator(function*() {
        try {
            const response = yield _this12.prisma.posts.findMany({
                select: {
                    id: true
                }
            });
            return response;
        } catch (error) {
            _loggerservice.logger.error({
                function: 'PostService.getIds',
                error
            });
        }
    })){
        super();
        _define_property(this, "facebookService", void 0);
        _define_property(this, "googleService", void 0);
        _define_property(this, "photoGenerator", void 0);
        _define_property(this, "createPost", void 0);
        _define_property(this, "getPosts", void 0);
        _define_property(this, "getPost", void 0);
        _define_property(this, "updatePhoto", void 0);
        _define_property(this, "updatePost", void 0);
        _define_property(this, "addFBIDtoDatabase", void 0);
        _define_property(this, "deleteById", void 0);
        _define_property(this, "hidePost", void 0);
        _define_property(this, "showPost", void 0);
        _define_property(this, "addAudioToDB", void 0);
        _define_property(this, "get30DaysPosts", void 0);
        _define_property(this, "getIds", void 0);
        this.facebookService = facebookService;
        this.googleService = googleService;
        this.photoGenerator = photoGenerator;
        this.createPost = createPost;
        this.getPosts = getPosts;
        this.getPost = getPost;
        this.updatePhoto = updatePhoto;
        this.updatePost = updatePost;
        this.addFBIDtoDatabase = addFBIDtoDatabase;
        this.deleteById = deleteById;
        this.hidePost = hidePost;
        this.showPost = showPost;
        this.addAudioToDB = addAudioToDB;
        this.get30DaysPosts = get30DaysPosts;
        this.getIds = getIds;
    }
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9wb3N0L3Bvc3Quc2VydmljZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKiBlc2xpbnQtZGlzYWJsZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tY29uZnVzaW5nLXZvaWQtZXhwcmVzc2lvbiAqL1xyXG4vKiBlc2xpbnQtZGlzYWJsZSBAdHlwZXNjcmlwdC1lc2xpbnQvcHJvbWlzZS1mdW5jdGlvbi1hc3luYyAqL1xyXG4vKiBlc2xpbnQtZGlzYWJsZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tbWlzdXNlZC1wcm9taXNlcyAqL1xyXG5pbXBvcnQgeyBEYXRhYmFzZUhhbmRsZXIgfSBmcm9tICcuLi9TZXJ2aWNlcy9kYXRhYmFzZS5zZXJ2aWNlJ1xyXG5pbXBvcnQgeyBQcmlzbWEgfSBmcm9tICdAcHJpc21hL2NsaWVudCdcclxuaW1wb3J0IHsgbG9nZ2VyIH0gZnJvbSAnLi4vU2VydmljZXMvbG9nZ2VyLnNlcnZpY2UnXHJcbmltcG9ydCB7IHR5cGUgTXlDdXJzb3IsIHR5cGUgR2VuZXJpY1Jlc3BvbnNlT2JqZWN0LCBSZXNwb25zZU9iamVjdCB9IGZyb20gJy4uL0VudGl0aWVzJ1xyXG5pbXBvcnQgeyB0eXBlIENyZWF0ZVBvc3RUeXBlLCB0eXBlIEltYWdlc1NjaGVtYSB9IGZyb20gJy4vcG9zdC5zY2hlbWEnXHJcbmltcG9ydCB7IEZhY2Vib29rU2VydmljZSB9IGZyb20gJy4uL1NlcnZpY2VzL2ZhY2Vib29rLnNlcnZpY2UnXHJcbmltcG9ydCB7IEdvb2dsZVNlcnZpY2UgfSBmcm9tICcuLi9TZXJ2aWNlcy9nb29nbGUuc2VydmljZSdcclxuaW1wb3J0IHsgQ29sdW1uUHJpc21hRXJyb3IsIE5vdEZvdW5kUHJpc21hRXJyb3IsIFVuaXF1ZVJlc3RyYWludEVycm9yLCBVbmtub3duUHJpc21hRXJyb3IgfSBmcm9tICcuLi9TZXJ2aWNlcy9wcmlzbWEuZXJyb3JzJ1xyXG5cclxuZXhwb3J0IGNsYXNzIFBvc3RTZXJ2aWNlIGV4dGVuZHMgRGF0YWJhc2VIYW5kbGVyIHtcclxuICBjb25zdHJ1Y3RvciAoXHJcbiAgICBwcm90ZWN0ZWQgZmFjZWJvb2tTZXJ2aWNlID0gbmV3IEZhY2Vib29rU2VydmljZSgpLFxyXG4gICAgcHJvdGVjdGVkIGdvb2dsZVNlcnZpY2UgPSBuZXcgR29vZ2xlU2VydmljZSgpLFxyXG4gICAgcHVibGljIHBob3RvR2VuZXJhdG9yID0gYXN5bmMgKGZpbGVzOiBFeHByZXNzLk11bHRlci5GaWxlW10sIGltYWdlc1BhcmFtPzogSW1hZ2VzU2NoZW1hW10pID0+IHtcclxuICAgICAgbGV0IHBob3RvQXJyYXk6IEFycmF5PHsgaWQ6IHN0cmluZyB9IHwgdW5kZWZpbmVkPiA9IFtdXHJcbiAgICAgIGxldCBpbWFnZXM6IEltYWdlc1NjaGVtYVtdIHwgdW5kZWZpbmVkID0gaW1hZ2VzUGFyYW1cclxuICAgICAgaWYgKGZpbGVzICE9PSB1bmRlZmluZWQgJiYgQXJyYXkuaXNBcnJheShmaWxlcykpIHtcclxuICAgICAgICBwaG90b0FycmF5ID0gYXdhaXQgUHJvbWlzZS5hbGwoZmlsZXMubWFwKGFzeW5jIChmaWxlKSA9PiB7XHJcbiAgICAgICAgICBjb25zdCBkYXRhID0gYXdhaXQgdGhpcy5mYWNlYm9va1NlcnZpY2UucG9zdFBob3RvKGZpbGUpXHJcbiAgICAgICAgICBpZiAoZGF0YS5vayAmJiAnaWQnIGluIGRhdGEuZGF0YSAmJiBkYXRhLmRhdGEuaWQgIT09IHVuZGVmaW5lZCkgeyByZXR1cm4gZGF0YS5kYXRhIGFzIHsgaWQ6IHN0cmluZyB9IH0gZWxzZSByZXR1cm4gdW5kZWZpbmVkXHJcbiAgICAgICAgfSkpXHJcbiAgICAgICAgLy8gZWxzZSB0aHJvdyBuZXcgRXJyb3IoSlNPTi5zdHJpbmdpZnkoeyBlcnJvcjogJ05vIHNlIGVudmlhcm9uIGltYWdlbmVzJywgaW1hZ2VzIH0pKVxyXG4gICAgICAgIGlmIChwaG90b0FycmF5ICE9PSBudWxsICYmIEFycmF5LmlzQXJyYXkocGhvdG9BcnJheSkpIHtcclxuICAgICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgdGhpcy5mYWNlYm9va1NlcnZpY2UuZ2V0TGlua0Zyb21JZChwaG90b0FycmF5KVxyXG4gICAgICAgICAgLy8gYXF1aSBzZSBhc2lnbmEgYSBpbWFnZXNBcnJheSB0b2RhcyBsYXMgaW1hZ2VuZXMgcXVlIGRlYmVyYSB0ZW5lciBlbCBwb3N0IHlhIHNlYW4gbGFzIHF1ZSBubyBzZSBlbGltaW5hcm9uIHkgbGFzIHF1ZSBzZSBhZ3JlZ3VlbiBzaSBodWJpZXJlXHJcbiAgICAgICAgICBpZiAocmVzcG9uc2Uub2spIHtcclxuICAgICAgICAgICAgaWYgKGltYWdlcyAhPT0gbnVsbCAmJiBBcnJheS5pc0FycmF5KGltYWdlcykpIGltYWdlcyA9IFsuLi5pbWFnZXMsIC4uLnJlc3BvbnNlLmRhdGFdXHJcbiAgICAgICAgICAgIGVsc2UgaW1hZ2VzID0gWy4uLnJlc3BvbnNlLmRhdGFdXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChpbWFnZXMgIT09IHVuZGVmaW5lZCAmJiBBcnJheS5pc0FycmF5KGltYWdlcykpIHtcclxuICAgICAgICAgIHBob3RvQXJyYXkgPSBbLi4ucGhvdG9BcnJheSwgLi4uaW1hZ2VzPy5tYXAoaW1hZ2UgPT4gKHsgaWQ6IGltYWdlLmZiaWQgfSkpXVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICBsb2dnZXIuZGVidWcoeyBmdW5jdGlvbjogJ3BPU1RzRVJWSUNFLnBob3RvR2VuZXJhdG9yJywgaW1hZ2VzIH0pXHJcbiAgICAgIHJldHVybiBpbWFnZXNcclxuICAgIH0sXHJcbiAgICBwdWJsaWMgY3JlYXRlUG9zdCA9IGFzeW5jIChib2R5OiBDcmVhdGVQb3N0VHlwZVsnYm9keSddLCBpZDogc3RyaW5nLCBkYXRhQXJyYXk6IEFycmF5PHsgdXJsOiBzdHJpbmcsIGZiaWQ6IHN0cmluZyB9PikgPT4ge1xyXG4gICAgICBjb25zdCB7IHRpdGxlLCB0ZXh0LCBoZWFkaW5nLCBjbGFzc2lmaWNhdGlvbiwgaW1wb3J0YW5jZSwgYXVkaW8sIHZpZGVvIH0gPSBib2R5XHJcbiAgICAgIGxldCBudW1iZXJJbXBvcnRhbmNlID0gMFxyXG4gICAgICBsZXQgYXVkaW9BcnJheTogQXJyYXk8eyBkcml2ZUlkOiBzdHJpbmcsIGlkOiBzdHJpbmcgfT4gPSBbXVxyXG4gICAgICBsZXQgdmlkZW9BcnJheTogQXJyYXk8eyB5b3V0dWJlSWQ6IHN0cmluZywgaWQ6IHN0cmluZyB9PiA9IFtdXHJcbiAgICAgIGlmIChhdWRpbyAhPT0gdW5kZWZpbmVkICYmIEFycmF5LmlzQXJyYXkoSlNPTi5wYXJzZShhdWRpbyA/PyAnJykpKSB7XHJcbiAgICAgICAgYXVkaW9BcnJheSA9IEpTT04ucGFyc2UoYXVkaW8pXHJcbiAgICAgIH0gZWxzZVxyXG4gICAgICBpZiAoYXVkaW8gIT09IHVuZGVmaW5lZCkgYXVkaW9BcnJheSA9IFtKU09OLnBhcnNlKGF1ZGlvKV1cclxuICAgICAgaWYgKHZpZGVvICE9PSB1bmRlZmluZWQgJiYgQXJyYXkuaXNBcnJheShKU09OLnBhcnNlKHZpZGVvKSkpIHsgdmlkZW9BcnJheSA9IEpTT04ucGFyc2UodmlkZW8pIH0gZWxzZVxyXG4gICAgICBpZiAodmlkZW8gIT09IHVuZGVmaW5lZCkgdmlkZW9BcnJheSA9IFtKU09OLnBhcnNlKHZpZGVvKV1cclxuICAgICAgaWYgKGltcG9ydGFuY2UgIT09IHVuZGVmaW5lZCAmJiB0eXBlb2YgaW1wb3J0YW5jZSA9PT0gJ3N0cmluZycpIG51bWJlckltcG9ydGFuY2UgPSBwYXJzZUludChpbXBvcnRhbmNlKVxyXG4gICAgICBjb25zb2xlLmxvZyh2aWRlb0FycmF5LCAndmlkZW9BcnJheScpXHJcbiAgICAgIHJldHVybiBhd2FpdCB0aGlzLnByaXNtYS5wb3N0cy5jcmVhdGUoe1xyXG4gICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgIGlzVmlzaWJsZTogdHJ1ZSxcclxuICAgICAgICAgIGNsYXNzaWZpY2F0aW9uLFxyXG4gICAgICAgICAgaGVhZGluZyxcclxuICAgICAgICAgIHRpdGxlLFxyXG4gICAgICAgICAgdGV4dCxcclxuICAgICAgICAgIGltcG9ydGFuY2U6IG51bWJlckltcG9ydGFuY2UsXHJcbiAgICAgICAgICBpbWFnZXM6IHsgY3JlYXRlOiBkYXRhQXJyYXkgfSxcclxuICAgICAgICAgIGF1dGhvcjogeyBjb25uZWN0OiB7IGlkIH0gfSxcclxuICAgICAgICAgIGF1ZGlvOiB7IGNvbm5lY3Q6IChhdWRpbyAhPT0gdW5kZWZpbmVkKSA/IGF1ZGlvQXJyYXkubWFwKGl0ZW0gPT4gKHsgaWQ6IGl0ZW0uaWQgfSkpIDogW10gfSxcclxuICAgICAgICAgIHZpZGVvOiB7IGNvbm5lY3Q6ICh2aWRlbyAhPT0gdW5kZWZpbmVkKSA/IHZpZGVvQXJyYXkubWFwKGl0ZW0gPT4gKHsgaWQ6IGl0ZW0uaWQgfSkpIDogW10gfVxyXG5cclxuICAgICAgICB9LFxyXG4gICAgICAgIGluY2x1ZGU6IHsgYXV0aG9yOiB7IHNlbGVjdDogeyBsYXN0TmFtZTogdHJ1ZSwgbmFtZTogdHJ1ZSwgdXNlcm5hbWU6IHRydWUgfSB9IH1cclxuICAgICAgfSkgLy8gZ0NyZWF0ZSh7IGF1dGhvcjogeyBjb25uZWN0OiB7IGlkIH0gfSwgaXNWaXNpYmxlOiB0cnVlLCBjbGFzc2lmaWNhdGlvbiwgaGVhZGluZywgdGl0bGUsIHRleHQsIGltcG9ydGFuY2U6IG51bWJlckltcG9ydGFuY2UsIGltYWdlczogeyBjcmVhdGU6IGRhdGFBcnJheSB9IH0pXHJcbiAgICB9LFxyXG4gICAgcHVibGljIGdldFBvc3RzID0gYXN5bmMgKHBhZ2luYXRpb25PcHRpb25zPzpcclxuICAgIHsgY3Vyc29yPzogUGFydGlhbDwgTXlDdXJzb3I+LCBwYWdpbmF0aW9uOiBudW1iZXIgfSxcclxuICAgIHF1ZXJ5T3B0aW9ucz86IFByaXNtYS5Qb3N0c0ZpbmRNYW55QXJnc1snd2hlcmUnXVxyXG4gICAgKSAvKjogUHJvbWlzZTxHZW5lcmljUmVzcG9uc2VPYmplY3Q8UHJpc21hLlBvc3RzQ3JlYXRlSW5wdXRbXT4gfCB1bmRlZmluZWQ+ICovID0+IHtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICBsb2dnZXIuZGVidWcoeyBxdWVyeU9wdGlvbnMgfSlcclxuICAgICAgICBjb25zdCBkYXRhID0gYXdhaXQgdGhpcy5wcmlzbWEucG9zdHMuZ0dldEFsbCh7IGltYWdlczogdHJ1ZSwgYXV0aG9yOiB0cnVlIH0sIHBhZ2luYXRpb25PcHRpb25zLCBxdWVyeU9wdGlvbnMgYXMgYW55KVxyXG4gICAgICAgIC8vIGxvZ2dlci5kZWJ1Zyh7IGZ1bmN0aW9uOiAnUG9zdFNlcnZpY2UuZ2V0UG9zdHMnLCBkYXRhIH0pXHJcbiAgICAgICAgcmV0dXJuIGRhdGFcclxuICAgICAgfSBjYXRjaCAoZXJyb3IpIHsgbG9nZ2VyLmVycm9yKHsgZnVuY3Rpb246ICdQb3N0U2VydmljZS5nZXRQb3N0cycsIGVycm9yIH0pIH1cclxuICAgIH0sXHJcbiAgICBwdWJsaWMgZ2V0UG9zdCA9IGFzeW5jIChpZDogc3RyaW5nKSA9PiB7XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCB0aGlzLnByaXNtYS5wb3N0cy5maW5kVW5pcXVlKFxyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICB3aGVyZTogeyBpZCB9LFxyXG4gICAgICAgICAgICBpbmNsdWRlOiB7XHJcbiAgICAgICAgICAgICAgYXV0aG9yOlxyXG4gICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3Q6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXZhdGFyOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFzdE5hbWU6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IHRydWVcclxuICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIGltYWdlczpcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBzZWxlY3Q6XHJcbiAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZiaWQ6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHVybDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlZEF0OiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZDogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgYXVkaW86IHtcclxuICAgICAgICAgICAgICAgIHNlbGVjdDoge1xyXG4gICAgICAgICAgICAgICAgICBpZDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgZHJpdmVJZDogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgdmlkZW86XHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgc2VsZWN0OlxyXG4gICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgeW91dHViZUlkOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB1cmw6IHRydWVcclxuICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgY29uc3QgbGF0ZXN0TmV3cyA9IGF3YWl0IHRoaXMucHJpc21hLnBvc3RzLmZpbmRNYW55KHsgd2hlcmU6IHt9LCBvcmRlckJ5OiB7IGNyZWF0ZWRBdDogJ2Rlc2MnIH0sIHRha2U6IDQsIGluY2x1ZGU6IHsgdmlkZW86IHsgc2VsZWN0OiB7IHlvdXR1YmVJZDogdHJ1ZSwgaWQ6IHRydWUgfSB9LCBpbWFnZXM6IHsgc2VsZWN0OiB7IHVybDogdHJ1ZSwgaWQ6IHRydWUgfSB9LCBhdWRpbzogeyBzZWxlY3Q6IHsgZHJpdmVJZDogdHJ1ZSwgaWQ6IHRydWUgfSB9IH0gfSlcclxuICAgICAgICAvKipcclxuICogZGVibyByZXZhbGlkYXIgbGFzIGltYWdlbmVzIGRlIGxhIHBhZ2luYSBzb2xpY2l0YWRhIHkgZGUgbGFzIHVsdGltYXMgbm90aWNpYXNcclxuICovXHJcblxyXG4gICAgICAgIC8vIGNvbnN0IGRhdGEgPSBhd2FpdCB0aGlzLnByaXNtYS5wb3N0cy5maW5kVW5pcXVlKFxyXG4gICAgICAgIC8vICAge1xyXG4gICAgICAgIC8vICAgICB3aGVyZTogeyBpZCB9LFxyXG4gICAgICAgIC8vICAgICBpbmNsdWRlOiB7XHJcbiAgICAgICAgLy8gICAgICAgYXV0aG9yOlxyXG4gICAgICAgIC8vICAgICAgICAgICAgIHtcclxuICAgICAgICAvLyAgICAgICAgICAgICAgIHNlbGVjdDpcclxuICAgICAgICAvLyAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgIGF2YXRhcjogdHJ1ZSxcclxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICBsYXN0TmFtZTogdHJ1ZSxcclxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICBuYW1lOiB0cnVlLFxyXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgIGlkOiB0cnVlXHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAvLyAgICAgICAgICAgICB9LFxyXG4gICAgICAgIC8vICAgICAgIGltYWdlczpcclxuICAgICAgICAvLyAgICAgICAgICAge1xyXG4gICAgICAgIC8vICAgICAgICAgICAgIHNlbGVjdDpcclxuICAgICAgICAvLyAgICAgICAgICAgICB7XHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICBmYmlkOiB0cnVlLFxyXG4gICAgICAgIC8vICAgICAgICAgICAgICAgdXJsOiB0cnVlLFxyXG4gICAgICAgIC8vICAgICAgICAgICAgICAgdXBkYXRlZEF0OiB0cnVlLFxyXG4gICAgICAgIC8vICAgICAgICAgICAgICAgaWQ6IHRydWVcclxuICAgICAgICAvLyAgICAgICAgICAgICB9XHJcbiAgICAgICAgLy8gICAgICAgICAgIH0sXHJcbiAgICAgICAgLy8gICAgICAgYXVkaW86IHtcclxuICAgICAgICAvLyAgICAgICAgIHNlbGVjdDoge1xyXG4gICAgICAgIC8vICAgICAgICAgICBpZDogdHJ1ZSxcclxuICAgICAgICAvLyAgICAgICAgICAgZHJpdmVJZDogdHJ1ZVxyXG4gICAgICAgIC8vICAgICAgICAgfVxyXG4gICAgICAgIC8vICAgICAgIH0sXHJcbiAgICAgICAgLy8gICAgICAgdmlkZW86XHJcbiAgICAgICAgLy8gICAgICAgICAgIHtcclxuICAgICAgICAvLyAgICAgICAgICAgICBzZWxlY3Q6XHJcbiAgICAgICAgLy8gICAgICAgICAgICAge1xyXG4gICAgICAgIC8vICAgICAgICAgICAgICAgaWQ6IHRydWUsXHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICB5b3V0dWJlSWQ6IHRydWUsXHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICB1cmw6IHRydWVcclxuICAgICAgICAvLyAgICAgICAgICAgICB9XHJcbiAgICAgICAgLy8gICAgICAgICAgIH1cclxuICAgICAgICAvLyAgICAgfVxyXG4gICAgICAgIC8vICAgfSkgLy8gZ0ZpbmRCeUlkKGlkLCBmaWVsZCBhcyBhbnkpXHJcbiAgICAgICAgbG9nZ2VyLmRlYnVnKHsgZnVuY3Rpb246ICdQb3N0U2VydmljZS5nZXRQb3N0JywgZGF0YTogcmVzcG9uc2UgfSlcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgLi4ucmVzcG9uc2UsXHJcbiAgICAgICAgICBsYXRlc3ROZXdzOiBsYXRlc3ROZXdzLm1hcCgoeyBhdWRpbywgaGVhZGluZywgaWQsIGltYWdlcywgdGl0bGUsIHZpZGVvLCBjcmVhdGVkQXQsIGNsYXNzaWZpY2F0aW9uIH0pID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIHsgYXVkaW8sIGhlYWRpbmcsIGlkLCBpbWFnZXMsIHRpdGxlLCB2aWRlbywgY3JlYXRlZEF0LCBjbGFzc2lmaWNhdGlvbiB9XHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuICAgICAgfSBjYXRjaCAoZXJyb3IpIHsgbG9nZ2VyLmVycm9yKHsgZnVuY3Rpb246ICdQb3N0U2VydmljZS5nZXRQb3N0JywgZXJyb3IgfSkgfVxyXG4gICAgfSxcclxuICAgIHB1YmxpYyB1cGRhdGVQaG90byA9IGFzeW5jIChwaG90bzogUHJpc21hLlBob3Rvc0NyZWF0ZUlucHV0KSA9PiB7XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IHRoaXMucHJpc21hLnBob3Rvcy51cGRhdGUoeyB3aGVyZTogeyBpZDogcGhvdG8uaWQgfSwgZGF0YTogeyAuLi5waG90bywgdXBkYXRlZEF0OiB1bmRlZmluZWQgfSB9KVxyXG4gICAgICAgIGxvZ2dlci5kZWJ1Zyh7IGZ1bmN0aW9uOiAnUG9zdFNlcnZpY2UudXBkYXRlUGhvdG8nLCBkYXRhIH0pXHJcbiAgICAgICAgcmV0dXJuIGRhdGFcclxuICAgICAgfSBjYXRjaCAoZXJyb3IpIHsgbG9nZ2VyLmVycm9yKHsgZnVuY3Rpb246ICdQb3N0U2VydmljZS51cGRhdGVQaG90bycsIGVycm9yIH0pIH1cclxuICAgIH0sXHJcbiAgICBwdWJsaWMgdXBkYXRlUG9zdCA9IGFzeW5jIChwb3N0T2JqZWN0OiBPbWl0PFByaXNtYS5Qb3N0c1VwZGF0ZUlucHV0LCAnaW1hZ2VzJyB8ICdhdWRpbycgfCAnaW1wb3J0YW5jZSc+ICYgeyBhdWRpbz86IHN0cmluZyB8IHVuZGVmaW5lZCwgaW1wb3J0YW5jZTogJzEnIHwgJzInIHwgJzMnIHwgJzQnIHwgJzUnIH0sIGlkUGFyYW06IHN0cmluZywgcGhvdG9PYmplY3Q6IEltYWdlc1NjaGVtYVtdIHwgdW5kZWZpbmVkKTogUHJvbWlzZTxHZW5lcmljUmVzcG9uc2VPYmplY3Q8UHJpc21hLlBvc3RzVXBkYXRlSW5wdXQ+PiA9PiB7XHJcbiAgICAgIGxldCBpZHNcclxuICAgICAgbGV0IGlkczI6IHN0cmluZ1tdIHwgdW5kZWZpbmVkXHJcbiAgICAgIGxldCBwaG90b09iamVjdE5vVW5kZWZpbmVkRmFsc2U6IEltYWdlc1NjaGVtYVtdXHJcbiAgICAgIGxldCBwaG90b09iamVjdE5vVW5kZWY6IEltYWdlc1NjaGVtYVtdXHJcbiAgICAgIGNvbnN0IGF1ZGlvRnJvbURCOiBBcnJheTx7IGlkOiBzdHJpbmcsIGRyaXZlSWQ6IHN0cmluZyB9PiA9XHJcbiAgICAgIHBvc3RPYmplY3QuYXVkaW8gIT09IHVuZGVmaW5lZCAmJlxyXG4gICAgICBKU09OLnBhcnNlKHBvc3RPYmplY3QuYXVkaW8pICE9PSBudWxsXHJcbiAgICAgICAgPyBBcnJheS5pc0FycmF5KHBvc3RPYmplY3QuYXVkaW8pXHJcbiAgICAgICAgICA/IEpTT04ucGFyc2UocG9zdE9iamVjdC5hdWRpbylcclxuICAgICAgICAgIDogW0pTT04ucGFyc2UocG9zdE9iamVjdC5hdWRpbyldXHJcbiAgICAgICAgOiB1bmRlZmluZWRcclxuICAgICAgY29uc3QgdmlkZW9Gcm9tRGI6IEFycmF5PHsgeW91dHViZUlkOiBzdHJpbmcsIGlkOiBzdHJpbmcgfT4gfCB1bmRlZmluZWQgPSAocG9zdE9iamVjdD8udmlkZW8gIT09IHVuZGVmaW5lZCkgPyBBcnJheS5pc0FycmF5KHBvc3RPYmplY3QudmlkZW8pID8gcG9zdE9iamVjdC52aWRlbyBhcyB1bmtub3duIGFzIEFycmF5PHsgeW91dHViZUlkOiBzdHJpbmcsIGlkOiBzdHJpbmcgfT4gOiBbcG9zdE9iamVjdC52aWRlbyBhcyB7IHlvdXR1YmVJZDogc3RyaW5nLCBpZDogc3RyaW5nIH1dIDogdW5kZWZpbmVkXHJcbiAgICAgIGNvbnNvbGUubG9nKHBvc3RPYmplY3QudmlkZW8sIHZpZGVvRnJvbURiLCAnVm9kZW8gZGF0YScpXHJcbiAgICAgIGlmICgnand0JyBpbiBwb3N0T2JqZWN0KSB7XHJcbiAgICAgICAgcG9zdE9iamVjdC5qd3QgPSB1bmRlZmluZWRcclxuICAgICAgfVxyXG4gICAgICBsb2dnZXIuZGVidWcoeyBwaG90b09iamVjdCwgZnVuY3Rpb246ICd1cGRhdGVQb3N0LnNlcnZpY2UnIH0pXHJcbiAgICAgIGlmIChwaG90b09iamVjdCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgaWRzID0gcGhvdG9PYmplY3QubWFwKChwaG90byk6IHN0cmluZyB8IHVuZGVmaW5lZCA9PiB7XHJcbiAgICAgICAgICBpZiAodHlwZW9mIHBob3RvID09PSAnb2JqZWN0JyAmJiBwaG90byAhPT0gbnVsbCAmJiAnaWQnIGluIHBob3RvICYmIHBob3RvLmlkICE9PSB1bmRlZmluZWQgJiYgdHlwZW9mIHBob3RvLmlkID09PSAnc3RyaW5nJykgeyByZXR1cm4gcGhvdG8/LmlkIH0gZWxzZSByZXR1cm4gdW5kZWZpbmVkXHJcbiAgICAgICAgfSlcclxuICAgICAgICBpZHMyID0gaWRzLmZpbHRlcigoaW1nOiBzdHJpbmcgfCB1bmRlZmluZWQpID0+IGltZyAhPT0gdW5kZWZpbmVkKSBhcyBzdHJpbmdbXSB8IHVuZGVmaW5lZFxyXG4gICAgICAgIHBob3RvT2JqZWN0Tm9VbmRlZmluZWRGYWxzZSA9IHBob3RvT2JqZWN0Lm1hcCgocGhvdG8pID0+IHtcclxuICAgICAgICAgIGlmIChwaG90byAhPT0gdW5kZWZpbmVkICYmIHBob3RvICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7IGZiaWQ6IHBob3RvLmZiaWQsIHVybDogcGhvdG8udXJsLCBpZDogcGhvdG8uaWQgfVxyXG4gICAgICAgICAgICAvLyBpZiAodHlwZW9mIHBob3RvID09PSAnb2JqZWN0JyAmJiAnaWQnIGluIHBob3RvICYmICdmYmlkJyBpbiBwaG90byAmJiAndXJsJyBpbiBwaG90bykgeyByZXR1cm4geyBmYmlkOiBwaG90by5mYmlkLCB1cmw6IHBob3RvLnVybCwgaWQ6IHBob3RvLmlkIH0gfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgcmV0dXJuIHsgZmJpZDogJ2ZhbHNlJywgdXJsOiAnZmFsc2UnLCBpZDogJ2ZhbHNlJyB9XHJcbiAgICAgICAgfSlcclxuICAgICAgICBwaG90b09iamVjdE5vVW5kZWYgPSBwaG90b09iamVjdE5vVW5kZWZpbmVkRmFsc2UuZmlsdGVyKGltZyA9PiBpbWcuZmJpZCAhPT0gJ2ZhbHNlJykgYXMgQXJyYXk8eyBpZD86IHN0cmluZywgZmJpZDogc3RyaW5nLCB1cmw6IHN0cmluZyB9PlxyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICBjb25zdCBhdXRob3I6IHN0cmluZyA9IHBvc3RPYmplY3QuYXV0aG9yIGFzIHN0cmluZ1xyXG4gICAgICAgICAgLyogYWNhIGRlYm8gaGFjZXIgZGlzdGludGFzIHJhbWFzIGVuIGVsIGNhc28gZGUgcXVlIHNlIHRlbmdhIGltYWdlbmVzIHBhcmEgYm9ycmFyLCB0ZW5nYSBpbWFnZW5lcyBwYXJhIGFncmVnYXIgICovXHJcbiAgICAgICAgICBpZiAoYXV0aG9yID09PSB1bmRlZmluZWQpIHRocm93IG5ldyBFcnJvcignTm8gYXV0aG9yIHNwZWNpZmllZCcpXHJcbiAgICAgICAgICAvKipcclxuICogY3JlbyBxdWUgZWwgZXJyb3IgZXN0YSBlbiBxdWUgZGVsZXRlTWFueSBlc3RhIG1hbCBpbXBsZW1lbnRhZG8uIERlIHVsdGltYSBzYWNhbW9zIGVsIGRlbGV0ZU1hbnlcclxuICpcclxuICovXHJcbiAgICAgICAgICBjb25zdCBkZWxldGVBdWRpb1Jlc3BvbnNlID0gYXdhaXQgdGhpcy5wcmlzbWEuYXVkaW8uZGVsZXRlTWFueSh7IHdoZXJlOiB7IHBvc3RzSWQ6IHBvc3RPYmplY3QuaWQgYXMgc3RyaW5nIH0gfSlcclxuICAgICAgICAgIGNvbnN0IGRlbGV0ZVZpZGVvUmVzcG9uc2UgPSBhd2FpdCB0aGlzLnByaXNtYS52aWRlby5kZWxldGVNYW55KHsgd2hlcmU6IHsgcG9zdHNJZDogcG9zdE9iamVjdC5pZCBhcyBzdHJpbmcgfSB9KVxyXG4gICAgICAgICAgY29uc3QgYXVkaW9NYXAgPSAoYXVkaW9Gcm9tREIgIT09IHVuZGVmaW5lZCkgPyB7IGNyZWF0ZTogYXVkaW9Gcm9tREIubWFwKGl0ZW0gPT4gKHsgZHJpdmVJZDogaXRlbS5kcml2ZUlkIH0pKSB9IDogdW5kZWZpbmVkXHJcbiAgICAgICAgICBjb25zdCB2aWRlb01hcCA9ICh2aWRlb0Zyb21EYiAhPT0gdW5kZWZpbmVkKSA/IHsgY29ubmVjdDogdmlkZW9Gcm9tRGIubWFwKGl0ZW0gPT4gKHsgeW91dHViZUlkOiBpdGVtLnlvdXR1YmVJZCB9KSkgfSA6IHVuZGVmaW5lZFxyXG4gICAgICAgICAgY29uc3QgaW1hZ2VNYXAgPSBwaG90b09iamVjdE5vVW5kZWYubWFwKHBob3RvID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIHsgLi4ucGhvdG8gfVxyXG4gICAgICAgICAgfSlcclxuICAgICAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCB0aGlzLnByaXNtYS5wb3N0cy51cGRhdGUoXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICB3aGVyZTogeyBpZDogaWRQYXJhbSB9LFxyXG4gICAgICAgICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgICAgICAgIC4uLnBvc3RPYmplY3QsXHJcbiAgICAgICAgICAgICAgICBpc1Zpc2libGU6IHRydWUsXHJcbiAgICAgICAgICAgICAgICB1cGRhdGVkQXQ6IHVuZGVmaW5lZCxcclxuICAgICAgICAgICAgICAgIGF1dGhvcjogeyBjb25uZWN0OiB7IGlkOiBhdXRob3IgfSB9LFxyXG4gICAgICAgICAgICAgICAgaW1wb3J0YW5jZTogcGFyc2VJbnQocG9zdE9iamVjdC5pbXBvcnRhbmNlIGFzIHN0cmluZyksXHJcbiAgICAgICAgICAgICAgICBhdWRpbzogYXVkaW9NYXAsXHJcbiAgICAgICAgICAgICAgICB2aWRlbzogdmlkZW9NYXAsXHJcbiAgICAgICAgICAgICAgICBpbWFnZXM6IHtcclxuICAgICAgICAgICAgICAgICAgZGVsZXRlTWFueTpcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgY3JlYXRlOiBpbWFnZU1hcFxyXG5cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIGluY2x1ZGU6IHsgYXVkaW86IHsgc2VsZWN0OiB7IGRyaXZlSWQ6IHRydWUsIGlkOiB0cnVlIH0gfSwgaW1hZ2VzOiB7IHNlbGVjdDogeyB1cmw6IHRydWUsIGZiaWQ6IHRydWUsIGlkOiB0cnVlIH0gfSwgdmlkZW86IHsgc2VsZWN0OiB7IHlvdXR1YmVJZDogdHJ1ZSB9IH0gfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgY29uc29sZS5sb2coZGVsZXRlQXVkaW9SZXNwb25zZSwgZGVsZXRlVmlkZW9SZXNwb25zZSwgZGF0YSlcclxuICAgICAgICAgIC8vIGNvbnN0IGRhdGEgPSB0cmFuc2FjdGlvblxyXG5cclxuICAgICAgICAgIGxvZ2dlci5kZWJ1Zyh7IGZ1bmN0aW9uOiAnUG9zdFNlcnZpY2UudXBkYXRlUG9zdCcsIGRhdGEgfSlcclxuICAgICAgICAgIHJldHVybiBuZXcgUmVzcG9uc2VPYmplY3QobnVsbCwgdHJ1ZSwgZGF0YSlcclxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgbG9nZ2VyLmVycm9yKHsgZnVuY3Rpb246ICdQb3N0U2VydmljZS51cGRhdGVQb3N0JywgZXJyb3IgfSlcclxuICAgICAgICAgIHJldHVybiBuZXcgUmVzcG9uc2VPYmplY3QoZXJyb3IsIGZhbHNlLCBudWxsKVxyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgY29uc3QgdHJhbnNhY3Rpb25SZXNwb25zZSA9IGF3YWl0IHRoaXMucHJpc21hLiR0cmFuc2FjdGlvbihbXHJcbiAgICAgICAgICAgIHRoaXMucHJpc21hLmF1ZGlvLmRlbGV0ZU1hbnkoeyB3aGVyZTogeyBwb3N0c0lkOiBwb3N0T2JqZWN0LmlkIGFzIGFueSB9IH0pLFxyXG4gICAgICAgICAgICB0aGlzLnByaXNtYS5wb3N0cy51cGRhdGUoXHJcbiAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgd2hlcmU6IHsgaWQ6IGlkUGFyYW0gfSxcclxuICAgICAgICAgICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgICAgICAgICAgLi4ucG9zdE9iamVjdCxcclxuICAgICAgICAgICAgICAgICAgdXBkYXRlZEF0OiB1bmRlZmluZWQsXHJcbiAgICAgICAgICAgICAgICAgIGltcG9ydGFuY2U6IHBhcnNlSW50KHBvc3RPYmplY3QuaW1wb3J0YW5jZSBhcyBzdHJpbmcpLFxyXG4gICAgICAgICAgICAgICAgICBhdXRob3I6IHsgY29ubmVjdDogeyBpZDogcG9zdE9iamVjdC5hdXRob3IgYXMgc3RyaW5nIH0gfSxcclxuICAgICAgICAgICAgICAgICAgaW1hZ2VzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlTWFueToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgTk9UOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgaW46IGlkczJcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgIGF1ZGlvOiAoYXVkaW9Gcm9tREIgIT09IHVuZGVmaW5lZCkgPyB7IGNyZWF0ZTogYXVkaW9Gcm9tREIubWFwKGl0ZW0gPT4gKHsgZHJpdmVJZDogaXRlbS5kcml2ZUlkIH0pKSB9IDogdW5kZWZpbmVkLFxyXG4gICAgICAgICAgICAgICAgICB2aWRlbzogKHZpZGVvRnJvbURiICE9PSB1bmRlZmluZWQpID8geyBjb25uZWN0OiB2aWRlb0Zyb21EYi5tYXAoaXRlbSA9PiAoeyB5b3V0dWJlSWQ6IGl0ZW0ueW91dHViZUlkIH0pKSB9IDogdW5kZWZpbmVkXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgIF0pXHJcbiAgICAgICAgICBjb25zdCBbLGRhdGFdID0gdHJhbnNhY3Rpb25SZXNwb25zZVxyXG4gICAgICAgICAgbG9nZ2VyLmRlYnVnKHsgZnVuY3Rpb246ICdQb3N0U2VydmljZS51cGRhdGVQb3N0JywgZGF0YSB9KVxyXG4gICAgICAgICAgcmV0dXJuIG5ldyBSZXNwb25zZU9iamVjdChudWxsLCB0cnVlLCBkYXRhKVxyXG4gICAgICAgICAgLy8gdmEgZWwgY29kaWdvIHNpIG5vIGhheSBjYW1iaW9zIGVuIGxhcyBwaG90b3NcclxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgbG9nZ2VyLmVycm9yKHsgZnVuY3Rpb246ICdQb3N0U2VydmljZS51cGRhdGVQb3N0JywgZXJyb3IgfSlcclxuICAgICAgICAgIHJldHVybiBuZXcgUmVzcG9uc2VPYmplY3QobnVsbCwgZmFsc2UsIGVycm9yKVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSwgcHVibGljIGFkZEZCSUR0b0RhdGFiYXNlID0gYXN5bmMgKGZiaWQ6IHN0cmluZywgaWQ6IHN0cmluZykgPT4ge1xyXG4gICAgICB0cnkge1xyXG4gICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgdGhpcy5wcmlzbWEucG9zdHMudXBkYXRlKHsgd2hlcmU6IHsgaWQgfSwgZGF0YTogeyBmYmlkIH0gfSlcclxuICAgICAgICByZXR1cm4gcmVzcG9uc2VcclxuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICBsb2dnZXIuZXJyb3IoeyBmdW5jdGlvbjogJ1Bvc3RTZXJ2aWNlLmFkZEZCSUR0b0RCJywgZXJyb3IgfSlcclxuICAgICAgICByZXR1cm4gbmV3IFJlc3BvbnNlT2JqZWN0KGVycm9yLCBmYWxzZSwgbnVsbClcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIHB1YmxpYyBkZWxldGVCeUlkID0gYXN5bmMgKGlkOiBzdHJpbmcpOiBQcm9taXNlPEdlbmVyaWNSZXNwb25zZU9iamVjdDxQcmlzbWEuUG9zdHNVcGRhdGVJbnB1dD4+ID0+IHtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHRoaXMucHJpc21hLnBvc3RzLmRlbGV0ZSh7IHdoZXJlOiB7IGlkIH0sIGluY2x1ZGU6IHsgYXVkaW86IHRydWUsIGltYWdlczogdHJ1ZSB9IH0pLy8gLmdEZWxldGUoaWQpXHJcbiAgICAgICAgcmV0dXJuIG5ldyBSZXNwb25zZU9iamVjdChudWxsLCB0cnVlLCByZXNwb25zZSlcclxuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICBsb2dnZXIuZXJyb3IoeyBmdW5jdGlvbjogJ1Bvc3RTZXJ2aWNlLmRlbGV0ZUJ5SWQnLCBlcnJvciB9KVxyXG4gICAgICAgIHJldHVybiBuZXcgUmVzcG9uc2VPYmplY3QoZXJyb3IsIGZhbHNlLCBudWxsKVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgcHVibGljIGhpZGVQb3N0ID0gYXN5bmMgKGlkOiBzdHJpbmcpOiBQcm9taXNlPEdlbmVyaWNSZXNwb25zZU9iamVjdDxQcmlzbWEuUG9zdHNVcGRhdGVJbnB1dD4+ID0+IHtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHRoaXMucHJpc21hLnBvc3RzLnVwZGF0ZSh7IHdoZXJlOiB7IGlkIH0sIGRhdGE6IHsgaXNWaXNpYmxlOiB7IHNldDogZmFsc2UgfSB9IH0pXHJcbiAgICAgICAgcmV0dXJuIG5ldyBSZXNwb25zZU9iamVjdChudWxsLCB0cnVlLCByZXNwb25zZSlcclxuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICBsb2dnZXIuZXJyb3IoeyBmdW5jdGlvbjogJ1Bvc3RTZXJ2aWNlLmhpZGVQb3N0JywgZXJyb3IgfSlcclxuICAgICAgICByZXR1cm4gbmV3IFJlc3BvbnNlT2JqZWN0KGVycm9yLCBmYWxzZSwgbnVsbClcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIHB1YmxpYyBzaG93UG9zdCA9IGFzeW5jIChpZDogc3RyaW5nKTogUHJvbWlzZTxHZW5lcmljUmVzcG9uc2VPYmplY3Q8UHJpc21hLlBvc3RzVXBkYXRlSW5wdXQ+PiA9PiB7XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCB0aGlzLnByaXNtYS5wb3N0cy51cGRhdGUoeyB3aGVyZTogeyBpZCB9LCBkYXRhOiB7IGlzVmlzaWJsZTogeyBzZXQ6IHRydWUgfSB9IH0pXHJcbiAgICAgICAgcmV0dXJuIG5ldyBSZXNwb25zZU9iamVjdChudWxsLCB0cnVlLCByZXNwb25zZSlcclxuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICBsb2dnZXIuZXJyb3IoeyBmdW5jdGlvbjogJ1Bvc3RTZXJ2aWNlLnNob3dQb3N0JywgZXJyb3IgfSlcclxuICAgICAgICByZXR1cm4gbmV3IFJlc3BvbnNlT2JqZWN0KGVycm9yLCBmYWxzZSwgbnVsbClcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIHB1YmxpYyBhZGRBdWRpb1RvREIgPSBhc3luYyAoZHJpdmVJZDogc3RyaW5nKSA9PiB7XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCB0aGlzLnByaXNtYS5hdWRpby5jcmVhdGUoeyBkYXRhOiB7IGRyaXZlSWQgfSB9KVxyXG4gICAgICAgIHJldHVybiByZXNwb25zZVxyXG4gICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgIGxvZ2dlci5lcnJvcih7IGZ1bmN0aW9uOiAnUG9zdFNlcnZpY2UuYWRkQXVkaW9Ub0RCJywgZXJyb3IgfSlcclxuICAgICAgICBpZiAoZXJyb3IgaW5zdGFuY2VvZiBQcmlzbWEuUHJpc21hQ2xpZW50S25vd25SZXF1ZXN0RXJyb3IpIHtcclxuICAgICAgICAgIHN3aXRjaCAoZXJyb3IuY29kZSkge1xyXG4gICAgICAgICAgICBjYXNlICdQMjAwMic6XHJcbiAgICAgICAgICAgICAgcmV0dXJuIG5ldyBVbmlxdWVSZXN0cmFpbnRFcnJvcihlcnJvciwgZXJyb3IubWV0YSlcclxuICAgICAgICAgICAgY2FzZSAnUDIwMDAnOlxyXG4gICAgICAgICAgICAgIHJldHVybiBuZXcgQ29sdW1uUHJpc21hRXJyb3IoZXJyb3IsIGVycm9yLm1ldGEpXHJcbiAgICAgICAgICAgIGNhc2UgJ1AyMDAxJzpcclxuICAgICAgICAgICAgICByZXR1cm4gbmV3IE5vdEZvdW5kUHJpc21hRXJyb3IoZXJyb3IsIGVycm9yLm1ldGEpXHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgcmV0dXJuIG5ldyBVbmtub3duUHJpc21hRXJyb3IoZXJyb3IsIGVycm9yLm1ldGEpXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHJldHVybiBlcnJvciBhcyBFcnJvclxyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgcHVibGljIGdldDMwRGF5c1Bvc3RzID0gYXN5bmMgKHBhZ2U6IG51bWJlciA9IDEpID0+IHtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICBjb25zdCBmcm9tRGF0ZSA9IG5ldyBEYXRlKClcclxuICAgICAgICBmcm9tRGF0ZS5zZXREYXRlKGZyb21EYXRlLmdldERhdGUoKSAtIDMwICogcGFnZSlcclxuICAgICAgICBjb25zdCB0b0RhdGUgPSBuZXcgRGF0ZShmcm9tRGF0ZSlcclxuICAgICAgICB0b0RhdGUuc2V0RGF0ZSh0b0RhdGUuZ2V0RGF0ZSgpICsgMzApXHJcblxyXG4gICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgdGhpcy5wcmlzbWEucG9zdHMuZmluZE1hbnkoe1xyXG4gICAgICAgICAgb3JkZXJCeTogeyBjcmVhdGVkQXQ6ICdkZXNjJyB9LFxyXG4gICAgICAgICAgd2hlcmU6IHsgY3JlYXRlZEF0OiB7IGd0OiBmcm9tRGF0ZSwgbHRlOiB0b0RhdGUgfSB9LFxyXG4gICAgICAgICAgaW5jbHVkZToge1xyXG4gICAgICAgICAgICBpbWFnZXM6IHsgc2VsZWN0OiB7IGZiaWQ6IHRydWUsIGlkOiB0cnVlLCB1cmw6IHRydWUsIHVwZGF0ZWRBdDogdHJ1ZSB9IH0sXHJcbiAgICAgICAgICAgIHZpZGVvOiB7IHNlbGVjdDogeyBpZDogdHJ1ZSwgdXJsOiB0cnVlLCB5b3V0dWJlSWQ6IHRydWUgfSB9LFxyXG4gICAgICAgICAgICBhdWRpbzogeyBzZWxlY3Q6IHsgaWQ6IHRydWUsIGRyaXZlSWQ6IHRydWUgfSB9LFxyXG4gICAgICAgICAgICBhdXRob3I6IHtcclxuICAgICAgICAgICAgICBzZWxlY3Q6IHtcclxuICAgICAgICAgICAgICAgIGF2YXRhcjogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIGJpcnRoRGF0ZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIGxhc3ROYW1lOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgbmFtZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIGlzVmVyaWZpZWQ6IHRydWVcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgY29uc3QgYXJyYXlJZDogYW55W10gPSBbXVxyXG4gICAgICAgIHJlc3BvbnNlLmZvckVhY2goYXN5bmMgKHJlcykgPT4ge1xyXG4gICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkocmVzLmltYWdlcykgJiYgcmVzLmltYWdlcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIHJlcy5pbWFnZXMuZm9yRWFjaChpbWFnZSA9PiB7XHJcbiAgICAgICAgICAgICAgaWYgKG5ldyBEYXRlKGltYWdlLnVwZGF0ZWRBdCkuZ2V0TWlsbGlzZWNvbmRzKCkgPCBuZXcgRGF0ZSgpLmdldE1pbGxpc2Vjb25kcygpIC0gODY0MDAwMDAgKiAyKSB7XHJcbiAgICAgICAgICAgICAgICBhcnJheUlkLnB1c2goeyBpZDogaW1hZ2UuZmJpZCB9KVxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coaW1hZ2UuZmJpZCwgaW1hZ2UudXBkYXRlZEF0LCAnZW50cm8nKVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoYXJyYXlJZCkgJiYgYXJyYXlJZC5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgY29uc3QgaW1hZ2VzID0gYXdhaXQgdGhpcy5mYWNlYm9va1NlcnZpY2UuZ2V0TGlua0Zyb21JZChhcnJheUlkKVxyXG4gICAgICAgICAgICAgIGlmIChpbWFnZXMub2spIHtcclxuICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMucHJpc21hLiR0cmFuc2FjdGlvbihhc3luYyAocHJpc21hKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgIGZvciAoY29uc3QgaW1hZ2Ugb2YgaW1hZ2VzLmRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBtb2RkID0gcmVzLmltYWdlcy5maW5kKGltYWdlREIgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coaW1hZ2UuZmJpZCwgaW1hZ2VEQi5pZClcclxuICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBpbWFnZURCLmZiaWQgPT09IGltYWdlLmZiaWRcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChtb2RkICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgIG1vZGQudXJsID0gaW1hZ2UudXJsXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBhd2FpdCBwcmlzbWEucGhvdG9zLnVwZGF0ZU1hbnkoeyB3aGVyZTogeyBmYmlkOiBpbWFnZS5mYmlkIH0sIGRhdGE6IHsgdXJsOiBpbWFnZS51cmwgfSB9KVxyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcblxyXG4gICAgICAgIHJldHVybiByZXNwb25zZVxyXG4gICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgIGxvZ2dlci5lcnJvcih7IGZ1bmN0aW9uOiAnUG9zdFNlcnZpY2UuZ2V0MzBEYXlzUG9zdHMnLCBlcnJvciB9KVxyXG4gICAgICAgIHJldHVybiBuZXcgVW5rbm93blByaXNtYUVycm9yKGVycm9yKVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICAsXHJcbiAgICBwdWJsaWMgZ2V0SWRzID0gYXN5bmMgKCkgPT4ge1xyXG4gICAgICB0cnkge1xyXG4gICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgdGhpcy5wcmlzbWEucG9zdHMuZmluZE1hbnkoeyBzZWxlY3Q6IHsgaWQ6IHRydWUgfSB9KVxyXG4gICAgICAgIHJldHVybiByZXNwb25zZVxyXG4gICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgIGxvZ2dlci5lcnJvcih7IGZ1bmN0aW9uOiAnUG9zdFNlcnZpY2UuZ2V0SWRzJywgZXJyb3IgfSlcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICApIHtcclxuICAgIHN1cGVyKClcclxuICB9XHJcbn1cclxuIl0sIm5hbWVzIjpbIlBvc3RTZXJ2aWNlIiwiRGF0YWJhc2VIYW5kbGVyIiwiY29uc3RydWN0b3IiLCJmYWNlYm9va1NlcnZpY2UiLCJGYWNlYm9va1NlcnZpY2UiLCJnb29nbGVTZXJ2aWNlIiwiR29vZ2xlU2VydmljZSIsInBob3RvR2VuZXJhdG9yIiwiZmlsZXMiLCJpbWFnZXNQYXJhbSIsInBob3RvQXJyYXkiLCJpbWFnZXMiLCJ1bmRlZmluZWQiLCJBcnJheSIsImlzQXJyYXkiLCJQcm9taXNlIiwiYWxsIiwibWFwIiwiZmlsZSIsImRhdGEiLCJwb3N0UGhvdG8iLCJvayIsImlkIiwicmVzcG9uc2UiLCJnZXRMaW5rRnJvbUlkIiwiaW1hZ2UiLCJmYmlkIiwibG9nZ2VyIiwiZGVidWciLCJmdW5jdGlvbiIsImNyZWF0ZVBvc3QiLCJib2R5IiwiZGF0YUFycmF5IiwidGl0bGUiLCJ0ZXh0IiwiaGVhZGluZyIsImNsYXNzaWZpY2F0aW9uIiwiaW1wb3J0YW5jZSIsImF1ZGlvIiwidmlkZW8iLCJudW1iZXJJbXBvcnRhbmNlIiwiYXVkaW9BcnJheSIsInZpZGVvQXJyYXkiLCJKU09OIiwicGFyc2UiLCJwYXJzZUludCIsImNvbnNvbGUiLCJsb2ciLCJwcmlzbWEiLCJwb3N0cyIsImNyZWF0ZSIsImlzVmlzaWJsZSIsImF1dGhvciIsImNvbm5lY3QiLCJpdGVtIiwiaW5jbHVkZSIsInNlbGVjdCIsImxhc3ROYW1lIiwibmFtZSIsInVzZXJuYW1lIiwiZ2V0UG9zdHMiLCJwYWdpbmF0aW9uT3B0aW9ucyIsInF1ZXJ5T3B0aW9ucyIsImdHZXRBbGwiLCJlcnJvciIsImdldFBvc3QiLCJmaW5kVW5pcXVlIiwid2hlcmUiLCJhdmF0YXIiLCJ1cmwiLCJ1cGRhdGVkQXQiLCJkcml2ZUlkIiwieW91dHViZUlkIiwibGF0ZXN0TmV3cyIsImZpbmRNYW55Iiwib3JkZXJCeSIsImNyZWF0ZWRBdCIsInRha2UiLCJ1cGRhdGVQaG90byIsInBob3RvIiwicGhvdG9zIiwidXBkYXRlIiwidXBkYXRlUG9zdCIsInBvc3RPYmplY3QiLCJpZFBhcmFtIiwicGhvdG9PYmplY3QiLCJpZHMiLCJpZHMyIiwicGhvdG9PYmplY3ROb1VuZGVmaW5lZEZhbHNlIiwicGhvdG9PYmplY3ROb1VuZGVmIiwiYXVkaW9Gcm9tREIiLCJ2aWRlb0Zyb21EYiIsImp3dCIsImZpbHRlciIsImltZyIsIkVycm9yIiwiZGVsZXRlQXVkaW9SZXNwb25zZSIsImRlbGV0ZU1hbnkiLCJwb3N0c0lkIiwiZGVsZXRlVmlkZW9SZXNwb25zZSIsImF1ZGlvTWFwIiwidmlkZW9NYXAiLCJpbWFnZU1hcCIsIlJlc3BvbnNlT2JqZWN0IiwidHJhbnNhY3Rpb25SZXNwb25zZSIsIiR0cmFuc2FjdGlvbiIsIk5PVCIsImluIiwiYWRkRkJJRHRvRGF0YWJhc2UiLCJkZWxldGVCeUlkIiwiZGVsZXRlIiwiaGlkZVBvc3QiLCJzZXQiLCJzaG93UG9zdCIsImFkZEF1ZGlvVG9EQiIsIlByaXNtYSIsIlByaXNtYUNsaWVudEtub3duUmVxdWVzdEVycm9yIiwiY29kZSIsIlVuaXF1ZVJlc3RyYWludEVycm9yIiwibWV0YSIsIkNvbHVtblByaXNtYUVycm9yIiwiTm90Rm91bmRQcmlzbWFFcnJvciIsIlVua25vd25QcmlzbWFFcnJvciIsImdldDMwRGF5c1Bvc3RzIiwicGFnZSIsImZyb21EYXRlIiwiRGF0ZSIsInNldERhdGUiLCJnZXREYXRlIiwidG9EYXRlIiwiZ3QiLCJsdGUiLCJiaXJ0aERhdGUiLCJpc1ZlcmlmaWVkIiwiYXJyYXlJZCIsImZvckVhY2giLCJyZXMiLCJsZW5ndGgiLCJnZXRNaWxsaXNlY29uZHMiLCJwdXNoIiwibW9kZCIsImZpbmQiLCJpbWFnZURCIiwidXBkYXRlTWFueSIsImdldElkcyJdLCJyYW5nZU1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7IiwibWFwcGluZ3MiOiJBQUFBLGtFQUFrRSxHQUNsRSw0REFBNEQsR0FDNUQseURBQXlEOzs7OytCQVU1Q0E7OztlQUFBQTs7O2lDQVRtQjt3QkFDVDsrQkFDQTswQkFDbUQ7aUNBRTFDOytCQUNGOzhCQUNtRTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7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
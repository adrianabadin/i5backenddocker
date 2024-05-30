"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    GoogleService: function() {
        return GoogleService;
    },
    driveMan: function() {
        return driveMan;
    },
    oauthClient: function() {
        return oauthClient;
    },
    url: function() {
        return url;
    }
});
const _googleapis = require("googleapis");
const _databaseservice = require("./database.service");
const _loggerservice = require("./logger.service");
const _fs = /*#__PURE__*/ _interop_require_default(require("fs"));
const _Entities = require("../Entities");
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
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const oauthClient = new _googleapis.google.auth.OAuth2(process.env.CLIENTID_BUCKET, process.env.CLIENTSECRET_BUCKET, process.env.CALLBACK_BUCKET);
const scopes = [
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/youtube',
    'https://mail.google.com/',
    'https://www.googleapis.com/auth/youtubepartner'
];
const url = oauthClient.generateAuthUrl({
    access_type: 'offline',
    scope: scopes
});
class GoogleService {
    isRTValid(tokenStr) {
        var _this = this;
        return _async_to_generator(function*() {
            try {
                _this.oAuthClient.setCredentials({
                    refresh_token: tokenStr
                });
                const { token } = yield _this.oAuthClient.getAccessToken();
                if (token === undefined) return false;
                else return true;
            } catch (error) {
                _loggerservice.logger.error({
                    function: 'GoogleService.isRTValid',
                    error
                });
                return false;
            }
        })();
    }
    initiateAuth() {
        var _this = this;
        return _async_to_generator(function*() {
            try {
                if (GoogleService.rt !== undefined && GoogleService.rt !== null) {
                    const response = yield _this.isRTValid(GoogleService.rt);
                    if (response) return true;
                    else throw new _Entities.TokenError();
                } else {
                    const result = yield _this.prisma.dataConfig.findUniqueOrThrow({
                        where: {
                            id: 1
                        },
                        select: {
                            refreshToken: true
                        }
                    });
                    GoogleService.rt = result.refreshToken;
                    if (result.refreshToken !== null) {
                        const response = yield _this.isRTValid(result.refreshToken);
                        if (response) return true;
                        else throw new _Entities.TokenError();
                    } else throw new _Entities.NeverAuthError() // aca debe ir un error que signifique nunca fue autenticado
                    ;
                }
            } catch (error) {
                _loggerservice.logger.error({
                    function: 'GoogleService',
                    error
                });
                if (error instanceof _Entities.TokenError || error instanceof _Entities.NeverAuthError) return error;
                else return new _Entities.UnknownGoogleError(error);
            }
        })();
    }
    folderExists(folder) {
        var _this = this;
        return _async_to_generator(function*() {
            try {
                const initiateResponse = yield _this.initiateAuth();
                if (!(initiateResponse !== undefined && typeof initiateResponse === 'object' && 'code' in initiateResponse)) {
                    var _data_files;
                    const drive = _googleapis.google.drive({
                        version: 'v3',
                        auth: oauthClient
                    });
                    const { data, status } = yield drive.files.list({
                        q: `mimeType='application/vnd.google-apps.folder' and name='${folder}'`,
                        fields: 'files(id, name)'
                    });
                    if (status > 400) throw new _Entities.FolderCreateError();
                    if (data.files !== undefined && ((_data_files = data.files) === null || _data_files === void 0 ? void 0 : _data_files.length) > 0 && data.files[0].id !== undefined && data.files[0].id !== null) {
                        return data.files[0].id;
                    } else {
                        const { data: dataCreated, status: statusCreated } = yield drive.files.create({
                            requestBody: {
                                mimeType: 'application/vnd.google-apps.folder',
                                name: folder
                            }
                        });
                        if (statusCreated > 400) throw new Error('Server error: ');
                        if ((dataCreated === null || dataCreated === void 0 ? void 0 : dataCreated.id) != null) {
                            return dataCreated.id;
                        } else throw new _Entities.FolderCreateError();
                    }
                } else throw initiateResponse;
            } catch (error) {
                _loggerservice.logger.error({
                    function: 'GoogleService.folderExists',
                    error
                });
                if (error instanceof _Entities.TokenError || error instanceof _Entities.NeverAuthError || error instanceof _Entities.FolderCreateError) {
                    return error;
                } else {
                    return new _Entities.UnknownGoogleError(error);
                }
            }
        })();
    }
    fileUpload(folder, file) {
        var _this = this;
        return _async_to_generator(function*() {
            try {
                if (GoogleService.rt === undefined) {
                    const initiateResponse = yield _this.initiateAuth();
                    if (initiateResponse instanceof _Entities.TokenError || initiateResponse instanceof _Entities.NeverAuthError) {
                        throw initiateResponse;
                    }
                }
                if (GoogleService.rt !== undefined) {
                    const drive = _googleapis.google.drive({
                        version: 'v3',
                        auth: oauthClient
                    });
                    const id = yield _this.folderExists(folder);
                    if (typeof id !== 'string' && id instanceof Error) throw id;
                    const splitedPath = file.split('/');
                    if (id !== undefined && id !== null) {
                        var _response_data;
                        const response = yield drive.files.create({
                            requestBody: {
                                parents: [
                                    id
                                ],
                                name: splitedPath[splitedPath.length - 1]
                            },
                            media: {
                                body: _fs.default.createReadStream(file)
                            }
                        });
                        let permissionsResponse;
                        if ((response === null || response === void 0 ? void 0 : response.data) !== null) {
                            permissionsResponse = yield drive.permissions.create({
                                fileId: response.data.id,
                                requestBody: {
                                    role: 'writer',
                                    type: 'anyone'
                                }
                            });
                            if (permissionsResponse !== undefined) {
                                yield _fs.default.promises.unlink(file);
                            } else {
                                throw new _Entities.PermissionsCreateError();
                            }
                        } else throw new _Entities.FileCreateError();
                        if (response.data.id !== undefined && ((_response_data = response.data) === null || _response_data === void 0 ? void 0 : _response_data.id) !== null) {
                            var _response_data1;
                            return (_response_data1 = response.data) === null || _response_data1 === void 0 ? void 0 : _response_data1.id;
                        } else throw new _Entities.FileCreateError();
                    } else throw new _Entities.FolderCreateError();
                }
                throw new _Entities.NeverAuthError();
            } catch (error) {
                _loggerservice.logger.error({
                    function: 'GoogleService.fileUpload',
                    error
                });
                if (error instanceof _Entities.TokenError || error instanceof _Entities.NeverAuthError || error instanceof _Entities.FolderCreateError || error instanceof _Entities.FileCreateError || error instanceof _Entities.PermissionsCreateError) {
                    return error;
                } else return new _Entities.UnknownGoogleError(error);
            }
        })();
    }
    fileRemove(driveId) {
        var _this = this;
        return _async_to_generator(function*() {
            try {
                const initiateResponse = yield _this.initiateAuth();
                if (initiateResponse instanceof _Entities.GoogleError) throw initiateResponse;
                const drive = _googleapis.google.drive({
                    version: 'v3',
                    auth: oauthClient
                });
                const response = yield drive.files.delete({
                    fileId: driveId
                });
                if (response === undefined) throw new Error('Error deleting drive: ' + driveId);
                return true;
            } catch (error) {
                _loggerservice.logger.error({
                    function: 'GoogleService.fileRemove',
                    error
                });
                if (error instanceof _Entities.TokenError || error instanceof _Entities.NeverAuthError || error instanceof _Entities.UnknownGoogleError) return error;
                else return error;
            }
        })();
    }
    uploadVideo(path, title, description, channelId, tags) {
        var _this = this;
        return _async_to_generator(function*() {
            try {
                const initiateResponse = yield _this.initiateAuth();
                if (initiateResponse instanceof _Entities.GoogleError) throw initiateResponse;
                const youtube = _googleapis.google.youtube({
                    version: 'v3',
                    auth: oauthClient
                });
                const video = yield youtube.videos.insert({
                    notifySubscribers: true,
                    requestBody: {
                        snippet: {
                            title,
                            description,
                            tags,
                            channelId,
                            defaultAudioLanguage: 'es'
                        },
                        status: {
                            privacyStatus: 'public'
                        }
                    },
                    part: [
                        'snippet',
                        'status'
                    ],
                    media: {
                        body: _fs.default.createReadStream(path)
                    }
                });
                if (video.data === null) throw new _Entities.VideoCreateError();
                if (video.data.id === undefined || video.data.id === null) throw new _Entities.VideoCreateError();
                return video.data.id;
            } catch (error) {
                if (typeof error === 'object' && error !== null && 'code' in error && error.code === 403) {
                    if ('errors' in error) {
                        if (Array.isArray(error.errors)) {
                            const quotas = error.errors.map((errorItem)=>{
                                if (typeof errorItem === 'object' && errorItem !== null && 'reason' in errorItem) {
                                    if (errorItem.reason === 'quotaExceeded') {
                                        return 1;
                                    }
                                }
                                return 0;
                            }).reduce((prev, cur)=>prev + cur);
                            if (quotas > 0) {
                                _loggerservice.logger.error({
                                    function: 'GoogleService.uploadVideo',
                                    error: new _Entities.QuotaExceededError(error)
                                });
                                return new _Entities.QuotaExceededError(error);
                            }
                        }
                    }
                }
                if (error instanceof _Entities.TokenError || error instanceof _Entities.NeverAuthError || error instanceof _Entities.VideoCreateError || error instanceof _Entities.QuotaExceededError) {
                    _loggerservice.logger.error({
                        function: 'GoogleService.uploadVideo',
                        error
                    });
                    return error;
                } else {
                    _loggerservice.logger.error({
                        function: 'GoogleService.uploadVideo',
                        error: new _Entities.UnknownGoogleError(error)
                    });
                    return new _Entities.UnknownGoogleError(error);
                }
            }
        })();
    }
    videoRm(id) {
        var _this = this;
        return _async_to_generator(function*() {
            try {
                const initiateResponse = yield _this.initiateAuth();
                if (initiateResponse instanceof _Entities.GoogleError) throw initiateResponse;
                const youtube = _googleapis.google.youtube({
                    version: 'v3',
                    auth: oauthClient
                });
                yield youtube.videos.delete({
                    id
                });
                return true;
            } catch (error) {
                if (error instanceof _Entities.TokenError || error instanceof _Entities.NeverAuthError || error instanceof _Entities.UnknownGoogleError) {
                    _loggerservice.logger.error({
                        function: 'PostService.videoRm',
                        error
                    });
                    return error;
                } else return new _Entities.UnknownGoogleError(error);
            }
        })();
    }
    constructor(oAuthClient = oauthClient, prisma = _databaseservice.prismaClient.prisma){
        _define_property(this, "oAuthClient", void 0);
        _define_property(this, "prisma", void 0);
        this.oAuthClient = oAuthClient;
        this.prisma = prisma;
        this.fileUpload = this.fileUpload.bind(this);
        this.folderExists = this.folderExists.bind(this);
        this.initiateAuth = this.initiateAuth.bind(this);
        this.isRTValid = this.isRTValid.bind(this);
        this.fileRemove = this.fileRemove.bind(this);
        this.uploadVideo = this.uploadVideo.bind(this);
    }
}
_define_property(GoogleService, "rt", void 0);
const driveMan = new GoogleService();

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9TZXJ2aWNlcy9nb29nbGUuc2VydmljZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBnb29nbGUsIHR5cGUgZHJpdmVfdjMgfSBmcm9tICdnb29nbGVhcGlzJ1xyXG5pbXBvcnQgeyBwcmlzbWFDbGllbnQgfSBmcm9tICcuL2RhdGFiYXNlLnNlcnZpY2UnXHJcbmltcG9ydCB7IGxvZ2dlciB9IGZyb20gJy4vbG9nZ2VyLnNlcnZpY2UnXHJcbmltcG9ydCBmcyBmcm9tICdmcydcclxuaW1wb3J0IHsgRmlsZUNyZWF0ZUVycm9yLCBGb2xkZXJDcmVhdGVFcnJvciwgR29vZ2xlRXJyb3IsIE5ldmVyQXV0aEVycm9yLCBQZXJtaXNzaW9uc0NyZWF0ZUVycm9yLCBRdW90YUV4Y2VlZGVkRXJyb3IsIFRva2VuRXJyb3IsIFVua25vd25Hb29nbGVFcnJvciwgVmlkZW9DcmVhdGVFcnJvciB9IGZyb20gJy4uL0VudGl0aWVzJ1xyXG5leHBvcnQgY29uc3Qgb2F1dGhDbGllbnQgPSBuZXcgZ29vZ2xlLmF1dGguT0F1dGgyKFxyXG4gIHByb2Nlc3MuZW52LkNMSUVOVElEX0JVQ0tFVCxcclxuICBwcm9jZXNzLmVudi5DTElFTlRTRUNSRVRfQlVDS0VULFxyXG4gIHByb2Nlc3MuZW52LkNBTExCQUNLX0JVQ0tFVClcclxuY29uc3Qgc2NvcGVzID0gWydodHRwczovL3d3dy5nb29nbGVhcGlzLmNvbS9hdXRoL2RyaXZlJywgJ2h0dHBzOi8vd3d3Lmdvb2dsZWFwaXMuY29tL2F1dGgveW91dHViZScsICdodHRwczovL21haWwuZ29vZ2xlLmNvbS8nLCAnaHR0cHM6Ly93d3cuZ29vZ2xlYXBpcy5jb20vYXV0aC95b3V0dWJlcGFydG5lciddXHJcbmV4cG9ydCBjb25zdCB1cmwgPSBvYXV0aENsaWVudC5nZW5lcmF0ZUF1dGhVcmwoeyBhY2Nlc3NfdHlwZTogJ29mZmxpbmUnLCBzY29wZTogc2NvcGVzIH0pXHJcblxyXG5leHBvcnQgY2xhc3MgR29vZ2xlU2VydmljZSB7XHJcbiAgc3RhdGljIHJ0OiBzdHJpbmcgfCBudWxsIHwgdW5kZWZpbmVkXHJcblxyXG4gIGNvbnN0cnVjdG9yIChcclxuICAgIHByb3RlY3RlZCBvQXV0aENsaWVudCA9IG9hdXRoQ2xpZW50LFxyXG4gICAgcHJvdGVjdGVkIHByaXNtYSA9IHByaXNtYUNsaWVudC5wcmlzbWFcclxuXHJcbiAgKSB7XHJcbiAgICB0aGlzLmZpbGVVcGxvYWQgPSB0aGlzLmZpbGVVcGxvYWQuYmluZCh0aGlzKVxyXG4gICAgdGhpcy5mb2xkZXJFeGlzdHMgPSB0aGlzLmZvbGRlckV4aXN0cy5iaW5kKHRoaXMpXHJcbiAgICB0aGlzLmluaXRpYXRlQXV0aCA9IHRoaXMuaW5pdGlhdGVBdXRoLmJpbmQodGhpcylcclxuICAgIHRoaXMuaXNSVFZhbGlkID0gdGhpcy5pc1JUVmFsaWQuYmluZCh0aGlzKVxyXG4gICAgdGhpcy5maWxlUmVtb3ZlID0gdGhpcy5maWxlUmVtb3ZlLmJpbmQodGhpcylcclxuICAgIHRoaXMudXBsb2FkVmlkZW8gPSB0aGlzLnVwbG9hZFZpZGVvLmJpbmQodGhpcylcclxuICB9XHJcblxyXG4gIGFzeW5jIGlzUlRWYWxpZCAodG9rZW5TdHI6IHN0cmluZyk6IFByb21pc2U8Ym9vbGVhbj4ge1xyXG4gICAgdHJ5IHtcclxuICAgICAgdGhpcy5vQXV0aENsaWVudC5zZXRDcmVkZW50aWFscyh7IHJlZnJlc2hfdG9rZW46IHRva2VuU3RyIH0pXHJcbiAgICAgIGNvbnN0IHsgdG9rZW4gfSA9IGF3YWl0IHRoaXMub0F1dGhDbGllbnQuZ2V0QWNjZXNzVG9rZW4oKVxyXG4gICAgICBpZiAodG9rZW4gPT09IHVuZGVmaW5lZCkgcmV0dXJuIGZhbHNlXHJcbiAgICAgIGVsc2UgcmV0dXJuIHRydWVcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgIGxvZ2dlci5lcnJvcih7IGZ1bmN0aW9uOiAnR29vZ2xlU2VydmljZS5pc1JUVmFsaWQnLCBlcnJvciB9KVxyXG4gICAgICByZXR1cm4gZmFsc2VcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGFzeW5jIGluaXRpYXRlQXV0aCAoKTogUHJvbWlzZTx0cnVlIHwgVG9rZW5FcnJvciB8IFVua25vd25Hb29nbGVFcnJvciB8IE5ldmVyQXV0aEVycm9yPiB7XHJcbiAgICB0cnkge1xyXG4gICAgICBpZiAoR29vZ2xlU2VydmljZS5ydCAhPT0gdW5kZWZpbmVkICYmIEdvb2dsZVNlcnZpY2UucnQgIT09IG51bGwpIHtcclxuICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHRoaXMuaXNSVFZhbGlkKEdvb2dsZVNlcnZpY2UucnQpXHJcbiAgICAgICAgaWYgKHJlc3BvbnNlKSByZXR1cm4gdHJ1ZVxyXG4gICAgICAgIGVsc2UgdGhyb3cgbmV3IFRva2VuRXJyb3IoKVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHRoaXMucHJpc21hLmRhdGFDb25maWcuZmluZFVuaXF1ZU9yVGhyb3coeyB3aGVyZTogeyBpZDogMSB9LCBzZWxlY3Q6IHsgcmVmcmVzaFRva2VuOiB0cnVlIH0gfSlcclxuICAgICAgICBHb29nbGVTZXJ2aWNlLnJ0ID0gcmVzdWx0LnJlZnJlc2hUb2tlblxyXG4gICAgICAgIGlmIChyZXN1bHQucmVmcmVzaFRva2VuICE9PSBudWxsKSB7XHJcbiAgICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHRoaXMuaXNSVFZhbGlkKHJlc3VsdC5yZWZyZXNoVG9rZW4pXHJcbiAgICAgICAgICBpZiAocmVzcG9uc2UpIHJldHVybiB0cnVlXHJcbiAgICAgICAgICBlbHNlIHRocm93IG5ldyBUb2tlbkVycm9yKClcclxuICAgICAgICB9IGVsc2UgdGhyb3cgbmV3IE5ldmVyQXV0aEVycm9yKCkgLy8gYWNhIGRlYmUgaXIgdW4gZXJyb3IgcXVlIHNpZ25pZmlxdWUgbnVuY2EgZnVlIGF1dGVudGljYWRvXHJcbiAgICAgIH1cclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgIGxvZ2dlci5lcnJvcih7IGZ1bmN0aW9uOiAnR29vZ2xlU2VydmljZScsIGVycm9yIH0pXHJcbiAgICAgIGlmIChlcnJvciBpbnN0YW5jZW9mIFRva2VuRXJyb3IgfHwgZXJyb3IgaW5zdGFuY2VvZiBOZXZlckF1dGhFcnJvcikgcmV0dXJuIGVycm9yXHJcbiAgICAgIGVsc2UgcmV0dXJuIG5ldyBVbmtub3duR29vZ2xlRXJyb3IoZXJyb3IpXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBhc3luYyBmb2xkZXJFeGlzdHMgKGZvbGRlcjogc3RyaW5nKTogUHJvbWlzZTxzdHJpbmcgfCBUb2tlbkVycm9yIHwgTmV2ZXJBdXRoRXJyb3IgfCBGb2xkZXJDcmVhdGVFcnJvciB8IFVua25vd25Hb29nbGVFcnJvcj4ge1xyXG4gICAgdHJ5IHtcclxuICAgICAgY29uc3QgaW5pdGlhdGVSZXNwb25zZSA9IGF3YWl0IHRoaXMuaW5pdGlhdGVBdXRoKClcclxuICAgICAgaWYgKCEoaW5pdGlhdGVSZXNwb25zZSAhPT0gdW5kZWZpbmVkICYmIHR5cGVvZiBpbml0aWF0ZVJlc3BvbnNlID09PSAnb2JqZWN0JyAmJiAnY29kZScgaW4gaW5pdGlhdGVSZXNwb25zZSkpIHtcclxuICAgICAgICBjb25zdCBkcml2ZTogZHJpdmVfdjMuRHJpdmUgPSBnb29nbGUuZHJpdmUoeyB2ZXJzaW9uOiAndjMnLCBhdXRoOiBvYXV0aENsaWVudCB9KVxyXG4gICAgICAgIGNvbnN0IHsgZGF0YSwgc3RhdHVzIH0gPSBhd2FpdCBkcml2ZS5maWxlcy5saXN0KHtcclxuICAgICAgICAgIHE6IGBtaW1lVHlwZT0nYXBwbGljYXRpb24vdm5kLmdvb2dsZS1hcHBzLmZvbGRlcicgYW5kIG5hbWU9JyR7Zm9sZGVyfSdgLFxyXG4gICAgICAgICAgZmllbGRzOiAnZmlsZXMoaWQsIG5hbWUpJ1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgaWYgKHN0YXR1cyA+IDQwMCkgdGhyb3cgbmV3IEZvbGRlckNyZWF0ZUVycm9yKClcclxuICAgICAgICBpZiAoZGF0YS5maWxlcyAhPT0gdW5kZWZpbmVkICYmIGRhdGEuZmlsZXM/Lmxlbmd0aCA+IDAgJiYgZGF0YS5maWxlc1swXS5pZCAhPT0gdW5kZWZpbmVkICYmIGRhdGEuZmlsZXNbMF0uaWQgIT09IG51bGwpIHtcclxuICAgICAgICAgIHJldHVybiBkYXRhLmZpbGVzWzBdLmlkXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGNvbnN0IHsgZGF0YTogZGF0YUNyZWF0ZWQsIHN0YXR1czogc3RhdHVzQ3JlYXRlZCB9ID0gYXdhaXQgZHJpdmUuZmlsZXMuY3JlYXRlKHtcclxuICAgICAgICAgICAgcmVxdWVzdEJvZHk6IHtcclxuICAgICAgICAgICAgICBtaW1lVHlwZTogJ2FwcGxpY2F0aW9uL3ZuZC5nb29nbGUtYXBwcy5mb2xkZXInLFxyXG4gICAgICAgICAgICAgIG5hbWU6IGZvbGRlclxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICAgaWYgKHN0YXR1c0NyZWF0ZWQgPiA0MDApIHRocm93IG5ldyBFcnJvcignU2VydmVyIGVycm9yOiAnKVxyXG4gICAgICAgICAgaWYgKGRhdGFDcmVhdGVkPy5pZCAhPSBudWxsKSB7IHJldHVybiBkYXRhQ3JlYXRlZC5pZCB9IGVsc2UgdGhyb3cgbmV3IEZvbGRlckNyZWF0ZUVycm9yKClcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSB0aHJvdyBpbml0aWF0ZVJlc3BvbnNlXHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICBsb2dnZXIuZXJyb3IoeyBmdW5jdGlvbjogJ0dvb2dsZVNlcnZpY2UuZm9sZGVyRXhpc3RzJywgZXJyb3IgfSlcclxuICAgICAgaWYgKGVycm9yIGluc3RhbmNlb2YgVG9rZW5FcnJvciB8fCBlcnJvciBpbnN0YW5jZW9mIE5ldmVyQXV0aEVycm9yIHx8IGVycm9yIGluc3RhbmNlb2YgRm9sZGVyQ3JlYXRlRXJyb3IpIHsgcmV0dXJuIGVycm9yIH0gZWxzZSB7IHJldHVybiBuZXcgVW5rbm93bkdvb2dsZUVycm9yKGVycm9yKSB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBhc3luYyBmaWxlVXBsb2FkIChmb2xkZXI6IHN0cmluZywgZmlsZTogc3RyaW5nKTogUHJvbWlzZTxzdHJpbmcgfCBOZXZlckF1dGhFcnJvciB8IFRva2VuRXJyb3IgfCBGb2xkZXJDcmVhdGVFcnJvciB8IEZpbGVDcmVhdGVFcnJvciB8IFBlcm1pc3Npb25zQ3JlYXRlRXJyb3IgfCBVbmtub3duR29vZ2xlRXJyb3I+IHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGlmIChHb29nbGVTZXJ2aWNlLnJ0ID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICBjb25zdCBpbml0aWF0ZVJlc3BvbnNlID0gYXdhaXQgdGhpcy5pbml0aWF0ZUF1dGgoKVxyXG4gICAgICAgIGlmIChpbml0aWF0ZVJlc3BvbnNlIGluc3RhbmNlb2YgVG9rZW5FcnJvciB8fCBpbml0aWF0ZVJlc3BvbnNlIGluc3RhbmNlb2YgTmV2ZXJBdXRoRXJyb3IpIHtcclxuICAgICAgICAgIHRocm93IGluaXRpYXRlUmVzcG9uc2VcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgaWYgKEdvb2dsZVNlcnZpY2UucnQgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIGNvbnN0IGRyaXZlOiBkcml2ZV92My5Ecml2ZSA9IGdvb2dsZS5kcml2ZSh7IHZlcnNpb246ICd2MycsIGF1dGg6IG9hdXRoQ2xpZW50IH0pXHJcbiAgICAgICAgY29uc3QgaWQ6IHN0cmluZyB8IEVycm9yID0gYXdhaXQgdGhpcy5mb2xkZXJFeGlzdHMoZm9sZGVyKVxyXG4gICAgICAgIGlmICh0eXBlb2YgaWQgIT09ICdzdHJpbmcnICYmIGlkIGluc3RhbmNlb2YgRXJyb3IpIHRocm93IGlkXHJcbiAgICAgICAgY29uc3Qgc3BsaXRlZFBhdGggPSBmaWxlLnNwbGl0KCcvJylcclxuXHJcbiAgICAgICAgaWYgKChpZCkgIT09IHVuZGVmaW5lZCAmJiBpZCAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBkcml2ZS5maWxlcy5jcmVhdGUoe1xyXG4gICAgICAgICAgICByZXF1ZXN0Qm9keToge1xyXG4gICAgICAgICAgICAgIHBhcmVudHM6IFtpZF0sXHJcblxyXG4gICAgICAgICAgICAgIG5hbWU6IHNwbGl0ZWRQYXRoW3NwbGl0ZWRQYXRoLmxlbmd0aCAtIDFdXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIG1lZGlhOiB7XHJcbiAgICAgICAgICAgICAgYm9keTogZnMuY3JlYXRlUmVhZFN0cmVhbShmaWxlKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICAgbGV0IHBlcm1pc3Npb25zUmVzcG9uc2VcclxuICAgICAgICAgIGlmIChyZXNwb25zZT8uZGF0YSAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICBwZXJtaXNzaW9uc1Jlc3BvbnNlID0gYXdhaXQgZHJpdmUucGVybWlzc2lvbnMuY3JlYXRlKHsgZmlsZUlkOiByZXNwb25zZS5kYXRhLmlkIGFzIHN0cmluZywgcmVxdWVzdEJvZHk6IHsgcm9sZTogJ3dyaXRlcicsIHR5cGU6ICdhbnlvbmUnIH0gfSlcclxuICAgICAgICAgICAgaWYgKHBlcm1pc3Npb25zUmVzcG9uc2UgIT09IHVuZGVmaW5lZCkgeyBhd2FpdCBmcy5wcm9taXNlcy51bmxpbmsoZmlsZSkgfSBlbHNlIHtcclxuICAgICAgICAgICAgICB0aHJvdyBuZXcgUGVybWlzc2lvbnNDcmVhdGVFcnJvcigpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0gZWxzZSB0aHJvdyBuZXcgRmlsZUNyZWF0ZUVycm9yKClcclxuICAgICAgICAgIGlmIChyZXNwb25zZS5kYXRhLmlkICE9PSB1bmRlZmluZWQgJiYgcmVzcG9uc2UuZGF0YT8uaWQgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmRhdGE/LmlkXHJcbiAgICAgICAgICB9IGVsc2UgdGhyb3cgbmV3IEZpbGVDcmVhdGVFcnJvcigpXHJcbiAgICAgICAgfSBlbHNlIHRocm93IG5ldyBGb2xkZXJDcmVhdGVFcnJvcigpXHJcbiAgICAgIH0gdGhyb3cgbmV3IE5ldmVyQXV0aEVycm9yKClcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgIGxvZ2dlci5lcnJvcih7IGZ1bmN0aW9uOiAnR29vZ2xlU2VydmljZS5maWxlVXBsb2FkJywgZXJyb3IgfSlcclxuICAgICAgaWYgKGVycm9yIGluc3RhbmNlb2YgVG9rZW5FcnJvciB8fFxyXG4gICAgICAgIGVycm9yIGluc3RhbmNlb2YgTmV2ZXJBdXRoRXJyb3IgfHxcclxuICAgICAgICBlcnJvciBpbnN0YW5jZW9mIEZvbGRlckNyZWF0ZUVycm9yIHx8XHJcbiAgICAgICAgZXJyb3IgaW5zdGFuY2VvZiBGaWxlQ3JlYXRlRXJyb3IgfHxcclxuICAgICAgICBlcnJvciBpbnN0YW5jZW9mIFBlcm1pc3Npb25zQ3JlYXRlRXJyb3IpIHtcclxuICAgICAgICByZXR1cm4gZXJyb3JcclxuICAgICAgfSBlbHNlIHJldHVybiBuZXcgVW5rbm93bkdvb2dsZUVycm9yKGVycm9yKVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgYXN5bmMgZmlsZVJlbW92ZSAoZHJpdmVJZDogc3RyaW5nKTogUHJvbWlzZTx0cnVlIHwgRXJyb3I+IHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGNvbnN0IGluaXRpYXRlUmVzcG9uc2UgPSBhd2FpdCB0aGlzLmluaXRpYXRlQXV0aCgpXHJcbiAgICAgIGlmIChpbml0aWF0ZVJlc3BvbnNlIGluc3RhbmNlb2YgR29vZ2xlRXJyb3IpIHRocm93IGluaXRpYXRlUmVzcG9uc2VcclxuICAgICAgY29uc3QgZHJpdmU6IGRyaXZlX3YzLkRyaXZlID0gZ29vZ2xlLmRyaXZlKHsgdmVyc2lvbjogJ3YzJywgYXV0aDogb2F1dGhDbGllbnQgfSlcclxuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBkcml2ZS5maWxlcy5kZWxldGUoe1xyXG4gICAgICAgIGZpbGVJZDogZHJpdmVJZFxyXG4gICAgICB9KVxyXG4gICAgICBpZiAocmVzcG9uc2UgPT09IHVuZGVmaW5lZCkgdGhyb3cgbmV3IEVycm9yKCdFcnJvciBkZWxldGluZyBkcml2ZTogJyArIGRyaXZlSWQpXHJcbiAgICAgIHJldHVybiB0cnVlXHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICBsb2dnZXIuZXJyb3IoeyBmdW5jdGlvbjogJ0dvb2dsZVNlcnZpY2UuZmlsZVJlbW92ZScsIGVycm9yIH0pXHJcbiAgICAgIGlmIChlcnJvciBpbnN0YW5jZW9mIFRva2VuRXJyb3IgfHwgZXJyb3IgaW5zdGFuY2VvZiBOZXZlckF1dGhFcnJvciB8fCBlcnJvciBpbnN0YW5jZW9mIFVua25vd25Hb29nbGVFcnJvcikgcmV0dXJuIGVycm9yXHJcbiAgICAgIGVsc2UgcmV0dXJuIGVycm9yIGFzIEVycm9yXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBhc3luYyB1cGxvYWRWaWRlbyAocGF0aDogc3RyaW5nLCB0aXRsZTogc3RyaW5nLCBkZXNjcmlwdGlvbjogc3RyaW5nLCBjaGFubmVsSWQ/OiBzdHJpbmcsIHRhZ3M/OiBzdHJpbmdbXSk6XHJcbiAgUHJvbWlzZTxzdHJpbmcgfCBUb2tlbkVycm9yIHwgTmV2ZXJBdXRoRXJyb3IgfCBVbmtub3duR29vZ2xlRXJyb3IgfCBWaWRlb0NyZWF0ZUVycm9yIHwgUXVvdGFFeGNlZWRlZEVycm9yPiB7XHJcbiAgICB0cnkge1xyXG4gICAgICBjb25zdCBpbml0aWF0ZVJlc3BvbnNlID0gYXdhaXQgdGhpcy5pbml0aWF0ZUF1dGgoKVxyXG4gICAgICBpZiAoaW5pdGlhdGVSZXNwb25zZSBpbnN0YW5jZW9mIEdvb2dsZUVycm9yKSB0aHJvdyBpbml0aWF0ZVJlc3BvbnNlXHJcbiAgICAgIGNvbnN0IHlvdXR1YmUgPSBnb29nbGUueW91dHViZSh7IHZlcnNpb246ICd2MycsIGF1dGg6IG9hdXRoQ2xpZW50IH0pXHJcbiAgICAgIGNvbnN0IHZpZGVvOiBhbnkgPSBhd2FpdCB5b3V0dWJlLnZpZGVvcy5pbnNlcnQoe1xyXG4gICAgICAgIG5vdGlmeVN1YnNjcmliZXJzOiB0cnVlLFxyXG4gICAgICAgIHJlcXVlc3RCb2R5OiB7XHJcbiAgICAgICAgICBzbmlwcGV0OiB7IHRpdGxlLCBkZXNjcmlwdGlvbiwgdGFncywgY2hhbm5lbElkLCBkZWZhdWx0QXVkaW9MYW5ndWFnZTogJ2VzJyB9LFxyXG4gICAgICAgICAgc3RhdHVzOiB7IHByaXZhY3lTdGF0dXM6ICdwdWJsaWMnIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIHBhcnQ6IFsnc25pcHBldCcsICdzdGF0dXMnXSxcclxuICAgICAgICBtZWRpYToge1xyXG4gICAgICAgICAgYm9keTogZnMuY3JlYXRlUmVhZFN0cmVhbShwYXRoKVxyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICB9XHJcbiAgICAgIClcclxuICAgICAgaWYgKHZpZGVvLmRhdGEgPT09IG51bGwpIHRocm93IG5ldyBWaWRlb0NyZWF0ZUVycm9yKClcclxuICAgICAgaWYgKHZpZGVvLmRhdGEuaWQgPT09IHVuZGVmaW5lZCB8fCB2aWRlby5kYXRhLmlkID09PSBudWxsKSB0aHJvdyBuZXcgVmlkZW9DcmVhdGVFcnJvcigpXHJcbiAgICAgIHJldHVybiB2aWRlby5kYXRhLmlkXHJcbiAgICB9IGNhdGNoIChlcnJvcjogdW5rbm93bikge1xyXG4gICAgICBpZiAodHlwZW9mIGVycm9yID09PSAnb2JqZWN0JyAmJiBlcnJvciAhPT0gbnVsbCAmJiAnY29kZScgaW4gZXJyb3IgJiYgZXJyb3IuY29kZSA9PT0gNDAzKSB7XHJcbiAgICAgICAgaWYgKCdlcnJvcnMnIGluIGVycm9yKSB7XHJcbiAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShlcnJvci5lcnJvcnMpKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHF1b3RhcyA9IGVycm9yLmVycm9ycy5tYXAoKGVycm9ySXRlbTogdW5rbm93bik6IG51bWJlciA9PiB7XHJcbiAgICAgICAgICAgICAgaWYgKHR5cGVvZiBlcnJvckl0ZW0gPT09ICdvYmplY3QnICYmIGVycm9ySXRlbSAhPT0gbnVsbCAmJiAncmVhc29uJyBpbiBlcnJvckl0ZW0pIHtcclxuICAgICAgICAgICAgICAgIGlmIChlcnJvckl0ZW0ucmVhc29uID09PSAncXVvdGFFeGNlZWRlZCcpIHtcclxuICAgICAgICAgICAgICAgICAgcmV0dXJuIDFcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgcmV0dXJuIDBcclxuICAgICAgICAgICAgfSkucmVkdWNlKChwcmV2LCBjdXIpID0+IHByZXYgKyBjdXIpXHJcbiAgICAgICAgICAgIGlmIChxdW90YXMgPiAwKSB7XHJcbiAgICAgICAgICAgICAgbG9nZ2VyLmVycm9yKHsgZnVuY3Rpb246ICdHb29nbGVTZXJ2aWNlLnVwbG9hZFZpZGVvJywgZXJyb3I6IG5ldyBRdW90YUV4Y2VlZGVkRXJyb3IoZXJyb3IpIH0pXHJcbiAgICAgICAgICAgICAgcmV0dXJuIG5ldyBRdW90YUV4Y2VlZGVkRXJyb3IoZXJyb3IpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChlcnJvciBpbnN0YW5jZW9mIFRva2VuRXJyb3IgfHwgZXJyb3IgaW5zdGFuY2VvZiBOZXZlckF1dGhFcnJvciB8fCBlcnJvciBpbnN0YW5jZW9mIFZpZGVvQ3JlYXRlRXJyb3IgfHwgZXJyb3IgaW5zdGFuY2VvZiBRdW90YUV4Y2VlZGVkRXJyb3IpIHtcclxuICAgICAgICBsb2dnZXIuZXJyb3IoeyBmdW5jdGlvbjogJ0dvb2dsZVNlcnZpY2UudXBsb2FkVmlkZW8nLCBlcnJvciB9KVxyXG4gICAgICAgIHJldHVybiBlcnJvclxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGxvZ2dlci5lcnJvcih7IGZ1bmN0aW9uOiAnR29vZ2xlU2VydmljZS51cGxvYWRWaWRlbycsIGVycm9yOiBuZXcgVW5rbm93bkdvb2dsZUVycm9yKGVycm9yKSB9KVxyXG4gICAgICAgIHJldHVybiBuZXcgVW5rbm93bkdvb2dsZUVycm9yKGVycm9yKVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBhc3luYyB2aWRlb1JtIChpZDogc3RyaW5nKTogUHJvbWlzZTxUb2tlbkVycm9yIHwgTmV2ZXJBdXRoRXJyb3IgfCBVbmtub3duR29vZ2xlRXJyb3IgfCB0cnVlPiB7XHJcbiAgICB0cnkge1xyXG4gICAgICBjb25zdCBpbml0aWF0ZVJlc3BvbnNlID0gYXdhaXQgdGhpcy5pbml0aWF0ZUF1dGgoKVxyXG4gICAgICBpZiAoaW5pdGlhdGVSZXNwb25zZSBpbnN0YW5jZW9mIEdvb2dsZUVycm9yKSB0aHJvdyBpbml0aWF0ZVJlc3BvbnNlXHJcbiAgICAgIGNvbnN0IHlvdXR1YmUgPSBnb29nbGUueW91dHViZSh7IHZlcnNpb246ICd2MycsIGF1dGg6IG9hdXRoQ2xpZW50IH0pXHJcbiAgICAgIGF3YWl0IHlvdXR1YmUudmlkZW9zLmRlbGV0ZSh7XHJcbiAgICAgICAgaWRcclxuXHJcbiAgICAgIH0pXHJcbiAgICAgIHJldHVybiB0cnVlXHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICBpZiAoZXJyb3IgaW5zdGFuY2VvZiBUb2tlbkVycm9yIHx8IGVycm9yIGluc3RhbmNlb2YgTmV2ZXJBdXRoRXJyb3IgfHwgZXJyb3IgaW5zdGFuY2VvZiBVbmtub3duR29vZ2xlRXJyb3IpIHtcclxuICAgICAgICBsb2dnZXIuZXJyb3IoeyBmdW5jdGlvbjogJ1Bvc3RTZXJ2aWNlLnZpZGVvUm0nLCBlcnJvciB9KVxyXG4gICAgICAgIHJldHVybiBlcnJvclxyXG4gICAgICB9IGVsc2UgcmV0dXJuIG5ldyBVbmtub3duR29vZ2xlRXJyb3IoZXJyb3IpXHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbmV4cG9ydCBjb25zdCBkcml2ZU1hbiA9IG5ldyBHb29nbGVTZXJ2aWNlKClcclxuIl0sIm5hbWVzIjpbIkdvb2dsZVNlcnZpY2UiLCJkcml2ZU1hbiIsIm9hdXRoQ2xpZW50IiwidXJsIiwiZ29vZ2xlIiwiYXV0aCIsIk9BdXRoMiIsInByb2Nlc3MiLCJlbnYiLCJDTElFTlRJRF9CVUNLRVQiLCJDTElFTlRTRUNSRVRfQlVDS0VUIiwiQ0FMTEJBQ0tfQlVDS0VUIiwic2NvcGVzIiwiZ2VuZXJhdGVBdXRoVXJsIiwiYWNjZXNzX3R5cGUiLCJzY29wZSIsImlzUlRWYWxpZCIsInRva2VuU3RyIiwib0F1dGhDbGllbnQiLCJzZXRDcmVkZW50aWFscyIsInJlZnJlc2hfdG9rZW4iLCJ0b2tlbiIsImdldEFjY2Vzc1Rva2VuIiwidW5kZWZpbmVkIiwiZXJyb3IiLCJsb2dnZXIiLCJmdW5jdGlvbiIsImluaXRpYXRlQXV0aCIsInJ0IiwicmVzcG9uc2UiLCJUb2tlbkVycm9yIiwicmVzdWx0IiwicHJpc21hIiwiZGF0YUNvbmZpZyIsImZpbmRVbmlxdWVPclRocm93Iiwid2hlcmUiLCJpZCIsInNlbGVjdCIsInJlZnJlc2hUb2tlbiIsIk5ldmVyQXV0aEVycm9yIiwiVW5rbm93bkdvb2dsZUVycm9yIiwiZm9sZGVyRXhpc3RzIiwiZm9sZGVyIiwiaW5pdGlhdGVSZXNwb25zZSIsImRhdGEiLCJkcml2ZSIsInZlcnNpb24iLCJzdGF0dXMiLCJmaWxlcyIsImxpc3QiLCJxIiwiZmllbGRzIiwiRm9sZGVyQ3JlYXRlRXJyb3IiLCJsZW5ndGgiLCJkYXRhQ3JlYXRlZCIsInN0YXR1c0NyZWF0ZWQiLCJjcmVhdGUiLCJyZXF1ZXN0Qm9keSIsIm1pbWVUeXBlIiwibmFtZSIsIkVycm9yIiwiZmlsZVVwbG9hZCIsImZpbGUiLCJzcGxpdGVkUGF0aCIsInNwbGl0IiwicGFyZW50cyIsIm1lZGlhIiwiYm9keSIsImZzIiwiY3JlYXRlUmVhZFN0cmVhbSIsInBlcm1pc3Npb25zUmVzcG9uc2UiLCJwZXJtaXNzaW9ucyIsImZpbGVJZCIsInJvbGUiLCJ0eXBlIiwicHJvbWlzZXMiLCJ1bmxpbmsiLCJQZXJtaXNzaW9uc0NyZWF0ZUVycm9yIiwiRmlsZUNyZWF0ZUVycm9yIiwiZmlsZVJlbW92ZSIsImRyaXZlSWQiLCJHb29nbGVFcnJvciIsImRlbGV0ZSIsInVwbG9hZFZpZGVvIiwicGF0aCIsInRpdGxlIiwiZGVzY3JpcHRpb24iLCJjaGFubmVsSWQiLCJ0YWdzIiwieW91dHViZSIsInZpZGVvIiwidmlkZW9zIiwiaW5zZXJ0Iiwibm90aWZ5U3Vic2NyaWJlcnMiLCJzbmlwcGV0IiwiZGVmYXVsdEF1ZGlvTGFuZ3VhZ2UiLCJwcml2YWN5U3RhdHVzIiwicGFydCIsIlZpZGVvQ3JlYXRlRXJyb3IiLCJjb2RlIiwiQXJyYXkiLCJpc0FycmF5IiwiZXJyb3JzIiwicXVvdGFzIiwibWFwIiwiZXJyb3JJdGVtIiwicmVhc29uIiwicmVkdWNlIiwicHJldiIsImN1ciIsIlF1b3RhRXhjZWVkZWRFcnJvciIsInZpZGVvUm0iLCJjb25zdHJ1Y3RvciIsInByaXNtYUNsaWVudCIsImJpbmQiXSwicmFuZ2VNYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztJQVlhQSxhQUFhO2VBQWJBOztJQXdO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
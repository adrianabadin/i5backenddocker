"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "FacebookService", {
    enumerable: true,
    get: function() {
        return FacebookService;
    }
});
const _dotenv = /*#__PURE__*/ _interop_require_default(require("dotenv"));
const _axios = /*#__PURE__*/ _interop_require_default(require("axios"));
const _fs = /*#__PURE__*/ _interop_require_default(require("fs"));
const _Entities = require("../Entities");
const _loggerservice = require("./logger.service");
const _app = require("../app");
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
_dotenv.default.config();
var _this = void 0;
var _this1 = void 0;
var _this2 = void 0;
class FacebookService {
    constructor(pageID = process.env.FACEBOOK_PAGE != null ? process.env.FACEBOOK_PAGE : 'me', pageToken = process.env.FB_PAGE_TOKEN !== null ? process.env.FB_PAGE_TOKEN : '', postPhoto = function() {
        var _ref = _async_to_generator(function*(data) {
            let response;
            if (_this.pageToken === undefined || _this.pageID === undefined) throw new Error('Must Provide Fb Credentials on enviromen Variables');
            try {
                response = yield _axios.default.post(`https://graph.facebook.com/${_this.pageID}/photos?published=false&access_token=${_this.pageToken}`, {
                    source: _fs.default.createReadStream(data.path)
                }, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }).then((response)=>{
                    _fs.default.unlinkSync(data.path);
                    return response.data;
                }).catch((error)=>{
                    _loggerservice.logger.error({
                        function: 'FacebookService.postPhoto.axiosPostRequest',
                        error
                    });
                    if (_fs.default.existsSync(data.path)) {
                        _fs.default.unlinkSync(data.path);
                    }
                    return new _Entities.ResponseObject(error, false, null);
                });
            } catch (error) {
                _loggerservice.logger.error({
                    function: 'FacebookService.postPhoto.axiosPostRequest',
                    error
                });
                if (_fs.default.existsSync(data.path)) {
                    _fs.default.unlinkSync(data.path);
                }
                return new _Entities.ResponseObject(error, false, null);
            }
            // console.log(response)
            return new _Entities.ResponseObject(null, true, response);
        });
        return function(data) {
            return _ref.apply(this, arguments);
        };
    }(), getLinkFromId = function() {
        var _ref = _async_to_generator(function*(idArray) {
            try {
                const imagesArray = [];
                //    console.log({ idArray })
                if (idArray !== undefined && Array.isArray(idArray)) {
                    // https://graph.facebook.com/391159203017232?fields=link&access_token=EAAC6VEEU92EBAMdz1ZAcWHS199UPlJqArvcZCkVVOT5vF9sZBYzMixo4IoNTnguXZB2BCb3Ui3jhGUGIIKGEtIx8ZC3iiMlpuXUNZBWHaDEJjif0M04jLyPhBCISHvnOY9oYIuj1Qrz5ZBlH63pMN3G3kB0AzioZAZCKd3HyA1Swl0mEO9Dg8k3WgqG5WrqLZANM9uEkcrn7IFjAZDZD
                    if (_this1.pageToken !== '') {
                        // TRABAJAR EN ESTE REQUEST PARA QUE DEVUELVA SOLO LA IMAGEN DE MAYOR RESOLUCION YAMODIFIQUE LINK POR IMAGES QUE DEVUELVE EL LINK PUBLICO
                        // DE LA IMAGEN DE FACEBOOK
                        const batch = [];
                        idArray.forEach((id)=>{
                            if (id !== undefined) {
                                batch.push({
                                    method: 'GET',
                                    relative_url: `${id.id}?fields=images`
                                });
                            }
                        });
                        const response = yield _axios.default.post('https://graph.facebook.com/', {
                            batch
                        }, {
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            params: {
                                access_token: _this1.pageToken
                            }
                        });
                        // logger.debug({ response, title: 'facebookFeed.getLinkfromid' })
                        // VALIDA QUE EL RESPONSE GENERAL SEA OK
                        if (response.status === 200) {
                            // VALIDA QUE HAYA DEVUELTO UN ARRAY DE RESPUESTAS
                            if (Array.isArray(response.data) && response.data.length > 0) {
                                // TOMA CADA RESPUESTA QUE DIO EL BATCH REQUEST Y LA PROCESA
                                response.data.forEach((image)=>{
                                    // VALIDA QUE LA RESPUESTA SEA UN OBJETO Y QUE CONTENGA LAS PROPIEDADES QUE VAMOS A USAR
                                    if (typeof image === 'object' && image !== null && 'code' in image && 'body' in image && typeof (image === null || image === void 0 ? void 0 : image.body) === 'string') {
                                        // VALIDA QUE LA RESPUESTA DE ESTA REQUEST EN PARTICULAR SEA OK
                                        if (image.code === 200) {
                                            const imagesFromFB = JSON.parse(image.body);
                                            // VALIDA QUE ESTA REQUEST TENGA UNA KEY IMAGES DE TIPO ARRAY Y UNA ID DE TIPO STRING
                                            if (imagesFromFB !== null && typeof imagesFromFB === 'object' && 'images' in imagesFromFB && 'id' in imagesFromFB && typeof imagesFromFB.id === 'string' && Array.isArray(imagesFromFB.images)) {
                                                //  console.log({ imagesFromFB: imagesFromFB.images })
                                                let found720 = false;
                                                let accu = 0;
                                                let indexAcc = 0;
                                                // RECORRE LAS IMAGENES DE ESA REQUEST Y TOMA EL NUMERO DE INDICE DE ESE ARRAY PARA GENERAR UN ACUMULADOR QUE NOS DEJE LUEGO ACCEDER A LA IMAGEN DE MAS RESOLUCION
                                                imagesFromFB.images.forEach((photo, subIndex)=>{
                                                    // VALIDA LOS CAMPOS HEIGHT WIDTH Y SOURCE Y VALIDA SUS TIPOS
                                                    if (typeof photo === 'object' && photo !== null && 'height' in photo && 'width' in photo && typeof photo.height === 'number' && typeof photo.width === 'number') {
                                                        // GENERA EL ACUMULADOR4 DE MAYOR RESOLUCION Y EL INDICE DEL DE MAYOR RESOLUCION
                                                        if (photo.height * photo.width >= accu) {
                                                            accu = photo.height * photo.width;
                                                            indexAcc = subIndex;
                                                        }
                                                        // SI LA RESOLUCION ES DE 720*480 O DE 480*720 PUSHEA EL OBJETO AL ARRAY Y CAMBIA A TRUE FOUND720
                                                        if (photo.height * photo.width === 480 * 720 && 'source' in photo) {
                                                            imagesArray.push({
                                                                fbid: imagesFromFB.id,
                                                                url: photo.source
                                                            });
                                                            found720 = true;
                                                        }
                                                    }
                                                });
                                                // EN EL CASO DE QUE EL ARRAY NO CUENTE CON LA RESOLUCION BUSCADA PUSHEA LA DE MAYOR RESOLUCION
                                                if (!found720) {
                                                    imagesArray.push({
                                                        fbid: imagesFromFB.id,
                                                        url: imagesFromFB.images[indexAcc].source
                                                    });
                                                }
                                            }
                                        //                logger.debug({ function: 'facebookService.getLinkFromId', imagesArray })
                                        // hace el return de un response Object con un imagesArray Type
                                        }
                                    }
                                });
                            }
                        } else throw new Error(response.data);
                    } else throw new Error('Must provide a facebook Token');
                }
                if (imagesArray.length > 0) {
                    return new _Entities.ResponseObject(null, true, imagesArray);
                } else {
                    _loggerservice.logger.error({
                        imagesArray
                    });
                    throw new Error('Error creating link from id array');
                }
            } catch (error) {
                _loggerservice.logger.error({
                    function: 'facebookService.getLinkFromId',
                    error
                });
                return new _Entities.ResponseObject(error, false, null);
            }
        });
        return function(idArray) {
            return _ref.apply(this, arguments);
        };
    }(), facebookFeed = function() {
        var _ref = _async_to_generator(function*(data, pictures, id) {
            let response;
            try {
                console.log(data, pictures);
                const { title, heading } = data;
                const message = `${title}\n${heading}\n\nPara leer mas click en el link  ${process.env.NEWSPAPER_URL}/${id}`;
                const pictsArray = pictures.map((picture)=>{
                    return picture.fbid // picture.url.split('fbid=')[1].split('&')[0]
                    ;
                });
                let dataRequest;
                if (process.env.NEWSPAPER_URL !== undefined) {
                    dataRequest = {
                        message,
                        attached_media: pictsArray.map((id)=>({
                                media_fbid: id
                            })),
                        access_token: process.env.FB_PAGE_TOKEN
                    };
                }
                console.log(dataRequest, 'DataRequest Var');
                try {
                    response = yield _axios.default.post(` https://graph.facebook.com/${process.env.FACEBOOK_PAGE}/feed`, dataRequest);
                    return new _Entities.ResponseObject(null, true, response);
                } catch (error) {
                    console.log(error);
                }
            } catch (error) {
                _loggerservice.logger.error({
                    function: 'FacebookService.facebookFeed',
                    error
                });
                return new _Entities.ResponseObject(error, false, null);
            }
        });
        return function(data, pictures, id) {
            return _ref.apply(this, arguments);
        };
    }(), updateFacebookPost = function() {
        var _ref = _async_to_generator(function*(id, data) {
            /*
      Hay que elegir.
      opcion 1 el post se actualiza borrando el previo y creando uno nuevo
      opcion 2 solo se actualiza el texto del post sin actualizar las imagenes
      */ const message = `${data.title}\n${data.heading}\n\nPara leer mas click en el link  ${process.env.NEWSPAPER_URL}/${data.newspaperID}`;
            const dataRequest = {
                message,
                access_token: process.env.FB_PAGE_TOKEN
            };
            try {
                const response = yield _axios.default.post(` https://graph.facebook.com/${id}/`, dataRequest);
                console.log(response.data, '*****************************');
                return new _Entities.ResponseObject(null, true, response.data);
            } catch (error) {
                var _error_response;
                return new _Entities.ResponseObject(error === null || error === void 0 ? void 0 : (_error_response = error.response) === null || _error_response === void 0 ? void 0 : _error_response.data, false, null);
            }
        });
        return function(id, data) {
            return _ref.apply(this, arguments);
        };
    }(), deleteFacebookPost = function() {
        var _ref = _async_to_generator(function*(fbid) {
            try {
                const response = yield _axios.default.delete(`https://graph.facebook.com/v16.0/${fbid}?access_token=${process.env.FB_PAGE_TOKEN}`);
                return response;
            } catch (error) {
                _loggerservice.logger.error({
                    function: 'facebookService.deleteFacebookPost',
                    error
                });
            }
        });
        return function(fbid) {
            return _ref.apply(this, arguments);
        };
    }(), assertValidToken = function() {
        var _ref = _async_to_generator(function*(token) {
            const response = yield (yield fetch(`https://graph.facebook.com/oauth/access_token?client_id=${process.env.FACEBOOK_APP_ID}&client_secret=${process.env.FACEBOOK_APP_SECRET}&grant_type=client_credentials`)).json();
            let newToken = '';
            if ('access_token' in response) newToken = response.access_token;
            if (newToken !== '') {
                const validationResponse = yield (yield fetch(`https://graph.facebook.com/v3.2/debug_token?input_token=${token}&access_token=${newToken}`)).json();
                console.log(validationResponse.data.is_valid);
                if ('data' in validationResponse && 'is_valid' in validationResponse.data && validationResponse.data.is_valid === true) return token;
                else {
                    const finalToken = yield _this2.getLongliveAccessToken(newToken, _app.userLogged.fbid);
                    return finalToken !== undefined ? finalToken : null;
                }
            } else return null;
        });
        return function(token) {
            return _ref.apply(this, arguments);
        };
    }(), getLongliveAccessToken = function() {
        var _ref = _async_to_generator(function*(accessToken, userId) {
            let response = yield fetch(`https://graph.facebook.com/oauth/access_token?grant_type=fb_exchange_token&client_id=${process.env.FACEBOOK_APP_ID}&client_secret=${process.env.FACEBOOK_APP_SECRET}&fb_exchange_token=${accessToken}`);
            const longUserToken = (yield response.json()).access_token;
            response = yield fetch(`https://graph.facebook.com/${userId}/accounts?
access_token=${longUserToken}`) // console.log(await response.json())
            ;
            const streamResponse = yield response.json();
            let data = '';
            if (streamResponse !== null && 'data' in streamResponse && Array.isArray(streamResponse === null || streamResponse === void 0 ? void 0 : streamResponse.data)) {
                streamResponse.data.forEach((page)=>{
                    // console.log(page, process.env.FACEBOOK_APP_ID)
                    if (page.id === process.env.FACEBOOK_PAGE) data = page.access_token;
                });
            }
            if (data !== '') return data;
        });
        return function(accessToken, userId) {
            return _ref.apply(this, arguments);
        };
    }()){
        _define_property(this, "pageID", void 0);
        _define_property(this, "pageToken", void 0);
        _define_property(this, "postPhoto", void 0);
        _define_property(this, "getLinkFromId", void 0);
        _define_property(this, "facebookFeed", void 0);
        _define_property(this, "updateFacebookPost", void 0);
        _define_property(this, "deleteFacebookPost", void 0);
        _define_property(this, "assertValidToken", void 0);
        _define_property(this, "getLongliveAccessToken", void 0);
        this.pageID = pageID;
        this.pageToken = pageToken;
        this.postPhoto = postPhoto;
        this.getLinkFromId = getLinkFromId;
        this.facebookFeed = facebookFeed;
        this.updateFacebookPost = updateFacebookPost;
        this.deleteFacebookPost = deleteFacebookPost;
        this.assertValidToken = assertValidToken;
        this.getLongliveAccessToken = getLongliveAccessToken;
    }
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9TZXJ2aWNlcy9mYWNlYm9vay5zZXJ2aWNlLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBkb3RlbnYgZnJvbSAnZG90ZW52J1xyXG5pbXBvcnQgYXhpb3MgZnJvbSAnYXhpb3MnXHJcbmltcG9ydCBmcyBmcm9tICdmcydcclxuaW1wb3J0IHsgdHlwZSBJRmFjZWJvb2tEYXRhLCBSZXNwb25zZU9iamVjdCwgdHlwZSBDbGFzc2lmaWNhdGlvbkFycmF5IH0gZnJvbSAnLi4vRW50aXRpZXMnXHJcbmltcG9ydCB7IGxvZ2dlciB9IGZyb20gJy4vbG9nZ2VyLnNlcnZpY2UnXHJcblxyXG5pbXBvcnQgeyB0eXBlIEdlbmVyaWNSZXNwb25zZU9iamVjdCB9IGZyb20gJy4vZ29vZ2xlLmVycm9ycydcclxuaW1wb3J0IHsgdXNlckxvZ2dlZCB9IGZyb20gJy4uL2FwcCdcclxuZG90ZW52LmNvbmZpZygpXHJcbmV4cG9ydCBjbGFzcyBGYWNlYm9va1NlcnZpY2Uge1xyXG4gIGNvbnN0cnVjdG9yIChcclxuICAgIHB1YmxpYyBwYWdlSUQgPSAocHJvY2Vzcy5lbnYuRkFDRUJPT0tfUEFHRSAhPSBudWxsKSA/IHByb2Nlc3MuZW52LkZBQ0VCT09LX1BBR0UgOiAnbWUnLFxyXG4gICAgcHVibGljIHBhZ2VUb2tlbiA9IChwcm9jZXNzLmVudi5GQl9QQUdFX1RPS0VOICE9PSBudWxsKSA/IHByb2Nlc3MuZW52LkZCX1BBR0VfVE9LRU4gOiAnJyxcclxuICAgIHB1YmxpYyBwb3N0UGhvdG8gPSBhc3luYyAoZGF0YTogRXhwcmVzcy5NdWx0ZXIuRmlsZSkgPT4ge1xyXG4gICAgICBsZXQgcmVzcG9uc2VcclxuICAgICAgaWYgKHRoaXMucGFnZVRva2VuID09PSB1bmRlZmluZWQgfHwgdGhpcy5wYWdlSUQgPT09IHVuZGVmaW5lZCkgdGhyb3cgbmV3IEVycm9yKCdNdXN0IFByb3ZpZGUgRmIgQ3JlZGVudGlhbHMgb24gZW52aXJvbWVuIFZhcmlhYmxlcycpXHJcblxyXG4gICAgICB0cnkge1xyXG4gICAgICAgIHJlc3BvbnNlID0gYXdhaXQgYXhpb3MucG9zdChgaHR0cHM6Ly9ncmFwaC5mYWNlYm9vay5jb20vJHt0aGlzLnBhZ2VJRH0vcGhvdG9zP3B1Ymxpc2hlZD1mYWxzZSZhY2Nlc3NfdG9rZW49JHt0aGlzLnBhZ2VUb2tlbn1gLCB7IHNvdXJjZTogZnMuY3JlYXRlUmVhZFN0cmVhbShkYXRhLnBhdGgpIH0sIHtcclxuICAgICAgICAgIGhlYWRlcnM6IHtcclxuICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdtdWx0aXBhcnQvZm9ybS1kYXRhJ1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pLnRoZW4ocmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICAgZnMudW5saW5rU3luYyhkYXRhLnBhdGgpXHJcbiAgICAgICAgICByZXR1cm4gcmVzcG9uc2UuZGF0YVxyXG4gICAgICAgIH0pLmNhdGNoKGVycm9yID0+IHtcclxuICAgICAgICAgIGxvZ2dlci5lcnJvcih7IGZ1bmN0aW9uOiAnRmFjZWJvb2tTZXJ2aWNlLnBvc3RQaG90by5heGlvc1Bvc3RSZXF1ZXN0JywgZXJyb3IgfSlcclxuICAgICAgICAgIGlmIChmcy5leGlzdHNTeW5jKGRhdGEucGF0aCkpIHsgZnMudW5saW5rU3luYyhkYXRhLnBhdGgpIH1cclxuICAgICAgICAgIHJldHVybiBuZXcgUmVzcG9uc2VPYmplY3QoZXJyb3IsIGZhbHNlLCBudWxsKVxyXG4gICAgICAgIH0pXHJcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgbG9nZ2VyLmVycm9yKHsgZnVuY3Rpb246ICdGYWNlYm9va1NlcnZpY2UucG9zdFBob3RvLmF4aW9zUG9zdFJlcXVlc3QnLCBlcnJvciB9KVxyXG4gICAgICAgIGlmIChmcy5leGlzdHNTeW5jKGRhdGEucGF0aCkpIHsgZnMudW5saW5rU3luYyhkYXRhLnBhdGgpIH1cclxuICAgICAgICByZXR1cm4gbmV3IFJlc3BvbnNlT2JqZWN0KGVycm9yLCBmYWxzZSwgbnVsbClcclxuICAgICAgfVxyXG4gICAgICAvLyBjb25zb2xlLmxvZyhyZXNwb25zZSlcclxuICAgICAgcmV0dXJuIG5ldyBSZXNwb25zZU9iamVjdChudWxsLCB0cnVlLCByZXNwb25zZSlcclxuICAgIH0sXHJcbiAgICBwdWJsaWMgZ2V0TGlua0Zyb21JZCA9IGFzeW5jIChpZEFycmF5OiBBcnJheTx7IGlkOiBzdHJpbmcgfSB8IHVuZGVmaW5lZD4pOiBQcm9taXNlPEdlbmVyaWNSZXNwb25zZU9iamVjdDxBcnJheTx7IGZiaWQ6IHN0cmluZywgdXJsOiBzdHJpbmcgfT4+PiA9PiB7XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgaW1hZ2VzQXJyYXk6IEFycmF5PHsgZmJpZDogc3RyaW5nLCB1cmw6IHN0cmluZyB9PiA9IFtdXHJcbiAgICAgICAgLy8gICAgY29uc29sZS5sb2coeyBpZEFycmF5IH0pXHJcbiAgICAgICAgaWYgKGlkQXJyYXkgIT09IHVuZGVmaW5lZCAmJiBBcnJheS5pc0FycmF5KGlkQXJyYXkpKSB7XHJcbiAgICAgICAgLy8gaHR0cHM6Ly9ncmFwaC5mYWNlYm9vay5jb20vMzkxMTU5MjAzMDE3MjMyP2ZpZWxkcz1saW5rJmFjY2Vzc190b2tlbj1FQUFDNlZFRVU5MkVCQU1kejFaQWNXSFMxOTlVUGxKcUFydmNaQ2tWVk9UNXZGOXNaQll6TWl4bzRJb05Ubmd1WFpCMkJDYjNVaTNqaEdVR0lJS0dFdEl4OFpDM2lpTWxwdVhVTlpCV0hhREVKamlmME0wNGpMeVBoQkNJU0h2bk9ZOW9ZSXVqMVFyejVaQmxINjNwTU4zRzNrQjBBemlvWkFaQ0tkM0h5QTFTd2wwbUVPOURnOGszV2dxRzVXcnFMWkFOTTl1RWtjcm43SUZqQVpEWkRcclxuICAgICAgICAgIGlmICh0aGlzLnBhZ2VUb2tlbiAhPT0gJycpIHtcclxuICAgICAgICAgICAgLy8gVFJBQkFKQVIgRU4gRVNURSBSRVFVRVNUIFBBUkEgUVVFIERFVlVFTFZBIFNPTE8gTEEgSU1BR0VOIERFIE1BWU9SIFJFU09MVUNJT04gWUFNT0RJRklRVUUgTElOSyBQT1IgSU1BR0VTIFFVRSBERVZVRUxWRSBFTCBMSU5LIFBVQkxJQ09cclxuICAgICAgICAgICAgLy8gREUgTEEgSU1BR0VOIERFIEZBQ0VCT09LXHJcbiAgICAgICAgICAgIGNvbnN0IGJhdGNoOiBhbnlbXSA9IFtdXHJcbiAgICAgICAgICAgIGlkQXJyYXkuZm9yRWFjaCgoaWQpID0+IHtcclxuICAgICAgICAgICAgICBpZiAoaWQgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgYmF0Y2gucHVzaCh7XHJcbiAgICAgICAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXHJcbiAgICAgICAgICAgICAgICAgIHJlbGF0aXZlX3VybDogYCR7aWQuaWR9P2ZpZWxkcz1pbWFnZXNgXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBheGlvcy5wb3N0KCdodHRwczovL2dyYXBoLmZhY2Vib29rLmNvbS8nLCB7IGJhdGNoIH0sIHsgaGVhZGVyczogeyAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nIH0sIHBhcmFtczogeyBhY2Nlc3NfdG9rZW46IHRoaXMucGFnZVRva2VuIH0gfSlcclxuICAgICAgICAgICAgLy8gbG9nZ2VyLmRlYnVnKHsgcmVzcG9uc2UsIHRpdGxlOiAnZmFjZWJvb2tGZWVkLmdldExpbmtmcm9taWQnIH0pXHJcbiAgICAgICAgICAgIC8vIFZBTElEQSBRVUUgRUwgUkVTUE9OU0UgR0VORVJBTCBTRUEgT0tcclxuICAgICAgICAgICAgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gMjAwKSB7XHJcbiAgICAgICAgICAgICAgLy8gVkFMSURBIFFVRSBIQVlBIERFVlVFTFRPIFVOIEFSUkFZIERFIFJFU1BVRVNUQVNcclxuICAgICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShyZXNwb25zZS5kYXRhKSAmJiByZXNwb25zZS5kYXRhLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgIC8vIFRPTUEgQ0FEQSBSRVNQVUVTVEEgUVVFIERJTyBFTCBCQVRDSCBSRVFVRVNUIFkgTEEgUFJPQ0VTQVxyXG4gICAgICAgICAgICAgICAgcmVzcG9uc2UuZGF0YS5mb3JFYWNoKChpbWFnZTogdW5rbm93bikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAvLyBWQUxJREEgUVVFIExBIFJFU1BVRVNUQSBTRUEgVU4gT0JKRVRPIFkgUVVFIENPTlRFTkdBIExBUyBQUk9QSUVEQURFUyBRVUUgVkFNT1MgQSBVU0FSXHJcbiAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgaW1hZ2UgPT09ICdvYmplY3QnICYmIGltYWdlICE9PSBudWxsICYmICdjb2RlJyBpbiBpbWFnZSAmJiAnYm9keScgaW4gaW1hZ2UgJiYgdHlwZW9mIGltYWdlPy5ib2R5ID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIFZBTElEQSBRVUUgTEEgUkVTUFVFU1RBIERFIEVTVEEgUkVRVUVTVCBFTiBQQVJUSUNVTEFSIFNFQSBPS1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChpbWFnZS5jb2RlID09PSAyMDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGltYWdlc0Zyb21GQjogdW5rbm93biA9IEpTT04ucGFyc2UoaW1hZ2UuYm9keSlcclxuICAgICAgICAgICAgICAgICAgICAgIC8vIFZBTElEQSBRVUUgRVNUQSBSRVFVRVNUIFRFTkdBIFVOQSBLRVkgSU1BR0VTIERFIFRJUE8gQVJSQVkgWSBVTkEgSUQgREUgVElQTyBTVFJJTkdcclxuICAgICAgICAgICAgICAgICAgICAgIGlmIChpbWFnZXNGcm9tRkIgIT09IG51bGwgJiYgdHlwZW9mIGltYWdlc0Zyb21GQiA9PT0gJ29iamVjdCcgJiYgJ2ltYWdlcycgaW4gaW1hZ2VzRnJvbUZCICYmICdpZCcgaW4gaW1hZ2VzRnJvbUZCICYmIHR5cGVvZiBpbWFnZXNGcm9tRkIuaWQgPT09ICdzdHJpbmcnICYmIEFycmF5LmlzQXJyYXkoaW1hZ2VzRnJvbUZCLmltYWdlcykpIHtcclxuICAgICAgICAgICAgICAgICAgICAgIC8vICBjb25zb2xlLmxvZyh7IGltYWdlc0Zyb21GQjogaW1hZ2VzRnJvbUZCLmltYWdlcyB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgZm91bmQ3MjA6IGJvb2xlYW4gPSBmYWxzZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgYWNjdTogbnVtYmVyID0gMFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgaW5kZXhBY2M6IG51bWJlciA9IDBcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gUkVDT1JSRSBMQVMgSU1BR0VORVMgREUgRVNBIFJFUVVFU1QgWSBUT01BIEVMIE5VTUVSTyBERSBJTkRJQ0UgREUgRVNFIEFSUkFZIFBBUkEgR0VORVJBUiBVTiBBQ1VNVUxBRE9SIFFVRSBOT1MgREVKRSBMVUVHTyBBQ0NFREVSIEEgTEEgSU1BR0VOIERFIE1BUyBSRVNPTFVDSU9OXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGltYWdlc0Zyb21GQi5pbWFnZXMuZm9yRWFjaCgocGhvdG86IHVua25vd24sIHN1YkluZGV4KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gVkFMSURBIExPUyBDQU1QT1MgSEVJR0hUIFdJRFRIIFkgU09VUkNFIFkgVkFMSURBIFNVUyBUSVBPU1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgcGhvdG8gPT09ICdvYmplY3QnICYmIHBob3RvICE9PSBudWxsICYmICdoZWlnaHQnIGluIHBob3RvICYmICd3aWR0aCcgaW4gcGhvdG8gJiYgdHlwZW9mIHBob3RvLmhlaWdodCA9PT0gJ251bWJlcicgJiYgdHlwZW9mIHBob3RvLndpZHRoID09PSAnbnVtYmVyJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gR0VORVJBIEVMIEFDVU1VTEFET1I0IERFIE1BWU9SIFJFU09MVUNJT04gWSBFTCBJTkRJQ0UgREVMIERFIE1BWU9SIFJFU09MVUNJT05cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwaG90by5oZWlnaHQgKiBwaG90by53aWR0aCA+PSBhY2N1KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFjY3UgPSBwaG90by5oZWlnaHQgKiBwaG90by53aWR0aFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmRleEFjYyA9IHN1YkluZGV4XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBTSSBMQSBSRVNPTFVDSU9OIEVTIERFIDcyMCo0ODAgTyBERSA0ODAqNzIwIFBVU0hFQSBFTCBPQkpFVE8gQUwgQVJSQVkgWSBDQU1CSUEgQSBUUlVFIEZPVU5ENzIwXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocGhvdG8uaGVpZ2h0ICogcGhvdG8ud2lkdGggPT09IDQ4MCAqIDcyMCAmJiAnc291cmNlJyBpbiBwaG90bykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbWFnZXNBcnJheS5wdXNoKHsgZmJpZDogaW1hZ2VzRnJvbUZCLmlkIGFzIHN0cmluZywgdXJsOiBwaG90by5zb3VyY2UgYXMgc3RyaW5nIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvdW5kNzIwID0gdHJ1ZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gRU4gRUwgQ0FTTyBERSBRVUUgRUwgQVJSQVkgTk8gQ1VFTlRFIENPTiBMQSBSRVNPTFVDSU9OIEJVU0NBREEgUFVTSEVBIExBIERFIE1BWU9SIFJFU09MVUNJT05cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFmb3VuZDcyMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGltYWdlc0FycmF5LnB1c2goeyBmYmlkOiBpbWFnZXNGcm9tRkIuaWQsIHVybDogaW1hZ2VzRnJvbUZCLmltYWdlc1tpbmRleEFjY10uc291cmNlIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgIGxvZ2dlci5kZWJ1Zyh7IGZ1bmN0aW9uOiAnZmFjZWJvb2tTZXJ2aWNlLmdldExpbmtGcm9tSWQnLCBpbWFnZXNBcnJheSB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgLy8gaGFjZSBlbCByZXR1cm4gZGUgdW4gcmVzcG9uc2UgT2JqZWN0IGNvbiB1biBpbWFnZXNBcnJheSBUeXBlXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHRocm93IG5ldyBFcnJvcihyZXNwb25zZS5kYXRhKVxyXG4gICAgICAgICAgfSBlbHNlIHRocm93IG5ldyBFcnJvcignTXVzdCBwcm92aWRlIGEgZmFjZWJvb2sgVG9rZW4nKVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoaW1hZ2VzQXJyYXkubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgcmV0dXJuIG5ldyBSZXNwb25zZU9iamVjdChudWxsLCB0cnVlLCBpbWFnZXNBcnJheSlcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgbG9nZ2VyLmVycm9yKHsgaW1hZ2VzQXJyYXkgfSlcclxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignRXJyb3IgY3JlYXRpbmcgbGluayBmcm9tIGlkIGFycmF5JylcclxuICAgICAgICB9XHJcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgbG9nZ2VyLmVycm9yKHsgZnVuY3Rpb246ICdmYWNlYm9va1NlcnZpY2UuZ2V0TGlua0Zyb21JZCcsIGVycm9yIH0pXHJcbiAgICAgICAgcmV0dXJuIG5ldyBSZXNwb25zZU9iamVjdChlcnJvciwgZmFsc2UsIG51bGwpXHJcbiAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgcHVibGljIGZhY2Vib29rRmVlZCA9IGFzeW5jIChkYXRhOiBJRmFjZWJvb2tEYXRhLCBwaWN0dXJlczogQXJyYXk8eyB1cmw6IHN0cmluZywgZmJpZDogc3RyaW5nIH0+LCBpZDogc3RyaW5nKSA9PiB7XHJcbiAgICAgIGxldCByZXNwb25zZVxyXG4gICAgICB0cnkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGRhdGEsIHBpY3R1cmVzKVxyXG4gICAgICAgIGNvbnN0IHsgdGl0bGUsIGhlYWRpbmcgfSA9IGRhdGFcclxuICAgICAgICBjb25zdCBtZXNzYWdlOiBzdHJpbmcgPVxyXG4gICAgICAgICAgYCR7dGl0bGV9XFxuJHtoZWFkaW5nfVxcblxcblBhcmEgbGVlciBtYXMgY2xpY2sgZW4gZWwgbGluayAgJHtwcm9jZXNzLmVudi5ORVdTUEFQRVJfVVJMfS8ke2lkfWBcclxuICAgICAgICBjb25zdCBwaWN0c0FycmF5ID0gcGljdHVyZXMubWFwKChwaWN0dXJlKSA9PiB7XHJcbiAgICAgICAgICByZXR1cm4gcGljdHVyZS5mYmlkIC8vIHBpY3R1cmUudXJsLnNwbGl0KCdmYmlkPScpWzFdLnNwbGl0KCcmJylbMF1cclxuICAgICAgICB9KVxyXG4gICAgICAgIGxldCBkYXRhUmVxdWVzdFxyXG4gICAgICAgIGlmIChwcm9jZXNzLmVudi5ORVdTUEFQRVJfVVJMICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgIGRhdGFSZXF1ZXN0ID0ge1xyXG4gICAgICAgICAgICBtZXNzYWdlLFxyXG4gICAgICAgICAgICBhdHRhY2hlZF9tZWRpYTogcGljdHNBcnJheS5tYXAoaWQgPT4gKHsgbWVkaWFfZmJpZDogaWQgfSkpLFxyXG4gICAgICAgICAgICBhY2Nlc3NfdG9rZW46IHByb2Nlc3MuZW52LkZCX1BBR0VfVE9LRU5cclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc29sZS5sb2coZGF0YVJlcXVlc3QsICdEYXRhUmVxdWVzdCBWYXInKVxyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICByZXNwb25zZSA9IGF3YWl0IGF4aW9zLnBvc3QoYCBodHRwczovL2dyYXBoLmZhY2Vib29rLmNvbS8ke3Byb2Nlc3MuZW52LkZBQ0VCT09LX1BBR0V9L2ZlZWRgLCBkYXRhUmVxdWVzdClcclxuICAgICAgICAgIHJldHVybiBuZXcgUmVzcG9uc2VPYmplY3QobnVsbCwgdHJ1ZSwgcmVzcG9uc2UpXHJcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHsgY29uc29sZS5sb2coZXJyb3IpIH1cclxuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICBsb2dnZXIuZXJyb3IoeyBmdW5jdGlvbjogJ0ZhY2Vib29rU2VydmljZS5mYWNlYm9va0ZlZWQnLCBlcnJvciB9KVxyXG4gICAgICAgIHJldHVybiBuZXcgUmVzcG9uc2VPYmplY3QoZXJyb3IsIGZhbHNlLCBudWxsKVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgcHVibGljIHVwZGF0ZUZhY2Vib29rUG9zdCA9IGFzeW5jIChpZDogc3RyaW5nLCBkYXRhOiB7IHRpdGxlOiBzdHJpbmcsIGhlYWRpbmc6IHN0cmluZywgY2xhc3NpZmljYXRpb246IHR5cGVvZiBDbGFzc2lmaWNhdGlvbkFycmF5W251bWJlcl0sIG5ld3NwYXBlcklEOiBzdHJpbmcsIGltYWdlczogc3RyaW5nW10gfSkgPT4ge1xyXG4gICAgICAvKlxyXG4gICAgICBIYXkgcXVlIGVsZWdpci5cclxuICAgICAgb3BjaW9uIDEgZWwgcG9zdCBzZSBhY3R1YWxpemEgYm9ycmFuZG8gZWwgcHJldmlvIHkgY3JlYW5kbyB1bm8gbnVldm9cclxuICAgICAgb3BjaW9uIDIgc29sbyBzZSBhY3R1YWxpemEgZWwgdGV4dG8gZGVsIHBvc3Qgc2luIGFjdHVhbGl6YXIgbGFzIGltYWdlbmVzXHJcbiAgICAgICovXHJcbiAgICAgIGNvbnN0IG1lc3NhZ2UgPSBgJHtkYXRhLnRpdGxlfVxcbiR7ZGF0YS5oZWFkaW5nfVxcblxcblBhcmEgbGVlciBtYXMgY2xpY2sgZW4gZWwgbGluayAgJHtwcm9jZXNzLmVudi5ORVdTUEFQRVJfVVJMfS8ke2RhdGEubmV3c3BhcGVySUR9YFxyXG4gICAgICBjb25zdCBkYXRhUmVxdWVzdCA9IHtcclxuICAgICAgICBtZXNzYWdlLFxyXG4gICAgICAgIGFjY2Vzc190b2tlbjogcHJvY2Vzcy5lbnYuRkJfUEFHRV9UT0tFTlxyXG5cclxuICAgICAgfVxyXG4gICAgICB0cnkge1xyXG4gICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgYXhpb3MucG9zdChgIGh0dHBzOi8vZ3JhcGguZmFjZWJvb2suY29tLyR7aWR9L2AsIGRhdGFSZXF1ZXN0KVxyXG4gICAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlLmRhdGEsICcqKioqKioqKioqKioqKioqKioqKioqKioqKioqKicpXHJcbiAgICAgICAgcmV0dXJuIG5ldyBSZXNwb25zZU9iamVjdChudWxsLCB0cnVlLCByZXNwb25zZS5kYXRhKVxyXG4gICAgICB9IGNhdGNoIChlcnJvcjogYW55KSB7IHJldHVybiBuZXcgUmVzcG9uc2VPYmplY3QoZXJyb3I/LnJlc3BvbnNlPy5kYXRhLCBmYWxzZSwgbnVsbCkgfVxyXG4gICAgfSxcclxuICAgIHB1YmxpYyBkZWxldGVGYWNlYm9va1Bvc3QgPSBhc3luYyAoZmJpZDogc3RyaW5nKTogUHJvbWlzZTxhbnk+ID0+IHtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGF4aW9zLmRlbGV0ZShgaHR0cHM6Ly9ncmFwaC5mYWNlYm9vay5jb20vdjE2LjAvJHtmYmlkfT9hY2Nlc3NfdG9rZW49JHtwcm9jZXNzLmVudi5GQl9QQUdFX1RPS0VOfWApXHJcbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlXHJcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgbG9nZ2VyLmVycm9yKHsgZnVuY3Rpb246ICdmYWNlYm9va1NlcnZpY2UuZGVsZXRlRmFjZWJvb2tQb3N0JywgZXJyb3IgfSlcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIHB1YmxpYyBhc3NlcnRWYWxpZFRva2VuID0gYXN5bmMgKHRva2VuOiBzdHJpbmcpOiBQcm9taXNlPHN0cmluZyB8IG51bGw+ID0+IHtcclxuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCAoYXdhaXQgZmV0Y2goYGh0dHBzOi8vZ3JhcGguZmFjZWJvb2suY29tL29hdXRoL2FjY2Vzc190b2tlbj9jbGllbnRfaWQ9JHtwcm9jZXNzLmVudi5GQUNFQk9PS19BUFBfSUR9JmNsaWVudF9zZWNyZXQ9JHtwcm9jZXNzLmVudi5GQUNFQk9PS19BUFBfU0VDUkVUfSZncmFudF90eXBlPWNsaWVudF9jcmVkZW50aWFsc2ApKS5qc29uKClcclxuICAgICAgbGV0IG5ld1Rva2VuOiBzdHJpbmcgPSAnJ1xyXG4gICAgICBpZiAoJ2FjY2Vzc190b2tlbicgaW4gcmVzcG9uc2UpIG5ld1Rva2VuID0gcmVzcG9uc2UuYWNjZXNzX3Rva2VuXHJcbiAgICAgIGlmIChuZXdUb2tlbiAhPT0gJycpIHtcclxuICAgICAgICBjb25zdCB2YWxpZGF0aW9uUmVzcG9uc2UgPSBhd2FpdCAoYXdhaXQgZmV0Y2goYGh0dHBzOi8vZ3JhcGguZmFjZWJvb2suY29tL3YzLjIvZGVidWdfdG9rZW4/aW5wdXRfdG9rZW49JHt0b2tlbn0mYWNjZXNzX3Rva2VuPSR7bmV3VG9rZW59YCkpLmpzb24oKVxyXG4gICAgICAgIGNvbnNvbGUubG9nKHZhbGlkYXRpb25SZXNwb25zZS5kYXRhLmlzX3ZhbGlkKVxyXG4gICAgICAgIGlmICgnZGF0YScgaW4gdmFsaWRhdGlvblJlc3BvbnNlICYmICdpc192YWxpZCcgaW4gdmFsaWRhdGlvblJlc3BvbnNlLmRhdGEgJiYgdmFsaWRhdGlvblJlc3BvbnNlLmRhdGEuaXNfdmFsaWQgPT09IHRydWUpIHJldHVybiB0b2tlblxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgY29uc3QgZmluYWxUb2tlbiA9IGF3YWl0IHRoaXMuZ2V0TG9uZ2xpdmVBY2Nlc3NUb2tlbihuZXdUb2tlbiwgdXNlckxvZ2dlZC5mYmlkKVxyXG4gICAgICAgICAgcmV0dXJuIGZpbmFsVG9rZW4gIT09IHVuZGVmaW5lZCA/IGZpbmFsVG9rZW4gOiBudWxsXHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2UgcmV0dXJuIG51bGxcclxuICAgIH0sXHJcbiAgICBwdWJsaWMgZ2V0TG9uZ2xpdmVBY2Nlc3NUb2tlbiA9IGFzeW5jIChhY2Nlc3NUb2tlbjogc3RyaW5nLCB1c2VySWQ6IHN0cmluZykgPT4ge1xyXG4gICAgICBsZXQgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgaHR0cHM6Ly9ncmFwaC5mYWNlYm9vay5jb20vb2F1dGgvYWNjZXNzX3Rva2VuP2dyYW50X3R5cGU9ZmJfZXhjaGFuZ2VfdG9rZW4mY2xpZW50X2lkPSR7cHJvY2Vzcy5lbnYuRkFDRUJPT0tfQVBQX0lEfSZjbGllbnRfc2VjcmV0PSR7cHJvY2Vzcy5lbnYuRkFDRUJPT0tfQVBQX1NFQ1JFVH0mZmJfZXhjaGFuZ2VfdG9rZW49JHthY2Nlc3NUb2tlbn1gKVxyXG4gICAgICBjb25zdCBsb25nVXNlclRva2VuID0gKGF3YWl0IHJlc3BvbnNlLmpzb24oKSkuYWNjZXNzX3Rva2VuIGFzIHN0cmluZ1xyXG4gICAgICByZXNwb25zZSA9IGF3YWl0IGZldGNoKGBodHRwczovL2dyYXBoLmZhY2Vib29rLmNvbS8ke3VzZXJJZH0vYWNjb3VudHM/XHJcbmFjY2Vzc190b2tlbj0ke2xvbmdVc2VyVG9rZW59YCkgLy8gY29uc29sZS5sb2coYXdhaXQgcmVzcG9uc2UuanNvbigpKVxyXG4gICAgICBjb25zdCBzdHJlYW1SZXNwb25zZSA9IChhd2FpdCByZXNwb25zZS5qc29uKCkpXHJcbiAgICAgIGxldCBkYXRhOiBzdHJpbmcgPSAnJ1xyXG4gICAgICBpZiAoc3RyZWFtUmVzcG9uc2UgIT09IG51bGwgJiYgJ2RhdGEnIGluIHN0cmVhbVJlc3BvbnNlICYmIEFycmF5LmlzQXJyYXkoc3RyZWFtUmVzcG9uc2U/LmRhdGEpKSB7XHJcbiAgICAgICAgc3RyZWFtUmVzcG9uc2UuZGF0YS5mb3JFYWNoKChwYWdlOiBhbnkpID0+IHtcclxuICAgICAgICAgLy8gY29uc29sZS5sb2cocGFnZSwgcHJvY2Vzcy5lbnYuRkFDRUJPT0tfQVBQX0lEKVxyXG4gICAgICAgICAgaWYgKHBhZ2UuaWQgPT09IHByb2Nlc3MuZW52LkZBQ0VCT09LX1BBR0UpIGRhdGEgPSBwYWdlLmFjY2Vzc190b2tlblxyXG4gICAgICAgIH0pXHJcbiAgICAgIH1cclxuICAgICAgaWYgKGRhdGEgIT09ICcnKSByZXR1cm4gZGF0YVxyXG4gICAgfVxyXG5cclxuICApIHsgfVxyXG59XHJcbiJdLCJuYW1lcyI6WyJGYWNlYm9va1NlcnZpY2UiLCJkb3RlbnYiLCJjb25maWciLCJjb25zdHJ1Y3RvciIsInBhZ2VJRCIsInByb2Nlc3MiLCJlbnYiLCJGQUNFQk9PS19QQUdFIiwicGFnZVRva2VuIiwiRkJfUEFHRV9UT0tFTiIsInBvc3RQaG90byIsImRhdGEiLCJyZXNwb25zZSIsInVuZGVmaW5lZCIsIkVycm9yIiwiYXhpb3MiLCJwb3N0Iiwic291cmNlIiwiZnMiLCJjcmVhdGVSZWFkU3RyZWFtIiwicGF0aCIsImhlYWRlcnMiLCJ0aGVuIiwidW5saW5rU3luYyIsImNhdGNoIiwiZXJyb3IiLCJsb2dnZXIiLCJmdW5jdGlvbiIsImV4aXN0c1N5bmMiLCJSZXNwb25zZU9iamVjdCIsImdldExpbmtGcm9tSWQiLCJpZEFycmF5IiwiaW1hZ2VzQXJyYXkiLCJBcnJheSIsImlzQXJyYXkiLCJiYXRjaCIsImZvckVhY2giLCJpZCIsInB1c2giLCJtZXRob2QiLCJyZWxhdGl2ZV91cmwiLCJwYXJhbXMiLCJhY2Nlc3NfdG9rZW4iLCJzdGF0dXMiLCJsZW5ndGgiLCJpbWFnZSIsImJvZHkiLCJjb2RlIiwiaW1hZ2VzRnJvbUZCIiwiSlNPTiIsInBhcnNlIiwiaW1hZ2VzIiwiZm91bmQ3MjAiLCJhY2N1IiwiaW5kZXhBY2MiLCJwaG90byIsInN1YkluZGV4IiwiaGVpZ2h0Iiwid2lkdGgiLCJmYmlkIiwidXJsIiwiZmFjZWJvb2tGZWVkIiwicGljdHVyZXMiLCJjb25zb2xlIiwibG9nIiwidGl0bGUiLCJoZWFkaW5nIiwibWVzc2FnZSIsIk5FV1NQQVBFUl9VUkwiLCJwaWN0c0FycmF5IiwibWFwIiwicGljdHVyZSIsImRhdGFSZXF1ZXN0IiwiYXR0YWNoZWRfbWVkaWEiLCJtZWRpYV9mYmlkIiwidXBkYXRlRmFjZWJvb2tQb3N0IiwibmV3c3BhcGVySUQiLCJkZWxldGVGYWNlYm9va1Bvc3QiLCJkZWxldGUiLCJhc3NlcnRWYWxpZFRva2VuIiwidG9rZW4iLCJmZXRjaCIsIkZBQ0VCT09LX0FQUF9JRCIsIkZBQ0VCT09LX0FQUF9TRUNSRVQiLCJqc29uIiwibmV3VG9rZW4iLCJ2YWxpZGF0aW9uUmVzcG9uc2UiLCJpc192YWxpZCIsImZpbmFsVG9rZW4iLCJnZXRMb25nbGl2ZUFjY2Vzc1Rva2VuIiwidXNlckxvZ2dlZCIsImFjY2Vzc1Rva2VuIiwidXNlcklkIiwibG9uZ1VzZXJUb2tlbiIsInN0cmVhbVJlc3BvbnNlIiwicGFnZSJdLCJyYW5nZU1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7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
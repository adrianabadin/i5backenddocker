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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FacebookService = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const axios_1 = __importDefault(require("axios"));
const fs_1 = __importDefault(require("fs"));
const Entities_1 = require("../Entities");
const logger_service_1 = require("./logger.service");
const app_1 = require("../app");
dotenv_1.default.config();
class FacebookService {
    constructor(pageID = (process.env.FACEBOOK_PAGE != null) ? process.env.FACEBOOK_PAGE : 'me', pageToken = (process.env.FB_PAGE_TOKEN !== null) ? process.env.FB_PAGE_TOKEN : '', postPhoto = (data) => __awaiter(this, void 0, void 0, function* () {
        let response;
        if (this.pageToken === undefined || this.pageID === undefined)
            throw new Error('Must Provide Fb Credentials on enviromen Variables');
        try {
            response = yield axios_1.default.post(`https://graph.facebook.com/${this.pageID}/photos?published=false&access_token=${this.pageToken}`, { source: fs_1.default.createReadStream(data.path) }, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then(response => {
                fs_1.default.unlinkSync(data.path);
                return response.data;
            }).catch(error => {
                logger_service_1.logger.error({ function: 'FacebookService.postPhoto.axiosPostRequest', error });
                if (fs_1.default.existsSync(data.path)) {
                    fs_1.default.unlinkSync(data.path);
                }
                return new Entities_1.ResponseObject(error, false, null);
            });
        }
        catch (error) {
            logger_service_1.logger.error({ function: 'FacebookService.postPhoto.axiosPostRequest', error });
            if (fs_1.default.existsSync(data.path)) {
                fs_1.default.unlinkSync(data.path);
            }
            return new Entities_1.ResponseObject(error, false, null);
        }
        // console.log(response)
        return new Entities_1.ResponseObject(null, true, response);
    }), getLinkFromId = (idArray) => __awaiter(this, void 0, void 0, function* () {
        try {
            const imagesArray = [];
            //    console.log({ idArray })
            if (idArray !== undefined && Array.isArray(idArray)) {
                // https://graph.facebook.com/391159203017232?fields=link&access_token=EAAC6VEEU92EBAMdz1ZAcWHS199UPlJqArvcZCkVVOT5vF9sZBYzMixo4IoNTnguXZB2BCb3Ui3jhGUGIIKGEtIx8ZC3iiMlpuXUNZBWHaDEJjif0M04jLyPhBCISHvnOY9oYIuj1Qrz5ZBlH63pMN3G3kB0AzioZAZCKd3HyA1Swl0mEO9Dg8k3WgqG5WrqLZANM9uEkcrn7IFjAZDZD
                if (this.pageToken !== '') {
                    // TRABAJAR EN ESTE REQUEST PARA QUE DEVUELVA SOLO LA IMAGEN DE MAYOR RESOLUCION YAMODIFIQUE LINK POR IMAGES QUE DEVUELVE EL LINK PUBLICO
                    // DE LA IMAGEN DE FACEBOOK
                    const batch = [];
                    idArray.forEach((id) => {
                        if (id !== undefined) {
                            batch.push({
                                method: 'GET',
                                relative_url: `${id.id}?fields=images`
                            });
                        }
                    });
                    const response = yield axios_1.default.post('https://graph.facebook.com/', { batch }, { headers: { 'Content-Type': 'application/json' }, params: { access_token: this.pageToken } });
                    // logger.debug({ response, title: 'facebookFeed.getLinkfromid' })
                    // VALIDA QUE EL RESPONSE GENERAL SEA OK
                    if (response.status === 200) {
                        // VALIDA QUE HAYA DEVUELTO UN ARRAY DE RESPUESTAS
                        if (Array.isArray(response.data) && response.data.length > 0) {
                            // TOMA CADA RESPUESTA QUE DIO EL BATCH REQUEST Y LA PROCESA
                            response.data.forEach((image) => {
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
                                            imagesFromFB.images.forEach((photo, subIndex) => {
                                                // VALIDA LOS CAMPOS HEIGHT WIDTH Y SOURCE Y VALIDA SUS TIPOS
                                                if (typeof photo === 'object' && photo !== null && 'height' in photo && 'width' in photo && typeof photo.height === 'number' && typeof photo.width === 'number') {
                                                    // GENERA EL ACUMULADOR4 DE MAYOR RESOLUCION Y EL INDICE DEL DE MAYOR RESOLUCION
                                                    if (photo.height * photo.width >= accu) {
                                                        accu = photo.height * photo.width;
                                                        indexAcc = subIndex;
                                                    }
                                                    // SI LA RESOLUCION ES DE 720*480 O DE 480*720 PUSHEA EL OBJETO AL ARRAY Y CAMBIA A TRUE FOUND720
                                                    if (photo.height * photo.width === 480 * 720 && 'source' in photo) {
                                                        imagesArray.push({ fbid: imagesFromFB.id, url: photo.source });
                                                        found720 = true;
                                                    }
                                                }
                                            });
                                            // EN EL CASO DE QUE EL ARRAY NO CUENTE CON LA RESOLUCION BUSCADA PUSHEA LA DE MAYOR RESOLUCION
                                            if (!found720) {
                                                imagesArray.push({ fbid: imagesFromFB.id, url: imagesFromFB.images[indexAcc].source });
                                            }
                                        }
                                        //                logger.debug({ function: 'facebookService.getLinkFromId', imagesArray })
                                        // hace el return de un response Object con un imagesArray Type
                                    }
                                }
                            });
                        }
                    }
                    else
                        throw new Error(response.data);
                }
                else
                    throw new Error('Must provide a facebook Token');
            }
            if (imagesArray.length > 0) {
                return new Entities_1.ResponseObject(null, true, imagesArray);
            }
            else {
                logger_service_1.logger.error({ imagesArray });
                throw new Error('Error creating link from id array');
            }
        }
        catch (error) {
            logger_service_1.logger.error({ function: 'facebookService.getLinkFromId', error });
            return new Entities_1.ResponseObject(error, false, null);
        }
    }), facebookFeed = (data, pictures, id) => __awaiter(this, void 0, void 0, function* () {
        let response;
        try {
            console.log(data, pictures);
            const { title, heading } = data;
            const message = `${title}\n${heading}\n\nPara leer mas click en el link  ${process.env.NEWSPAPER_URL}/${id}`;
            const pictsArray = pictures.map((picture) => {
                return picture.fbid; // picture.url.split('fbid=')[1].split('&')[0]
            });
            let dataRequest;
            if (process.env.NEWSPAPER_URL !== undefined) {
                dataRequest = {
                    message,
                    attached_media: pictsArray.map(id => ({ media_fbid: id })),
                    access_token: process.env.FB_PAGE_TOKEN
                };
            }
            console.log(dataRequest, 'DataRequest Var');
            try {
                response = yield axios_1.default.post(` https://graph.facebook.com/${process.env.FACEBOOK_PAGE}/feed`, dataRequest);
                return new Entities_1.ResponseObject(null, true, response);
            }
            catch (error) {
                console.log(error);
            }
        }
        catch (error) {
            logger_service_1.logger.error({ function: 'FacebookService.facebookFeed', error });
            return new Entities_1.ResponseObject(error, false, null);
        }
    }), updateFacebookPost = (id, data) => __awaiter(this, void 0, void 0, function* () {
        var _a;
        /*
        Hay que elegir.
        opcion 1 el post se actualiza borrando el previo y creando uno nuevo
        opcion 2 solo se actualiza el texto del post sin actualizar las imagenes
        */
        const message = `${data.title}\n${data.heading}\n\nPara leer mas click en el link  ${process.env.NEWSPAPER_URL}/${data.newspaperID}`;
        const dataRequest = {
            message,
            access_token: process.env.FB_PAGE_TOKEN
        };
        try {
            const response = yield axios_1.default.post(` https://graph.facebook.com/${id}/`, dataRequest);
            console.log(response.data, '*****************************');
            return new Entities_1.ResponseObject(null, true, response.data);
        }
        catch (error) {
            return new Entities_1.ResponseObject((_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.data, false, null);
        }
    }), deleteFacebookPost = (fbid) => __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.delete(`https://graph.facebook.com/v16.0/${fbid}?access_token=${process.env.FB_PAGE_TOKEN}`);
            return response;
        }
        catch (error) {
            logger_service_1.logger.error({ function: 'facebookService.deleteFacebookPost', error });
        }
    }), assertValidToken = (token) => __awaiter(this, void 0, void 0, function* () {
        const response = yield (yield fetch(`https://graph.facebook.com/oauth/access_token?client_id=${process.env.FACEBOOK_APP_ID}&client_secret=${process.env.FACEBOOK_APP_SECRET}&grant_type=client_credentials`)).json();
        let newToken = '';
        if ('access_token' in response)
            newToken = response.access_token;
        if (newToken !== '') {
            const validationResponse = yield (yield fetch(`https://graph.facebook.com/v3.2/debug_token?input_token=${token}&access_token=${newToken}`)).json();
            console.log(validationResponse.data.is_valid);
            if ('data' in validationResponse && 'is_valid' in validationResponse.data && validationResponse.data.is_valid === true)
                return token;
            else {
                const finalToken = yield this.getLongliveAccessToken(newToken, app_1.userLogged.fbid);
                return finalToken !== undefined ? finalToken : null;
            }
        }
        else
            return null;
    }), getLongliveAccessToken = (accessToken, userId) => __awaiter(this, void 0, void 0, function* () {
        let response = yield fetch(`https://graph.facebook.com/oauth/access_token?grant_type=fb_exchange_token&client_id=${process.env.FACEBOOK_APP_ID}&client_secret=${process.env.FACEBOOK_APP_SECRET}&fb_exchange_token=${accessToken}`);
        const longUserToken = (yield response.json()).access_token;
        response = yield fetch(`https://graph.facebook.com/${userId}/accounts?
access_token=${longUserToken}`); // console.log(await response.json())
        const streamResponse = (yield response.json());
        let data = '';
        if (streamResponse !== null && 'data' in streamResponse && Array.isArray(streamResponse === null || streamResponse === void 0 ? void 0 : streamResponse.data)) {
            streamResponse.data.forEach((page) => {
                // console.log(page, process.env.FACEBOOK_APP_ID)
                if (page.id === process.env.FACEBOOK_PAGE)
                    data = page.access_token;
            });
        }
        if (data !== '')
            return data;
    })) {
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
exports.FacebookService = FacebookService;

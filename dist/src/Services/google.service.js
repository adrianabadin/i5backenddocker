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
exports.driveMan = exports.GoogleService = exports.url = exports.oauthClient = void 0;
const googleapis_1 = require("googleapis");
const database_service_1 = require("./database.service");
const logger_service_1 = require("./logger.service");
const fs_1 = __importDefault(require("fs"));
const Entities_1 = require("../Entities");
exports.oauthClient = new googleapis_1.google.auth.OAuth2(process.env.CLIENTID_BUCKET, process.env.CLIENTSECRET_BUCKET, process.env.CALLBACK_BUCKET);
const scopes = ['https://www.googleapis.com/auth/drive', 'https://www.googleapis.com/auth/youtube', 'https://mail.google.com/', 'https://www.googleapis.com/auth/youtubepartner'];
exports.url = exports.oauthClient.generateAuthUrl({ access_type: 'offline', scope: scopes });
class GoogleService {
    constructor(oAuthClient = exports.oauthClient, prisma = database_service_1.prismaClient.prisma) {
        this.oAuthClient = oAuthClient;
        this.prisma = prisma;
        this.fileUpload = this.fileUpload.bind(this);
        this.folderExists = this.folderExists.bind(this);
        this.initiateAuth = this.initiateAuth.bind(this);
        this.isRTValid = this.isRTValid.bind(this);
        this.fileRemove = this.fileRemove.bind(this);
        this.uploadVideo = this.uploadVideo.bind(this);
    }
    isRTValid(tokenStr) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.oAuthClient.setCredentials({ refresh_token: tokenStr });
                const { token } = yield this.oAuthClient.getAccessToken();
                if (token === undefined)
                    return false;
                else
                    return true;
            }
            catch (error) {
                logger_service_1.logger.error({ function: 'GoogleService.isRTValid', error });
                return false;
            }
        });
    }
    initiateAuth() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (GoogleService.rt !== undefined && GoogleService.rt !== null) {
                    const response = yield this.isRTValid(GoogleService.rt);
                    if (response)
                        return true;
                    else
                        throw new Entities_1.TokenError();
                }
                else {
                    const result = yield this.prisma.dataConfig.findUniqueOrThrow({ where: { id: 1 }, select: { refreshToken: true } });
                    GoogleService.rt = result.refreshToken;
                    if (result.refreshToken !== null) {
                        const response = yield this.isRTValid(result.refreshToken);
                        if (response)
                            return true;
                        else
                            throw new Entities_1.TokenError();
                    }
                    else
                        throw new Entities_1.NeverAuthError(); // aca debe ir un error que signifique nunca fue autenticado
                }
            }
            catch (error) {
                logger_service_1.logger.error({ function: 'GoogleService', error });
                if (error instanceof Entities_1.TokenError || error instanceof Entities_1.NeverAuthError)
                    return error;
                else
                    return new Entities_1.UnknownGoogleError(error);
            }
        });
    }
    folderExists(folder) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const initiateResponse = yield this.initiateAuth();
                if (!(initiateResponse !== undefined && typeof initiateResponse === 'object' && 'code' in initiateResponse)) {
                    const drive = googleapis_1.google.drive({ version: 'v3', auth: exports.oauthClient });
                    const { data, status } = yield drive.files.list({
                        q: `mimeType='application/vnd.google-apps.folder' and name='${folder}'`,
                        fields: 'files(id, name)'
                    });
                    if (status > 400)
                        throw new Entities_1.FolderCreateError();
                    if (data.files !== undefined && ((_a = data.files) === null || _a === void 0 ? void 0 : _a.length) > 0 && data.files[0].id !== undefined && data.files[0].id !== null) {
                        return data.files[0].id;
                    }
                    else {
                        const { data: dataCreated, status: statusCreated } = yield drive.files.create({
                            requestBody: {
                                mimeType: 'application/vnd.google-apps.folder',
                                name: folder
                            }
                        });
                        if (statusCreated > 400)
                            throw new Error('Server error: ');
                        if ((dataCreated === null || dataCreated === void 0 ? void 0 : dataCreated.id) != null) {
                            return dataCreated.id;
                        }
                        else
                            throw new Entities_1.FolderCreateError();
                    }
                }
                else
                    throw initiateResponse;
            }
            catch (error) {
                logger_service_1.logger.error({ function: 'GoogleService.folderExists', error });
                if (error instanceof Entities_1.TokenError || error instanceof Entities_1.NeverAuthError || error instanceof Entities_1.FolderCreateError) {
                    return error;
                }
                else {
                    return new Entities_1.UnknownGoogleError(error);
                }
            }
        });
    }
    fileUpload(folder, file) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (GoogleService.rt === undefined) {
                    const initiateResponse = yield this.initiateAuth();
                    if (initiateResponse instanceof Entities_1.TokenError || initiateResponse instanceof Entities_1.NeverAuthError) {
                        throw initiateResponse;
                    }
                }
                if (GoogleService.rt !== undefined) {
                    const drive = googleapis_1.google.drive({ version: 'v3', auth: exports.oauthClient });
                    const id = yield this.folderExists(folder);
                    if (typeof id !== 'string' && id instanceof Error)
                        throw id;
                    const splitedPath = file.split('/');
                    if ((id) !== undefined && id !== null) {
                        const response = yield drive.files.create({
                            requestBody: {
                                parents: [id],
                                name: splitedPath[splitedPath.length - 1]
                            },
                            media: {
                                body: fs_1.default.createReadStream(file)
                            }
                        });
                        let permissionsResponse;
                        if ((response === null || response === void 0 ? void 0 : response.data) !== null) {
                            permissionsResponse = yield drive.permissions.create({ fileId: response.data.id, requestBody: { role: 'writer', type: 'anyone' } });
                            if (permissionsResponse !== undefined) {
                                yield fs_1.default.promises.unlink(file);
                            }
                            else {
                                throw new Entities_1.PermissionsCreateError();
                            }
                        }
                        else
                            throw new Entities_1.FileCreateError();
                        if (response.data.id !== undefined && ((_a = response.data) === null || _a === void 0 ? void 0 : _a.id) !== null) {
                            return (_b = response.data) === null || _b === void 0 ? void 0 : _b.id;
                        }
                        else
                            throw new Entities_1.FileCreateError();
                    }
                    else
                        throw new Entities_1.FolderCreateError();
                }
                throw new Entities_1.NeverAuthError();
            }
            catch (error) {
                logger_service_1.logger.error({ function: 'GoogleService.fileUpload', error });
                if (error instanceof Entities_1.TokenError ||
                    error instanceof Entities_1.NeverAuthError ||
                    error instanceof Entities_1.FolderCreateError ||
                    error instanceof Entities_1.FileCreateError ||
                    error instanceof Entities_1.PermissionsCreateError) {
                    return error;
                }
                else
                    return new Entities_1.UnknownGoogleError(error);
            }
        });
    }
    fileRemove(driveId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const initiateResponse = yield this.initiateAuth();
                if (initiateResponse instanceof Entities_1.GoogleError)
                    throw initiateResponse;
                const drive = googleapis_1.google.drive({ version: 'v3', auth: exports.oauthClient });
                const response = yield drive.files.delete({
                    fileId: driveId
                });
                if (response === undefined)
                    throw new Error('Error deleting drive: ' + driveId);
                return true;
            }
            catch (error) {
                logger_service_1.logger.error({ function: 'GoogleService.fileRemove', error });
                if (error instanceof Entities_1.TokenError || error instanceof Entities_1.NeverAuthError || error instanceof Entities_1.UnknownGoogleError)
                    return error;
                else
                    return error;
            }
        });
    }
    uploadVideo(path, title, description, channelId, tags) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const initiateResponse = yield this.initiateAuth();
                if (initiateResponse instanceof Entities_1.GoogleError)
                    throw initiateResponse;
                const youtube = googleapis_1.google.youtube({ version: 'v3', auth: exports.oauthClient });
                const video = yield youtube.videos.insert({
                    notifySubscribers: true,
                    requestBody: {
                        snippet: { title, description, tags, channelId, defaultAudioLanguage: 'es' },
                        status: { privacyStatus: 'public' }
                    },
                    part: ['snippet', 'status'],
                    media: {
                        body: fs_1.default.createReadStream(path)
                    }
                });
                if (video.data === null)
                    throw new Entities_1.VideoCreateError();
                if (video.data.id === undefined || video.data.id === null)
                    throw new Entities_1.VideoCreateError();
                return video.data.id;
            }
            catch (error) {
                if (typeof error === 'object' && error !== null && 'code' in error && error.code === 403) {
                    if ('errors' in error) {
                        if (Array.isArray(error.errors)) {
                            const quotas = error.errors.map((errorItem) => {
                                if (typeof errorItem === 'object' && errorItem !== null && 'reason' in errorItem) {
                                    if (errorItem.reason === 'quotaExceeded') {
                                        return 1;
                                    }
                                }
                                return 0;
                            }).reduce((prev, cur) => prev + cur);
                            if (quotas > 0) {
                                logger_service_1.logger.error({ function: 'GoogleService.uploadVideo', error: new Entities_1.QuotaExceededError(error) });
                                return new Entities_1.QuotaExceededError(error);
                            }
                        }
                    }
                }
                if (error instanceof Entities_1.TokenError || error instanceof Entities_1.NeverAuthError || error instanceof Entities_1.VideoCreateError || error instanceof Entities_1.QuotaExceededError) {
                    logger_service_1.logger.error({ function: 'GoogleService.uploadVideo', error });
                    return error;
                }
                else {
                    logger_service_1.logger.error({ function: 'GoogleService.uploadVideo', error: new Entities_1.UnknownGoogleError(error) });
                    return new Entities_1.UnknownGoogleError(error);
                }
            }
        });
    }
    videoRm(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const initiateResponse = yield this.initiateAuth();
                if (initiateResponse instanceof Entities_1.GoogleError)
                    throw initiateResponse;
                const youtube = googleapis_1.google.youtube({ version: 'v3', auth: exports.oauthClient });
                yield youtube.videos.delete({
                    id
                });
                return true;
            }
            catch (error) {
                if (error instanceof Entities_1.TokenError || error instanceof Entities_1.NeverAuthError || error instanceof Entities_1.UnknownGoogleError) {
                    logger_service_1.logger.error({ function: 'PostService.videoRm', error });
                    return error;
                }
                else
                    return new Entities_1.UnknownGoogleError(error);
            }
        });
    }
}
exports.GoogleService = GoogleService;
exports.driveMan = new GoogleService();

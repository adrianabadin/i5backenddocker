"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.AuthController = void 0;
const auth_service_1 = require("./auth.service");
const keypair_service_1 = require("../Services/keypair.service");
const dotenv_1 = __importDefault(require("dotenv"));
const app_1 = require("../app");
const jwt = __importStar(require("jsonwebtoken"));
const fs_1 = __importDefault(require("fs"));
const facebook_service_1 = require("../Services/facebook.service");
const google_service_1 = require("../Services/google.service");
const logger_service_1 = require("../Services/logger.service");
const database_service_1 = require("../Services/database.service");
dotenv_1.default.config();
const simetricKey = (process.env.SIMETRICKEY !== undefined) ? process.env.SIMETRICKEY : '';
class AuthController {
    constructor(service = new auth_service_1.AuthService(), cryptService = { encrypt: keypair_service_1.encrypt, decrypt: keypair_service_1.decrypt }, Guard = (req, res, next) => {
        let id;
        if (req.user !== undefined && 'id' in req.user) {
            id = req.user.id;
        }
        else
            return;
        if (id !== undefined && id !== null) {
            const jwt = this.service.tokenIssuance(id);
            res.clearCookie('jwt');
            res.cookie('jwt', jwt);
            next();
        }
    }, jwtRenewalToken = (req, res, next) => {
        if (req.isAuthenticated()) {
            console.log(req.cookies);
            if ('id' in req.user) {
                const token = this.service.tokenIssuance(req.user.id);
                res.clearCookie('jwt');
                res.cookie('jwt', token);
                next();
            }
        }
    }, sendAuthData = (req, res) => __awaiter(this, void 0, void 0, function* () {
        if (req.isAuthenticated()) {
            console.log(req.user);
            let refreshToken;
            try {
                if ('rol' in req.user && req.user.rol === 'ADMIN') {
                    refreshToken = (yield this.service.prisma.dataConfig.findUniqueOrThrow({ where: { id: 1 }, select: { refreshToken: true } })).refreshToken;
                }
                console.log(refreshToken);
                res.status(200).json(Object.assign(Object.assign({}, req.user), { refreshToken }));
            }
            catch (error) {
                logger_service_1.logger.error({ function: 'AuthController.sendAuthData', error });
            }
        }
        else
            res.status(403).send('unauthorized');
    }), issueJWT = (req, res, next) => {
        console.log('issuing');
        if (req.isAuthenticated()) {
            console.log('authenticated');
            if ('id' in (req === null || req === void 0 ? void 0 : req.user)) {
                const jwt = this.service.tokenIssuance(req.user.id);
                const encriptedToken = this.cryptService.encrypt(jwt, simetricKey);
                res.status(200).send(encriptedToken);
            }
        }
        console.log('finished');
        next();
    }, jwtLogin = (req, res, next) => {
        if (req.isAuthenticated()) {
            console.log('is Auth');
            if ('id' in (req === null || req === void 0 ? void 0 : req.user)) {
                const token = this.service.tokenIssuance(req.user.id);
                res.clearCookie('jwt');
                res.status(200).send(Object.assign(Object.assign({}, req.user), { token, hash: undefined, refreshToken: undefined, accessToken: undefined }));
            }
            else
                res.status(401).send({ ok: false });
        }
        else
            res.status(401).send({ ok: false });
    }, localLogin = (req, res) => __awaiter(this, void 0, void 0, function* () {
        console.log(req.user, 'Login', req.body);
        try {
            if (req.isAuthenticated() && 'id' in (req === null || req === void 0 ? void 0 : req.user) && req.user.id !== null && typeof req.user.id === 'string') {
                const token = this.service.tokenIssuance(req.user.id);
                res.clearCookie('jwt');
                res.cookie('jwt', token);
                let refreshToken;
                if ('rol' in req.user && req.user.rol !== null && req.user.rol === 'ADMIN') {
                    refreshToken = yield this.service.prisma.dataConfig.findUniqueOrThrow({ where: { id: 1 } });
                }
                res.status(200).send(Object.assign(Object.assign({}, req.user), { password: null, token, refreshToken }));
            }
            else
                res.status(404).send({ ok: false, message: 'Invalid Credentials' });
        }
        catch (error) {
            logger_service_1.logger.error({ function: 'AuthController.localLogin', error });
            res.status(500).send(error);
        }
    }), innerToken = (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            let response;
            const { code } = req.query;
            if (code !== undefined) {
                const { tokens } = yield google_service_1.oauthClient.getToken(code);
                if (tokens.refresh_token !== undefined) {
                    google_service_1.oauthClient.setCredentials(tokens);
                    google_service_1.GoogleService.rt = tokens.refresh_token;
                    response = (yield this.service.prisma.dataConfig.upsert({ where: { id: 1 }, update: { refreshToken: tokens.refresh_token }, create: { refreshToken: tokens.refresh_token } })).refreshToken;
                }
            }
            res.status(200).send({ token: response, ok: true });
        }
        catch (error) {
            logger_service_1.logger.error({ function: 'AuthController.innerToken', error });
            res.status(401).send(error);
        }
    }), isRTValid = (req, res) => __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const refreshToken = (_a = (yield this.service.prisma.dataConfig.findUnique({ where: { id: 1 }, select: { refreshToken: true } }))) === null || _a === void 0 ? void 0 : _a.refreshToken;
            google_service_1.oauthClient.setCredentials({ refresh_token: refreshToken });
            const data = yield google_service_1.oauthClient.getAccessToken();
            console.log(data);
            res.send(data);
        }
        catch (error) {
            console.log(error);
            res.redirect('/auth/innerAuth');
        }
    }), facebookLogin = (req, res) => {
        if (req.isAuthenticated() && 'id' in (req === null || req === void 0 ? void 0 : req.user) && req.user.id !== null && typeof req.user.id === 'string') {
            const token = this.service.tokenIssuance(req.user.id);
            res.clearCookie('jwt');
            res.cookie('jwt', token);
            console.log(JSON.parse(req.query.state).cbURL);
            res.redirect(JSON.parse(req.query.state).cbURL);
        }
        else
            res.status(404).send({ ok: false, message: 'Invalid Credentials', code: '404' });
    }, gOAuthLogin = (req, res) => {
        if (req.isAuthenticated() && 'id' in (req === null || req === void 0 ? void 0 : req.user) && req.user.id !== null && typeof req.user.id === 'string') {
            const token = this.service.tokenIssuance(req.user.id);
            res.clearCookie('jwt');
            res.cookie('jwt', token);
            res.redirect('http://localhost:3000');
            // res.status(200).send({ message: 'Authenticated', token })
        }
        else
            res.status(401).send({ message: 'unAuthorized' });
    }, authState = (req, _res, next) => __awaiter(this, void 0, void 0, function* () {
        if (app_1.userLogged.id === '' && req.cookies.jwt !== null) {
            let tempJwt = req.cookies.jwt;
            tempJwt = tempJwt !== undefined ? tempJwt : req.body.jwt !== undefined ? req.body.jwt : undefined;
            if (tempJwt !== undefined) {
                const simetricKey = process.env.SIMETRICKEY;
                const publicKey = fs_1.default.readFileSync(`${process.env.KEYS_PATH}/publicKey.pem`, 'utf-8');
                const jwtoken = (0, keypair_service_1.decrypt)(req.cookies.jwt, simetricKey);
                const token = jwt.verify(jwtoken, publicKey);
                const prisma = database_service_1.prismaClient; // new PrismaClient()
                if (token !== undefined) {
                    const user = yield prisma.prisma.users.findUnique({ where: { id: token.sub }, select: { fbid: true, username: true, accessToken: true, id: true, isVerified: true, rol: true, lastName: true, name: true } });
                    if (user !== null) {
                        const facebookService = new facebook_service_1.FacebookService();
                        if (user.accessToken !== null) {
                            app_1.userLogged.accessToken = yield facebookService.assertValidToken(user.accessToken);
                        }
                        app_1.userLogged.id = user.id;
                        app_1.userLogged.isVerified = user.isVerified;
                        app_1.userLogged.lastName = user.lastName;
                        app_1.userLogged.name = user.name;
                        app_1.userLogged.rol = user.rol;
                        app_1.userLogged.username = user.username;
                        if (user.fbid !== null)
                            app_1.userLogged.fbid = user.fbid;
                        req.user = app_1.userLogged;
                    }
                }
            }
            req.user = app_1.userLogged;
        }
        next();
    })) {
        this.service = service;
        this.cryptService = cryptService;
        this.Guard = Guard;
        this.jwtRenewalToken = jwtRenewalToken;
        this.sendAuthData = sendAuthData;
        this.issueJWT = issueJWT;
        this.jwtLogin = jwtLogin;
        this.localLogin = localLogin;
        this.innerToken = innerToken;
        this.isRTValid = isRTValid;
        this.facebookLogin = facebookLogin;
        this.gOAuthLogin = gOAuthLogin;
        this.authState = authState;
    }
}
exports.AuthController = AuthController;

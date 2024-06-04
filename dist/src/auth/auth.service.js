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
exports.AuthService = void 0;
const database_service_1 = require("../Services/database.service");
const logger_service_1 = require("../Services/logger.service");
const argon2_1 = __importDefault(require("argon2"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const fs_1 = __importDefault(require("fs"));
const dotenv_1 = __importDefault(require("dotenv"));
const keypair_service_1 = require("../Services/keypair.service");
const app_1 = require("../app");
const facebook_service_1 = require("../Services/facebook.service");
const users_service_1 = require("../users/users.service");
const prisma_errors_1 = require("../Services/prisma.errors");
const auth_errors_1 = require("./auth.errors");
dotenv_1.default.config();
const simetricKey = process.env.SIMETRICKEY;
const privateKey = fs_1.default.readFileSync('./src/auth/privateKey.pem', 'utf-8');
const userServicePM = new users_service_1.UsersService();
class AuthService {
    constructor(prisma = database_service_1.prismaClient.prisma, crypt = { encrypt: keypair_service_1.encrypt, decrypt: keypair_service_1.decrypt }, facebookService = new facebook_service_1.FacebookService(), usersService = userServicePM) {
        this.prisma = prisma;
        this.crypt = crypt;
        this.facebookService = facebookService;
        this.usersService = usersService;
        this.findFBUserOrCreate = this.findFBUserOrCreate.bind(this);
        this.isFacebookAdmin = this.isFacebookAdmin.bind(this);
        this.googleAuthVerify = this.googleAuthVerify.bind(this);
        this.jwtLoginVerify = this.jwtLoginVerify.bind(this);
        this.tokenIssuance = this.tokenIssuance.bind(this);
        this.localLoginVerify = this.localLoginVerify.bind(this);
        this.localSignUpVerify = this.localSignUpVerify.bind(this);
    }
    localSignUpVerify(req, username, password, done) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.usersService.findByUserName(username);
                if (user === null || user instanceof prisma_errors_1.PrismaError) {
                    const body = Object.assign(Object.assign({}, req.body), { hash: yield argon2_1.default.hash(password), avatar: (_a = req.file) === null || _a === void 0 ? void 0 : _a.path });
                    const newUser = yield this.usersService.createUser(body);
                    if (newUser instanceof prisma_errors_1.PrismaError)
                        throw newUser;
                    if ((newUser === null || newUser === void 0 ? void 0 : newUser.id) !== undefined) {
                        console.log('llego al final');
                        done(null, newUser);
                    }
                    else {
                        throw new auth_errors_1.UserCreateError();
                    }
                }
                else
                    throw new auth_errors_1.UserExistsError();
            }
            catch (error) {
                logger_service_1.logger.error({
                    function: 'AuthService.localSignUpVerify', error
                });
                if (error instanceof auth_errors_1.AuthError || error instanceof prisma_errors_1.PrismaError) {
                    done(error, false, { message: error.message });
                }
                else
                    done(error, false);
            }
        });
    }
    localLoginVerify(req, username, password, done) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.usersService.findByUserName(username); // await this.prisma.users.findUniqueOrThrow({ where: { username }, select: { isVerified: true, lastName: true, id: true, username: true, name: true, rol: true, hash: true } }) as any
                if (user instanceof prisma_errors_1.PrismaError)
                    done(user, false);
                if (user !== undefined && 'username' in user && user.username !== null) {
                    logger_service_1.logger.debug({
                        function: 'AuthService.localLoginVerify', user: Object.assign(Object.assign({}, user), { hash: null })
                    });
                    let isValid = false;
                    if ('hash' in user && user.hash !== null && user.hash !== undefined) {
                        isValid = yield argon2_1.default.verify(user.hash, password);
                    }
                    if (isValid) {
                        if (user !== null && 'id' in user && user.id !== undefined) {
                            console.log('some', user);
                            delete user.hash;
                            done(null, user, { message: 'Successfully Logged In' });
                        }
                        else
                            done(null, false, { message: 'Password doesent match' });
                    }
                    else
                        done(null, false, { message: 'username doesnt exist' });
                }
            }
            catch (error) {
                logger_service_1.logger.error({ function: 'AuthService.localLoginVerify', error });
                done(error, false, { message: 'Database Error' });
            }
        });
    }
    tokenIssuance(id) {
        const jwToken = jsonwebtoken_1.default.sign({ sub: id }, privateKey, { algorithm: 'RS256', expiresIn: process.env.TKN_EXPIRATION });
        if (simetricKey !== undefined) {
            return this.crypt.encrypt(jwToken, simetricKey);
        }
        else
            throw new Error('simetricKey is undefined');
    }
    jwtLoginVerify(req, jwtPayload, done) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = jwtPayload.sub;
                const userResponse = yield this.prisma.users.findUnique({ where: { id } });
                // await this.prisma.users.gFindById(id, { isVerified: true, lastName: true, id: true, username: true, name: true, rol: true, accessToken: true })
                if (userResponse !== undefined && userResponse !== null) {
                    const user = Object.assign(Object.assign({}, userResponse), { rol: userResponse.rol, gender: userResponse.gender });
                    app_1.userLogged.accessToken = user.accessToken;
                    app_1.userLogged.id = user.id;
                    app_1.userLogged.isVerified = user.isVerified;
                    app_1.userLogged.lastName = user.lastName;
                    app_1.userLogged.name = user.name;
                    app_1.userLogged.rol = user.rol;
                    app_1.userLogged.username = user.username;
                    if ('username' in user && user.username !== undefined && user.username !== null) {
                        logger_service_1.logger.debug({ function: 'jwtLoginVerify', message: 'Successfully logged in' });
                        done(null, user, { message: 'Successfully Logged In' });
                    }
                    else {
                        logger_service_1.logger.debug({ function: 'jwtLoginVerify', message: 'ID doesent match any registred users' });
                        done(null, false, { message: 'ID doesnt match any registred users' });
                    }
                }
            }
            catch (error) {
                logger_service_1.logger.error({ function: 'AuthService.jwtLoginVerify', error });
                done(error, false, { message: 'Database Error' });
            }
        });
    }
    googleAuthVerify(req, accessToken, refreshToken, profile, done) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(accessToken, 'refresh', refreshToken);
                const { email } = profile;
                this.prisma.users.findUnique({ where: { username: email }, select: { isVerified: true, lastName: true, name: true, id: true, username: true, rol: true, accessToken: true, refreshToken: true } })
                    .then(user => {
                    if ((user === null || user === void 0 ? void 0 : user.username) != null) {
                        console.log(user, 'user');
                        if (refreshToken !== undefined) {
                            this.prisma.users.update({ where: { username: email }, data: { refreshToken }, select: { isVerified: true, lastName: true, name: true, id: true, username: true, rol: true, accessToken: true, refreshToken: true } })
                                .then(response => {
                                return done(null, response, { message: 'Successfully Logged in!' });
                            })
                                .catch(error => {
                                logger_service_1.logger.error({ function: 'AuthService.googleAuthVerify', error });
                                return done(null, false, { message: 'Error updating refreshToken' });
                            });
                        }
                        return done(null, user, { message: 'Successfully Logged in!' });
                    }
                    else {
                        req.flash('at', accessToken);
                        req.flash('rt', refreshToken);
                        return done(null, false, { message: 'username doesnt exist' });
                    }
                }).catch(error => {
                    logger_service_1.logger.error({ function: 'AuthService.googleAuthVerify', error });
                    done(error, false, { message: 'Database Error' });
                });
            }
            catch (error) {
                logger_service_1.logger.error({ function: 'AuthService.googleAuthVerify', error });
                done(error, false, { message: 'Database Error' });
            }
        });
    }
    isFacebookAdmin(token) {
        return __awaiter(this, void 0, void 0, function* () {
            let bool = false;
            try {
                const resp = yield fetch(`https://graph.facebook.com/me/accounts?access_token=${token}`);
                const response = yield resp.json();
                if ('data' in response && Array.isArray(response.data)) {
                    response.data.forEach((page) => {
                        if ('id' in page && page.id === process.env.FACEBOOK_PAGE)
                            bool = true;
                    });
                }
            }
            catch (error) {
                logger_service_1.logger.error({ function: 'isFacebookAdmin.authService', error });
            }
            return bool;
        });
    }
    findFBUserOrCreate(email, profile, accessToken, birthDay, phone, gender) {
        return __awaiter(this, void 0, void 0, function* () {
            const admin = yield this.isFacebookAdmin(accessToken);
            let finalAccessToken = '';
            if (admin)
                finalAccessToken = yield this.facebookService.getLongliveAccessToken(accessToken, profile.id);
            console.log(finalAccessToken, "Long lived token");
            const user = yield this.usersService.findByUserName(email); // this.prisma.users.findUnique({ where: { username: email } })
            console.log(user, "Usuarios", admin);
            if (user instanceof prisma_errors_1.PrismaError)
                throw user;
            if (user != null) { // usuario existe
                console.log("user exist", user.rol, admin);
                if (user.rol !== 'ADMIN' && admin === true) { // el rol del usuario no es admin, pero administra la pagina
                    console.log("algo");
                    const response = yield this.prisma.users.update({
                        where: { username: email },
                        data: {
                            accessToken: finalAccessToken,
                            isVerified: true,
                            avatar: profile.photos[0].value,
                            fbid: profile.id,
                            rol: 'ADMIN'
                        }
                    });
                    console.log(response, "updated", accessToken);
                    return Object.assign(Object.assign({}, response), { rol: response.rol });
                }
                else if (user.rol === 'ADMIN' && !admin) {
                    const response = yield this.prisma.users.update({
                        where: { username: email },
                        data: {
                            isVerified: true,
                            accessToken: finalAccessToken,
                            avatar: profile.photos[0].value,
                            fbid: profile.id,
                            rol: 'USER'
                        }
                    });
                    return Object.assign(Object.assign({}, response), { rol: response.rol });
                }
                else if (user.accessToken === null || user.avatar === null || user.fbid === null || (user.isVerified === undefined || !user.isVerified)) {
                    const response = yield this.prisma.users.update({ where: { username: email }, data: { accessToken: finalAccessToken, isVerified: true, avatar: profile.photos[0].value, fbid: profile.id } });
                    return response;
                }
                return user;
            }
            else { // usuario no existe valida si es admin o user y si tiene la informacion lo crea
                if (gender !== null && phone !== undefined && birthDay !== null) {
                    // cambiar para usar userService
                    const response = yield this.usersService.createUser({
                        birthDate: birthDay,
                        gender,
                        phone,
                        username: email,
                        avatar: profile.photos[0].value,
                        name: profile.name.givenName,
                        lastName: profile.name.familName,
                        hash: '',
                        password: ''
                    }, profile.id, accessToken);
                    return response;
                } // no se pasaron los datos opcionales ala funcion entonces devuelve un undefined y vuelve  a la strategy para continuar flujo
            }
        });
    }
}
exports.AuthService = AuthService;

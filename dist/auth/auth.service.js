"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AuthService", {
    enumerable: true,
    get: function() {
        return AuthService;
    }
});
const _databaseservice = require("../Services/database.service");
const _loggerservice = require("../Services/logger.service");
const _argon2 = /*#__PURE__*/ _interop_require_default(require("argon2"));
const _jsonwebtoken = /*#__PURE__*/ _interop_require_default(require("jsonwebtoken"));
const _fs = /*#__PURE__*/ _interop_require_default(require("fs"));
const _dotenv = /*#__PURE__*/ _interop_require_default(require("dotenv"));
const _keypairservice = require("../Services/keypair.service");
const _app = require("../app");
const _facebookservice = require("../Services/facebook.service");
const _usersservice = require("../users/users.service");
const _prismaerrors = require("../Services/prisma.errors");
const _autherrors = require("./auth.errors");
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
_dotenv.default.config();
const simetricKey = process.env.SIMETRICKEY;
const privateKey = _fs.default.readFileSync('./src/auth/privateKey.pem', 'utf-8');
const userServicePM = new _usersservice.UsersService();
var _this = void 0;
var _this1 = void 0;
var _this2 = void 0;
var _this3 = void 0;
var _this4 = void 0;
class AuthService extends _databaseservice.DatabaseHandler {
    constructor(crypt = {
        encrypt: _keypairservice.encrypt,
        decrypt: _keypairservice.decrypt
    }, facebookService = new _facebookservice.FacebookService(), usersService = userServicePM, localSignUpVerify = function() {
        var _ref = _async_to_generator(function*(req, username, password, done) {
            try {
                const user = yield _this.usersService.findByUserName(username);
                if (user === null || user instanceof _prismaerrors.PrismaError) {
                    var _req_file;
                    const body = _object_spread_props(_object_spread({}, req.body), {
                        hash: yield _argon2.default.hash(password),
                        avatar: (_req_file = req.file) === null || _req_file === void 0 ? void 0 : _req_file.path
                    });
                    const newUser = yield _this.usersService.createUser(body);
                    if (newUser instanceof _prismaerrors.PrismaError) throw newUser;
                    if ((newUser === null || newUser === void 0 ? void 0 : newUser.id) !== undefined) {
                        console.log('llego al final');
                        done(null, newUser);
                    } else {
                        throw new _autherrors.UserCreateError();
                    }
                } else throw new _autherrors.UserExistsError();
            } catch (error) {
                _loggerservice.logger.error({
                    function: 'AuthService.localSignUpVerify',
                    error
                });
                if (error instanceof _autherrors.AuthError || error instanceof _prismaerrors.PrismaError) {
                    done(error, false, {
                        message: error.message
                    });
                } else done(error, false);
            }
        });
        return function(req, username, password, done) {
            return _ref.apply(this, arguments);
        };
    }(), localLoginVerify = function() {
        var _ref = _async_to_generator(function*(req, username, password, done) {
            try {
                const user = yield _this1.usersService.findByUserName(username) // await this.prisma.users.findUniqueOrThrow({ where: { username }, select: { isVerified: true, lastName: true, id: true, username: true, name: true, rol: true, hash: true } }) as any
                ;
                if (user instanceof _prismaerrors.PrismaError) done(user, false);
                if (user !== undefined && 'username' in user && user.username !== null) {
                    _loggerservice.logger.debug({
                        function: 'AuthService.localLoginVerify',
                        user: _object_spread_props(_object_spread({}, user), {
                            hash: null
                        })
                    });
                    let isValid = false;
                    if ('hash' in user && user.hash !== null && user.hash !== undefined) {
                        isValid = yield _argon2.default.verify(user.hash, password);
                    }
                    if (isValid) {
                        if (user !== null && 'id' in user && user.id !== undefined) {
                            console.log('some', user);
                            delete user.hash;
                            done(null, user, {
                                message: 'Successfully Logged In'
                            });
                        } else done(null, false, {
                            message: 'Password doesent match'
                        });
                    } else done(null, false, {
                        message: 'username doesnt exist'
                    });
                }
            } catch (error) {
                _loggerservice.logger.error({
                    function: 'AuthService.localLoginVerify',
                    error
                });
                done(error, false, {
                    message: 'Database Error'
                });
            }
        });
        return function(req, username, password, done) {
            return _ref.apply(this, arguments);
        };
    }(), tokenIssuance = (id)=>{
        const jwToken = _jsonwebtoken.default.sign({
            sub: id
        }, privateKey, {
            algorithm: 'RS256',
            expiresIn: process.env.TKN_EXPIRATION
        });
        if (simetricKey !== undefined) {
            return this.crypt.encrypt(jwToken, simetricKey);
        } else throw new Error('simetricKey is undefined');
    }, jwtLoginVerify = function() {
        var _ref = _async_to_generator(function*(req, jwtPayload, done) {
            try {
                const id = jwtPayload.sub;
                const userResponse = yield _this2.prisma.users.findUnique({
                    where: {
                        id
                    }
                });
                // await this.prisma.users.gFindById(id, { isVerified: true, lastName: true, id: true, username: true, name: true, rol: true, accessToken: true })
                if (userResponse !== undefined && userResponse !== null) {
                    const user = _object_spread_props(_object_spread({}, userResponse), {
                        rol: userResponse.rol,
                        gender: userResponse.gender
                    });
                    _app.userLogged.accessToken = user.accessToken;
                    _app.userLogged.id = user.id;
                    _app.userLogged.isVerified = user.isVerified;
                    _app.userLogged.lastName = user.lastName;
                    _app.userLogged.name = user.name;
                    _app.userLogged.rol = user.rol;
                    _app.userLogged.username = user.username;
                    if ('username' in user && user.username !== undefined && user.username !== null) {
                        _loggerservice.logger.debug({
                            function: 'jwtLoginVerify',
                            message: 'Successfully logged in'
                        });
                        done(null, user, {
                            message: 'Successfully Logged In'
                        });
                    } else {
                        _loggerservice.logger.debug({
                            function: 'jwtLoginVerify',
                            message: 'ID doesent match any registred users'
                        });
                        done(null, false, {
                            message: 'ID doesnt match any registred users'
                        });
                    }
                }
            } catch (error) {
                _loggerservice.logger.error({
                    function: 'AuthService.jwtLoginVerify',
                    error
                });
                done(error, false, {
                    message: 'Database Error'
                });
            }
        });
        return function(req, jwtPayload, done) {
            return _ref.apply(this, arguments);
        };
    }(), googleAuthVerify = (req, accessToken, refreshToken, profile, done)=>{
        try {
            console.log(accessToken, 'refresh', refreshToken);
            const { email } = profile;
            this.prisma.users.findUnique({
                where: {
                    username: email
                },
                select: {
                    isVerified: true,
                    lastName: true,
                    name: true,
                    id: true,
                    username: true,
                    rol: true,
                    accessToken: true,
                    refreshToken: true
                }
            }).then((user)=>{
                if ((user === null || user === void 0 ? void 0 : user.username) != null) {
                    console.log(user, 'user');
                    if (refreshToken !== undefined) {
                        this.prisma.users.update({
                            where: {
                                username: email
                            },
                            data: {
                                refreshToken
                            },
                            select: {
                                isVerified: true,
                                lastName: true,
                                name: true,
                                id: true,
                                username: true,
                                rol: true,
                                accessToken: true,
                                refreshToken: true
                            }
                        }).then((response)=>{
                            return done(null, response, {
                                message: 'Successfully Logged in!'
                            });
                        }).catch((error)=>{
                            _loggerservice.logger.error({
                                function: 'AuthService.googleAuthVerify',
                                error
                            });
                            return done(null, false, {
                                message: 'Error updating refreshToken'
                            });
                        });
                    }
                    return done(null, user, {
                        message: 'Successfully Logged in!'
                    });
                } else {
                    req.flash('at', accessToken);
                    req.flash('rt', refreshToken);
                    return done(null, false, {
                        message: 'username doesnt exist'
                    });
                }
            }).catch((error)=>{
                _loggerservice.logger.error({
                    function: 'AuthService.googleAuthVerify',
                    error
                });
                done(error, false, {
                    message: 'Database Error'
                });
            });
        } catch (error) {
            _loggerservice.logger.error({
                function: 'AuthService.googleAuthVerify',
                error
            });
            done(error, false, {
                message: 'Database Error'
            });
        }
    }, innerVerify = function() {
        var _ref = _async_to_generator(function*(refreshToken) {
            try {
                let data;
                if (refreshToken !== undefined) data = yield _this3.prisma.dataConfig.upsert({
                    where: {
                        id: 1
                    },
                    update: {
                        refreshToken
                    },
                    create: {
                        refreshToken
                    },
                    select: {
                        refreshToken: true
                    }
                });
                if (data !== undefined) return data;
            } catch (error) {
                _loggerservice.logger.error({
                    function: 'AuthController.innerVerify',
                    error
                });
            }
        });
        return function(refreshToken) {
            return _ref.apply(this, arguments);
        };
    }(), serialize = (user, done)=>{
        done(null, user.id);
    }, deSerialize = (userId, done)=>{
        this.prisma.users.gFindById(userId).then((response)=>{
            const data = response.data;
            return done(null, data);
        }).catch((error)=>{
            _loggerservice.logger.error({
                function: 'AuthService.deSerialize',
                error
            });
        });
    }, isFacebookAdmin = function() {
        var _ref = _async_to_generator(function*(token) {
            let bool = false;
            try {
                const resp = yield fetch(`https://graph.facebook.com/me/accounts?access_token=${token}`);
                const response = yield resp.json();
                if ('data' in response && Array.isArray(response.data)) {
                    response.data.forEach((page)=>{
                        if ('id' in page && page.id === process.env.FACEBOOK_PAGE) bool = true;
                    });
                }
            } catch (error) {
                _loggerservice.logger.error({
                    function: 'isFacebookAdmin.authService',
                    error
                });
            }
            return bool;
        });
        return function(token) {
            return _ref.apply(this, arguments);
        };
    }(), findFBUserOrCreate = function() {
        var _ref = _async_to_generator(function*(email, profile, accessToken, birthDay, phone, gender) {
            const admin = yield _this4.isFacebookAdmin(accessToken);
            let finalAccessToken = '';
            if (admin) finalAccessToken = yield _this4.facebookService.getLongliveAccessToken(accessToken, profile.id);
            console.log(finalAccessToken, "Long lived token");
            const user = yield _this4.usersService.findByUserName(email) // this.prisma.users.findUnique({ where: { username: email } })
            ;
            console.log(user, "Usuarios", admin);
            if (user instanceof _prismaerrors.PrismaError) throw user;
            if (user != null) {
                console.log("user exist", user.rol, admin);
                if (user.rol !== 'ADMIN' && admin === true) {
                    console.log("algo");
                    const response = yield _this4.prisma.users.update({
                        where: {
                            username: email
                        },
                        data: {
                            accessToken: finalAccessToken,
                            isVerified: true,
                            avatar: profile.photos[0].value,
                            fbid: profile.id,
                            rol: 'ADMIN'
                        }
                    });
                    console.log(response, "updated", accessToken);
                    return _object_spread_props(_object_spread({}, response), {
                        rol: response.rol
                    });
                } else if (user.rol === 'ADMIN' && !admin) {
                    const response = yield _this4.prisma.users.update({
                        where: {
                            username: email
                        },
                        data: {
                            isVerified: true,
                            accessToken: finalAccessToken,
                            avatar: profile.photos[0].value,
                            fbid: profile.id,
                            rol: 'USER'
                        }
                    });
                    return _object_spread_props(_object_spread({}, response), {
                        rol: response.rol
                    });
                } else if (user.accessToken === null || user.avatar === null || user.fbid === null || user.isVerified === undefined || !user.isVerified) {
                    const response = yield _this4.prisma.users.update({
                        where: {
                            username: email
                        },
                        data: {
                            accessToken: finalAccessToken,
                            isVerified: true,
                            avatar: profile.photos[0].value,
                            fbid: profile.id
                        }
                    });
                    return response;
                }
                return user;
            } else {
                if (gender !== null && phone !== undefined && birthDay !== null) {
                    // cambiar para usar userService
                    const response = yield _this4.usersService.createUser({
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
                    // const response = await this.prisma.users
                    //   .gCreate({
                    //     lastName: profile.name.familName as string,
                    //     name: profile.name.givenName as string,
                    //     phone,
                    //     username: email,
                    //     rol: admin ? 'ADMIN' : 'USER',
                    //     isVerified: true,
                    //     accessToken,
                    //     gender,
                    //     birthDate: birthDay,
                    //     fbid: profile.id,
                    //     avatar: profile.photos[0].value
                    //   })
                    return response;
                } // no se pasaron los datos opcionales ala funcion entonces devuelve un undefined y vuelve  a la strategy para continuar flujo
            }
        });
        return function(email, profile, accessToken, birthDay, phone, gender) {
            return _ref.apply(this, arguments);
        };
    }()){
        super();
        _define_property(this, "crypt", void 0);
        _define_property(this, "facebookService", void 0);
        _define_property(this, "usersService", void 0);
        _define_property(this, "localSignUpVerify", void 0);
        _define_property(this, "localLoginVerify", void 0);
        _define_property(this, "tokenIssuance", void 0);
        _define_property(this, "jwtLoginVerify", void 0);
        _define_property(this, "googleAuthVerify", void 0);
        _define_property(this, "innerVerify", void 0);
        _define_property(this, "serialize", void 0);
        _define_property(this, "deSerialize", void 0);
        _define_property(this, "isFacebookAdmin", void 0);
        _define_property(this, "findFBUserOrCreate", void 0);
        this.crypt = crypt;
        this.facebookService = facebookService;
        this.usersService = usersService;
        this.localSignUpVerify = localSignUpVerify;
        this.localLoginVerify = localLoginVerify;
        this.tokenIssuance = tokenIssuance;
        this.jwtLoginVerify = jwtLoginVerify;
        this.googleAuthVerify = googleAuthVerify;
        this.innerVerify = innerVerify;
        this.serialize = serialize;
        this.deSerialize = deSerialize;
        this.isFacebookAdmin = isFacebookAdmin;
        this.findFBUserOrCreate = findFBUserOrCreate;
    }
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hdXRoL2F1dGguc2VydmljZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBEYXRhYmFzZUhhbmRsZXIgfSBmcm9tICcuLi9TZXJ2aWNlcy9kYXRhYmFzZS5zZXJ2aWNlJ1xyXG5pbXBvcnQgeyBsb2dnZXIgfSBmcm9tICcuLi9TZXJ2aWNlcy9sb2dnZXIuc2VydmljZSdcclxuaW1wb3J0IHsgdHlwZSBVc2VycyB9IGZyb20gJ0BwcmlzbWEvY2xpZW50J1xyXG5pbXBvcnQgeyB0eXBlIFJlcXVlc3QgfSBmcm9tICdleHByZXNzJ1xyXG5pbXBvcnQgYXJnb24yIGZyb20gJ2FyZ29uMidcclxuaW1wb3J0IGp3dCBmcm9tICdqc29ud2VidG9rZW4nXHJcbmltcG9ydCBmcyBmcm9tICdmcydcclxuaW1wb3J0IGRvdGVudiBmcm9tICdkb3RlbnYnXHJcbmltcG9ydCB7IHR5cGUgSVJlc3BvbnNlT2JqZWN0LCB0eXBlIERvbmVUeXBlIH0gZnJvbSAnLi4vRW50aXRpZXMnXHJcbmltcG9ydCB7IGVuY3J5cHQsIGRlY3J5cHQgfSBmcm9tICcuLi9TZXJ2aWNlcy9rZXlwYWlyLnNlcnZpY2UnXHJcbmltcG9ydCB7IHVzZXJMb2dnZWQgfSBmcm9tICcuLi9hcHAnXHJcbmltcG9ydCB7IEZhY2Vib29rU2VydmljZSB9IGZyb20gJy4uL1NlcnZpY2VzL2ZhY2Vib29rLnNlcnZpY2UnXHJcbmltcG9ydCB7IFVzZXJzU2VydmljZSB9IGZyb20gJy4uL3VzZXJzL3VzZXJzLnNlcnZpY2UnXHJcbmltcG9ydCB7IFByaXNtYUVycm9yIH0gZnJvbSAnLi4vU2VydmljZXMvcHJpc21hLmVycm9ycydcclxuaW1wb3J0IHsgdHlwZSBTaWduVXBUeXBlIH0gZnJvbSAnLi9zaWduVXAuc2NoZW1hJ1xyXG5pbXBvcnQgeyBBdXRoRXJyb3IsIFVzZXJDcmVhdGVFcnJvciwgVXNlckV4aXN0c0Vycm9yIH0gZnJvbSAnLi9hdXRoLmVycm9ycydcclxuZG90ZW52LmNvbmZpZygpXHJcbmNvbnN0IHNpbWV0cmljS2V5ID0gcHJvY2Vzcy5lbnYuU0lNRVRSSUNLRVlcclxuY29uc3QgcHJpdmF0ZUtleSA9IGZzLnJlYWRGaWxlU3luYygnLi9zcmMvYXV0aC9wcml2YXRlS2V5LnBlbScsICd1dGYtOCcpXHJcbmNvbnN0IHVzZXJTZXJ2aWNlUE0gPSBuZXcgVXNlcnNTZXJ2aWNlKClcclxuZXhwb3J0IGNsYXNzIEF1dGhTZXJ2aWNlIGV4dGVuZHMgRGF0YWJhc2VIYW5kbGVyIHtcclxuICBjb25zdHJ1Y3RvciAoXHJcbiAgICBwcm90ZWN0ZWQgY3J5cHQgPSB7IGVuY3J5cHQsIGRlY3J5cHQgfSxcclxuICAgIHByb3RlY3RlZCBmYWNlYm9va1NlcnZpY2UgPSBuZXcgRmFjZWJvb2tTZXJ2aWNlKCksXHJcbiAgICBwcm90ZWN0ZWQgdXNlcnNTZXJ2aWNlID0gdXNlclNlcnZpY2VQTSxcclxuICAgIHB1YmxpYyBsb2NhbFNpZ25VcFZlcmlmeSA9IGFzeW5jIChyZXE6IFJlcXVlc3Q8YW55LCBhbnksIFNpZ25VcFR5cGU+LCB1c2VybmFtZTogc3RyaW5nLCBwYXNzd29yZDogc3RyaW5nLCBkb25lOiBEb25lVHlwZSkgPT4ge1xyXG4gICAgICB0cnkge1xyXG4gICAgICAgIGNvbnN0IHVzZXIgPSBhd2FpdCB0aGlzLnVzZXJzU2VydmljZS5maW5kQnlVc2VyTmFtZSh1c2VybmFtZSlcclxuICAgICAgICBpZiAodXNlciA9PT0gbnVsbCB8fCB1c2VyIGluc3RhbmNlb2YgUHJpc21hRXJyb3IpIHtcclxuICAgICAgICAgIGNvbnN0IGJvZHk6IFNpZ25VcFR5cGUgJiB7IGhhc2g6IHN0cmluZywgYXZhdGFyPzogc3RyaW5nIH0gPVxyXG4gICAgICAgICAgeyAuLi5yZXEuYm9keSwgaGFzaDogYXdhaXQgYXJnb24yLmhhc2gocGFzc3dvcmQpLCBhdmF0YXI6IHJlcS5maWxlPy5wYXRoIH1cclxuICAgICAgICAgIGNvbnN0IG5ld1VzZXIgPSBhd2FpdCB0aGlzLnVzZXJzU2VydmljZS5jcmVhdGVVc2VyKGJvZHkpXHJcbiAgICAgICAgICBpZiAobmV3VXNlciBpbnN0YW5jZW9mIFByaXNtYUVycm9yKSB0aHJvdyBuZXdVc2VyXHJcbiAgICAgICAgICBpZiAobmV3VXNlcj8uaWQgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnbGxlZ28gYWwgZmluYWwnKVxyXG4gICAgICAgICAgICBkb25lKG51bGwsIG5ld1VzZXIpXHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgVXNlckNyZWF0ZUVycm9yKClcclxuICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2UgdGhyb3cgbmV3IFVzZXJFeGlzdHNFcnJvcigpXHJcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgbG9nZ2VyLmVycm9yKHtcclxuICAgICAgICAgIGZ1bmN0aW9uOiAnQXV0aFNlcnZpY2UubG9jYWxTaWduVXBWZXJpZnknLCBlcnJvclxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgaWYgKGVycm9yIGluc3RhbmNlb2YgQXV0aEVycm9yIHx8IGVycm9yIGluc3RhbmNlb2YgUHJpc21hRXJyb3IpIHsgZG9uZShlcnJvciwgZmFsc2UsIHsgbWVzc2FnZTogZXJyb3IubWVzc2FnZSB9KSB9IGVsc2UgZG9uZShlcnJvciwgZmFsc2UpXHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBwdWJsaWMgbG9jYWxMb2dpblZlcmlmeSA9IGFzeW5jIChyZXE6IFJlcXVlc3QsIHVzZXJuYW1lOiBzdHJpbmcsIHBhc3N3b3JkOiBzdHJpbmcsIGRvbmU6IERvbmVUeXBlKSA9PiB7XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgdXNlciA9IGF3YWl0IHRoaXMudXNlcnNTZXJ2aWNlLmZpbmRCeVVzZXJOYW1lKHVzZXJuYW1lKS8vIGF3YWl0IHRoaXMucHJpc21hLnVzZXJzLmZpbmRVbmlxdWVPclRocm93KHsgd2hlcmU6IHsgdXNlcm5hbWUgfSwgc2VsZWN0OiB7IGlzVmVyaWZpZWQ6IHRydWUsIGxhc3ROYW1lOiB0cnVlLCBpZDogdHJ1ZSwgdXNlcm5hbWU6IHRydWUsIG5hbWU6IHRydWUsIHJvbDogdHJ1ZSwgaGFzaDogdHJ1ZSB9IH0pIGFzIGFueVxyXG4gICAgICAgIGlmICh1c2VyIGluc3RhbmNlb2YgUHJpc21hRXJyb3IpIGRvbmUodXNlciwgZmFsc2UpXHJcbiAgICAgICAgaWYgKHVzZXIgIT09IHVuZGVmaW5lZCAmJiAndXNlcm5hbWUnIGluIHVzZXIgJiYgdXNlci51c2VybmFtZSAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgbG9nZ2VyLmRlYnVnKHtcclxuICAgICAgICAgICAgZnVuY3Rpb246ICdBdXRoU2VydmljZS5sb2NhbExvZ2luVmVyaWZ5JywgdXNlcjogeyAuLi51c2VyLCBoYXNoOiBudWxsIH1cclxuICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgICAgbGV0IGlzVmFsaWQ6IGJvb2xlYW4gPSBmYWxzZVxyXG4gICAgICAgICAgaWYgKCdoYXNoJyBpbiB1c2VyICYmIHVzZXIuaGFzaCAhPT0gbnVsbCAmJiB1c2VyLmhhc2ggIT09IHVuZGVmaW5lZCkgeyBpc1ZhbGlkID0gYXdhaXQgYXJnb24yLnZlcmlmeSh1c2VyLmhhc2gsIHBhc3N3b3JkKSB9XHJcbiAgICAgICAgICBpZiAoaXNWYWxpZCkge1xyXG4gICAgICAgICAgICBpZiAodXNlciAhPT0gbnVsbCAmJiAnaWQnIGluIHVzZXIgJiYgdXNlci5pZCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3NvbWUnLCB1c2VyKVxyXG4gICAgICAgICAgICAgIGRlbGV0ZSB1c2VyLmhhc2hcclxuICAgICAgICAgICAgICBkb25lKG51bGwsIHVzZXIsIHsgbWVzc2FnZTogJ1N1Y2Nlc3NmdWxseSBMb2dnZWQgSW4nIH0pXHJcbiAgICAgICAgICAgIH0gZWxzZSBkb25lKG51bGwsIGZhbHNlLCB7IG1lc3NhZ2U6ICdQYXNzd29yZCBkb2VzZW50IG1hdGNoJyB9KVxyXG4gICAgICAgICAgfSBlbHNlIGRvbmUobnVsbCwgZmFsc2UsIHsgbWVzc2FnZTogJ3VzZXJuYW1lIGRvZXNudCBleGlzdCcgfSlcclxuICAgICAgICB9XHJcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgbG9nZ2VyLmVycm9yKHsgZnVuY3Rpb246ICdBdXRoU2VydmljZS5sb2NhbExvZ2luVmVyaWZ5JywgZXJyb3IgfSlcclxuICAgICAgICBkb25lKGVycm9yLCBmYWxzZSwgeyBtZXNzYWdlOiAnRGF0YWJhc2UgRXJyb3InIH0pXHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBwdWJsaWMgdG9rZW5Jc3N1YW5jZSA9IChpZDogc3RyaW5nKTogc3RyaW5nID0+IHtcclxuICAgICAgY29uc3QgandUb2tlbiA9IGp3dC5zaWduKHsgc3ViOiBpZCB9LCBwcml2YXRlS2V5LCB7IGFsZ29yaXRobTogJ1JTMjU2JywgZXhwaXJlc0luOiBwcm9jZXNzLmVudi5US05fRVhQSVJBVElPTiB9KVxyXG4gICAgICBpZiAoc2ltZXRyaWNLZXkgIT09IHVuZGVmaW5lZCkgeyByZXR1cm4gdGhpcy5jcnlwdC5lbmNyeXB0KGp3VG9rZW4sIHNpbWV0cmljS2V5KSB9IGVsc2UgdGhyb3cgbmV3IEVycm9yKCdzaW1ldHJpY0tleSBpcyB1bmRlZmluZWQnKVxyXG4gICAgfSxcclxuICAgIHB1YmxpYyBqd3RMb2dpblZlcmlmeSA9IGFzeW5jIChyZXE6IFJlcXVlc3QsIGp3dFBheWxvYWQ6IHN0cmluZywgZG9uZTogRG9uZVR5cGUpID0+IHtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICBjb25zdCBpZCA9IGp3dFBheWxvYWQuc3ViIGFzIHVua25vd24gYXMgc3RyaW5nXHJcbiAgICAgICAgY29uc3QgdXNlclJlc3BvbnNlID0gYXdhaXQgdGhpcy5wcmlzbWEudXNlcnMuZmluZFVuaXF1ZSh7IHdoZXJlOiB7IGlkIH0gfSlcclxuICAgICAgICAvLyBhd2FpdCB0aGlzLnByaXNtYS51c2Vycy5nRmluZEJ5SWQoaWQsIHsgaXNWZXJpZmllZDogdHJ1ZSwgbGFzdE5hbWU6IHRydWUsIGlkOiB0cnVlLCB1c2VybmFtZTogdHJ1ZSwgbmFtZTogdHJ1ZSwgcm9sOiB0cnVlLCBhY2Nlc3NUb2tlbjogdHJ1ZSB9KVxyXG4gICAgICAgIGlmICh1c2VyUmVzcG9uc2UgIT09IHVuZGVmaW5lZCAmJiB1c2VyUmVzcG9uc2UgIT09IG51bGwpIHtcclxuICAgICAgICAgIGNvbnN0IHVzZXIgPSB7IC4uLnVzZXJSZXNwb25zZSwgcm9sOiB1c2VyUmVzcG9uc2Uucm9sLCBnZW5kZXI6IHVzZXJSZXNwb25zZS5nZW5kZXIgfVxyXG4gICAgICAgICAgdXNlckxvZ2dlZC5hY2Nlc3NUb2tlbiA9IHVzZXIuYWNjZXNzVG9rZW5cclxuICAgICAgICAgIHVzZXJMb2dnZWQuaWQgPSB1c2VyLmlkXHJcbiAgICAgICAgICB1c2VyTG9nZ2VkLmlzVmVyaWZpZWQgPSB1c2VyLmlzVmVyaWZpZWRcclxuICAgICAgICAgIHVzZXJMb2dnZWQubGFzdE5hbWUgPSB1c2VyLmxhc3ROYW1lXHJcbiAgICAgICAgICB1c2VyTG9nZ2VkLm5hbWUgPSB1c2VyLm5hbWVcclxuICAgICAgICAgIHVzZXJMb2dnZWQucm9sID0gdXNlci5yb2xcclxuICAgICAgICAgIHVzZXJMb2dnZWQudXNlcm5hbWUgPSB1c2VyLnVzZXJuYW1lXHJcbiAgICAgICAgICBpZiAoJ3VzZXJuYW1lJyBpbiB1c2VyICYmIHVzZXIudXNlcm5hbWUgIT09IHVuZGVmaW5lZCAmJiB1c2VyLnVzZXJuYW1lICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIGxvZ2dlci5kZWJ1Zyh7IGZ1bmN0aW9uOiAnand0TG9naW5WZXJpZnknLCBtZXNzYWdlOiAnU3VjY2Vzc2Z1bGx5IGxvZ2dlZCBpbicgfSlcclxuICAgICAgICAgICAgZG9uZShudWxsLCB1c2VyLCB7IG1lc3NhZ2U6ICdTdWNjZXNzZnVsbHkgTG9nZ2VkIEluJyB9KVxyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbG9nZ2VyLmRlYnVnKHsgZnVuY3Rpb246ICdqd3RMb2dpblZlcmlmeScsIG1lc3NhZ2U6ICdJRCBkb2VzZW50IG1hdGNoIGFueSByZWdpc3RyZWQgdXNlcnMnIH0pXHJcbiAgICAgICAgICAgIGRvbmUobnVsbCwgZmFsc2UsIHsgbWVzc2FnZTogJ0lEIGRvZXNudCBtYXRjaCBhbnkgcmVnaXN0cmVkIHVzZXJzJyB9KVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICBsb2dnZXIuZXJyb3IoeyBmdW5jdGlvbjogJ0F1dGhTZXJ2aWNlLmp3dExvZ2luVmVyaWZ5JywgZXJyb3IgfSlcclxuICAgICAgICBkb25lKGVycm9yLCBmYWxzZSwgeyBtZXNzYWdlOiAnRGF0YWJhc2UgRXJyb3InIH0pXHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBwdWJsaWMgZ29vZ2xlQXV0aFZlcmlmeSA9IChyZXE6IFJlcXVlc3QsIGFjY2Vzc1Rva2VuOiBzdHJpbmcsIHJlZnJlc2hUb2tlbjogc3RyaW5nLCBwcm9maWxlOiBhbnksIGRvbmU6IERvbmVUeXBlKSA9PiB7XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coYWNjZXNzVG9rZW4sICdyZWZyZXNoJywgcmVmcmVzaFRva2VuKVxyXG4gICAgICAgIGNvbnN0IHsgZW1haWwgfSA9IHByb2ZpbGVcclxuICAgICAgICB0aGlzLnByaXNtYS51c2Vycy5maW5kVW5pcXVlKHsgd2hlcmU6IHsgdXNlcm5hbWU6IGVtYWlsIH0sIHNlbGVjdDogeyBpc1ZlcmlmaWVkOiB0cnVlLCBsYXN0TmFtZTogdHJ1ZSwgbmFtZTogdHJ1ZSwgaWQ6IHRydWUsIHVzZXJuYW1lOiB0cnVlLCByb2w6IHRydWUsIGFjY2Vzc1Rva2VuOiB0cnVlLCByZWZyZXNoVG9rZW46IHRydWUgfSB9KVxyXG4gICAgICAgICAgLnRoZW4odXNlciA9PiB7XHJcbiAgICAgICAgICAgIGlmICh1c2VyPy51c2VybmFtZSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgY29uc29sZS5sb2codXNlciwgJ3VzZXInKVxyXG4gICAgICAgICAgICAgIGlmIChyZWZyZXNoVG9rZW4gIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wcmlzbWEudXNlcnMudXBkYXRlKHsgd2hlcmU6IHsgdXNlcm5hbWU6IGVtYWlsIGFzIHN0cmluZyB9LCBkYXRhOiB7IHJlZnJlc2hUb2tlbiB9LCBzZWxlY3Q6IHsgaXNWZXJpZmllZDogdHJ1ZSwgbGFzdE5hbWU6IHRydWUsIG5hbWU6IHRydWUsIGlkOiB0cnVlLCB1c2VybmFtZTogdHJ1ZSwgcm9sOiB0cnVlLCBhY2Nlc3NUb2tlbjogdHJ1ZSwgcmVmcmVzaFRva2VuOiB0cnVlIH0gfSlcclxuICAgICAgICAgICAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkb25lKG51bGwsIHJlc3BvbnNlIGFzIGFueSwgeyBtZXNzYWdlOiAnU3VjY2Vzc2Z1bGx5IExvZ2dlZCBpbiEnIH0pXHJcbiAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgIC5jYXRjaChlcnJvciA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLmVycm9yKHsgZnVuY3Rpb246ICdBdXRoU2VydmljZS5nb29nbGVBdXRoVmVyaWZ5JywgZXJyb3IgfSlcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZG9uZShudWxsLCBmYWxzZSwgeyBtZXNzYWdlOiAnRXJyb3IgdXBkYXRpbmcgcmVmcmVzaFRva2VuJyB9KVxyXG4gICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICByZXR1cm4gZG9uZShudWxsLCB1c2VyIGFzIGFueSwgeyBtZXNzYWdlOiAnU3VjY2Vzc2Z1bGx5IExvZ2dlZCBpbiEnIH0pXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgcmVxLmZsYXNoKCdhdCcsIGFjY2Vzc1Rva2VuKVxyXG4gICAgICAgICAgICAgIHJlcS5mbGFzaCgncnQnLCByZWZyZXNoVG9rZW4pXHJcbiAgICAgICAgICAgICAgcmV0dXJuIGRvbmUobnVsbCwgZmFsc2UsIHsgbWVzc2FnZTogJ3VzZXJuYW1lIGRvZXNudCBleGlzdCcgfSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSkuY2F0Y2goZXJyb3IgPT4ge1xyXG4gICAgICAgICAgICBsb2dnZXIuZXJyb3IoeyBmdW5jdGlvbjogJ0F1dGhTZXJ2aWNlLmdvb2dsZUF1dGhWZXJpZnknLCBlcnJvciB9KVxyXG4gICAgICAgICAgICBkb25lKGVycm9yLCBmYWxzZSwgeyBtZXNzYWdlOiAnRGF0YWJhc2UgRXJyb3InIH0pXHJcbiAgICAgICAgICB9KVxyXG4gICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgIGxvZ2dlci5lcnJvcih7IGZ1bmN0aW9uOiAnQXV0aFNlcnZpY2UuZ29vZ2xlQXV0aFZlcmlmeScsIGVycm9yIH0pXHJcbiAgICAgICAgZG9uZShlcnJvciwgZmFsc2UsIHsgbWVzc2FnZTogJ0RhdGFiYXNlIEVycm9yJyB9KVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgcHVibGljIGlubmVyVmVyaWZ5ID0gYXN5bmMgKHJlZnJlc2hUb2tlbjogc3RyaW5nKSA9PiB7XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgbGV0IGRhdGFcclxuICAgICAgICBpZiAocmVmcmVzaFRva2VuICE9PSB1bmRlZmluZWQpIGRhdGEgPSBhd2FpdCB0aGlzLnByaXNtYS5kYXRhQ29uZmlnLnVwc2VydCh7IHdoZXJlOiB7IGlkOiAxIH0sIHVwZGF0ZTogeyByZWZyZXNoVG9rZW4gfSwgY3JlYXRlOiB7IHJlZnJlc2hUb2tlbiB9LCBzZWxlY3Q6IHsgcmVmcmVzaFRva2VuOiB0cnVlIH0gfSlcclxuICAgICAgICBpZiAoZGF0YSAhPT0gdW5kZWZpbmVkKSByZXR1cm4gZGF0YVxyXG4gICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgIGxvZ2dlci5lcnJvcih7IGZ1bmN0aW9uOiAnQXV0aENvbnRyb2xsZXIuaW5uZXJWZXJpZnknLCBlcnJvciB9KVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgcHVibGljIHNlcmlhbGl6ZSA9ICh1c2VyOiBhbnksIGRvbmU6IERvbmVUeXBlKSA9PiB7XHJcbiAgICAgIGRvbmUobnVsbCwgdXNlci5pZClcclxuICAgIH0sXHJcbiAgICBwdWJsaWMgZGVTZXJpYWxpemUgPSAodXNlcklkOiBzdHJpbmcsIGRvbmU6IERvbmVUeXBlKSA9PiB7XHJcbiAgICAgIHRoaXMucHJpc21hLnVzZXJzLmdGaW5kQnlJZCh1c2VySWQpXHJcbiAgICAgICAgLnRoZW4oKHJlc3BvbnNlOiBJUmVzcG9uc2VPYmplY3QpID0+IHtcclxuICAgICAgICAgIGNvbnN0IGRhdGE6IFVzZXJzID0gcmVzcG9uc2UuZGF0YVxyXG4gICAgICAgICAgcmV0dXJuIGRvbmUobnVsbCwgZGF0YSlcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5jYXRjaChlcnJvciA9PiB7XHJcbiAgICAgICAgICBsb2dnZXIuZXJyb3IoeyBmdW5jdGlvbjogJ0F1dGhTZXJ2aWNlLmRlU2VyaWFsaXplJywgZXJyb3IgfSlcclxuICAgICAgICB9KVxyXG4gICAgfSxcclxuICAgIHB1YmxpYyBpc0ZhY2Vib29rQWRtaW4gPSBhc3luYyAodG9rZW46IHN0cmluZyk6IFByb21pc2U8Ym9vbGVhbj4gPT4ge1xyXG4gICAgICBsZXQgYm9vbDogYm9vbGVhbiA9IGZhbHNlXHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgcmVzcCA9IGF3YWl0IGZldGNoKGBodHRwczovL2dyYXBoLmZhY2Vib29rLmNvbS9tZS9hY2NvdW50cz9hY2Nlc3NfdG9rZW49JHt0b2tlbn1gKVxyXG4gICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgcmVzcC5qc29uKClcclxuICAgICAgICBpZiAoJ2RhdGEnIGluIHJlc3BvbnNlICYmIEFycmF5LmlzQXJyYXkocmVzcG9uc2UuZGF0YSkpIHtcclxuICAgICAgICAgIHJlc3BvbnNlLmRhdGEuZm9yRWFjaCgocGFnZTogYW55KSA9PiB7XHJcbiAgICAgICAgICAgIGlmICgnaWQnIGluIHBhZ2UgJiYgcGFnZS5pZCA9PT0gcHJvY2Vzcy5lbnYuRkFDRUJPT0tfUEFHRSkgYm9vbCA9IHRydWVcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgfVxyXG4gICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgIGxvZ2dlci5lcnJvcih7IGZ1bmN0aW9uOiAnaXNGYWNlYm9va0FkbWluLmF1dGhTZXJ2aWNlJywgZXJyb3IgfSlcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gYm9vbFxyXG4gICAgfSxcclxuXHJcbiAgICBwdWJsaWMgZmluZEZCVXNlck9yQ3JlYXRlID1cclxuICAgIGFzeW5jIChlbWFpbDogc3RyaW5nLFxyXG4gICAgICBwcm9maWxlOiBhbnksXHJcbiAgICAgIGFjY2Vzc1Rva2VuOiBzdHJpbmcsXHJcbiAgICAgIGJpcnRoRGF5Pzogc3RyaW5nLFxyXG4gICAgICBwaG9uZT86IHN0cmluZyxcclxuICAgICAgZ2VuZGVyPzogJ01BTEUnIHwgJ0ZFTUFMRScgfCAnTk9UX0JJTkFSWScpID0+IHtcclxuICAgICAgY29uc3QgYWRtaW4gPSBhd2FpdCB0aGlzLmlzRmFjZWJvb2tBZG1pbihhY2Nlc3NUb2tlbilcclxuICAgICAgbGV0IGZpbmFsQWNjZXNzVG9rZW46IHN0cmluZyB8IHVuZGVmaW5lZCA9ICcnXHJcbiAgICAgIGlmIChhZG1pbikgZmluYWxBY2Nlc3NUb2tlbiA9IGF3YWl0IHRoaXMuZmFjZWJvb2tTZXJ2aWNlLmdldExvbmdsaXZlQWNjZXNzVG9rZW4oYWNjZXNzVG9rZW4sIHByb2ZpbGUuaWQpXHJcbiAgICAgIGNvbnNvbGUubG9nKGZpbmFsQWNjZXNzVG9rZW4sXCJMb25nIGxpdmVkIHRva2VuXCIpXHJcbiAgICAgICAgY29uc3QgdXNlciA9IGF3YWl0IHRoaXMudXNlcnNTZXJ2aWNlLmZpbmRCeVVzZXJOYW1lKGVtYWlsKSAvLyB0aGlzLnByaXNtYS51c2Vycy5maW5kVW5pcXVlKHsgd2hlcmU6IHsgdXNlcm5hbWU6IGVtYWlsIH0gfSlcclxuICAgICAgICBjb25zb2xlLmxvZyh1c2VyLFwiVXN1YXJpb3NcIixhZG1pbilcclxuICAgICAgICBpZiAodXNlciBpbnN0YW5jZW9mIFByaXNtYUVycm9yKSB0aHJvdyB1c2VyXHJcbiAgICAgIGlmICh1c2VyICE9IG51bGwpIHsgLy8gdXN1YXJpbyBleGlzdGVcclxuICAgICAgICBjb25zb2xlLmxvZyhcInVzZXIgZXhpc3RcIix1c2VyLnJvbCxhZG1pbilcclxuICAgICAgICBpZiAodXNlci5yb2wgIT09ICdBRE1JTicgJiYgYWRtaW4gPT09dHJ1ZSkgeyAvLyBlbCByb2wgZGVsIHVzdWFyaW8gbm8gZXMgYWRtaW4sIHBlcm8gYWRtaW5pc3RyYSBsYSBwYWdpbmFcclxuICAgICAgICAgIGNvbnNvbGUubG9nKFwiYWxnb1wiKVxyXG4gICAgICAgICAgY29uc3QgcmVzcG9uc2UgPVxyXG4gICAgICAgICAgICBhd2FpdCB0aGlzLnByaXNtYS51c2Vycy51cGRhdGUoe1xyXG4gICAgICAgICAgICAgIHdoZXJlOiB7IHVzZXJuYW1lOiBlbWFpbCB9LFxyXG4gICAgICAgICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgICAgICAgIGFjY2Vzc1Rva2VuOiBmaW5hbEFjY2Vzc1Rva2VuLFxyXG4gICAgICAgICAgICAgICAgaXNWZXJpZmllZDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIGF2YXRhcjogcHJvZmlsZS5waG90b3NbMF0udmFsdWUsXHJcbiAgICAgICAgICAgICAgICBmYmlkOiBwcm9maWxlLmlkLFxyXG4gICAgICAgICAgICAgICAgcm9sOiAnQURNSU4nXHJcbiAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UsXCJ1cGRhdGVkXCIsYWNjZXNzVG9rZW4pXHJcbiAgICAgICAgICByZXR1cm4geyAuLi5yZXNwb25zZSwgcm9sOiByZXNwb25zZS5yb2wgfVxyXG4gICAgICAgIH0gZWxzZSBpZiAodXNlci5yb2wgPT09ICdBRE1JTicgJiYgIWFkbWluKSB7XHJcbiAgICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHRoaXMucHJpc21hLnVzZXJzLnVwZGF0ZShcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIHdoZXJlOiB7IHVzZXJuYW1lOiBlbWFpbCB9LFxyXG4gICAgICAgICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgICAgICAgIGlzVmVyaWZpZWQ6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBhY2Nlc3NUb2tlbjogZmluYWxBY2Nlc3NUb2tlbixcclxuICAgICAgICAgICAgICAgIGF2YXRhcjogcHJvZmlsZS5waG90b3NbMF0udmFsdWUsXHJcbiAgICAgICAgICAgICAgICBmYmlkOiBwcm9maWxlLmlkLFxyXG4gICAgICAgICAgICAgICAgcm9sOiAnVVNFUidcclxuICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgcmV0dXJuIHsgLi4ucmVzcG9uc2UsIHJvbDogcmVzcG9uc2Uucm9sIH1cclxuICAgICAgICB9IGVsc2UgaWYgKHVzZXIuYWNjZXNzVG9rZW4gPT09IG51bGwgfHwgdXNlci5hdmF0YXIgPT09IG51bGwgfHwgdXNlci5mYmlkID09PSBudWxsIHx8ICh1c2VyLmlzVmVyaWZpZWQgPT09IHVuZGVmaW5lZCB8fCAhdXNlci5pc1ZlcmlmaWVkKSkge1xyXG4gICAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCB0aGlzLnByaXNtYS51c2Vycy51cGRhdGUoeyB3aGVyZTogeyB1c2VybmFtZTogZW1haWwgfSwgZGF0YTogeyBhY2Nlc3NUb2tlbjogZmluYWxBY2Nlc3NUb2tlbiwgaXNWZXJpZmllZDogdHJ1ZSwgYXZhdGFyOiBwcm9maWxlLnBob3Rvc1swXS52YWx1ZSwgZmJpZDogcHJvZmlsZS5pZCB9IH0pXHJcbiAgICAgICAgICByZXR1cm4gcmVzcG9uc2VcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHVzZXJcclxuICAgICAgfSBlbHNlIHsgLy8gdXN1YXJpbyBubyBleGlzdGUgdmFsaWRhIHNpIGVzIGFkbWluIG8gdXNlciB5IHNpIHRpZW5lIGxhIGluZm9ybWFjaW9uIGxvIGNyZWFcclxuICAgICAgICBpZiAoZ2VuZGVyICE9PSBudWxsICYmIHBob25lICE9PSB1bmRlZmluZWQgJiYgYmlydGhEYXkgIT09IG51bGwpIHtcclxuICAgICAgICAgIC8vIGNhbWJpYXIgcGFyYSB1c2FyIHVzZXJTZXJ2aWNlXHJcbiAgICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHRoaXMudXNlcnNTZXJ2aWNlLmNyZWF0ZVVzZXIoe1xyXG4gICAgICAgICAgICBiaXJ0aERhdGU6IGJpcnRoRGF5LFxyXG4gICAgICAgICAgICBnZW5kZXIsXHJcbiAgICAgICAgICAgIHBob25lLFxyXG4gICAgICAgICAgICB1c2VybmFtZTogZW1haWwsXHJcbiAgICAgICAgICAgIGF2YXRhcjogcHJvZmlsZS5waG90b3NbMF0udmFsdWUsXHJcbiAgICAgICAgICAgIG5hbWU6IHByb2ZpbGUubmFtZS5naXZlbk5hbWUgYXMgc3RyaW5nLFxyXG4gICAgICAgICAgICBsYXN0TmFtZTogcHJvZmlsZS5uYW1lLmZhbWlsTmFtZSBhcyBzdHJpbmcsXHJcbiAgICAgICAgICAgIGhhc2g6ICcnLFxyXG4gICAgICAgICAgICBwYXNzd29yZDogJydcclxuXHJcbiAgICAgICAgICB9LCBwcm9maWxlLmlkLCBhY2Nlc3NUb2tlbilcclxuICAgICAgICAgIC8vIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgdGhpcy5wcmlzbWEudXNlcnNcclxuICAgICAgICAgIC8vICAgLmdDcmVhdGUoe1xyXG4gICAgICAgICAgLy8gICAgIGxhc3ROYW1lOiBwcm9maWxlLm5hbWUuZmFtaWxOYW1lIGFzIHN0cmluZyxcclxuICAgICAgICAgIC8vICAgICBuYW1lOiBwcm9maWxlLm5hbWUuZ2l2ZW5OYW1lIGFzIHN0cmluZyxcclxuICAgICAgICAgIC8vICAgICBwaG9uZSxcclxuICAgICAgICAgIC8vICAgICB1c2VybmFtZTogZW1haWwsXHJcbiAgICAgICAgICAvLyAgICAgcm9sOiBhZG1pbiA/ICdBRE1JTicgOiAnVVNFUicsXHJcbiAgICAgICAgICAvLyAgICAgaXNWZXJpZmllZDogdHJ1ZSxcclxuICAgICAgICAgIC8vICAgICBhY2Nlc3NUb2tlbixcclxuICAgICAgICAgIC8vICAgICBnZW5kZXIsXHJcbiAgICAgICAgICAvLyAgICAgYmlydGhEYXRlOiBiaXJ0aERheSxcclxuICAgICAgICAgIC8vICAgICBmYmlkOiBwcm9maWxlLmlkLFxyXG4gICAgICAgICAgLy8gICAgIGF2YXRhcjogcHJvZmlsZS5waG90b3NbMF0udmFsdWVcclxuXHJcbiAgICAgICAgICAvLyAgIH0pXHJcblxyXG4gICAgICAgICAgcmV0dXJuIHJlc3BvbnNlXHJcbiAgICAgICAgfSAvLyBubyBzZSBwYXNhcm9uIGxvcyBkYXRvcyBvcGNpb25hbGVzIGFsYSBmdW5jaW9uIGVudG9uY2VzIGRldnVlbHZlIHVuIHVuZGVmaW5lZCB5IHZ1ZWx2ZSAgYSBsYSBzdHJhdGVneSBwYXJhIGNvbnRpbnVhciBmbHVqb1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgKSB7IHN1cGVyKCkgfVxyXG59XHJcbiJdLCJuYW1lcyI6WyJBdXRoU2VydmljZSIsImRvdGVudiIsImNvbmZpZyIsInNpbWV0cmljS2V5IiwicHJvY2VzcyIsImVudiIsIlNJTUVUUklDS0VZIiwicHJpdmF0ZUtleSIsImZzIiwicmVhZEZpbGVTeW5jIiwidXNlclNlcnZpY2VQTSIsIlVzZXJzU2VydmljZSIsIkRhdGFiYXNlSGFuZGxlciIsImNvbnN0cnVjdG9yIiwiY3J5cHQiLCJlbmNyeXB0IiwiZGVjcnlwdCIsImZhY2Vib29rU2VydmljZSIsIkZhY2Vib29rU2VydmljZSIsInVzZXJzU2VydmljZSIsImxvY2FsU2lnblVwVmVyaWZ5IiwicmVxIiwidXNlcm5hbWUiLCJwYXNzd29yZCIsImRvbmUiLCJ1c2VyIiwiZmluZEJ5VXNlck5hbWUiLCJQcmlzbWFFcnJvciIsImJvZHkiLCJoYXNoIiwiYXJnb24yIiwiYXZhdGFyIiwiZmlsZSIsInBhdGgiLCJuZXdVc2VyIiwiY3JlYXRlVXNlciIsImlkIiwidW5kZWZpbmVkIiwiY29uc29sZSIsImxvZyIsIlVzZXJDcmVhdGVFcnJvciIsIlVzZXJFeGlzdHNFcnJvciIsImVycm9yIiwibG9nZ2VyIiwiZnVuY3Rpb24iLCJBdXRoRXJyb3IiLCJtZXNzYWdlIiwibG9jYWxMb2dpblZlcmlmeSIsImRlYnVnIiwiaXNWYWxpZCIsInZlcmlmeSIsInRva2VuSXNzdWFuY2UiLCJqd1Rva2VuIiwiand0Iiwic2lnbiIsInN1YiIsImFsZ29yaXRobSIsImV4cGlyZXNJbiIsIlRLTl9FWFBJUkFUSU9OIiwiRXJyb3IiLCJqd3RMb2dpblZlcmlmeSIsImp3dFBheWxvYWQiLCJ1c2VyUmVzcG9uc2UiLCJwcmlzbWEiLCJ1c2VycyIsImZpbmRVbmlxdWUiLCJ3aGVyZSIsInJvbCIsImdlbmRlciIsInVzZXJMb2dnZWQiLCJhY2Nlc3NUb2tlbiIsImlzVmVyaWZpZWQiLCJsYXN0TmFtZSIsIm5hbWUiLCJnb29nbGVBdXRoVmVyaWZ5IiwicmVmcmVzaFRva2VuIiwicHJvZmlsZSIsImVtYWlsIiwic2VsZWN0IiwidGhlbiIsInVwZGF0ZSIsImRhdGEiLCJyZXNwb25zZSIsImNhdGNoIiwiZmxhc2giLCJpbm5lclZlcmlmeSIsImRhdGFDb25maWciLCJ1cHNlcnQiLCJjcmVhdGUiLCJzZXJpYWxpemUiLCJkZVNlcmlhbGl6ZSIsInVzZXJJZCIsImdGaW5kQnlJZCIsImlzRmFjZWJvb2tBZG1pbiIsInRva2VuIiwiYm9vbCIsInJlc3AiLCJmZXRjaCIsImpzb24iLCJBcnJheSIsImlzQXJyYXkiLCJmb3JFYWNoIiwicGFnZSIsIkZBQ0VCT09LX1BBR0UiLCJmaW5kRkJVc2VyT3JDcmVhdGUiLCJiaXJ0aERheSIsInBob25lIiwiYWRtaW4iLCJmaW5hbEFjY2Vzc1Rva2VuIiwiZ2V0TG9uZ2xpdmVBY2Nlc3NUb2tlbiIsInBob3RvcyIsInZhbHVlIiwiZmJpZCIsImJpcnRoRGF0ZSIsImdpdmVuTmFtZSIsImZhbWlsTmFtZSJdLCJyYW5nZU1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7IiwibWFwcGluZ3MiOiI7Ozs7K0JBb0JhQTs7O2VBQUFBOzs7aUNBcEJtQjsrQkFDVDsrREFHSjtxRUFDSDsyREFDRDsrREFDSTtnQ0FFYztxQkFDTjtpQ0FDSzs4QkFDSDs4QkFDRDs0QkFFZ0M7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7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
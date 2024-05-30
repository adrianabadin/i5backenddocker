"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AuthController", {
    enumerable: true,
    get: function() {
        return AuthController;
    }
});
const _authservice = require("./auth.service");
const _keypairservice = require("../Services/keypair.service");
const _dotenv = /*#__PURE__*/ _interop_require_default(require("dotenv"));
const _app = require("../app");
const _jsonwebtoken = /*#__PURE__*/ _interop_require_wildcard(require("jsonwebtoken"));
const _fs = /*#__PURE__*/ _interop_require_default(require("fs"));
const _facebookservice = require("../Services/facebook.service");
const _googleservice = require("../Services/google.service");
const _loggerservice = require("../Services/logger.service");
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
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {
        __proto__: null
    };
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
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
const simetricKey = process.env.SIMETRICKEY !== undefined ? process.env.SIMETRICKEY : '';
var _this = void 0;
var _this1 = void 0;
var _this2 = void 0;
var _this3 = void 0;
class AuthController {
    constructor(service = new _authservice.AuthService(), cryptService = {
        encrypt: _keypairservice.encrypt,
        decrypt: _keypairservice.decrypt
    }, Guard = (req, res, next)=>{
        let id;
        if (req.user !== undefined && 'id' in req.user) {
            id = req.user.id;
        } else return;
        if (id !== undefined && id !== null) {
            const jwt = this.service.tokenIssuance(id);
            res.clearCookie('jwt');
            res.cookie('jwt', jwt);
            next();
        }
    }, jwtRenewalToken = (req, res, next)=>{
        if (req.isAuthenticated()) {
            console.log(req.cookies);
            if ('id' in req.user) {
                const token = this.service.tokenIssuance(req.user.id);
                res.clearCookie('jwt');
                res.cookie('jwt', token);
                next();
            }
        }
    }, sendAuthData = function() {
        var _ref = _async_to_generator(function*(req, res) {
            if (req.isAuthenticated()) {
                console.log(req.user);
                let refreshToken;
                try {
                    if ('rol' in req.user && req.user.rol === 'ADMIN') {
                        refreshToken = (yield _this.service.prisma.dataConfig.findUniqueOrThrow({
                            where: {
                                id: 1
                            },
                            select: {
                                refreshToken: true
                            }
                        })).refreshToken;
                    }
                    console.log(refreshToken);
                    res.status(200).json(_object_spread_props(_object_spread({}, req.user), {
                        refreshToken
                    }));
                } catch (error) {
                    _loggerservice.logger.error({
                        function: 'AuthController.sendAuthData',
                        error
                    });
                }
            } else res.status(403).send('unauthorized');
        });
        return function(req, res) {
            return _ref.apply(this, arguments);
        };
    }(), issueJWT = (req, res, next)=>{
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
    }, jwtLogin = (req, res, next)=>{
        if (req.isAuthenticated()) {
            console.log('is Auth');
            if ('id' in (req === null || req === void 0 ? void 0 : req.user)) {
                const token = this.service.tokenIssuance(req.user.id);
                res.clearCookie('jwt');
                res.status(200).send(_object_spread_props(_object_spread({}, req.user), {
                    token,
                    hash: undefined,
                    refreshToken: undefined,
                    accessToken: undefined
                }));
            } else res.status(401).send({
                ok: false
            });
        } else res.status(401).send({
            ok: false
        });
    }, localLogin = function() {
        var _ref = _async_to_generator(function*(req, res) {
            console.log(req.user, 'Login', req.body);
            try {
                if (req.isAuthenticated() && 'id' in (req === null || req === void 0 ? void 0 : req.user) && req.user.id !== null && typeof req.user.id === 'string') {
                    const token = _this1.service.tokenIssuance(req.user.id);
                    res.clearCookie('jwt');
                    res.cookie('jwt', token);
                    let refreshToken;
                    if ('rol' in req.user && req.user.rol !== null && req.user.rol === 'ADMIN') {
                        refreshToken = yield _this1.service.prisma.dataConfig.findUniqueOrThrow({
                            where: {
                                id: 1
                            }
                        });
                    }
                    res.status(200).send(_object_spread_props(_object_spread({}, req.user), {
                        password: null,
                        token,
                        refreshToken
                    }));
                } else res.status(404).send({
                    ok: false,
                    message: 'Invalid Credentials'
                });
            } catch (error) {
                _loggerservice.logger.error({
                    function: 'AuthController.localLogin',
                    error
                });
                res.status(500).send(error);
            }
        });
        return function(req, res) {
            return _ref.apply(this, arguments);
        };
    }(), innerToken = function() {
        var _ref = _async_to_generator(function*(req, res) {
            try {
                let response;
                const { code } = req.query;
                if (code !== undefined) {
                    const { tokens } = yield _googleservice.oauthClient.getToken(code);
                    if (tokens.refresh_token !== undefined) {
                        _googleservice.oauthClient.setCredentials(tokens);
                        _googleservice.GoogleService.rt = tokens.refresh_token;
                        response = (yield _this2.service.prisma.dataConfig.upsert({
                            where: {
                                id: 1
                            },
                            update: {
                                refreshToken: tokens.refresh_token
                            },
                            create: {
                                refreshToken: tokens.refresh_token
                            }
                        })).refreshToken;
                    }
                }
                res.status(200).send({
                    token: response,
                    ok: true
                });
            } catch (error) {
                _loggerservice.logger.error({
                    function: 'AuthController.innerToken',
                    error
                });
                res.status(401).send(error);
            }
        });
        return function(req, res) {
            return _ref.apply(this, arguments);
        };
    }(), isRTValid = function() {
        var _ref = _async_to_generator(function*(req, res) {
            try {
                var _this;
                const refreshToken = (_this = yield _this3.service.prisma.dataConfig.findUnique({
                    where: {
                        id: 1
                    },
                    select: {
                        refreshToken: true
                    }
                })) === null || _this === void 0 ? void 0 : _this.refreshToken;
                _googleservice.oauthClient.setCredentials({
                    refresh_token: refreshToken
                });
                const data = yield _googleservice.oauthClient.getAccessToken();
                console.log(data);
                res.send(data);
            } catch (error) {
                console.log(error);
                res.redirect('/auth/innerAuth');
            }
        });
        return function(req, res) {
            return _ref.apply(this, arguments);
        };
    }(), facebookLogin = (req, res)=>{
        if (req.isAuthenticated() && 'id' in (req === null || req === void 0 ? void 0 : req.user) && req.user.id !== null && typeof req.user.id === 'string') {
            const token = this.service.tokenIssuance(req.user.id);
            res.clearCookie('jwt');
            res.cookie('jwt', token);
            console.log(JSON.parse(req.query.state).cbURL);
            res.redirect(JSON.parse(req.query.state).cbURL);
        } else res.status(404).send({
            ok: false,
            message: 'Invalid Credentials',
            code: '404'
        });
    }, gOAuthLogin = (req, res)=>{
        if (req.isAuthenticated() && 'id' in (req === null || req === void 0 ? void 0 : req.user) && req.user.id !== null && typeof req.user.id === 'string') {
            const token = this.service.tokenIssuance(req.user.id);
            res.clearCookie('jwt');
            res.cookie('jwt', token);
            res.redirect('http://localhost:3000');
        // res.status(200).send({ message: 'Authenticated', token })
        } else res.status(401).send({
            message: 'unAuthorized'
        });
    }, authState = function() {
        var _ref = _async_to_generator(function*(req, _res, next) {
            if (_app.userLogged.id === '' && req.cookies.jwt !== null) {
                let tempJwt = req.cookies.jwt;
                tempJwt = tempJwt !== undefined ? tempJwt : req.body.jwt !== undefined ? req.body.jwt : undefined;
                if (tempJwt !== undefined) {
                    const simetricKey = process.env.SIMETRICKEY;
                    const publicKey = _fs.default.readFileSync(`${process.env.KEYS_PATH}/publicKey.pem`, 'utf-8');
                    const jwtoken = (0, _keypairservice.decrypt)(req.cookies.jwt, simetricKey);
                    const token = _jsonwebtoken.verify(jwtoken, publicKey);
                    const prisma = _databaseservice // new PrismaClient()
                    .prismaClient;
                    if (token !== undefined) {
                        const user = yield prisma.prisma.users.findUnique({
                            where: {
                                id: token.sub
                            },
                            select: {
                                fbid: true,
                                username: true,
                                accessToken: true,
                                id: true,
                                isVerified: true,
                                rol: true,
                                lastName: true,
                                name: true
                            }
                        });
                        if (user !== null) {
                            const facebookService = new _facebookservice.FacebookService();
                            if (user.accessToken !== null) {
                                _app.userLogged.accessToken = yield facebookService.assertValidToken(user.accessToken);
                            }
                            _app.userLogged.id = user.id;
                            _app.userLogged.isVerified = user.isVerified;
                            _app.userLogged.lastName = user.lastName;
                            _app.userLogged.name = user.name;
                            _app.userLogged.rol = user.rol;
                            _app.userLogged.username = user.username;
                            if (user.fbid !== null) _app.userLogged.fbid = user.fbid;
                            req.user = _app.userLogged;
                        }
                    }
                }
                req.user = _app.userLogged;
            }
            next();
        });
        return function(req, _res, next) {
            return _ref.apply(this, arguments);
        };
    }()){
        _define_property(this, "service", void 0);
        _define_property(this, "cryptService", void 0);
        _define_property(this, "Guard", void 0);
        _define_property(this, "jwtRenewalToken", void 0);
        _define_property(this, "sendAuthData", void 0);
        _define_property(this, "issueJWT", void 0);
        _define_property(this, "jwtLogin", void 0);
        _define_property(this, "localLogin", void 0);
        _define_property(this, "innerToken", void 0);
        _define_property(this, "isRTValid", void 0);
        _define_property(this, "facebookLogin", void 0);
        _define_property(this, "gOAuthLogin", void 0);
        _define_property(this, "authState", void 0);
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hdXRoL2F1dGguY29udHJvbGxlci50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyB0eXBlIE5leHRGdW5jdGlvbiwgdHlwZSBSZXF1ZXN0LCB0eXBlIFJlc3BvbnNlIH0gZnJvbSAnZXhwcmVzcydcclxuaW1wb3J0IHsgQXV0aFNlcnZpY2UgfSBmcm9tICcuL2F1dGguc2VydmljZSdcclxuaW1wb3J0IHsgZW5jcnlwdCwgZGVjcnlwdCB9IGZyb20gJy4uL1NlcnZpY2VzL2tleXBhaXIuc2VydmljZSdcclxuaW1wb3J0IGRvdGVudiBmcm9tICdkb3RlbnYnXHJcbmltcG9ydCB7IHVzZXJMb2dnZWQgfSBmcm9tICcuLi9hcHAnXHJcbmltcG9ydCAqIGFzIGp3dCBmcm9tICdqc29ud2VidG9rZW4nXHJcbmltcG9ydCBmcyBmcm9tICdmcydcclxuaW1wb3J0IHsgRmFjZWJvb2tTZXJ2aWNlIH0gZnJvbSAnLi4vU2VydmljZXMvZmFjZWJvb2suc2VydmljZSdcclxuaW1wb3J0IHsgR29vZ2xlU2VydmljZSwgb2F1dGhDbGllbnQgfSBmcm9tICcuLi9TZXJ2aWNlcy9nb29nbGUuc2VydmljZSdcclxuaW1wb3J0IHsgbG9nZ2VyIH0gZnJvbSAnLi4vU2VydmljZXMvbG9nZ2VyLnNlcnZpY2UnXHJcbmltcG9ydCB7IHByaXNtYUNsaWVudCB9IGZyb20gJy4uL1NlcnZpY2VzL2RhdGFiYXNlLnNlcnZpY2UnXHJcbmRvdGVudi5jb25maWcoKVxyXG5jb25zdCBzaW1ldHJpY0tleSA9IChwcm9jZXNzLmVudi5TSU1FVFJJQ0tFWSAhPT0gdW5kZWZpbmVkKSA/IHByb2Nlc3MuZW52LlNJTUVUUklDS0VZIDogJydcclxuXHJcbmV4cG9ydCBjbGFzcyBBdXRoQ29udHJvbGxlciB7XHJcbiAgY29uc3RydWN0b3IgKFxyXG4gICAgcHVibGljIHNlcnZpY2UgPSBuZXcgQXV0aFNlcnZpY2UoKSxcclxuICAgIHB1YmxpYyBjcnlwdFNlcnZpY2UgPSB7IGVuY3J5cHQsIGRlY3J5cHQgfSxcclxuICAgIHB1YmxpYyBHdWFyZCA9IChyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UsIG5leHQ6IE5leHRGdW5jdGlvbikgPT4ge1xyXG4gICAgICBsZXQgaWRcclxuICAgICAgaWYgKHJlcS51c2VyICE9PSB1bmRlZmluZWQgJiYgJ2lkJyBpbiByZXEudXNlcikge1xyXG4gICAgICAgIGlkID0gcmVxLnVzZXIuaWRcclxuICAgICAgfSBlbHNlIHJldHVyblxyXG4gICAgICBpZiAoaWQgIT09IHVuZGVmaW5lZCAmJiBpZCAhPT0gbnVsbCkge1xyXG4gICAgICAgIGNvbnN0IGp3dCA9IHRoaXMuc2VydmljZS50b2tlbklzc3VhbmNlKGlkIGFzIHN0cmluZylcclxuICAgICAgICByZXMuY2xlYXJDb29raWUoJ2p3dCcpXHJcbiAgICAgICAgcmVzLmNvb2tpZSgnand0Jywgand0KVxyXG4gICAgICAgIG5leHQoKVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgcHVibGljIGp3dFJlbmV3YWxUb2tlbiA9IChyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UsIG5leHQ6IE5leHRGdW5jdGlvbikgPT4ge1xyXG4gICAgICBpZiAocmVxLmlzQXV0aGVudGljYXRlZCgpKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2cocmVxLmNvb2tpZXMpXHJcbiAgICAgICAgaWYgKCdpZCcgaW4gcmVxLnVzZXIpIHtcclxuICAgICAgICAgIGNvbnN0IHRva2VuID0gdGhpcy5zZXJ2aWNlLnRva2VuSXNzdWFuY2UocmVxLnVzZXIuaWQgYXMgc3RyaW5nKVxyXG4gICAgICAgICAgcmVzLmNsZWFyQ29va2llKCdqd3QnKVxyXG4gICAgICAgICAgcmVzLmNvb2tpZSgnand0JywgdG9rZW4pXHJcbiAgICAgICAgICBuZXh0KClcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBwdWJsaWMgc2VuZEF1dGhEYXRhID0gYXN5bmMgKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSkgPT4ge1xyXG4gICAgICBpZiAocmVxLmlzQXV0aGVudGljYXRlZCgpKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2cocmVxLnVzZXIpXHJcbiAgICAgICAgbGV0IHJlZnJlc2hUb2tlblxyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICBpZiAoJ3JvbCcgaW4gcmVxLnVzZXIgJiYgcmVxLnVzZXIucm9sID09PSAnQURNSU4nKSB7XHJcbiAgICAgICAgICAgIHJlZnJlc2hUb2tlbiA9IChhd2FpdCB0aGlzLnNlcnZpY2UucHJpc21hLmRhdGFDb25maWcuZmluZFVuaXF1ZU9yVGhyb3coeyB3aGVyZTogeyBpZDogMSB9LCBzZWxlY3Q6IHsgcmVmcmVzaFRva2VuOiB0cnVlIH0gfSkpLnJlZnJlc2hUb2tlblxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgY29uc29sZS5sb2cocmVmcmVzaFRva2VuKVxyXG4gICAgICAgICAgcmVzLnN0YXR1cygyMDApLmpzb24oeyAuLi5yZXEudXNlciwgcmVmcmVzaFRva2VuIH0pXHJcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHsgbG9nZ2VyLmVycm9yKHsgZnVuY3Rpb246ICdBdXRoQ29udHJvbGxlci5zZW5kQXV0aERhdGEnLCBlcnJvciB9KSB9XHJcbiAgICAgIH0gZWxzZSByZXMuc3RhdHVzKDQwMykuc2VuZCgndW5hdXRob3JpemVkJylcclxuICAgIH0sXHJcbiAgICBwdWJsaWMgaXNzdWVKV1QgPSAocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlLCBuZXh0OiBOZXh0RnVuY3Rpb24pID0+IHtcclxuICAgICAgY29uc29sZS5sb2coJ2lzc3VpbmcnKVxyXG4gICAgICBpZiAocmVxLmlzQXV0aGVudGljYXRlZCgpKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ2F1dGhlbnRpY2F0ZWQnKVxyXG4gICAgICAgIGlmICgnaWQnIGluIHJlcT8udXNlcikge1xyXG4gICAgICAgICAgY29uc3Qgand0ID0gdGhpcy5zZXJ2aWNlLnRva2VuSXNzdWFuY2UocmVxLnVzZXIuaWQgYXMgc3RyaW5nKVxyXG4gICAgICAgICAgY29uc3QgZW5jcmlwdGVkVG9rZW4gPSB0aGlzLmNyeXB0U2VydmljZS5lbmNyeXB0KGp3dCwgc2ltZXRyaWNLZXkpXHJcblxyXG4gICAgICAgICAgcmVzLnN0YXR1cygyMDApLnNlbmQoZW5jcmlwdGVkVG9rZW4pXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIGNvbnNvbGUubG9nKCdmaW5pc2hlZCcpXHJcbiAgICAgIG5leHQoKVxyXG4gICAgfSxcclxuICAgIHB1YmxpYyBqd3RMb2dpbiA9IChyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UsIG5leHQ6IE5leHRGdW5jdGlvbikgPT4ge1xyXG4gICAgICBpZiAocmVxLmlzQXV0aGVudGljYXRlZCgpKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ2lzIEF1dGgnKVxyXG4gICAgICAgIGlmICgnaWQnIGluIHJlcT8udXNlcikge1xyXG4gICAgICAgICAgY29uc3QgdG9rZW4gPSB0aGlzLnNlcnZpY2UudG9rZW5Jc3N1YW5jZShyZXEudXNlci5pZCBhcyBzdHJpbmcpXHJcbiAgICAgICAgICByZXMuY2xlYXJDb29raWUoJ2p3dCcpXHJcbiAgICAgICAgICByZXMuc3RhdHVzKDIwMCkuc2VuZCh7IC4uLnJlcS51c2VyLCB0b2tlbiwgaGFzaDogdW5kZWZpbmVkLCByZWZyZXNoVG9rZW46IHVuZGVmaW5lZCwgYWNjZXNzVG9rZW46IHVuZGVmaW5lZCB9KVxyXG4gICAgICAgIH0gZWxzZSByZXMuc3RhdHVzKDQwMSkuc2VuZCh7IG9rOiBmYWxzZSB9KVxyXG4gICAgICB9IGVsc2UgcmVzLnN0YXR1cyg0MDEpLnNlbmQoeyBvazogZmFsc2UgfSlcclxuICAgIH0sXHJcbiAgICBwdWJsaWMgbG9jYWxMb2dpbiA9IGFzeW5jIChyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UpID0+IHtcclxuICAgICAgY29uc29sZS5sb2cocmVxLnVzZXIsICdMb2dpbicsIHJlcS5ib2R5KVxyXG4gICAgICB0cnkge1xyXG4gICAgICAgIGlmIChyZXEuaXNBdXRoZW50aWNhdGVkKCkgJiYgJ2lkJyBpbiByZXE/LnVzZXIgJiYgcmVxLnVzZXIuaWQgIT09IG51bGwgJiYgdHlwZW9mIHJlcS51c2VyLmlkID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgY29uc3QgdG9rZW4gPSB0aGlzLnNlcnZpY2UudG9rZW5Jc3N1YW5jZShyZXEudXNlci5pZClcclxuICAgICAgICAgIHJlcy5jbGVhckNvb2tpZSgnand0JylcclxuICAgICAgICAgIHJlcy5jb29raWUoJ2p3dCcsIHRva2VuKVxyXG4gICAgICAgICAgbGV0IHJlZnJlc2hUb2tlblxyXG4gICAgICAgICAgaWYgKCdyb2wnIGluIHJlcS51c2VyICYmIHJlcS51c2VyLnJvbCAhPT0gbnVsbCAmJiByZXEudXNlci5yb2wgPT09ICdBRE1JTicpIHtcclxuICAgICAgICAgICAgcmVmcmVzaFRva2VuID0gYXdhaXQgdGhpcy5zZXJ2aWNlLnByaXNtYS5kYXRhQ29uZmlnLmZpbmRVbmlxdWVPclRocm93KHsgd2hlcmU6IHsgaWQ6IDEgfSB9KVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgcmVzLnN0YXR1cygyMDApLnNlbmQoeyAuLi5yZXEudXNlciwgcGFzc3dvcmQ6IG51bGwsIHRva2VuLCByZWZyZXNoVG9rZW4gfSlcclxuICAgICAgICB9IGVsc2UgcmVzLnN0YXR1cyg0MDQpLnNlbmQoeyBvazogZmFsc2UsIG1lc3NhZ2U6ICdJbnZhbGlkIENyZWRlbnRpYWxzJyB9KVxyXG4gICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgIGxvZ2dlci5lcnJvcih7IGZ1bmN0aW9uOiAnQXV0aENvbnRyb2xsZXIubG9jYWxMb2dpbicsIGVycm9yIH0pXHJcbiAgICAgICAgcmVzLnN0YXR1cyg1MDApLnNlbmQoZXJyb3IpXHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBwdWJsaWMgaW5uZXJUb2tlbiA9IGFzeW5jIChyZXE6IFJlcXVlc3Q8YW55LCBhbnksIGFueSwgeyBjb2RlOiBzdHJpbmcgfT4sIHJlczogUmVzcG9uc2UpID0+IHtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICBsZXQgcmVzcG9uc2VcclxuICAgICAgICBjb25zdCB7IGNvZGUgfSA9IHJlcS5xdWVyeVxyXG4gICAgICAgIGlmIChjb2RlICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgIGNvbnN0IHsgdG9rZW5zIH0gPSBhd2FpdCBvYXV0aENsaWVudC5nZXRUb2tlbihjb2RlKVxyXG4gICAgICAgICAgaWYgKHRva2Vucy5yZWZyZXNoX3Rva2VuICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgb2F1dGhDbGllbnQuc2V0Q3JlZGVudGlhbHModG9rZW5zKVxyXG4gICAgICAgICAgICBHb29nbGVTZXJ2aWNlLnJ0ID0gdG9rZW5zLnJlZnJlc2hfdG9rZW5cclxuICAgICAgICAgICAgcmVzcG9uc2UgPSAoYXdhaXQgdGhpcy5zZXJ2aWNlLnByaXNtYS5kYXRhQ29uZmlnLnVwc2VydCh7IHdoZXJlOiB7IGlkOiAxIH0sIHVwZGF0ZTogeyByZWZyZXNoVG9rZW46IHRva2Vucy5yZWZyZXNoX3Rva2VuIH0sIGNyZWF0ZTogeyByZWZyZXNoVG9rZW46IHRva2Vucy5yZWZyZXNoX3Rva2VuIH0gfSkpLnJlZnJlc2hUb2tlblxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXMuc3RhdHVzKDIwMCkuc2VuZCh7IHRva2VuOiByZXNwb25zZSwgb2s6IHRydWUgfSlcclxuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICBsb2dnZXIuZXJyb3IoeyBmdW5jdGlvbjogJ0F1dGhDb250cm9sbGVyLmlubmVyVG9rZW4nLCBlcnJvciB9KVxyXG4gICAgICAgIHJlcy5zdGF0dXMoNDAxKS5zZW5kKGVycm9yKVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgcHVibGljIGlzUlRWYWxpZCA9IGFzeW5jIChyZXE6IFJlcXVlc3Q8YW55LCBhbnksIGFueSwgeyBjb2RlOiBzdHJpbmcgfT4sIHJlczogUmVzcG9uc2UpID0+IHtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICBjb25zdCByZWZyZXNoVG9rZW4gPSAoYXdhaXQgdGhpcy5zZXJ2aWNlLnByaXNtYS5kYXRhQ29uZmlnLmZpbmRVbmlxdWUoeyB3aGVyZTogeyBpZDogMSB9LCBzZWxlY3Q6IHsgcmVmcmVzaFRva2VuOiB0cnVlIH0gfSkpPy5yZWZyZXNoVG9rZW5cclxuICAgICAgICBvYXV0aENsaWVudC5zZXRDcmVkZW50aWFscyh7IHJlZnJlc2hfdG9rZW46IHJlZnJlc2hUb2tlbiB9KVxyXG4gICAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCBvYXV0aENsaWVudC5nZXRBY2Nlc3NUb2tlbigpXHJcbiAgICAgICAgY29uc29sZS5sb2coZGF0YSlcclxuICAgICAgICByZXMuc2VuZChkYXRhKVxyXG4gICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGVycm9yKVxyXG4gICAgICAgIHJlcy5yZWRpcmVjdCgnL2F1dGgvaW5uZXJBdXRoJylcclxuICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBwdWJsaWMgZmFjZWJvb2tMb2dpbiA9IChyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UpID0+IHtcclxuICAgICAgaWYgKHJlcS5pc0F1dGhlbnRpY2F0ZWQoKSAmJiAnaWQnIGluIHJlcT8udXNlciAmJiByZXEudXNlci5pZCAhPT0gbnVsbCAmJiB0eXBlb2YgcmVxLnVzZXIuaWQgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgY29uc3QgdG9rZW4gPSB0aGlzLnNlcnZpY2UudG9rZW5Jc3N1YW5jZShyZXEudXNlci5pZClcclxuICAgICAgICByZXMuY2xlYXJDb29raWUoJ2p3dCcpXHJcbiAgICAgICAgcmVzLmNvb2tpZSgnand0JywgdG9rZW4pXHJcbiAgICAgICAgY29uc29sZS5sb2coSlNPTi5wYXJzZShyZXEucXVlcnkuc3RhdGUgYXMgc3RyaW5nKS5jYlVSTCBhcyBzdHJpbmcpXHJcbiAgICAgICAgcmVzLnJlZGlyZWN0KEpTT04ucGFyc2UocmVxLnF1ZXJ5LnN0YXRlIGFzIHN0cmluZykuY2JVUkwgYXMgc3RyaW5nKVxyXG4gICAgICB9IGVsc2UgcmVzLnN0YXR1cyg0MDQpLnNlbmQoeyBvazogZmFsc2UsIG1lc3NhZ2U6ICdJbnZhbGlkIENyZWRlbnRpYWxzJywgY29kZTogJzQwNCcgfSlcclxuICAgIH0sXHJcbiAgICBwdWJsaWMgZ09BdXRoTG9naW4gPSAocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlKSA9PiB7XHJcbiAgICAgIGlmIChyZXEuaXNBdXRoZW50aWNhdGVkKCkgJiYgJ2lkJyBpbiByZXE/LnVzZXIgJiYgcmVxLnVzZXIuaWQgIT09IG51bGwgJiYgdHlwZW9mIHJlcS51c2VyLmlkID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgIGNvbnN0IHRva2VuID0gdGhpcy5zZXJ2aWNlLnRva2VuSXNzdWFuY2UocmVxLnVzZXIuaWQpXHJcbiAgICAgICAgcmVzLmNsZWFyQ29va2llKCdqd3QnKVxyXG4gICAgICAgIHJlcy5jb29raWUoJ2p3dCcsIHRva2VuKVxyXG4gICAgICAgIHJlcy5yZWRpcmVjdCgnaHR0cDovL2xvY2FsaG9zdDozMDAwJylcclxuICAgICAgICAvLyByZXMuc3RhdHVzKDIwMCkuc2VuZCh7IG1lc3NhZ2U6ICdBdXRoZW50aWNhdGVkJywgdG9rZW4gfSlcclxuICAgICAgfSBlbHNlIHJlcy5zdGF0dXMoNDAxKS5zZW5kKHsgbWVzc2FnZTogJ3VuQXV0aG9yaXplZCcgfSlcclxuICAgIH0sXHJcbiAgICBwdWJsaWMgYXV0aFN0YXRlID0gYXN5bmMgKHJlcTogUmVxdWVzdCwgX3JlczogUmVzcG9uc2UsIG5leHQ6IE5leHRGdW5jdGlvbikgPT4ge1xyXG4gICAgICBpZiAodXNlckxvZ2dlZC5pZCA9PT0gJycgJiYgcmVxLmNvb2tpZXMuand0ICE9PSBudWxsKSB7XHJcbiAgICAgICAgbGV0IHRlbXBKd3QgPSByZXEuY29va2llcy5qd3RcclxuICAgICAgICB0ZW1wSnd0ID0gdGVtcEp3dCAhPT0gdW5kZWZpbmVkID8gdGVtcEp3dCA6IHJlcS5ib2R5Lmp3dCAhPT0gdW5kZWZpbmVkID8gcmVxLmJvZHkuand0IDogdW5kZWZpbmVkXHJcbiAgICAgICAgaWYgKHRlbXBKd3QgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgY29uc3Qgc2ltZXRyaWNLZXkgPSBwcm9jZXNzLmVudi5TSU1FVFJJQ0tFWVxyXG4gICAgICAgICAgY29uc3QgcHVibGljS2V5ID0gZnMucmVhZEZpbGVTeW5jKGAke3Byb2Nlc3MuZW52LktFWVNfUEFUSH0vcHVibGljS2V5LnBlbWAsICd1dGYtOCcpXHJcbiAgICAgICAgICBjb25zdCBqd3Rva2VuID0gZGVjcnlwdChyZXEuY29va2llcy5qd3QsIHNpbWV0cmljS2V5KVxyXG4gICAgICAgICAgY29uc3QgdG9rZW4gPSBqd3QudmVyaWZ5KGp3dG9rZW4sIHB1YmxpY0tleSlcclxuICAgICAgICAgIGNvbnN0IHByaXNtYSA9IHByaXNtYUNsaWVudC8vIG5ldyBQcmlzbWFDbGllbnQoKVxyXG4gICAgICAgICAgaWYgKHRva2VuICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgY29uc3QgdXNlciA9IGF3YWl0IHByaXNtYS5wcmlzbWEudXNlcnMuZmluZFVuaXF1ZSh7IHdoZXJlOiB7IGlkOiB0b2tlbi5zdWIgYXMgc3RyaW5nIH0sIHNlbGVjdDogeyBmYmlkOiB0cnVlLCB1c2VybmFtZTogdHJ1ZSwgYWNjZXNzVG9rZW46IHRydWUsIGlkOiB0cnVlLCBpc1ZlcmlmaWVkOiB0cnVlLCByb2w6IHRydWUsIGxhc3ROYW1lOiB0cnVlLCBuYW1lOiB0cnVlIH0gfSlcclxuICAgICAgICAgICAgaWYgKHVzZXIgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgICBjb25zdCBmYWNlYm9va1NlcnZpY2UgPSBuZXcgRmFjZWJvb2tTZXJ2aWNlKClcclxuICAgICAgICAgICAgICBpZiAodXNlci5hY2Nlc3NUb2tlbiAhPT0gbnVsbCkgeyB1c2VyTG9nZ2VkLmFjY2Vzc1Rva2VuID0gYXdhaXQgZmFjZWJvb2tTZXJ2aWNlLmFzc2VydFZhbGlkVG9rZW4odXNlci5hY2Nlc3NUb2tlbikgfVxyXG4gICAgICAgICAgICAgIHVzZXJMb2dnZWQuaWQgPSB1c2VyLmlkXHJcbiAgICAgICAgICAgICAgdXNlckxvZ2dlZC5pc1ZlcmlmaWVkID0gdXNlci5pc1ZlcmlmaWVkXHJcbiAgICAgICAgICAgICAgdXNlckxvZ2dlZC5sYXN0TmFtZSA9IHVzZXIubGFzdE5hbWVcclxuICAgICAgICAgICAgICB1c2VyTG9nZ2VkLm5hbWUgPSB1c2VyLm5hbWVcclxuICAgICAgICAgICAgICB1c2VyTG9nZ2VkLnJvbCA9IHVzZXIucm9sIGFzIGFueVxyXG4gICAgICAgICAgICAgIHVzZXJMb2dnZWQudXNlcm5hbWUgPSB1c2VyLnVzZXJuYW1lXHJcbiAgICAgICAgICAgICAgaWYgKHVzZXIuZmJpZCAhPT0gbnVsbCkgdXNlckxvZ2dlZC5mYmlkID0gdXNlci5mYmlkXHJcbiAgICAgICAgICAgICAgcmVxLnVzZXIgPSB1c2VyTG9nZ2VkXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmVxLnVzZXIgPSB1c2VyTG9nZ2VkXHJcbiAgICAgIH1cclxuICAgICAgbmV4dCgpXHJcbiAgICB9XHJcbiAgKSB7fVxyXG59XHJcbiJdLCJuYW1lcyI6WyJBdXRoQ29udHJvbGxlciIsImRvdGVudiIsImNvbmZpZyIsInNpbWV0cmljS2V5IiwicHJvY2VzcyIsImVudiIsIlNJTUVUUklDS0VZIiwidW5kZWZpbmVkIiwiY29uc3RydWN0b3IiLCJzZXJ2aWNlIiwiQXV0aFNlcnZpY2UiLCJjcnlwdFNlcnZpY2UiLCJlbmNyeXB0IiwiZGVjcnlwdCIsIkd1YXJkIiwicmVxIiwicmVzIiwibmV4dCIsImlkIiwidXNlciIsImp3dCIsInRva2VuSXNzdWFuY2UiLCJjbGVhckNvb2tpZSIsImNvb2tpZSIsImp3dFJlbmV3YWxUb2tlbiIsImlzQXV0aGVudGljYXRlZCIsImNvbnNvbGUiLCJsb2ciLCJjb29raWVzIiwidG9rZW4iLCJzZW5kQXV0aERhdGEiLCJyZWZyZXNoVG9rZW4iLCJyb2wiLCJwcmlzbWEiLCJkYXRhQ29uZmlnIiwiZmluZFVuaXF1ZU9yVGhyb3ciLCJ3aGVyZSIsInNlbGVjdCIsInN0YXR1cyIsImpzb24iLCJlcnJvciIsImxvZ2dlciIsImZ1bmN0aW9uIiwic2VuZCIsImlzc3VlSldUIiwiZW5jcmlwdGVkVG9rZW4iLCJqd3RMb2dpbiIsImhhc2giLCJhY2Nlc3NUb2tlbiIsIm9rIiwibG9jYWxMb2dpbiIsImJvZHkiLCJwYXNzd29yZCIsIm1lc3NhZ2UiLCJpbm5lclRva2VuIiwicmVzcG9uc2UiLCJjb2RlIiwicXVlcnkiLCJ0b2tlbnMiLCJvYXV0aENsaWVudCIsImdldFRva2VuIiwicmVmcmVzaF90b2tlbiIsInNldENyZWRlbnRpYWxzIiwiR29vZ2xlU2VydmljZSIsInJ0IiwidXBzZXJ0IiwidXBkYXRlIiwiY3JlYXRlIiwiaXNSVFZhbGlkIiwiZmluZFVuaXF1ZSIsImRhdGEiLCJnZXRBY2Nlc3NUb2tlbiIsInJlZGlyZWN0IiwiZmFjZWJvb2tMb2dpbiIsIkpTT04iLCJwYXJzZSIsInN0YXRlIiwiY2JVUkwiLCJnT0F1dGhMb2dpbiIsImF1dGhTdGF0ZSIsIl9yZXMiLCJ1c2VyTG9nZ2VkIiwidGVtcEp3dCIsInB1YmxpY0tleSIsImZzIiwicmVhZEZpbGVTeW5jIiwiS0VZU19QQVRIIiwiand0b2tlbiIsInZlcmlmeSIsInByaXNtYUNsaWVudCIsInVzZXJzIiwic3ViIiwiZmJpZCIsInVzZXJuYW1lIiwiaXNWZXJpZmllZCIsImxhc3ROYW1lIiwibmFtZSIsImZhY2Vib29rU2VydmljZSIsIkZhY2Vib29rU2VydmljZSIsImFzc2VydFZhbGlkVG9rZW4iXSwicmFuZ2VNYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7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
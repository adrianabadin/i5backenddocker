"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
/* eslint-disable @typescript-eslint/no-misused-promises */
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const passport_1 = __importDefault(require("passport"));
require("./auth/localStrategy.module");
require("./auth/googleOauth2.module");
require("./auth/jwtStrategy.module");
require("./auth/facebook.module");
const app_routes_1 = require("./app.routes");
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
// const authService = new AuthService()
exports.app = (0, express_1.default)();
exports.app.use(express_1.default.json());
exports.app.use(express_1.default.urlencoded({ extended: true }));
exports.app.use((0, cookie_parser_1.default)()); // "Whether 'tis nobler in the mind to suffer"
exports.app.use((0, morgan_1.default)('dev'));
exports.app.use((0, cors_1.default)({
    origin: ['http://localhost:3000', 'http://localhost:3000/managment'],
    credentials: true,
    preflightContinue: true
}));
exports.app.use(express_1.default.static('public'));
// const store = new PrismaSessionStore(prismaClient, {
//   checkPeriod: 2 * 60 * 1000, // ms
//   dbRecordIdIsSessionId: true,
//   dbRecordIdFunction: undefined,
//   ttl: 60 * 60 * 1000 * 24
// })
// const sessionMiddleware = Session({
//   resave: false,
//   saveUninitialized: false,
//   cookie: { sameSite: 'none', secure: true, httpOnly: false },
//   secret: 'Dilated flakes of fire fall, like snow in the Alps when there is no wind'
// })
// app.use(sessionMiddleware)
// app.use(flash())
exports.app.use(passport_1.default.initialize());
// app.use(passport.session())
// passport.serializeUser(authService.serialize)
// passport.deserializeUser(authService.deSerialize)
(0, app_routes_1.routeHandler)(exports.app);

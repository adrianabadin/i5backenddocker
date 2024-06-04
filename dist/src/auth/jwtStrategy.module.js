"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cookieExtractor = void 0;
/* eslint-disable @typescript-eslint/no-misused-promises */
const passport_jwt_1 = require("passport-jwt");
const passport_1 = __importDefault(require("passport"));
const auth_service_1 = require("./auth.service");
const keypair_service_1 = require("../Services/keypair.service");
const fs_1 = __importDefault(require("fs"));
const dotenv_1 = __importDefault(require("dotenv"));
// import * as jwt from 'jsonwebtoken'
dotenv_1.default.config();
const publicKey = fs_1.default.readFileSync(`${process.env.KEYS_PATH}/publicKey.pem`, 'utf-8');
const simetricKey = '+vdKrc3rEqncv+pgGy9WmhZXoQfWsPiAuc1UA5yfujE='; // process.env.SIMETRICKEY
const authService = new auth_service_1.AuthService();
const cookieExtractor = (req) => {
    let { jwt: token } = req.cookies;
    console.log(token);
    if ('jwt' in req.body && req.body.jwt !== null && token === undefined) {
        token = req.body.jwt;
    }
    if (token !== undefined) {
        if (simetricKey !== undefined)
            return (0, keypair_service_1.decrypt)(token, simetricKey);
        else
            throw new Error('simetricKey is undefined');
    }
    else
        throw new Error('Token is undefined');
};
exports.cookieExtractor = cookieExtractor;
passport_1.default.use(new passport_jwt_1.Strategy({
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromExtractors([exports.cookieExtractor]),
    secretOrKey: publicKey,
    algorithms: ['RS256'],
    passReqToCallback: true
}, authService.jwtLoginVerify));

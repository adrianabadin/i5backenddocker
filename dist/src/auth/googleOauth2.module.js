"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const auth_service_1 = require("./auth.service");
const passport_google_oauth2_1 = __importDefault(require("passport-google-oauth2"));
const Strategy = passport_google_oauth2_1.default.Strategy;
const authService = new auth_service_1.AuthService();
console.log('cargando oauth'.bgCyan);
passport_1.default.use(new Strategy({
    clientID: process.env.CLIENTID,
    clientSecret: process.env.CLIENTSECRET,
    callbackURL: 'http://localhost:8080/auth/google/getuser',
    scope: ['openid', 'email', 'profile'],
    passReqToCallback: true
}, authService.googleAuthVerify));
// passport.use('inner', new Strategy({
//   clientID: process.env.CLIENTID_BUCKET,
//   clientSecret: process.env.CLIENTSECRET_BUCKET,
//   callbackURL: process.env.CALLBACK_BUCKET,
//   scope: ['openid', 'email', 'profile'],
//   passReqToCallback: true
// }, authService.googleAuthVerify))

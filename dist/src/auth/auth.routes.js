"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
/* eslint-disable @typescript-eslint/no-misused-promises */
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const post_routes_1 = require("../post/post.routes");
const passport_1 = __importDefault(require("passport"));
const dotenv_1 = __importDefault(require("dotenv"));
const app_1 = require("../app");
const google_service_1 = require("../Services/google.service");
dotenv_1.default.config();
exports.authRoutes = (0, express_1.Router)();
const authController = new auth_controller_1.AuthController();
exports.authRoutes.post('/token', passport_1.default.authenticate('jwt', { session: false }), authController.jwtRenewalToken, authController.sendAuthData);
exports.authRoutes.get('/token', passport_1.default.authenticate('jwt', { session: false }), authController.jwtRenewalToken, authController.sendAuthData);
exports.authRoutes.post('/login', passport_1.default.authenticate('login', { session: false }), authController.localLogin);
exports.authRoutes.get('/setcookie', (req, res) => {
    res.cookie('adrian', 'groso');
    res.send({ ok: true });
});
exports.authRoutes.get('/getcookies', (req, res) => {
    res.send({ ok: true, cookie: req.cookies });
});
exports.authRoutes.post('/signup', post_routes_1.upload.single('avatar'), passport_1.default.authenticate('register', { session: false }), authController.localLogin);
exports.authRoutes.get('/goauth', passport_1.default.authenticate('google', { session: false,
    scope: ['profile', 'email', 'openid'], prompt: 'consent'
}), authController.gOAuthLogin);
exports.authRoutes.get('/innerAuth', (req, res) => { res.redirect(google_service_1.url); });
// eslint-disable-next-line @typescript-eslint/no-misused-promises
exports.authRoutes.get('/innerAuth/cb', authController.innerToken);
exports.authRoutes.get('/isRTValid', authController.isRTValid);
exports.authRoutes.get('/google/getuser', passport_1.default.authenticate('google', { scope: ['profile', 'email'] }), authController.gOAuthLogin);
exports.authRoutes.get('/facebook', (req, res, next) => {
    let data;
    if (req.query !== undefined)
        data = req.query;
    passport_1.default.authenticate('facebook', { session: false, scope: ['email'], state: (data != null) ? JSON.stringify(data) : '' })(req, res, next);
});
exports.authRoutes.get('/facebook/callback/', passport_1.default.authenticate('facebook', { session: false }), authController.facebookLogin);
/**
 * Failed Login And Signup
 */
exports.authRoutes.get('/failedlogin', () => {
    console.log('Failed Login');
});
exports.authRoutes.get('/logout', (req, res) => {
    app_1.userLogged.id = '';
    app_1.userLogged.accessToken = '';
    res.clearCookie('jwt');
});

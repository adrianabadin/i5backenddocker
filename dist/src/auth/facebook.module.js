"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const auth_service_1 = require("./auth.service");
const passport_facebook_1 = require("passport-facebook");
const logger_service_1 = require("../Services/logger.service");
const facebook_service_1 = require("../Services/facebook.service");
const facebookService = new facebook_service_1.FacebookService();
const authService = new auth_service_1.AuthService();
passport_1.default.use('facebook', new passport_facebook_1.Strategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: process.env.FACEBOOK_APP_CB,
    passReqToCallback: true,
    profileFields: ['id', 'displayName', 'emails', 'photos', 'birthday', 'gender', 'name', 'profileUrl']
}, (req, accessToken, _refreshToken, profile, cb) => {
    console.log(req.query);
    if ('id' in profile)
        facebookService.getLongliveAccessToken(accessToken, profile.id).then((response) => { console.log(response === null || response === void 0 ? void 0 : response.body); }).catch((e) => { console.log(e); });
    const { birthDate, gender, phone } = JSON.parse(req.query.state);
    /**
   * logica a implementar
   * si el usuario de facebook ya esta registrado con su email, verifica si es administrador de la pagina, verifica si es administrador
   * en la base de datos, si no es admin de la db pero si de fb actualiza la base de datos. si no es admin de fb verifica que tenga rol
   * de usuarios y si no es asi actualiza su rol a usuarios, luego hace el login y devuelve la respuesta.
   * SI el usuario no esta registrado, y se recibieron query params, crea un nuevo usuario, si no se recibiero query params, se devuelve
   * el failed to login y se redirige a una vista que permita enviar la solicitud con esos params
   */
    console.log("hasta aca", profile);
    if ('emails' in profile && Array.isArray(profile.emails)) {
        authService.findFBUserOrCreate(profile.emails[0].value, profile, accessToken, birthDate, phone, gender)
            .then((response) => {
            console.log(response === null || response === void 0 ? void 0 : response.id, "id");
            if ((response === null || response === void 0 ? void 0 : response.id) != null) {
                cb(null, response);
            }
            else
                cb(new Error('Usuario inexistente, faltan datos para crearlo'), null);
        })
            .catch(error => logger_service_1.logger.error({ function: 'FacebookStrategy', error }));
    }
    //  authService.isFacebookAdmin(accessToken).then(response => { console.log({ response }) }).catch(e => { console.log(e) })
    // cb(null, { id: 'ada' })
}));

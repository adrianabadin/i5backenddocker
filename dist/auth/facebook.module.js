"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _passport = /*#__PURE__*/ _interop_require_default(require("passport"));
const _authservice = require("./auth.service");
const _passportfacebook = require("passport-facebook");
const _loggerservice = require("../Services/logger.service");
const _facebookservice = require("../Services/facebook.service");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const facebookService = new _facebookservice.FacebookService();
const authService = new _authservice.AuthService();
_passport.default.use('facebook', new _passportfacebook.Strategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: process.env.FACEBOOK_APP_CB,
    passReqToCallback: true,
    profileFields: [
        'id',
        'displayName',
        'emails',
        'photos',
        'birthday',
        'gender',
        'name',
        'profileUrl'
    ]
}, (req, accessToken, _refreshToken, profile, cb)=>{
    console.log(req.query);
    if ('id' in profile) facebookService.getLongliveAccessToken(accessToken, profile.id).then((response)=>{
        console.log(response === null || response === void 0 ? void 0 : response.body);
    }).catch((e)=>{
        console.log(e);
    });
    const { birthDate, gender, phone } = JSON.parse(req.query.state);
    /**
 * logica a implementar
 * si el usuario de facebook ya esta registrado con su email, verifica si es administrador de la pagina, verifica si es administrador
 * en la base de datos, si no es admin de la db pero si de fb actualiza la base de datos. si no es admin de fb verifica que tenga rol
 * de usuarios y si no es asi actualiza su rol a usuarios, luego hace el login y devuelve la respuesta.
 * SI el usuario no esta registrado, y se recibieron query params, crea un nuevo usuario, si no se recibiero query params, se devuelve
 * el failed to login y se redirige a una vista que permita enviar la solicitud con esos params
 */ console.log("hasta aca", profile);
    if ('emails' in profile && Array.isArray(profile.emails)) {
        authService.findFBUserOrCreate(profile.emails[0].value, profile, accessToken, birthDate, phone, gender).then((response)=>{
            console.log(response === null || response === void 0 ? void 0 : response.id, "id");
            if ((response === null || response === void 0 ? void 0 : response.id) != null) {
                cb(null, response);
            } else cb(new Error('Usuario inexistente, faltan datos para crearlo'), null);
        }).catch((error)=>_loggerservice.logger.error({
                function: 'FacebookStrategy',
                error
            }));
    }
//  authService.isFacebookAdmin(accessToken).then(response => { console.log({ response }) }).catch(e => { console.log(e) })
// cb(null, { id: 'ada' })
}));

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hdXRoL2ZhY2Vib29rLm1vZHVsZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgcGFzc3BvcnQgZnJvbSAncGFzc3BvcnQnXHJcbmltcG9ydCB7IEF1dGhTZXJ2aWNlIH0gZnJvbSAnLi9hdXRoLnNlcnZpY2UnXHJcbmltcG9ydCB7IFN0cmF0ZWd5IH0gZnJvbSAncGFzc3BvcnQtZmFjZWJvb2snXHJcbmltcG9ydCB7IHR5cGUgUmVxdWVzdCB9IGZyb20gJ2V4cHJlc3MnXHJcbmltcG9ydCB7IGxvZ2dlciB9IGZyb20gJy4uL1NlcnZpY2VzL2xvZ2dlci5zZXJ2aWNlJ1xyXG5pbXBvcnQgeyBGYWNlYm9va1NlcnZpY2UgfSBmcm9tICcuLi9TZXJ2aWNlcy9mYWNlYm9vay5zZXJ2aWNlJ1xyXG5jb25zdCBmYWNlYm9va1NlcnZpY2UgPSBuZXcgRmFjZWJvb2tTZXJ2aWNlKClcclxuY29uc3QgYXV0aFNlcnZpY2UgPSBuZXcgQXV0aFNlcnZpY2UoKVxyXG5wYXNzcG9ydC51c2UoJ2ZhY2Vib29rJywgbmV3IFN0cmF0ZWd5KHtcclxuICBjbGllbnRJRDogcHJvY2Vzcy5lbnYuRkFDRUJPT0tfQVBQX0lELFxyXG4gIGNsaWVudFNlY3JldDogcHJvY2Vzcy5lbnYuRkFDRUJPT0tfQVBQX1NFQ1JFVCxcclxuICBjYWxsYmFja1VSTDogcHJvY2Vzcy5lbnYuRkFDRUJPT0tfQVBQX0NCLFxyXG5cclxuICBwYXNzUmVxVG9DYWxsYmFjazogdHJ1ZSxcclxuICBwcm9maWxlRmllbGRzOiBbJ2lkJywgJ2Rpc3BsYXlOYW1lJywgJ2VtYWlscycsICdwaG90b3MnLCAnYmlydGhkYXknLCAnZ2VuZGVyJywgJ25hbWUnLCAncHJvZmlsZVVybCddXHJcbn0sIChyZXE6IFJlcXVlc3Q8YW55PiwgYWNjZXNzVG9rZW46IHN0cmluZywgX3JlZnJlc2hUb2tlbjogc3RyaW5nLCBwcm9maWxlOiBvYmplY3QsIGNiOiAoLi4uYXJnczogYW55KSA9PiB2b2lkKSA9PiB7XHJcbiAgY29uc29sZS5sb2cocmVxLnF1ZXJ5KVxyXG4gIGlmICgnaWQnIGluIHByb2ZpbGUpIGZhY2Vib29rU2VydmljZS5nZXRMb25nbGl2ZUFjY2Vzc1Rva2VuKGFjY2Vzc1Rva2VuLCBwcm9maWxlLmlkIGFzIHN0cmluZykudGhlbigocmVzcG9uc2U6IGFueSkgPT4geyBjb25zb2xlLmxvZyhyZXNwb25zZT8uYm9keSkgfSkuY2F0Y2goKGU6IGFueSkgPT4geyBjb25zb2xlLmxvZyhlKSB9KVxyXG4gIGNvbnN0IHsgYmlydGhEYXRlLCBnZW5kZXIsIHBob25lIH0gPSBKU09OLnBhcnNlKHJlcS5xdWVyeS5zdGF0ZSBhcyBzdHJpbmcpXHJcbiAgLyoqXHJcbiAqIGxvZ2ljYSBhIGltcGxlbWVudGFyXHJcbiAqIHNpIGVsIHVzdWFyaW8gZGUgZmFjZWJvb2sgeWEgZXN0YSByZWdpc3RyYWRvIGNvbiBzdSBlbWFpbCwgdmVyaWZpY2Egc2kgZXMgYWRtaW5pc3RyYWRvciBkZSBsYSBwYWdpbmEsIHZlcmlmaWNhIHNpIGVzIGFkbWluaXN0cmFkb3JcclxuICogZW4gbGEgYmFzZSBkZSBkYXRvcywgc2kgbm8gZXMgYWRtaW4gZGUgbGEgZGIgcGVybyBzaSBkZSBmYiBhY3R1YWxpemEgbGEgYmFzZSBkZSBkYXRvcy4gc2kgbm8gZXMgYWRtaW4gZGUgZmIgdmVyaWZpY2EgcXVlIHRlbmdhIHJvbFxyXG4gKiBkZSB1c3VhcmlvcyB5IHNpIG5vIGVzIGFzaSBhY3R1YWxpemEgc3Ugcm9sIGEgdXN1YXJpb3MsIGx1ZWdvIGhhY2UgZWwgbG9naW4geSBkZXZ1ZWx2ZSBsYSByZXNwdWVzdGEuXHJcbiAqIFNJIGVsIHVzdWFyaW8gbm8gZXN0YSByZWdpc3RyYWRvLCB5IHNlIHJlY2liaWVyb24gcXVlcnkgcGFyYW1zLCBjcmVhIHVuIG51ZXZvIHVzdWFyaW8sIHNpIG5vIHNlIHJlY2liaWVybyBxdWVyeSBwYXJhbXMsIHNlIGRldnVlbHZlXHJcbiAqIGVsIGZhaWxlZCB0byBsb2dpbiB5IHNlIHJlZGlyaWdlIGEgdW5hIHZpc3RhIHF1ZSBwZXJtaXRhIGVudmlhciBsYSBzb2xpY2l0dWQgY29uIGVzb3MgcGFyYW1zXHJcbiAqL1xyXG5jb25zb2xlLmxvZyhcImhhc3RhIGFjYVwiLHByb2ZpbGUpXHJcbiAgaWYgKCdlbWFpbHMnIGluIHByb2ZpbGUgJiYgQXJyYXkuaXNBcnJheShwcm9maWxlLmVtYWlscykpIHtcclxuICAgIGF1dGhTZXJ2aWNlLmZpbmRGQlVzZXJPckNyZWF0ZShwcm9maWxlLmVtYWlsc1swXS52YWx1ZSBhcyBzdHJpbmcsIHByb2ZpbGUsIGFjY2Vzc1Rva2VuLCBiaXJ0aERhdGUsIHBob25lLCBnZW5kZXIpXHJcbiAgICAgIC50aGVuKChyZXNwb25zZTogYW55KSA9PiB7XHJcbiAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2U/LmlkLFwiaWRcIilcclxuICAgICAgICBpZiAoKHJlc3BvbnNlPy5pZCkgIT0gbnVsbCkge1xyXG4gICAgICAgICAgY2IobnVsbCwgcmVzcG9uc2UpXHJcbiAgICAgICAgfSBlbHNlIGNiKG5ldyBFcnJvcignVXN1YXJpbyBpbmV4aXN0ZW50ZSwgZmFsdGFuIGRhdG9zIHBhcmEgY3JlYXJsbycpLCBudWxsKVxyXG4gICAgICB9KVxyXG4gICAgICAuY2F0Y2goZXJyb3IgPT4gbG9nZ2VyLmVycm9yKHsgZnVuY3Rpb246ICdGYWNlYm9va1N0cmF0ZWd5JywgZXJyb3IgfSkpXHJcbiAgfVxyXG5cclxuLy8gIGF1dGhTZXJ2aWNlLmlzRmFjZWJvb2tBZG1pbihhY2Nlc3NUb2tlbikudGhlbihyZXNwb25zZSA9PiB7IGNvbnNvbGUubG9nKHsgcmVzcG9uc2UgfSkgfSkuY2F0Y2goZSA9PiB7IGNvbnNvbGUubG9nKGUpIH0pXHJcbiAgLy8gY2IobnVsbCwgeyBpZDogJ2FkYScgfSlcclxufSkpXHJcbiJdLCJuYW1lcyI6WyJmYWNlYm9va1NlcnZpY2UiLCJGYWNlYm9va1NlcnZpY2UiLCJhdXRoU2VydmljZSIsIkF1dGhTZXJ2aWNlIiwicGFzc3BvcnQiLCJ1c2UiLCJTdHJhdGVneSIsImNsaWVudElEIiwicHJvY2VzcyIsImVudiIsIkZBQ0VCT09LX0FQUF9JRCIsImNsaWVudFNlY3JldCIsIkZBQ0VCT09LX0FQUF9TRUNSRVQiLCJjYWxsYmFja1VSTCIsIkZBQ0VCT09LX0FQUF9DQiIsInBhc3NSZXFUb0NhbGxiYWNrIiwicHJvZmlsZUZpZWxkcyIsInJlcSIsImFjY2Vzc1Rva2VuIiwiX3JlZnJlc2hUb2tlbiIsInByb2ZpbGUiLCJjYiIsImNvbnNvbGUiLCJsb2ciLCJxdWVyeSIsImdldExvbmdsaXZlQWNjZXNzVG9rZW4iLCJpZCIsInRoZW4iLCJyZXNwb25zZSIsImJvZHkiLCJjYXRjaCIsImUiLCJiaXJ0aERhdGUiLCJnZW5kZXIiLCJwaG9uZSIsIkpTT04iLCJwYXJzZSIsInN0YXRlIiwiQXJyYXkiLCJpc0FycmF5IiwiZW1haWxzIiwiZmluZEZCVXNlck9yQ3JlYXRlIiwidmFsdWUiLCJFcnJvciIsImVycm9yIiwibG9nZ2VyIiwiZnVuY3Rpb24iXSwicmFuZ2VNYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OyIsIm1hcHBpbmdzIjoiOzs7O2lFQUFxQjs2QkFDTztrQ0FDSDsrQkFFRjtpQ0FDUzs7Ozs7O0FBQ2hDLE1BQU1BLGtCQUFrQixJQUFJQyxnQ0FBZTtBQUMzQyxNQUFNQyxjQUFjLElBQUlDLHdCQUFXO0FBQ25DQyxpQkFBUSxDQUFDQyxHQUFHLENBQUMsWUFBWSxJQUFJQywwQkFBUSxDQUFDO0lBQ3BDQyxVQUFVQyxRQUFRQyxHQUFHLENBQUNDLGVBQWU7SUFDckNDLGNBQWNILFFBQVFDLEdBQUcsQ0FBQ0csbUJBQW1CO0lBQzdDQyxhQUFhTCxRQUFRQyxHQUFHLENBQUNLLGVBQWU7SUFFeENDLG1CQUFtQjtJQUNuQkMsZUFBZTtRQUFDO1FBQU07UUFBZTtRQUFVO1FBQVU7UUFBWTtRQUFVO1FBQVE7S0FBYTtBQUN0RyxHQUFHLENBQUNDLEtBQW1CQyxhQUFxQkMsZUFBdUJDLFNBQWlCQztJQUNsRkMsUUFBUUMsR0FBRyxDQUFDTixJQUFJTyxLQUFLO0lBQ3JCLElBQUksUUFBUUosU0FBU3BCLGdCQUFnQnlCLHNCQUFzQixDQUFDUCxhQUFhRSxRQUFRTSxFQUFFLEVBQVlDLElBQUksQ0FBQyxDQUFDQztRQUFvQk4sUUFBUUMsR0FBRyxDQUFDSyxxQkFBQUEsK0JBQUFBLFNBQVVDLElBQUk7SUFBRSxHQUFHQyxLQUFLLENBQUMsQ0FBQ0M7UUFBYVQsUUFBUUMsR0FBRyxDQUFDUTtJQUFHO0lBQzNMLE1BQU0sRUFBRUMsU0FBUyxFQUFFQyxNQUFNLEVBQUVDLEtBQUssRUFBRSxHQUFHQyxLQUFLQyxLQUFLLENBQUNuQixJQUFJTyxLQUFLLENBQUNhLEtBQUs7SUFDL0Q7Ozs7Ozs7Q0FPRCxHQUNEZixRQUFRQyxHQUFHLENBQUMsYUFBWUg7SUFDdEIsSUFBSSxZQUFZQSxXQUFXa0IsTUFBTUMsT0FBTyxDQUFDbkIsUUFBUW9CLE1BQU0sR0FBRztRQUN4RHRDLFlBQVl1QyxrQkFBa0IsQ0FBQ3JCLFFBQVFvQixNQUFNLENBQUMsRUFBRSxDQUFDRSxLQUFLLEVBQVl0QixTQUFTRixhQUFhYyxXQUFXRSxPQUFPRCxRQUN2R04sSUFBSSxDQUFDLENBQUNDO1lBQ0xOLFFBQVFDLEdBQUcsQ0FBQ0sscUJBQUFBLCtCQUFBQSxTQUFVRixFQUFFLEVBQUM7WUFDekIsSUFBSSxDQUFDRSxxQkFBQUEsK0JBQUFBLFNBQVVGLEVBQUUsS0FBSyxNQUFNO2dCQUMxQkwsR0FBRyxNQUFNTztZQUNYLE9BQU9QLEdBQUcsSUFBSXNCLE1BQU0sbURBQW1EO1FBQ3pFLEdBQ0NiLEtBQUssQ0FBQ2MsQ0FBQUEsUUFBU0MscUJBQU0sQ0FBQ0QsS0FBSyxDQUFDO2dCQUFFRSxVQUFVO2dCQUFvQkY7WUFBTTtJQUN2RTtBQUVGLDJIQUEySDtBQUN6SCwwQkFBMEI7QUFDNUIifQ==
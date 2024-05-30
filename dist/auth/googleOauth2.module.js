"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _passport = /*#__PURE__*/ _interop_require_default(require("passport"));
const _authservice = require("./auth.service");
const _passportgoogleoauth2 = /*#__PURE__*/ _interop_require_default(require("passport-google-oauth2"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const Strategy = _passportgoogleoauth2.default.Strategy;
const authService = new _authservice.AuthService();
console.log('cargando oauth');
_passport.default.use(new Strategy({
    clientID: process.env.CLIENTID,
    clientSecret: process.env.CLIENTSECRET,
    callbackURL: 'http://localhost:8080/auth/google/getuser',
    scope: [
        'openid',
        'email',
        'profile'
    ],
    passReqToCallback: true
}, authService.googleAuthVerify)) // passport.use('inner', new Strategy({
 //   clientID: process.env.CLIENTID_BUCKET,
 //   clientSecret: process.env.CLIENTSECRET_BUCKET,
 //   callbackURL: process.env.CALLBACK_BUCKET,
 //   scope: ['openid', 'email', 'profile'],
 //   passReqToCallback: true
 // }, authService.googleAuthVerify))
;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hdXRoL2dvb2dsZU9hdXRoMi5tb2R1bGUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHBhc3Nwb3J0IGZyb20gJ3Bhc3Nwb3J0J1xyXG5pbXBvcnQgeyBBdXRoU2VydmljZSB9IGZyb20gJy4vYXV0aC5zZXJ2aWNlJ1xyXG5pbXBvcnQgZ29vZ2xlT2F1dGggZnJvbSAncGFzc3BvcnQtZ29vZ2xlLW9hdXRoMidcclxuY29uc3QgU3RyYXRlZ3kgPSBnb29nbGVPYXV0aC5TdHJhdGVneVxyXG5jb25zdCBhdXRoU2VydmljZSA9IG5ldyBBdXRoU2VydmljZSgpXHJcbmNvbnNvbGUubG9nKCdjYXJnYW5kbyBvYXV0aCcpXHJcbnBhc3Nwb3J0LnVzZShuZXcgU3RyYXRlZ3koe1xyXG4gIGNsaWVudElEOiBwcm9jZXNzLmVudi5DTElFTlRJRCxcclxuICBjbGllbnRTZWNyZXQ6IHByb2Nlc3MuZW52LkNMSUVOVFNFQ1JFVCxcclxuICBjYWxsYmFja1VSTDogJ2h0dHA6Ly9sb2NhbGhvc3Q6ODA4MC9hdXRoL2dvb2dsZS9nZXR1c2VyJyxcclxuICBzY29wZTogWydvcGVuaWQnLCAnZW1haWwnLCAncHJvZmlsZSddLFxyXG5cclxuICBwYXNzUmVxVG9DYWxsYmFjazogdHJ1ZVxyXG59LCBhdXRoU2VydmljZS5nb29nbGVBdXRoVmVyaWZ5KSlcclxuXHJcbi8vIHBhc3Nwb3J0LnVzZSgnaW5uZXInLCBuZXcgU3RyYXRlZ3koe1xyXG4vLyAgIGNsaWVudElEOiBwcm9jZXNzLmVudi5DTElFTlRJRF9CVUNLRVQsXHJcbi8vICAgY2xpZW50U2VjcmV0OiBwcm9jZXNzLmVudi5DTElFTlRTRUNSRVRfQlVDS0VULFxyXG4vLyAgIGNhbGxiYWNrVVJMOiBwcm9jZXNzLmVudi5DQUxMQkFDS19CVUNLRVQsXHJcbi8vICAgc2NvcGU6IFsnb3BlbmlkJywgJ2VtYWlsJywgJ3Byb2ZpbGUnXSxcclxuLy8gICBwYXNzUmVxVG9DYWxsYmFjazogdHJ1ZVxyXG4vLyB9LCBhdXRoU2VydmljZS5nb29nbGVBdXRoVmVyaWZ5KSlcclxuIl0sIm5hbWVzIjpbIlN0cmF0ZWd5IiwiZ29vZ2xlT2F1dGgiLCJhdXRoU2VydmljZSIsIkF1dGhTZXJ2aWNlIiwiY29uc29sZSIsImxvZyIsInBhc3Nwb3J0IiwidXNlIiwiY2xpZW50SUQiLCJwcm9jZXNzIiwiZW52IiwiQ0xJRU5USUQiLCJjbGllbnRTZWNyZXQiLCJDTElFTlRTRUNSRVQiLCJjYWxsYmFja1VSTCIsInNjb3BlIiwicGFzc1JlcVRvQ2FsbGJhY2siLCJnb29nbGVBdXRoVmVyaWZ5Il0sInJhbmdlTWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7IiwibWFwcGluZ3MiOiI7Ozs7aUVBQXFCOzZCQUNPOzZFQUNKOzs7Ozs7QUFDeEIsTUFBTUEsV0FBV0MsNkJBQVcsQ0FBQ0QsUUFBUTtBQUNyQyxNQUFNRSxjQUFjLElBQUlDLHdCQUFXO0FBQ25DQyxRQUFRQyxHQUFHLENBQUM7QUFDWkMsaUJBQVEsQ0FBQ0MsR0FBRyxDQUFDLElBQUlQLFNBQVM7SUFDeEJRLFVBQVVDLFFBQVFDLEdBQUcsQ0FBQ0MsUUFBUTtJQUM5QkMsY0FBY0gsUUFBUUMsR0FBRyxDQUFDRyxZQUFZO0lBQ3RDQyxhQUFhO0lBQ2JDLE9BQU87UUFBQztRQUFVO1FBQVM7S0FBVTtJQUVyQ0MsbUJBQW1CO0FBQ3JCLEdBQUdkLFlBQVllLGdCQUFnQixHQUUvQix1Q0FBdUM7Q0FDdkMsMkNBQTJDO0NBQzNDLG1EQUFtRDtDQUNuRCw4Q0FBOEM7Q0FDOUMsMkNBQTJDO0NBQzNDLDRCQUE0QjtDQUM1QixvQ0FBb0MifQ==
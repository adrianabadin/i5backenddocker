/* eslint-disable @typescript-eslint/no-misused-promises */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "authRoutes", {
    enumerable: true,
    get: function() {
        return authRoutes;
    }
});
const _express = require("express");
const _authcontroller = require("./auth.controller");
const _postroutes = require("../post/post.routes");
const _passport = /*#__PURE__*/ _interop_require_default(require("passport"));
const _dotenv = /*#__PURE__*/ _interop_require_default(require("dotenv"));
const _app = require("../app");
const _googleservice = require("../Services/google.service");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
_dotenv.default.config();
const authRoutes = (0, _express.Router)();
const authController = new _authcontroller.AuthController();
authRoutes.post('/token', _passport.default.authenticate('jwt', {
    session: false
}), authController.jwtRenewalToken, authController.sendAuthData);
authRoutes.get('/token', _passport.default.authenticate('jwt', {
    session: false
}), authController.jwtRenewalToken, authController.sendAuthData);
authRoutes.post('/login', _passport.default.authenticate('login', {
    session: false
}), authController.localLogin);
authRoutes.get('/setcookie', (req, res)=>{
    res.cookie('adrian', 'groso');
    res.send({
        ok: true
    });
});
authRoutes.get('/getcookies', (req, res)=>{
    res.send({
        ok: true,
        cookie: req.cookies
    });
});
authRoutes.post('/signup', _postroutes.upload.single('avatar'), _passport.default.authenticate('register', {
    session: false
}), authController.localLogin);
authRoutes.get('/goauth', _passport.default.authenticate('google', {
    session: false,
    scope: [
        'profile',
        'email',
        'openid'
    ],
    prompt: 'consent'
}), authController.gOAuthLogin);
authRoutes.get('/innerAuth', (req, res)=>{
    res.redirect(_googleservice.url);
});
// eslint-disable-next-line @typescript-eslint/no-misused-promises
authRoutes.get('/innerAuth/cb', authController.innerToken);
authRoutes.get('/isRTValid', authController.isRTValid);
authRoutes.get('/google/getuser', _passport.default.authenticate('google', {
    scope: [
        'profile',
        'email'
    ]
}), authController.gOAuthLogin);
authRoutes.get('/facebook', (req, res, next)=>{
    let data;
    if (req.query !== undefined) data = req.query;
    _passport.default.authenticate('facebook', {
        session: false,
        scope: [
            'email'
        ],
        state: data != null ? JSON.stringify(data) : ''
    })(req, res, next);
});
authRoutes.get('/facebook/callback/', _passport.default.authenticate('facebook', {
    session: false
}), authController.facebookLogin);
/**
 * Failed Login And Signup
 */ authRoutes.get('/failedlogin', ()=>{
    console.log('Failed Login');
});
authRoutes.get('/logout', (req, res)=>{
    _app.userLogged.id = '';
    _app.userLogged.accessToken = '';
    res.clearCookie('jwt');
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hdXRoL2F1dGgucm91dGVzLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qIGVzbGludC1kaXNhYmxlIEB0eXBlc2NyaXB0LWVzbGludC9uby1taXN1c2VkLXByb21pc2VzICovXHJcbmltcG9ydCB7IHR5cGUgTmV4dEZ1bmN0aW9uLCBSb3V0ZXIsIHR5cGUgUmVxdWVzdCwgdHlwZSBSZXNwb25zZSB9IGZyb20gJ2V4cHJlc3MnXHJcbmltcG9ydCB7IEF1dGhDb250cm9sbGVyIH0gZnJvbSAnLi9hdXRoLmNvbnRyb2xsZXInXHJcbmltcG9ydCB7IHVwbG9hZCB9IGZyb20gJy4uL3Bvc3QvcG9zdC5yb3V0ZXMnXHJcbmltcG9ydCBwYXNzcG9ydCBmcm9tICdwYXNzcG9ydCdcclxuaW1wb3J0IGRvdGVudiBmcm9tICdkb3RlbnYnXHJcbmltcG9ydCB7IHVzZXJMb2dnZWQgfSBmcm9tICcuLi9hcHAnXHJcbmltcG9ydCB7IHVybCB9IGZyb20gJy4uL1NlcnZpY2VzL2dvb2dsZS5zZXJ2aWNlJ1xyXG5cclxuZG90ZW52LmNvbmZpZygpXHJcbmV4cG9ydCBjb25zdCBhdXRoUm91dGVzID0gUm91dGVyKClcclxuY29uc3QgYXV0aENvbnRyb2xsZXIgPSBuZXcgQXV0aENvbnRyb2xsZXIoKVxyXG5hdXRoUm91dGVzLnBvc3QoJy90b2tlbicsIHBhc3Nwb3J0LmF1dGhlbnRpY2F0ZSgnand0JywgeyBzZXNzaW9uOiBmYWxzZSB9KSwgYXV0aENvbnRyb2xsZXIuand0UmVuZXdhbFRva2VuLCBhdXRoQ29udHJvbGxlci5zZW5kQXV0aERhdGEpXHJcbmF1dGhSb3V0ZXMuZ2V0KCcvdG9rZW4nLCBwYXNzcG9ydC5hdXRoZW50aWNhdGUoJ2p3dCcsIHsgc2Vzc2lvbjogZmFsc2UgfSksIGF1dGhDb250cm9sbGVyLmp3dFJlbmV3YWxUb2tlbiwgYXV0aENvbnRyb2xsZXIuc2VuZEF1dGhEYXRhKVxyXG5hdXRoUm91dGVzLnBvc3QoJy9sb2dpbicsIHBhc3Nwb3J0LmF1dGhlbnRpY2F0ZSgnbG9naW4nLHtzZXNzaW9uOmZhbHNlfSksIGF1dGhDb250cm9sbGVyLmxvY2FsTG9naW4pXHJcbmF1dGhSb3V0ZXMuZ2V0KCcvc2V0Y29va2llJywgKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSkgPT4ge1xyXG4gIHJlcy5jb29raWUoJ2FkcmlhbicsICdncm9zbycpXHJcbiAgcmVzLnNlbmQoeyBvazogdHJ1ZSB9KVxyXG59KVxyXG5hdXRoUm91dGVzLmdldCgnL2dldGNvb2tpZXMnLCAocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlKSA9PiB7XHJcbiAgcmVzLnNlbmQoeyBvazogdHJ1ZSwgY29va2llOiByZXEuY29va2llcyB9KVxyXG59KVxyXG5hdXRoUm91dGVzLnBvc3QoJy9zaWdudXAnLCB1cGxvYWQuc2luZ2xlKCdhdmF0YXInKSwgcGFzc3BvcnQuYXV0aGVudGljYXRlKCdyZWdpc3RlcicsIHsgc2Vzc2lvbjogZmFsc2UgfSksIGF1dGhDb250cm9sbGVyLmxvY2FsTG9naW4pXHJcbmF1dGhSb3V0ZXMuZ2V0KCcvZ29hdXRoJywgcGFzc3BvcnQuYXV0aGVudGljYXRlKCdnb29nbGUnLCB7c2Vzc2lvbjpmYWxzZSxcclxuICBzY29wZTogWydwcm9maWxlJywgJ2VtYWlsJywgJ29wZW5pZCddLCBwcm9tcHQ6ICdjb25zZW50J1xyXG59KSwgYXV0aENvbnRyb2xsZXIuZ09BdXRoTG9naW4pXHJcbmF1dGhSb3V0ZXMuZ2V0KCcvaW5uZXJBdXRoJywgKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSkgPT4geyByZXMucmVkaXJlY3QodXJsKSB9KVxyXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLW1pc3VzZWQtcHJvbWlzZXNcclxuYXV0aFJvdXRlcy5nZXQoJy9pbm5lckF1dGgvY2InLCBhdXRoQ29udHJvbGxlci5pbm5lclRva2VuKVxyXG5hdXRoUm91dGVzLmdldCgnL2lzUlRWYWxpZCcsIGF1dGhDb250cm9sbGVyLmlzUlRWYWxpZClcclxuYXV0aFJvdXRlcy5nZXQoJy9nb29nbGUvZ2V0dXNlcicsIHBhc3Nwb3J0LmF1dGhlbnRpY2F0ZSgnZ29vZ2xlJywgeyBzY29wZTogWydwcm9maWxlJywgJ2VtYWlsJ10gfSksIGF1dGhDb250cm9sbGVyLmdPQXV0aExvZ2luKVxyXG5hdXRoUm91dGVzLmdldCgnL2ZhY2Vib29rJywgKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSwgbmV4dDogTmV4dEZ1bmN0aW9uKSA9PiB7XHJcbiAgbGV0IGRhdGFcclxuICBpZiAocmVxLnF1ZXJ5ICE9PSB1bmRlZmluZWQpIGRhdGEgPSByZXEucXVlcnlcclxuICBwYXNzcG9ydC5hdXRoZW50aWNhdGUoJ2ZhY2Vib29rJywge3Nlc3Npb246ZmFsc2UsIHNjb3BlOiBbJ2VtYWlsJ10sIHN0YXRlOiAoZGF0YSAhPSBudWxsKSA/IEpTT04uc3RyaW5naWZ5KGRhdGEpIDogJycgfSkocmVxLCByZXMsIG5leHQpXHJcbn0pXHJcbmF1dGhSb3V0ZXMuZ2V0KCcvZmFjZWJvb2svY2FsbGJhY2svJywgcGFzc3BvcnQuYXV0aGVudGljYXRlKCdmYWNlYm9vaycse3Nlc3Npb246ZmFsc2V9KSwgYXV0aENvbnRyb2xsZXIuZmFjZWJvb2tMb2dpbilcclxuXHJcbi8qKlxyXG4gKiBGYWlsZWQgTG9naW4gQW5kIFNpZ251cFxyXG4gKi9cclxuXHJcbmF1dGhSb3V0ZXMuZ2V0KCcvZmFpbGVkbG9naW4nLCAoKSA9PiB7XHJcbiAgY29uc29sZS5sb2coJ0ZhaWxlZCBMb2dpbicpXHJcbn0pXHJcbmF1dGhSb3V0ZXMuZ2V0KCcvbG9nb3V0JywgKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSkgPT4ge1xyXG4gIHVzZXJMb2dnZWQuaWQgPSAnJ1xyXG4gIHVzZXJMb2dnZWQuYWNjZXNzVG9rZW4gPSAnJ1xyXG4gIHJlcy5jbGVhckNvb2tpZSgnand0JylcclxufSlcclxuIl0sIm5hbWVzIjpbImF1dGhSb3V0ZXMiLCJkb3RlbnYiLCJjb25maWciLCJSb3V0ZXIiLCJhdXRoQ29udHJvbGxlciIsIkF1dGhDb250cm9sbGVyIiwicG9zdCIsInBhc3Nwb3J0IiwiYXV0aGVudGljYXRlIiwic2Vzc2lvbiIsImp3dFJlbmV3YWxUb2tlbiIsInNlbmRBdXRoRGF0YSIsImdldCIsImxvY2FsTG9naW4iLCJyZXEiLCJyZXMiLCJjb29raWUiLCJzZW5kIiwib2siLCJjb29raWVzIiwidXBsb2FkIiwic2luZ2xlIiwic2NvcGUiLCJwcm9tcHQiLCJnT0F1dGhMb2dpbiIsInJlZGlyZWN0IiwidXJsIiwiaW5uZXJUb2tlbiIsImlzUlRWYWxpZCIsIm5leHQiLCJkYXRhIiwicXVlcnkiLCJ1bmRlZmluZWQiLCJzdGF0ZSIsIkpTT04iLCJzdHJpbmdpZnkiLCJmYWNlYm9va0xvZ2luIiwiY29uc29sZSIsImxvZyIsInVzZXJMb2dnZWQiLCJpZCIsImFjY2Vzc1Rva2VuIiwiY2xlYXJDb29raWUiXSwicmFuZ2VNYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OyIsIm1hcHBpbmdzIjoiQUFBQSx5REFBeUQ7Ozs7K0JBVTVDQTs7O2VBQUFBOzs7eUJBVDBEO2dDQUN4Qzs0QkFDUjtpRUFDRjsrREFDRjtxQkFDUTsrQkFDUDs7Ozs7O0FBRXBCQyxlQUFNLENBQUNDLE1BQU07QUFDTixNQUFNRixhQUFhRyxJQUFBQSxlQUFNO0FBQ2hDLE1BQU1DLGlCQUFpQixJQUFJQyw4QkFBYztBQUN6Q0wsV0FBV00sSUFBSSxDQUFDLFVBQVVDLGlCQUFRLENBQUNDLFlBQVksQ0FBQyxPQUFPO0lBQUVDLFNBQVM7QUFBTSxJQUFJTCxlQUFlTSxlQUFlLEVBQUVOLGVBQWVPLFlBQVk7QUFDdklYLFdBQVdZLEdBQUcsQ0FBQyxVQUFVTCxpQkFBUSxDQUFDQyxZQUFZLENBQUMsT0FBTztJQUFFQyxTQUFTO0FBQU0sSUFBSUwsZUFBZU0sZUFBZSxFQUFFTixlQUFlTyxZQUFZO0FBQ3RJWCxXQUFXTSxJQUFJLENBQUMsVUFBVUMsaUJBQVEsQ0FBQ0MsWUFBWSxDQUFDLFNBQVE7SUFBQ0MsU0FBUTtBQUFLLElBQUlMLGVBQWVTLFVBQVU7QUFDbkdiLFdBQVdZLEdBQUcsQ0FBQyxjQUFjLENBQUNFLEtBQWNDO0lBQzFDQSxJQUFJQyxNQUFNLENBQUMsVUFBVTtJQUNyQkQsSUFBSUUsSUFBSSxDQUFDO1FBQUVDLElBQUk7SUFBSztBQUN0QjtBQUNBbEIsV0FBV1ksR0FBRyxDQUFDLGVBQWUsQ0FBQ0UsS0FBY0M7SUFDM0NBLElBQUlFLElBQUksQ0FBQztRQUFFQyxJQUFJO1FBQU1GLFFBQVFGLElBQUlLLE9BQU87SUFBQztBQUMzQztBQUNBbkIsV0FBV00sSUFBSSxDQUFDLFdBQVdjLGtCQUFNLENBQUNDLE1BQU0sQ0FBQyxXQUFXZCxpQkFBUSxDQUFDQyxZQUFZLENBQUMsWUFBWTtJQUFFQyxTQUFTO0FBQU0sSUFBSUwsZUFBZVMsVUFBVTtBQUNwSWIsV0FBV1ksR0FBRyxDQUFDLFdBQVdMLGlCQUFRLENBQUNDLFlBQVksQ0FBQyxVQUFVO0lBQUNDLFNBQVE7SUFDakVhLE9BQU87UUFBQztRQUFXO1FBQVM7S0FBUztJQUFFQyxRQUFRO0FBQ2pELElBQUluQixlQUFlb0IsV0FBVztBQUM5QnhCLFdBQVdZLEdBQUcsQ0FBQyxjQUFjLENBQUNFLEtBQWNDO0lBQW9CQSxJQUFJVSxRQUFRLENBQUNDLGtCQUFHO0FBQUU7QUFDbEYsa0VBQWtFO0FBQ2xFMUIsV0FBV1ksR0FBRyxDQUFDLGlCQUFpQlIsZUFBZXVCLFVBQVU7QUFDekQzQixXQUFXWSxHQUFHLENBQUMsY0FBY1IsZUFBZXdCLFNBQVM7QUFDckQ1QixXQUFXWSxHQUFHLENBQUMsbUJBQW1CTCxpQkFBUSxDQUFDQyxZQUFZLENBQUMsVUFBVTtJQUFFYyxPQUFPO1FBQUM7UUFBVztLQUFRO0FBQUMsSUFBSWxCLGVBQWVvQixXQUFXO0FBQzlIeEIsV0FBV1ksR0FBRyxDQUFDLGFBQWEsQ0FBQ0UsS0FBY0MsS0FBZWM7SUFDeEQsSUFBSUM7SUFDSixJQUFJaEIsSUFBSWlCLEtBQUssS0FBS0MsV0FBV0YsT0FBT2hCLElBQUlpQixLQUFLO0lBQzdDeEIsaUJBQVEsQ0FBQ0MsWUFBWSxDQUFDLFlBQVk7UUFBQ0MsU0FBUTtRQUFPYSxPQUFPO1lBQUM7U0FBUTtRQUFFVyxPQUFPLEFBQUNILFFBQVEsT0FBUUksS0FBS0MsU0FBUyxDQUFDTCxRQUFRO0lBQUcsR0FBR2hCLEtBQUtDLEtBQUtjO0FBQ3JJO0FBQ0E3QixXQUFXWSxHQUFHLENBQUMsdUJBQXVCTCxpQkFBUSxDQUFDQyxZQUFZLENBQUMsWUFBVztJQUFDQyxTQUFRO0FBQUssSUFBSUwsZUFBZWdDLGFBQWE7QUFFckg7O0NBRUMsR0FFRHBDLFdBQVdZLEdBQUcsQ0FBQyxnQkFBZ0I7SUFDN0J5QixRQUFRQyxHQUFHLENBQUM7QUFDZDtBQUNBdEMsV0FBV1ksR0FBRyxDQUFDLFdBQVcsQ0FBQ0UsS0FBY0M7SUFDdkN3QixlQUFVLENBQUNDLEVBQUUsR0FBRztJQUNoQkQsZUFBVSxDQUFDRSxXQUFXLEdBQUc7SUFDekIxQixJQUFJMkIsV0FBVyxDQUFDO0FBQ2xCIn0=
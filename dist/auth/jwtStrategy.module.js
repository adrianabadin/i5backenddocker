/* eslint-disable @typescript-eslint/no-misused-promises */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "cookieExtractor", {
    enumerable: true,
    get: function() {
        return cookieExtractor;
    }
});
const _passportjwt = require("passport-jwt");
const _passport = /*#__PURE__*/ _interop_require_default(require("passport"));
const _authservice = require("./auth.service");
const _keypairservice = require("../Services/keypair.service");
const _fs = /*#__PURE__*/ _interop_require_default(require("fs"));
const _dotenv = /*#__PURE__*/ _interop_require_default(require("dotenv"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
// import * as jwt from 'jsonwebtoken'
_dotenv.default.config();
const publicKey = _fs.default.readFileSync(`${process.env.KEYS_PATH}/publicKey.pem`, 'utf-8');
const simetricKey = '+vdKrc3rEqncv+pgGy9WmhZXoQfWsPiAuc1UA5yfujE=' // process.env.SIMETRICKEY
;
const authService = new _authservice.AuthService();
const cookieExtractor = (req)=>{
    let { jwt: token } = req.cookies;
    console.log(token);
    if ('jwt' in req.body && req.body.jwt !== null && token === undefined) {
        token = req.body.jwt;
    }
    if (token !== undefined) {
        if (simetricKey !== undefined) return (0, _keypairservice.decrypt)(token, simetricKey);
        else throw new Error('simetricKey is undefined');
    } else throw new Error('Token is undefined');
};
_passport.default.use(new _passportjwt.Strategy({
    jwtFromRequest: _passportjwt.ExtractJwt.fromExtractors([
        cookieExtractor
    ]),
    secretOrKey: publicKey,
    algorithms: [
        'RS256'
    ],
    passReqToCallback: true
}, authService.jwtLoginVerify));

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hdXRoL2p3dFN0cmF0ZWd5Lm1vZHVsZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKiBlc2xpbnQtZGlzYWJsZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tbWlzdXNlZC1wcm9taXNlcyAqL1xyXG5pbXBvcnQgeyBTdHJhdGVneSwgRXh0cmFjdEp3dCB9IGZyb20gJ3Bhc3Nwb3J0LWp3dCdcclxuaW1wb3J0IHBhc3Nwb3J0IGZyb20gJ3Bhc3Nwb3J0J1xyXG5pbXBvcnQgeyBBdXRoU2VydmljZSB9IGZyb20gJy4vYXV0aC5zZXJ2aWNlJ1xyXG5pbXBvcnQgeyBkZWNyeXB0IH0gZnJvbSAnLi4vU2VydmljZXMva2V5cGFpci5zZXJ2aWNlJ1xyXG5pbXBvcnQgeyB0eXBlIFJlcXVlc3QgfSBmcm9tICdleHByZXNzJ1xyXG5pbXBvcnQgZnMgZnJvbSAnZnMnXHJcbmltcG9ydCBkb3RlbnYgZnJvbSAnZG90ZW52J1xyXG4vLyBpbXBvcnQgKiBhcyBqd3QgZnJvbSAnanNvbndlYnRva2VuJ1xyXG5kb3RlbnYuY29uZmlnKClcclxuY29uc3QgcHVibGljS2V5ID0gZnMucmVhZEZpbGVTeW5jKGAke3Byb2Nlc3MuZW52LktFWVNfUEFUSH0vcHVibGljS2V5LnBlbWAsICd1dGYtOCcpXHJcbmNvbnN0IHNpbWV0cmljS2V5ID0gJyt2ZEtyYzNyRXFuY3YrcGdHeTlXbWhaWG9RZldzUGlBdWMxVUE1eWZ1akU9Jy8vIHByb2Nlc3MuZW52LlNJTUVUUklDS0VZXHJcblxyXG5jb25zdCBhdXRoU2VydmljZSA9IG5ldyBBdXRoU2VydmljZSgpXHJcbmV4cG9ydCBjb25zdCBjb29raWVFeHRyYWN0b3IgPSAocmVxOiBSZXF1ZXN0KTogc3RyaW5nID0+IHtcclxuICBsZXQgeyBqd3Q6IHRva2VuIH0gPSByZXEuY29va2llc1xyXG4gIGNvbnNvbGUubG9nKHRva2VuKVxyXG4gIGlmICgnand0JyBpbiByZXEuYm9keSAmJiByZXEuYm9keS5qd3QgIT09IG51bGwgJiYgdG9rZW4gPT09IHVuZGVmaW5lZCkgeyB0b2tlbiA9IHJlcS5ib2R5Lmp3dCB9XHJcbiAgaWYgKHRva2VuICE9PSB1bmRlZmluZWQpIHtcclxuICAgIGlmIChzaW1ldHJpY0tleSAhPT0gdW5kZWZpbmVkKSByZXR1cm4gZGVjcnlwdCh0b2tlbiwgc2ltZXRyaWNLZXkpXHJcbiAgICBlbHNlIHRocm93IG5ldyBFcnJvcignc2ltZXRyaWNLZXkgaXMgdW5kZWZpbmVkJylcclxuICB9IGVsc2UgdGhyb3cgbmV3IEVycm9yKCdUb2tlbiBpcyB1bmRlZmluZWQnKVxyXG59XHJcbnBhc3Nwb3J0LnVzZShuZXcgU3RyYXRlZ3koe1xyXG4gIGp3dEZyb21SZXF1ZXN0OiBFeHRyYWN0Snd0LmZyb21FeHRyYWN0b3JzKFtjb29raWVFeHRyYWN0b3JdKSxcclxuICBzZWNyZXRPcktleTogcHVibGljS2V5LFxyXG4gIGFsZ29yaXRobXM6IFsnUlMyNTYnXSxcclxuICBwYXNzUmVxVG9DYWxsYmFjazogdHJ1ZVxyXG59LCBhdXRoU2VydmljZS5qd3RMb2dpblZlcmlmeSkpXHJcbiJdLCJuYW1lcyI6WyJjb29raWVFeHRyYWN0b3IiLCJkb3RlbnYiLCJjb25maWciLCJwdWJsaWNLZXkiLCJmcyIsInJlYWRGaWxlU3luYyIsInByb2Nlc3MiLCJlbnYiLCJLRVlTX1BBVEgiLCJzaW1ldHJpY0tleSIsImF1dGhTZXJ2aWNlIiwiQXV0aFNlcnZpY2UiLCJyZXEiLCJqd3QiLCJ0b2tlbiIsImNvb2tpZXMiLCJjb25zb2xlIiwibG9nIiwiYm9keSIsInVuZGVmaW5lZCIsImRlY3J5cHQiLCJFcnJvciIsInBhc3Nwb3J0IiwidXNlIiwiU3RyYXRlZ3kiLCJqd3RGcm9tUmVxdWVzdCIsIkV4dHJhY3RKd3QiLCJmcm9tRXh0cmFjdG9ycyIsInNlY3JldE9yS2V5IiwiYWxnb3JpdGhtcyIsInBhc3NSZXFUb0NhbGxiYWNrIiwiand0TG9naW5WZXJpZnkiXSwicmFuZ2VNYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7IiwibWFwcGluZ3MiOiJBQUFBLHlEQUF5RDs7OzsrQkFjNUNBOzs7ZUFBQUE7Ozs2QkFid0I7aUVBQ2hCOzZCQUNPO2dDQUNKOzJEQUVUOytEQUNJOzs7Ozs7QUFDbkIsc0NBQXNDO0FBQ3RDQyxlQUFNLENBQUNDLE1BQU07QUFDYixNQUFNQyxZQUFZQyxXQUFFLENBQUNDLFlBQVksQ0FBQyxDQUFDLEVBQUVDLFFBQVFDLEdBQUcsQ0FBQ0MsU0FBUyxDQUFDLGNBQWMsQ0FBQyxFQUFFO0FBQzVFLE1BQU1DLGNBQWMsK0NBQThDLDBCQUEwQjs7QUFFNUYsTUFBTUMsY0FBYyxJQUFJQyx3QkFBVztBQUM1QixNQUFNWCxrQkFBa0IsQ0FBQ1k7SUFDOUIsSUFBSSxFQUFFQyxLQUFLQyxLQUFLLEVBQUUsR0FBR0YsSUFBSUcsT0FBTztJQUNoQ0MsUUFBUUMsR0FBRyxDQUFDSDtJQUNaLElBQUksU0FBU0YsSUFBSU0sSUFBSSxJQUFJTixJQUFJTSxJQUFJLENBQUNMLEdBQUcsS0FBSyxRQUFRQyxVQUFVSyxXQUFXO1FBQUVMLFFBQVFGLElBQUlNLElBQUksQ0FBQ0wsR0FBRztJQUFDO0lBQzlGLElBQUlDLFVBQVVLLFdBQVc7UUFDdkIsSUFBSVYsZ0JBQWdCVSxXQUFXLE9BQU9DLElBQUFBLHVCQUFPLEVBQUNOLE9BQU9MO2FBQ2hELE1BQU0sSUFBSVksTUFBTTtJQUN2QixPQUFPLE1BQU0sSUFBSUEsTUFBTTtBQUN6QjtBQUNBQyxpQkFBUSxDQUFDQyxHQUFHLENBQUMsSUFBSUMscUJBQVEsQ0FBQztJQUN4QkMsZ0JBQWdCQyx1QkFBVSxDQUFDQyxjQUFjLENBQUM7UUFBQzNCO0tBQWdCO0lBQzNENEIsYUFBYXpCO0lBQ2IwQixZQUFZO1FBQUM7S0FBUTtJQUNyQkMsbUJBQW1CO0FBQ3JCLEdBQUdwQixZQUFZcUIsY0FBYyJ9
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "routeHandler", {
    enumerable: true,
    get: function() {
        return routeHandler;
    }
});
const _authroutes = require("./auth/auth.routes");
const _postroutes = require("./post/post.routes");
const _adsroutes = /*#__PURE__*/ _interop_require_default(require("./ads/ads.routes"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function routeHandler(app) {
    app.use('/auth', _authroutes.authRoutes);
    app.use('/post', _postroutes.postRouter);
    app.use('/ads', _adsroutes.default);
    app.use('/', (req, res)=>{
        console.log('root', req.path);
    });
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9hcHAucm91dGVzLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIlxyXG5pbXBvcnQgeyAgUmVxdWVzdCwgIEFwcGxpY2F0aW9uLCBSZXNwb25zZSB9IGZyb20gJ2V4cHJlc3MnXHJcbmltcG9ydCB7IGF1dGhSb3V0ZXMgfSBmcm9tICcuL2F1dGgvYXV0aC5yb3V0ZXMnXHJcbmltcG9ydCB7IHBvc3RSb3V0ZXIgfSBmcm9tICcuL3Bvc3QvcG9zdC5yb3V0ZXMnXHJcbmltcG9ydCBhZHNSb3V0ZXIgZnJvbSAnLi9hZHMvYWRzLnJvdXRlcydcclxuZXhwb3J0IGZ1bmN0aW9uIHJvdXRlSGFuZGxlciAoYXBwOiBBcHBsaWNhdGlvbik6IHZvaWQge1xyXG4gIGFwcC51c2UoJy9hdXRoJywgYXV0aFJvdXRlcylcclxuICBhcHAudXNlKCcvcG9zdCcsIHBvc3RSb3V0ZXIpXHJcbiAgYXBwLnVzZSgnL2FkcycsIGFkc1JvdXRlcilcclxuICBhcHAudXNlKCcvJywgKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSkgPT4ge1xyXG4gICAgY29uc29sZS5sb2coJ3Jvb3QnLCByZXEucGF0aClcclxuICB9KVxyXG59XHJcbiJdLCJuYW1lcyI6WyJyb3V0ZUhhbmRsZXIiLCJhcHAiLCJ1c2UiLCJhdXRoUm91dGVzIiwicG9zdFJvdXRlciIsImFkc1JvdXRlciIsInJlcSIsInJlcyIsImNvbnNvbGUiLCJsb2ciLCJwYXRoIl0sInJhbmdlTWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7IiwibWFwcGluZ3MiOiI7Ozs7K0JBS2dCQTs7O2VBQUFBOzs7NEJBSFc7NEJBQ0E7a0VBQ0w7Ozs7OztBQUNmLFNBQVNBLGFBQWNDLEdBQWdCO0lBQzVDQSxJQUFJQyxHQUFHLENBQUMsU0FBU0Msc0JBQVU7SUFDM0JGLElBQUlDLEdBQUcsQ0FBQyxTQUFTRSxzQkFBVTtJQUMzQkgsSUFBSUMsR0FBRyxDQUFDLFFBQVFHLGtCQUFTO0lBQ3pCSixJQUFJQyxHQUFHLENBQUMsS0FBSyxDQUFDSSxLQUFjQztRQUMxQkMsUUFBUUMsR0FBRyxDQUFDLFFBQVFILElBQUlJLElBQUk7SUFDOUI7QUFDRiJ9
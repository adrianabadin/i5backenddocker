/* eslint-disable @typescript-eslint/no-misused-promises */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "app", {
    enumerable: true,
    get: function() {
        return app;
    }
});
const _express = /*#__PURE__*/ _interop_require_default(require("express"));
const _cookieparser = /*#__PURE__*/ _interop_require_default(require("cookie-parser"));
const _passport = /*#__PURE__*/ _interop_require_default(require("passport"));
require("./auth/localStrategy.module");
require("./auth/googleOauth2.module");
require("./auth/jwtStrategy.module");
require("./auth/facebook.module");
const _approutes = require("./app.routes");
const _cors = /*#__PURE__*/ _interop_require_default(require("cors"));
const _morgan = /*#__PURE__*/ _interop_require_default(require("morgan"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const app = (0, _express.default)();
app.use(_express.default.json());
app.use(_express.default.urlencoded({
    extended: true
}));
app.use((0, _cookieparser.default)()) // "Whether 'tis nobler in the mind to suffer"
;
app.use((0, _morgan.default)('dev'));
app.use((0, _cors.default)({
    origin: [
        'http://localhost:3000',
        'http://localhost:3000/managment'
    ],
    credentials: true,
    preflightContinue: true
}));
app.use(_express.default.static('public'));
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
app.use(_passport.default.initialize());
// app.use(passport.session())
// passport.serializeUser(authService.serialize)
// passport.deserializeUser(authService.deSerialize)
(0, _approutes.routeHandler)(app);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9hcHAubWlkZGxld2FyZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKiBlc2xpbnQtZGlzYWJsZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tbWlzdXNlZC1wcm9taXNlcyAqL1xyXG5pbXBvcnQgZXhwcmVzcywgeyB0eXBlIE5leHRGdW5jdGlvbiwgdHlwZSBSZXF1ZXN0LCB0eXBlIFJlc3BvbnNlIH0gZnJvbSAnZXhwcmVzcydcclxuaW1wb3J0IGNvb2tpZVBhcnNlciBmcm9tICdjb29raWUtcGFyc2VyJ1xyXG5pbXBvcnQgcGFzc3BvcnQgZnJvbSAncGFzc3BvcnQnXHJcbmltcG9ydCAnLi9hdXRoL2xvY2FsU3RyYXRlZ3kubW9kdWxlJ1xyXG5pbXBvcnQgJy4vYXV0aC9nb29nbGVPYXV0aDIubW9kdWxlJ1xyXG5pbXBvcnQgJy4vYXV0aC9qd3RTdHJhdGVneS5tb2R1bGUnXHJcbmltcG9ydCAnLi9hdXRoL2ZhY2Vib29rLm1vZHVsZSdcclxuXHJcbmltcG9ydCB7IHJvdXRlSGFuZGxlciB9IGZyb20gJy4vYXBwLnJvdXRlcydcclxuaW1wb3J0IGNvcnMgZnJvbSAnY29ycydcclxuXHJcbmltcG9ydCBtb3JnYW4gZnJvbSAnbW9yZ2FuJ1xyXG5cclxuLy8gY29uc3QgYXV0aFNlcnZpY2UgPSBuZXcgQXV0aFNlcnZpY2UoKVxyXG5leHBvcnQgY29uc3QgYXBwID0gZXhwcmVzcygpXHJcblxyXG5hcHAudXNlKGV4cHJlc3MuanNvbigpKVxyXG5hcHAudXNlKGV4cHJlc3MudXJsZW5jb2RlZCh7IGV4dGVuZGVkOiB0cnVlIH0pKVxyXG5hcHAudXNlKGNvb2tpZVBhcnNlcigpKSAvLyBcIldoZXRoZXIgJ3RpcyBub2JsZXIgaW4gdGhlIG1pbmQgdG8gc3VmZmVyXCJcclxuXHJcbmFwcC51c2UobW9yZ2FuKCdkZXYnKSlcclxuYXBwLnVzZShjb3JzKHtcclxuICBvcmlnaW46IFsnaHR0cDovL2xvY2FsaG9zdDozMDAwJywgJ2h0dHA6Ly9sb2NhbGhvc3Q6MzAwMC9tYW5hZ21lbnQnXSxcclxuICBjcmVkZW50aWFsczogdHJ1ZSxcclxuICBwcmVmbGlnaHRDb250aW51ZTogdHJ1ZVxyXG59KSlcclxuYXBwLnVzZShleHByZXNzLnN0YXRpYygncHVibGljJykpXHJcblxyXG4vLyBjb25zdCBzdG9yZSA9IG5ldyBQcmlzbWFTZXNzaW9uU3RvcmUocHJpc21hQ2xpZW50LCB7XHJcbi8vICAgY2hlY2tQZXJpb2Q6IDIgKiA2MCAqIDEwMDAsIC8vIG1zXHJcbi8vICAgZGJSZWNvcmRJZElzU2Vzc2lvbklkOiB0cnVlLFxyXG4vLyAgIGRiUmVjb3JkSWRGdW5jdGlvbjogdW5kZWZpbmVkLFxyXG4vLyAgIHR0bDogNjAgKiA2MCAqIDEwMDAgKiAyNFxyXG4vLyB9KVxyXG4vLyBjb25zdCBzZXNzaW9uTWlkZGxld2FyZSA9IFNlc3Npb24oe1xyXG5cclxuLy8gICByZXNhdmU6IGZhbHNlLFxyXG4vLyAgIHNhdmVVbmluaXRpYWxpemVkOiBmYWxzZSxcclxuLy8gICBjb29raWU6IHsgc2FtZVNpdGU6ICdub25lJywgc2VjdXJlOiB0cnVlLCBodHRwT25seTogZmFsc2UgfSxcclxuLy8gICBzZWNyZXQ6ICdEaWxhdGVkIGZsYWtlcyBvZiBmaXJlIGZhbGwsIGxpa2Ugc25vdyBpbiB0aGUgQWxwcyB3aGVuIHRoZXJlIGlzIG5vIHdpbmQnXHJcblxyXG4vLyB9KVxyXG5cclxuLy8gYXBwLnVzZShzZXNzaW9uTWlkZGxld2FyZSlcclxuLy8gYXBwLnVzZShmbGFzaCgpKVxyXG5hcHAudXNlKHBhc3Nwb3J0LmluaXRpYWxpemUoKSlcclxuLy8gYXBwLnVzZShwYXNzcG9ydC5zZXNzaW9uKCkpXHJcbi8vIHBhc3Nwb3J0LnNlcmlhbGl6ZVVzZXIoYXV0aFNlcnZpY2Uuc2VyaWFsaXplKVxyXG4vLyBwYXNzcG9ydC5kZXNlcmlhbGl6ZVVzZXIoYXV0aFNlcnZpY2UuZGVTZXJpYWxpemUpXHJcbnJvdXRlSGFuZGxlcihhcHApXHJcbiJdLCJuYW1lcyI6WyJhcHAiLCJleHByZXNzIiwidXNlIiwianNvbiIsInVybGVuY29kZWQiLCJleHRlbmRlZCIsImNvb2tpZVBhcnNlciIsIm1vcmdhbiIsImNvcnMiLCJvcmlnaW4iLCJjcmVkZW50aWFscyIsInByZWZsaWdodENvbnRpbnVlIiwic3RhdGljIiwicGFzc3BvcnQiLCJpbml0aWFsaXplIiwicm91dGVIYW5kbGVyIl0sInJhbmdlTWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzsiLCJtYXBwaW5ncyI6IkFBQUEseURBQXlEOzs7OytCQWU1Q0E7OztlQUFBQTs7O2dFQWQyRDtxRUFDL0M7aUVBQ0o7UUFDZDtRQUNBO1FBQ0E7UUFDQTsyQkFFc0I7NkRBQ1o7K0RBRUU7Ozs7OztBQUdaLE1BQU1BLE1BQU1DLElBQUFBLGdCQUFPO0FBRTFCRCxJQUFJRSxHQUFHLENBQUNELGdCQUFPLENBQUNFLElBQUk7QUFDcEJILElBQUlFLEdBQUcsQ0FBQ0QsZ0JBQU8sQ0FBQ0csVUFBVSxDQUFDO0lBQUVDLFVBQVU7QUFBSztBQUM1Q0wsSUFBSUUsR0FBRyxDQUFDSSxJQUFBQSxxQkFBWSxLQUFJLDhDQUE4Qzs7QUFFdEVOLElBQUlFLEdBQUcsQ0FBQ0ssSUFBQUEsZUFBTSxFQUFDO0FBQ2ZQLElBQUlFLEdBQUcsQ0FBQ00sSUFBQUEsYUFBSSxFQUFDO0lBQ1hDLFFBQVE7UUFBQztRQUF5QjtLQUFrQztJQUNwRUMsYUFBYTtJQUNiQyxtQkFBbUI7QUFDckI7QUFDQVgsSUFBSUUsR0FBRyxDQUFDRCxnQkFBTyxDQUFDVyxNQUFNLENBQUM7QUFFdkIsdURBQXVEO0FBQ3ZELHNDQUFzQztBQUN0QyxpQ0FBaUM7QUFDakMsbUNBQW1DO0FBQ25DLDZCQUE2QjtBQUM3QixLQUFLO0FBQ0wsc0NBQXNDO0FBRXRDLG1CQUFtQjtBQUNuQiw4QkFBOEI7QUFDOUIsaUVBQWlFO0FBQ2pFLHVGQUF1RjtBQUV2RixLQUFLO0FBRUwsNkJBQTZCO0FBQzdCLG1CQUFtQjtBQUNuQlosSUFBSUUsR0FBRyxDQUFDVyxpQkFBUSxDQUFDQyxVQUFVO0FBQzNCLDhCQUE4QjtBQUM5QixnREFBZ0Q7QUFDaEQsb0RBQW9EO0FBQ3BEQyxJQUFBQSx1QkFBWSxFQUFDZiJ9
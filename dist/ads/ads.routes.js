/* eslint-disable @typescript-eslint/no-misused-promises */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    adsRouter: function() {
        return adsRouter;
    },
    default: function() {
        return _default;
    },
    upload: function() {
        return upload;
    }
});
const _express = require("express");
const _multer = /*#__PURE__*/ _interop_require_default(require("multer"));
const _adscontroller = require("./ads.controller");
const _zodvalidate = require("../middlewares/zod.validate");
const _adsschema = require("./ads.schema");
const _passport = /*#__PURE__*/ _interop_require_default(require("passport"));
const _authcontroller = require("../auth/auth.controller");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const authController = new _authcontroller.AuthController();
const adsController = new _adscontroller.AdsController();
const storage = _multer.default.diskStorage({
    destination: function(_req, _file, cb) {
        cb(null, './public');
    },
    filename: function(_req, file, cb) {
        // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname);
    }
});
const upload = (0, _multer.default)({
    storage
});
const adsRouter = (0, _express.Router)();
adsRouter.post('/create', _passport.default.authenticate('jwt', {
    session: false
}), authController.jwtRenewalToken, upload.single('image'), (0, _zodvalidate.schemaValidator)(_adsschema.createAdSchema), adsController.createAd);
adsRouter.get('/getAll', adsController.getAds);
adsRouter.put('/setActive/:id', _passport.default.authenticate('jwt', {
    session: false
}), authController.jwtRenewalToken, adsController.setActive);
adsRouter.put('/setInactive/:id', _passport.default.authenticate('jwt', {
    session: false
}), authController.jwtRenewalToken, adsController.setInactive);
adsRouter.delete('/delete/:id', _passport.default.authenticate('jwt', {
    session: false
}), authController.jwtRenewalToken, adsController.deleteAd);
adsRouter.get('/get/:id', adsController.getAd);
adsRouter.put('/update/:id', upload.single('image'), (0, _zodvalidate.schemaValidator)(_adsschema.createAdSchema), _passport.default.authenticate('jwt', {
    session: false
}), authController.jwtRenewalToken, adsController.updateAd);
const _default = adsRouter;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hZHMvYWRzLnJvdXRlcy50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKiBlc2xpbnQtZGlzYWJsZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tbWlzdXNlZC1wcm9taXNlcyAqL1xyXG5pbXBvcnQgeyBSb3V0ZXIsIHR5cGUgUmVxdWVzdCwgdHlwZSBOZXh0RnVuY3Rpb24sIHR5cGUgUmVzcG9uc2UgfSBmcm9tICdleHByZXNzJ1xyXG5pbXBvcnQgbXVsdGVyIGZyb20gJ211bHRlcidcclxuaW1wb3J0IHsgQWRzQ29udHJvbGxlciB9IGZyb20gJy4vYWRzLmNvbnRyb2xsZXInXHJcbmltcG9ydCB7IHNjaGVtYVZhbGlkYXRvciB9IGZyb20gJy4uL21pZGRsZXdhcmVzL3pvZC52YWxpZGF0ZSdcclxuaW1wb3J0IHsgY3JlYXRlQWRTY2hlbWEgfSBmcm9tICcuL2Fkcy5zY2hlbWEnXHJcbmltcG9ydCBwYXNzcG9ydCBmcm9tICdwYXNzcG9ydCdcclxuaW1wb3J0IHsgQXV0aENvbnRyb2xsZXIgfSBmcm9tICcuLi9hdXRoL2F1dGguY29udHJvbGxlcidcclxuY29uc3QgYXV0aENvbnRyb2xsZXIgPSBuZXcgQXV0aENvbnRyb2xsZXIoKVxyXG5jb25zdCBhZHNDb250cm9sbGVyID0gbmV3IEFkc0NvbnRyb2xsZXIoKVxyXG5jb25zdCBzdG9yYWdlID0gbXVsdGVyLmRpc2tTdG9yYWdlKHtcclxuICBkZXN0aW5hdGlvbjogZnVuY3Rpb24gKFxyXG4gICAgX3JlcTogUmVxdWVzdCxcclxuICAgIF9maWxlOiBFeHByZXNzLk11bHRlci5GaWxlLFxyXG4gICAgY2I6ICguLi5hcmc6IGFueSkgPT4gYW55XHJcbiAgKSB7XHJcbiAgICBjYihudWxsLCAnLi9wdWJsaWMnKVxyXG4gIH0sXHJcbiAgZmlsZW5hbWU6IGZ1bmN0aW9uIChcclxuICAgIF9yZXE6IFJlcXVlc3QsXHJcbiAgICBmaWxlOiBFeHByZXNzLk11bHRlci5GaWxlLFxyXG4gICAgY2I6ICguLi5hcmdzOiBhbnkpID0+IGFueVxyXG4gICkge1xyXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9yZXN0cmljdC1wbHVzLW9wZXJhbmRzXHJcbiAgICBjb25zdCB1bmlxdWVTdWZmaXggPSBEYXRlLm5vdygpICsgJy0nICsgTWF0aC5yb3VuZChNYXRoLnJhbmRvbSgpICogMWU5KVxyXG4gICAgY2IobnVsbCwgZmlsZS5maWVsZG5hbWUgKyAnLScgKyB1bmlxdWVTdWZmaXggKyAnLScgKyBmaWxlLm9yaWdpbmFsbmFtZSlcclxuICB9XHJcbn0pXHJcbmV4cG9ydCBjb25zdCB1cGxvYWQgPSBtdWx0ZXIoeyBzdG9yYWdlIH0pXHJcbmV4cG9ydCBjb25zdCBhZHNSb3V0ZXIgPSBSb3V0ZXIoKVxyXG5cclxuYWRzUm91dGVyLnBvc3QoJy9jcmVhdGUnLCBwYXNzcG9ydC5hdXRoZW50aWNhdGUoJ2p3dCcsIHsgc2Vzc2lvbjogZmFsc2UgfSksIGF1dGhDb250cm9sbGVyLmp3dFJlbmV3YWxUb2tlbiwgdXBsb2FkLnNpbmdsZSgnaW1hZ2UnKSxcclxuICBzY2hlbWFWYWxpZGF0b3IoY3JlYXRlQWRTY2hlbWEpLFxyXG4gIGFkc0NvbnRyb2xsZXIuY3JlYXRlQWQpXHJcbmFkc1JvdXRlci5nZXQoJy9nZXRBbGwnLCBhZHNDb250cm9sbGVyLmdldEFkcylcclxuYWRzUm91dGVyLnB1dCgnL3NldEFjdGl2ZS86aWQnLCBwYXNzcG9ydC5hdXRoZW50aWNhdGUoJ2p3dCcsIHsgc2Vzc2lvbjogZmFsc2UgfSksIGF1dGhDb250cm9sbGVyLmp3dFJlbmV3YWxUb2tlbiwgYWRzQ29udHJvbGxlci5zZXRBY3RpdmUpXHJcbmFkc1JvdXRlci5wdXQoJy9zZXRJbmFjdGl2ZS86aWQnLCBwYXNzcG9ydC5hdXRoZW50aWNhdGUoJ2p3dCcsIHsgc2Vzc2lvbjogZmFsc2UgfSksIGF1dGhDb250cm9sbGVyLmp3dFJlbmV3YWxUb2tlbiwgYWRzQ29udHJvbGxlci5zZXRJbmFjdGl2ZSlcclxuYWRzUm91dGVyLmRlbGV0ZSgnL2RlbGV0ZS86aWQnLCBwYXNzcG9ydC5hdXRoZW50aWNhdGUoJ2p3dCcsIHsgc2Vzc2lvbjogZmFsc2UgfSksIGF1dGhDb250cm9sbGVyLmp3dFJlbmV3YWxUb2tlbiwgYWRzQ29udHJvbGxlci5kZWxldGVBZClcclxuYWRzUm91dGVyLmdldCgnL2dldC86aWQnLCBhZHNDb250cm9sbGVyLmdldEFkKVxyXG5hZHNSb3V0ZXIucHV0KCcvdXBkYXRlLzppZCcsIHVwbG9hZC5zaW5nbGUoJ2ltYWdlJyksIHNjaGVtYVZhbGlkYXRvcihjcmVhdGVBZFNjaGVtYSksIHBhc3Nwb3J0LmF1dGhlbnRpY2F0ZSgnand0JywgeyBzZXNzaW9uOiBmYWxzZSB9KSwgYXV0aENvbnRyb2xsZXIuand0UmVuZXdhbFRva2VuLCBhZHNDb250cm9sbGVyLnVwZGF0ZUFkKVxyXG5leHBvcnQgZGVmYXVsdCBhZHNSb3V0ZXJcclxuIl0sIm5hbWVzIjpbImFkc1JvdXRlciIsInVwbG9hZCIsImF1dGhDb250cm9sbGVyIiwiQXV0aENvbnRyb2xsZXIiLCJhZHNDb250cm9sbGVyIiwiQWRzQ29udHJvbGxlciIsInN0b3JhZ2UiLCJtdWx0ZXIiLCJkaXNrU3RvcmFnZSIsImRlc3RpbmF0aW9uIiwiX3JlcSIsIl9maWxlIiwiY2IiLCJmaWxlbmFtZSIsImZpbGUiLCJ1bmlxdWVTdWZmaXgiLCJEYXRlIiwibm93IiwiTWF0aCIsInJvdW5kIiwicmFuZG9tIiwiZmllbGRuYW1lIiwib3JpZ2luYWxuYW1lIiwiUm91dGVyIiwicG9zdCIsInBhc3Nwb3J0IiwiYXV0aGVudGljYXRlIiwic2Vzc2lvbiIsImp3dFJlbmV3YWxUb2tlbiIsInNpbmdsZSIsInNjaGVtYVZhbGlkYXRvciIsImNyZWF0ZUFkU2NoZW1hIiwiY3JlYXRlQWQiLCJnZXQiLCJnZXRBZHMiLCJwdXQiLCJzZXRBY3RpdmUiLCJzZXRJbmFjdGl2ZSIsImRlbGV0ZSIsImRlbGV0ZUFkIiwiZ2V0QWQiLCJ1cGRhdGVBZCJdLCJyYW5nZU1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7IiwibWFwcGluZ3MiOiJBQUFBLHlEQUF5RDs7Ozs7Ozs7Ozs7SUE2QjVDQSxTQUFTO2VBQVRBOztJQVdiLE9BQXdCO2VBQXhCOztJQVphQyxNQUFNO2VBQU5BOzs7eUJBM0IwRDsrREFDcEQ7K0JBQ1c7NkJBQ0U7MkJBQ0Q7aUVBQ1Y7Z0NBQ1U7Ozs7OztBQUMvQixNQUFNQyxpQkFBaUIsSUFBSUMsOEJBQWM7QUFDekMsTUFBTUMsZ0JBQWdCLElBQUlDLDRCQUFhO0FBQ3ZDLE1BQU1DLFVBQVVDLGVBQU0sQ0FBQ0MsV0FBVyxDQUFDO0lBQ2pDQyxhQUFhLFNBQ1hDLElBQWEsRUFDYkMsS0FBMEIsRUFDMUJDLEVBQXdCO1FBRXhCQSxHQUFHLE1BQU07SUFDWDtJQUNBQyxVQUFVLFNBQ1JILElBQWEsRUFDYkksSUFBeUIsRUFDekJGLEVBQXlCO1FBRXpCLHFFQUFxRTtRQUNyRSxNQUFNRyxlQUFlQyxLQUFLQyxHQUFHLEtBQUssTUFBTUMsS0FBS0MsS0FBSyxDQUFDRCxLQUFLRSxNQUFNLEtBQUs7UUFDbkVSLEdBQUcsTUFBTUUsS0FBS08sU0FBUyxHQUFHLE1BQU1OLGVBQWUsTUFBTUQsS0FBS1EsWUFBWTtJQUN4RTtBQUNGO0FBQ08sTUFBTXJCLFNBQVNNLElBQUFBLGVBQU0sRUFBQztJQUFFRDtBQUFRO0FBQ2hDLE1BQU1OLFlBQVl1QixJQUFBQSxlQUFNO0FBRS9CdkIsVUFBVXdCLElBQUksQ0FBQyxXQUFXQyxpQkFBUSxDQUFDQyxZQUFZLENBQUMsT0FBTztJQUFFQyxTQUFTO0FBQU0sSUFBSXpCLGVBQWUwQixlQUFlLEVBQUUzQixPQUFPNEIsTUFBTSxDQUFDLFVBQ3hIQyxJQUFBQSw0QkFBZSxFQUFDQyx5QkFBYyxHQUM5QjNCLGNBQWM0QixRQUFRO0FBQ3hCaEMsVUFBVWlDLEdBQUcsQ0FBQyxXQUFXN0IsY0FBYzhCLE1BQU07QUFDN0NsQyxVQUFVbUMsR0FBRyxDQUFDLGtCQUFrQlYsaUJBQVEsQ0FBQ0MsWUFBWSxDQUFDLE9BQU87SUFBRUMsU0FBUztBQUFNLElBQUl6QixlQUFlMEIsZUFBZSxFQUFFeEIsY0FBY2dDLFNBQVM7QUFDeklwQyxVQUFVbUMsR0FBRyxDQUFDLG9CQUFvQlYsaUJBQVEsQ0FBQ0MsWUFBWSxDQUFDLE9BQU87SUFBRUMsU0FBUztBQUFNLElBQUl6QixlQUFlMEIsZUFBZSxFQUFFeEIsY0FBY2lDLFdBQVc7QUFDN0lyQyxVQUFVc0MsTUFBTSxDQUFDLGVBQWViLGlCQUFRLENBQUNDLFlBQVksQ0FBQyxPQUFPO0lBQUVDLFNBQVM7QUFBTSxJQUFJekIsZUFBZTBCLGVBQWUsRUFBRXhCLGNBQWNtQyxRQUFRO0FBQ3hJdkMsVUFBVWlDLEdBQUcsQ0FBQyxZQUFZN0IsY0FBY29DLEtBQUs7QUFDN0N4QyxVQUFVbUMsR0FBRyxDQUFDLGVBQWVsQyxPQUFPNEIsTUFBTSxDQUFDLFVBQVVDLElBQUFBLDRCQUFlLEVBQUNDLHlCQUFjLEdBQUdOLGlCQUFRLENBQUNDLFlBQVksQ0FBQyxPQUFPO0lBQUVDLFNBQVM7QUFBTSxJQUFJekIsZUFBZTBCLGVBQWUsRUFBRXhCLGNBQWNxQyxRQUFRO01BQzlMLFdBQWV6QyJ9
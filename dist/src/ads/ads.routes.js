"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adsRouter = exports.upload = void 0;
/* eslint-disable @typescript-eslint/no-misused-promises */
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const ads_controller_1 = require("./ads.controller");
const zod_validate_1 = require("../middlewares/zod.validate");
const ads_schema_1 = require("./ads.schema");
const passport_1 = __importDefault(require("passport"));
const auth_controller_1 = require("../auth/auth.controller");
const authController = new auth_controller_1.AuthController();
const adsController = new ads_controller_1.AdsController();
const storage = multer_1.default.diskStorage({
    destination: function (_req, _file, cb) {
        cb(null, './public');
    },
    filename: function (_req, file, cb) {
        // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname);
    }
});
exports.upload = (0, multer_1.default)({ storage });
exports.adsRouter = (0, express_1.Router)();
exports.adsRouter.post('/create', passport_1.default.authenticate('jwt', { session: false }), authController.jwtRenewalToken, exports.upload.single('image'), (0, zod_validate_1.schemaValidator)(ads_schema_1.createAdSchema), adsController.createAd);
exports.adsRouter.get('/getAll', adsController.getAds);
exports.adsRouter.put('/setActive/:id', passport_1.default.authenticate('jwt', { session: false }), authController.jwtRenewalToken, adsController.setActive);
exports.adsRouter.put('/setInactive/:id', passport_1.default.authenticate('jwt', { session: false }), authController.jwtRenewalToken, adsController.setInactive);
exports.adsRouter.delete('/delete/:id', passport_1.default.authenticate('jwt', { session: false }), authController.jwtRenewalToken, adsController.deleteAd);
exports.adsRouter.get('/get/:id', adsController.getAd);
exports.adsRouter.put('/update/:id', exports.upload.single('image'), (0, zod_validate_1.schemaValidator)(ads_schema_1.createAdSchema), passport_1.default.authenticate('jwt', { session: false }), authController.jwtRenewalToken, adsController.updateAd);
exports.default = exports.adsRouter;

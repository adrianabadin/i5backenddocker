"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdsController = void 0;
const ads_service_1 = require("./ads.service");
const logger_service_1 = require("../Services/logger.service");
const Entities_1 = require("../Entities");
const adsServiceLoad = new ads_service_1.AdsService();
class AdsController {
    constructor() {
        this.service = new ads_service_1.AdsService();
        this.service = adsServiceLoad;
        this.createAd = this.createAd.bind(this);
        this.getAds = this.getAds.bind(this);
        this.setActive = this.setActive.bind(this);
        this.setInactive = this.setInactive.bind(this);
        this.deleteAd = this.deleteAd.bind(this);
        this.getAd = this.getAd.bind(this);
        this.updateAd = this.updateAd.bind(this);
    }
    createAd(req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            console.log('valido');
            try {
                const response = yield this.service.createAd(Object.assign(Object.assign({}, req.body), { photoUrl: (_a = req.file) === null || _a === void 0 ? void 0 : _a.filename }));
                res.status(200).send({ error: null, ok: true, data: response });
            }
            catch (error) {
                logger_service_1.logger.error({ function: 'AdsController.createAd', error });
                res.status(500).send({ error, ok: false, data: null });
            }
        });
    }
    getAds(_req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.service.getAds();
                res.status(200).send(response);
            }
            catch (error) {
                logger_service_1.logger.error({ function: 'AdsController.getAds', error });
                res.status(400).send({ error, ok: false, data: null });
            }
        });
    }
    setActive(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.params, 'cosas');
            try {
                const response = yield this.service.setActive(req.params.id);
                console.log(response, req.params.id, 'texo');
                res.status(200).send(response);
            }
            catch (error) {
                logger_service_1.logger.error({ function: 'AdsController.setActive', error });
                res.status(400).send(new Entities_1.ResponseObject(error, false, null));
            }
        });
    }
    setInactive(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.params);
            try {
                const response = yield this.service.setInactive(req.params.id);
                res.status(200).send(response);
            }
            catch (error) {
                logger_service_1.logger.error({ function: 'AdsController.setInactive', error });
                res.status(400).send(new Entities_1.ResponseObject(error, false, null));
            }
        });
    }
    deleteAd(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const response = yield this.service.deleteAd(id);
                res.status(200).send(response);
            }
            catch (error) {
                logger_service_1.logger.error({ function: 'adsController.delete', error });
                res.status(404).send({ error, ok: false, data: null });
            }
        });
    }
    getAd(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.service.getAd(req.params.id);
                res.status(200).send(response);
            }
            catch (error) {
                logger_service_1.logger.error({ function: 'AdsController.getAd', error });
                res.status(404).send(error);
            }
        });
    }
    updateAd(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(req.body, 'text', req.params, req.file);
                const { photoUrl } = req.body;
                let filename;
                if (req.file !== undefined) {
                    filename = req.file.filename;
                }
                const response = yield this.service.updateAd(Object.assign(Object.assign({}, req.body), { photoUrl: filename !== undefined ? filename : photoUrl }), req.params.id);
                console.log(photoUrl, filename, response);
                res.status(200).send(response);
            }
            catch (error) {
                logger_service_1.logger.error({ function: 'AdsController.updateAd', error });
                res.status(404).send({ error, ok: false, data: null });
            }
        });
    }
}
exports.AdsController = AdsController;

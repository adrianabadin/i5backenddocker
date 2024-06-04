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
exports.AdsService = void 0;
const database_service_1 = require("../Services/database.service");
const logger_service_1 = require("../Services/logger.service");
const google_errors_1 = require("../Services/google.errors");
class AdsService {
    constructor(prisma = database_service_1.prismaClient.prisma, createAd = (data) => __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield this.prisma.ads.create({ data: { importance: data.importance, photoUrl: data.photoUrl, title: data.title, url: data.url, user: { connect: { id: data.usersId } } } });
            return new google_errors_1.ResponseObject(null, true, response);
        }
        catch (error) {
            logger_service_1.logger.error({ function: 'AdsService.createAd', error });
            return new google_errors_1.ResponseObject(error, false, null);
        }
    }), getAds = () => __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield this.prisma.ads.findMany({});
            return new google_errors_1.ResponseObject(null, true, response);
        }
        catch (error) {
            logger_service_1.logger.error({ function: 'AdsService.getAds', error });
            return new google_errors_1.ResponseObject(error, false, null);
        }
    }), setActive = (id) => __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield this.prisma.ads.update({ where: { id }, data: { isActive: true } });
            return new google_errors_1.ResponseObject(null, true, result);
        }
        catch (error) {
            logger_service_1.logger.error({ function: 'AdsService.setActive', error });
            return new google_errors_1.ResponseObject(error, false, null);
        }
    }), setInactive = (id) => __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield this.prisma.ads.update({ where: { id }, data: { isActive: false } });
            return new google_errors_1.ResponseObject(null, true, result);
        }
        catch (error) {
            logger_service_1.logger.error({ function: 'AdsService.setInactive', error });
            return new google_errors_1.ResponseObject(error, false, null);
        }
    }), deleteAd = (id) => __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield this.prisma.ads.delete({ where: { id } });
            return new google_errors_1.ResponseObject(null, true, response);
        }
        catch (error) {
            logger_service_1.logger.error({ function: 'AdsService.deleteAd', error });
            return new google_errors_1.ResponseObject(error, false, null);
        }
    }), getAd = (id) => __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield this.prisma.ads.findUnique({ where: { id } });
            console.log(response, 'getAd');
            return new google_errors_1.ResponseObject(null, true, response);
        }
        catch (error) {
            logger_service_1.logger.error({ function: 'AdsService.getAd', error });
        }
    }), updateAd = (data, id) => __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield this.prisma.ads.update({ where: { id }, data });
            return new google_errors_1.ResponseObject(null, true, response);
        }
        catch (error) {
            logger_service_1.logger.error({ function: 'AdsService.updateAd', error });
            return new google_errors_1.ResponseObject(error, false, null);
        }
    })) {
        this.prisma = prisma;
        this.createAd = createAd;
        this.getAds = getAds;
        this.setActive = setActive;
        this.setInactive = setInactive;
        this.deleteAd = deleteAd;
        this.getAd = getAd;
        this.updateAd = updateAd;
    }
}
exports.AdsService = AdsService;

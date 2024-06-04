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
exports.UsersService = void 0;
const database_service_1 = require("../Services/database.service");
const logger_service_1 = require("../Services/logger.service");
const prisma_errors_1 = require("../Services/prisma.errors");
class UsersService {
    constructor(prisma = database_service_1.prismaClient.prisma) {
        this.prisma = prisma;
        this.findById = this.findById.bind(this);
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.prisma.users.findUniqueOrThrow({
                    where: { id }
                });
                const user = Object.assign(Object.assign({}, response), { rol: response.rol, gender: response.gender });
                return user;
            }
            catch (error) {
                logger_service_1.logger.error({ function: 'UsersService.findById', error });
                return new prisma_errors_1.UnknownPrismaError(error);
            }
        });
    }
    findByUserName(username) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.prisma.users.findUniqueOrThrow({
                    where: { username }
                });
                const user = Object.assign(Object.assign({}, response), { rol: response.rol, gender: response.gender });
                const returnType = user;
                return returnType;
            }
            catch (error) {
                logger_service_1.logger.error({ function: 'UsersService.findById', error });
                return new prisma_errors_1.UnknownPrismaError(error);
            }
        });
    }
    createUser(user, fbid, accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.prisma.users.create({
                    data: {
                        hash: user.hash,
                        avatar: user.avatar,
                        username: user.username,
                        rol: fbid === undefined ? 'USER' : 'ADMIN',
                        gender: user.gender === undefined ? 'NOT_BINARY' : user.gender,
                        name: user.name,
                        lastName: user.lastName,
                        phone: user.phone,
                        birthDate: user.birthDate,
                        isVerified: fbid !== undefined,
                        fbid,
                        accessToken
                    }
                });
                const responseType = Object.assign(Object.assign({}, response), { rol: response.rol, gender: response.gender });
                return responseType;
            }
            catch (error) {
                logger_service_1.logger.error({ function: 'UsersService.createUser', error });
                return new prisma_errors_1.UnknownPrismaError(error);
            }
        });
    }
}
exports.UsersService = UsersService;

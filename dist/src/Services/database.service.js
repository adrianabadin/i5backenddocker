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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prismaClient = exports.DatabaseHandler = void 0;
const client_1 = require("@prisma/client");
const logger_service_1 = require("./logger.service");
const Entities_1 = require("../Entities");
// import { PrismaLibSQL } from '@prisma/adapter-libsql'
// import { createClient } from '@libsql/client/.'
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// const client = createClient({ url: `${process.env.TURSO_DATABASE_URL}`, authToken: `${process.env.TURSO_AUTH_TOKEN}` })
// const adapter = new PrismaLibSQL(client)
class DatabaseHandler {
    constructor(unExtendedPrisma = new client_1.PrismaClient(), prisma = unExtendedPrisma.$extends({
        model: {
            $allModels: {
                gCreate(args) {
                    return __awaiter(this, void 0, void 0, function* () {
                        try {
                            const data = yield this.create({ data: args, select: { author: { select: { name: true, lastName: true } }, id: true, createdAt: true, title: true, heading: true, text: true, classification: true, usersId: true, importance: true, isVisible: true, images: true } });
                            logger_service_1.logger.debug({
                                function: 'DatabaseHandler.create', data
                            });
                            return new Entities_1.ResponseObject(null, true, data);
                        }
                        catch (error) {
                            logger_service_1.logger.error({ function: 'DatabaseHandler.create', error });
                            return new Entities_1.ResponseObject(error, false, null);
                        }
                    });
                },
                gUpdate(dataObject, id) {
                    return __awaiter(this, void 0, void 0, function* () {
                        try {
                            const data = yield this.update({ where: { id }, data: dataObject });
                            logger_service_1.logger.debug({
                                function: 'DatabaseHandler.update', data
                            });
                            return new Entities_1.ResponseObject(null, true, data);
                        }
                        catch (error) {
                            logger_service_1.logger.error({
                                function: 'DatabaseHandler.update', error
                            });
                            return new Entities_1.ResponseObject(error, false, null);
                        }
                    });
                },
                gFindById(id, includeField) {
                    return __awaiter(this, void 0, void 0, function* () {
                        try {
                            let data;
                            if (includeField !== undefined) {
                                data = yield this.findUniqueOrThrow({ where: { id }, select: includeField });
                            }
                            else {
                                data = yield this.findUniqueOrThrow({ where: { id } });
                            }
                            return new Entities_1.ResponseObject(null, true, data);
                        }
                        catch (error) {
                            logger_service_1.logger.error({
                                function: 'DatabaseHandler.FindById', error
                            });
                            return new Entities_1.ResponseObject(error, false, null);
                        }
                    });
                },
                gGetAll(includeFields, paginationObject, filter) {
                    return __awaiter(this, void 0, void 0, function* () {
                        try {
                            if (paginationObject !== undefined) {
                                if ((paginationObject === null || paginationObject === void 0 ? void 0 : paginationObject.cusor) !== undefined) {
                                    // cursor and pagination provided second page and so on
                                    const data = yield this.findMany({
                                        take: paginationObject.pagination,
                                        skip: 1,
                                        cursor: paginationObject.cusor,
                                        include: includeFields,
                                        orderBy: { createdAt: 'desc' },
                                        where: filter === undefined ? undefined : filter
                                    });
                                    return new Entities_1.ResponseObject(null, true, data);
                                }
                                else {
                                    // first page case paginationObject not undefined cursor not privided
                                    const data = yield this.findMany({
                                        take: paginationObject.pagination,
                                        include: includeFields,
                                        orderBy: { createdAt: 'desc' },
                                        where: filter === undefined ? undefined : filter
                                    });
                                    return new Entities_1.ResponseObject(null, true, data);
                                }
                            }
                            else {
                                // no pagination object defined request the entire collection
                                const data = yield this.findMany({
                                    include: includeFields,
                                    orderBy: { createdAt: 'desc' },
                                    where: filter === undefined ? undefined : filter
                                });
                                return new Entities_1.ResponseObject(null, true, data);
                            }
                        }
                        catch (error) {
                            logger_service_1.logger.error({
                                function: 'DatabaseHandler.GetAll', error
                            });
                            return new Entities_1.ResponseObject(error, false, null);
                        }
                    });
                },
                gGetN(number, lastId) {
                    return __awaiter(this, void 0, void 0, function* () {
                        try {
                            let data;
                            if (lastId !== undefined) {
                                data = yield this.findMany({
                                    skip: 1,
                                    take: number,
                                    cursor: { id: lastId },
                                    orderBy: { id: 'asc' }
                                });
                            }
                            else {
                                data = yield this.findMany({ skip: 1, take: number, orderBy: { id: 'asc' } });
                            }
                            return new Entities_1.ResponseObject(null, true, data);
                        }
                        catch (error) {
                            logger_service_1.logger.error({
                                function: 'DatabaseHandler.GetN', error
                            });
                            return new Entities_1.ResponseObject(error, false, null);
                        }
                    });
                },
                gDelete(id) {
                    return __awaiter(this, void 0, void 0, function* () {
                        try {
                            const data = yield this.delete({ where: { id } });
                            return new Entities_1.ResponseObject(null, true, data);
                        }
                        catch (error) {
                            logger_service_1.logger.error({
                                function: 'DatabaseHandler.Delete', error
                            });
                            return new Entities_1.ResponseObject(error, false, null);
                        }
                    });
                }
            }
        }
    })) {
        this.unExtendedPrisma = unExtendedPrisma;
        this.prisma = prisma;
        if (DatabaseHandler.Instance !== undefined)
            return DatabaseHandler.Instance;
        DatabaseHandler.Instance = this;
        return DatabaseHandler.Instance;
    }
}
exports.DatabaseHandler = DatabaseHandler;
exports.prismaClient = new DatabaseHandler();
// export let prismaClient: any
// try {
//   prismaClient = new DatabaseHandler()
// } catch (e) { console.log(e, 'xxxxxxxxxxx') }

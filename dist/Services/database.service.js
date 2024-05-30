"use strict";
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
    DatabaseHandler: function() {
        return DatabaseHandler;
    },
    prismaClient: function() {
        return prismaClient;
    }
});
const _client = require("@prisma/client");
const _loggerservice = require("./logger.service");
const _Entities = require("../Entities");
const _dotenv = /*#__PURE__*/ _interop_require_default(require("dotenv"));
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg);
        var value = info.value;
    } catch (error) {
        reject(error);
        return;
    }
    if (info.done) {
        resolve(value);
    } else {
        Promise.resolve(value).then(_next, _throw);
    }
}
function _async_to_generator(fn) {
    return function() {
        var self = this, args = arguments;
        return new Promise(function(resolve, reject) {
            var gen = fn.apply(self, args);
            function _next(value) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
            }
            function _throw(err) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
            }
            _next(undefined);
        });
    };
}
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
_dotenv.default.config();
class DatabaseHandler {
    constructor(unExtendedPrisma = new _client.PrismaClient(), prisma = unExtendedPrisma.$extends({
        model: {
            $allModels: {
                gCreate (args) {
                    return _async_to_generator(function*() {
                        try {
                            const data = yield this.create({
                                data: args,
                                select: {
                                    author: {
                                        select: {
                                            name: true,
                                            lastName: true
                                        }
                                    },
                                    id: true,
                                    createdAt: true,
                                    title: true,
                                    heading: true,
                                    text: true,
                                    classification: true,
                                    usersId: true,
                                    importance: true,
                                    isVisible: true,
                                    images: true
                                }
                            });
                            _loggerservice.logger.debug({
                                function: 'DatabaseHandler.create',
                                data
                            });
                            return new _Entities.ResponseObject(null, true, data);
                        } catch (error) {
                            _loggerservice.logger.error({
                                function: 'DatabaseHandler.create',
                                error
                            });
                            return new _Entities.ResponseObject(error, false, null);
                        }
                    }).apply(this);
                },
                gUpdate (dataObject, id) {
                    return _async_to_generator(function*() {
                        try {
                            const data = yield this.update({
                                where: {
                                    id
                                },
                                data: dataObject
                            });
                            _loggerservice.logger.debug({
                                function: 'DatabaseHandler.update',
                                data
                            });
                            return new _Entities.ResponseObject(null, true, data);
                        } catch (error) {
                            _loggerservice.logger.error({
                                function: 'DatabaseHandler.update',
                                error
                            });
                            return new _Entities.ResponseObject(error, false, null);
                        }
                    }).apply(this);
                },
                gFindById (id, includeField) {
                    return _async_to_generator(function*() {
                        try {
                            let data;
                            if (includeField !== undefined) {
                                data = yield this.findUniqueOrThrow({
                                    where: {
                                        id
                                    },
                                    select: includeField
                                });
                            } else {
                                data = yield this.findUniqueOrThrow({
                                    where: {
                                        id
                                    }
                                });
                            }
                            return new _Entities.ResponseObject(null, true, data);
                        } catch (error) {
                            _loggerservice.logger.error({
                                function: 'DatabaseHandler.FindById',
                                error
                            });
                            return new _Entities.ResponseObject(error, false, null);
                        }
                    }).apply(this);
                },
                gGetAll (includeFields, paginationObject, filter) {
                    return _async_to_generator(function*() {
                        try {
                            if (paginationObject !== undefined) {
                                if ((paginationObject === null || paginationObject === void 0 ? void 0 : paginationObject.cusor) !== undefined) {
                                    // cursor and pagination provided second page and so on
                                    const data = yield this.findMany({
                                        take: paginationObject.pagination,
                                        skip: 1,
                                        cursor: paginationObject.cusor,
                                        include: includeFields,
                                        orderBy: {
                                            createdAt: 'desc'
                                        },
                                        where: filter === undefined ? undefined : filter
                                    });
                                    return new _Entities.ResponseObject(null, true, data);
                                } else {
                                    // first page case paginationObject not undefined cursor not privided
                                    const data = yield this.findMany({
                                        take: paginationObject.pagination,
                                        include: includeFields,
                                        orderBy: {
                                            createdAt: 'desc'
                                        },
                                        where: filter === undefined ? undefined : filter
                                    });
                                    return new _Entities.ResponseObject(null, true, data);
                                }
                            } else {
                                // no pagination object defined request the entire collection
                                const data = yield this.findMany({
                                    include: includeFields,
                                    orderBy: {
                                        createdAt: 'desc'
                                    },
                                    where: filter === undefined ? undefined : filter
                                });
                                return new _Entities.ResponseObject(null, true, data);
                            }
                        } catch (error) {
                            _loggerservice.logger.error({
                                function: 'DatabaseHandler.GetAll',
                                error
                            });
                            return new _Entities.ResponseObject(error, false, null);
                        }
                    }).apply(this);
                },
                gGetN (number, lastId) {
                    return _async_to_generator(function*() {
                        try {
                            let data;
                            if (lastId !== undefined) {
                                data = yield this.findMany({
                                    skip: 1,
                                    take: number,
                                    cursor: {
                                        id: lastId
                                    },
                                    orderBy: {
                                        id: 'asc'
                                    }
                                });
                            } else {
                                data = yield this.findMany({
                                    skip: 1,
                                    take: number,
                                    orderBy: {
                                        id: 'asc'
                                    }
                                });
                            }
                            return new _Entities.ResponseObject(null, true, data);
                        } catch (error) {
                            _loggerservice.logger.error({
                                function: 'DatabaseHandler.GetN',
                                error
                            });
                            return new _Entities.ResponseObject(error, false, null);
                        }
                    }).apply(this);
                },
                gDelete (id) {
                    return _async_to_generator(function*() {
                        try {
                            const data = yield this.delete({
                                where: {
                                    id
                                }
                            });
                            return new _Entities.ResponseObject(null, true, data);
                        } catch (error) {
                            _loggerservice.logger.error({
                                function: 'DatabaseHandler.Delete',
                                error
                            });
                            return new _Entities.ResponseObject(error, false, null);
                        }
                    }).apply(this);
                }
            }
        }
    })){
        _define_property(this, "unExtendedPrisma", void 0);
        _define_property(this, "prisma", void 0);
        this.unExtendedPrisma = unExtendedPrisma;
        this.prisma = prisma;
        if (DatabaseHandler.Instance !== undefined) return DatabaseHandler.Instance;
        DatabaseHandler.Instance = this;
        return DatabaseHandler.Instance;
    }
}
_define_property(DatabaseHandler, "Instance", void 0);
const prismaClient = new DatabaseHandler() // export let prismaClient: any
 // try {
 //   prismaClient = new DatabaseHandler()
 // } catch (e) { console.log(e, 'xxxxxxxxxxx') }
;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9TZXJ2aWNlcy9kYXRhYmFzZS5zZXJ2aWNlLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFByaXNtYUNsaWVudCwgdHlwZSBQcmlzbWEgfSBmcm9tICdAcHJpc21hL2NsaWVudCdcclxuaW1wb3J0IHsgbG9nZ2VyIH0gZnJvbSAnLi9sb2dnZXIuc2VydmljZSdcclxuaW1wb3J0IHsgUmVzcG9uc2VPYmplY3QsIHR5cGUgR2VuZXJpY1Jlc3BvbnNlT2JqZWN0IH0gZnJvbSAnLi4vRW50aXRpZXMnXHJcbi8vIGltcG9ydCB7IFByaXNtYUxpYlNRTCB9IGZyb20gJ0BwcmlzbWEvYWRhcHRlci1saWJzcWwnXHJcbi8vIGltcG9ydCB7IGNyZWF0ZUNsaWVudCB9IGZyb20gJ0BsaWJzcWwvY2xpZW50Ly4nXHJcbmltcG9ydCBkb3RlbnYgZnJvbSAnZG90ZW52J1xyXG5kb3RlbnYuY29uZmlnKClcclxuLy8gY29uc3QgY2xpZW50ID0gY3JlYXRlQ2xpZW50KHsgdXJsOiBgJHtwcm9jZXNzLmVudi5UVVJTT19EQVRBQkFTRV9VUkx9YCwgYXV0aFRva2VuOiBgJHtwcm9jZXNzLmVudi5UVVJTT19BVVRIX1RPS0VOfWAgfSlcclxuLy8gY29uc3QgYWRhcHRlciA9IG5ldyBQcmlzbWFMaWJTUUwoY2xpZW50KVxyXG5leHBvcnQgY2xhc3MgRGF0YWJhc2VIYW5kbGVyIHtcclxuICBzdGF0aWMgSW5zdGFuY2U6IGFueVxyXG4gIGNvbnN0cnVjdG9yIChcclxuICAgIHB1YmxpYyB1bkV4dGVuZGVkUHJpc21hID0gbmV3IFByaXNtYUNsaWVudCgpLFxyXG5cclxuICAgIHB1YmxpYyBwcmlzbWEgPSB1bkV4dGVuZGVkUHJpc21hLiRleHRlbmRzKHtcclxuXHJcbiAgICAgIG1vZGVsOiB7XHJcblxyXG4gICAgICAgICRhbGxNb2RlbHM6XHJcbiAgICAgICAge1xyXG4gICAgICAgICAgYXN5bmMgIGdDcmVhdGUgPFQsIEE+KFxyXG4gICAgICAgICAgICB0aGlzOiBUICYgeyBjcmVhdGU6IGFueSB9LFxyXG4gICAgICAgICAgICBhcmdzOiBQcmlzbWEuRXhhY3Q8QSwgUHJpc21hLkFyZ3M8VCwgJ2NyZWF0ZSc+WydkYXRhJ10gJiBQcmlzbWEuQXJnczxULCAnY3JlYXRlJz5bJ2RhdGEnXVsnaW1hZ2VzJ11bJ2NyZWF0ZSddWydpbmNsdWRlJ10+XHJcbiAgICAgICAgICApOiBQcm9taXNlPEdlbmVyaWNSZXNwb25zZU9iamVjdDxQcmlzbWEuUmVzdWx0PFQsIEEsICdjcmVhdGUnPj4+IHtcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICBjb25zdCBkYXRhID0gYXdhaXQgdGhpcy5jcmVhdGUoeyBkYXRhOiBhcmdzLCBzZWxlY3Q6IHsgYXV0aG9yOiB7IHNlbGVjdDogeyBuYW1lOiB0cnVlLCBsYXN0TmFtZTogdHJ1ZSB9IH0sIGlkOiB0cnVlLCBjcmVhdGVkQXQ6IHRydWUsIHRpdGxlOiB0cnVlLCBoZWFkaW5nOiB0cnVlLCB0ZXh0OiB0cnVlLCBjbGFzc2lmaWNhdGlvbjogdHJ1ZSwgdXNlcnNJZDogdHJ1ZSwgaW1wb3J0YW5jZTogdHJ1ZSwgaXNWaXNpYmxlOiB0cnVlLCBpbWFnZXM6IHRydWUgfSB9KVxyXG4gICAgICAgICAgICAgIGxvZ2dlci5kZWJ1Zyh7XHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbjogJ0RhdGFiYXNlSGFuZGxlci5jcmVhdGUnLCBkYXRhXHJcbiAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICByZXR1cm4gbmV3IFJlc3BvbnNlT2JqZWN0KG51bGwsIHRydWUsIGRhdGEpXHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgbG9nZ2VyLmVycm9yKHsgZnVuY3Rpb246ICdEYXRhYmFzZUhhbmRsZXIuY3JlYXRlJywgZXJyb3IgfSlcclxuICAgICAgICAgICAgICByZXR1cm4gbmV3IFJlc3BvbnNlT2JqZWN0KGVycm9yLCBmYWxzZSwgbnVsbClcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIGFzeW5jIGdVcGRhdGU8VCwgQT4odGhpczogVCAmIHsgdXBkYXRlOiBhbnkgfSwgZGF0YU9iamVjdDogUHJpc21hLkV4YWN0PEEsIFBhcnRpYWw8UHJpc21hLkFyZ3M8VCwgJ3VwZGF0ZSc+WydkYXRhJ10+ID4sIGlkOiBzdHJpbmcpOiBQcm9taXNlPEdlbmVyaWNSZXNwb25zZU9iamVjdDxQcmlzbWEuUmVzdWx0PFQsIEEsICd1cGRhdGUnPj4+IHtcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICBjb25zdCBkYXRhID0gYXdhaXQgdGhpcy51cGRhdGUoeyB3aGVyZTogeyBpZCB9LCBkYXRhOiBkYXRhT2JqZWN0IH0pXHJcbiAgICAgICAgICAgICAgbG9nZ2VyLmRlYnVnKHtcclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uOiAnRGF0YWJhc2VIYW5kbGVyLnVwZGF0ZScsIGRhdGFcclxuICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgIHJldHVybiBuZXcgUmVzcG9uc2VPYmplY3QobnVsbCwgdHJ1ZSwgZGF0YSlcclxuICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICBsb2dnZXIuZXJyb3Ioe1xyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb246ICdEYXRhYmFzZUhhbmRsZXIudXBkYXRlJywgZXJyb3JcclxuICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgIHJldHVybiBuZXcgUmVzcG9uc2VPYmplY3QoZXJyb3IsIGZhbHNlLCBudWxsKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgYXN5bmMgZ0ZpbmRCeUlkPFQsIEE+KHRoaXM6IFQgJiB7IGZpbmRVbmlxdWVPclRocm93OiBhbnkgfSwgaWQ6IHN0cmluZywgaW5jbHVkZUZpZWxkPzogUHJpc21hLkV4YWN0PEEsIFByaXNtYS5BcmdzPFQsICdmaW5kVW5pcXVlT3JUaHJvdyc+WydzZWxlY3QnXT4pOiBQcm9taXNlPEdlbmVyaWNSZXNwb25zZU9iamVjdDxQcmlzbWEuUmVzdWx0PFQsIEEsICdmaW5kVW5pcXVlT3JUaHJvdyc+Pj4ge1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgIGxldCBkYXRhXHJcbiAgICAgICAgICAgICAgaWYgKGluY2x1ZGVGaWVsZCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICBkYXRhID0gYXdhaXQgdGhpcy5maW5kVW5pcXVlT3JUaHJvdyh7IHdoZXJlOiB7IGlkIH0sIHNlbGVjdDogaW5jbHVkZUZpZWxkIH0pXHJcbiAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGRhdGEgPSBhd2FpdCB0aGlzLmZpbmRVbmlxdWVPclRocm93KHsgd2hlcmU6IHsgaWQgfSB9KVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICByZXR1cm4gbmV3IFJlc3BvbnNlT2JqZWN0KG51bGwsIHRydWUsIGRhdGEpXHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgbG9nZ2VyLmVycm9yKHtcclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uOiAnRGF0YWJhc2VIYW5kbGVyLkZpbmRCeUlkJywgZXJyb3JcclxuICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgIHJldHVybiBuZXcgUmVzcG9uc2VPYmplY3QoZXJyb3IsIGZhbHNlLCBudWxsKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgYXN5bmMgZ0dldEFsbDxULCBBPihcclxuICAgICAgICAgICAgdGhpczogVCAmIHsgZmluZE1hbnk6IGFueSB9LFxyXG4gICAgICAgICAgICBpbmNsdWRlRmllbGRzOiBQcmlzbWEuRXhhY3Q8QSwgUHJpc21hLkFyZ3M8VCwgJ2ZpbmRNYW55Jz5bJ2luY2x1ZGUnXT4sXHJcbiAgICAgICAgICAgIHBhZ2luYXRpb25PYmplY3Q/OiB7IGN1c29yPzogYW55LCBwYWdpbmF0aW9uOiBudW1iZXIgfSxcclxuICAgICAgICAgICAgZmlsdGVyPzogUHJpc21hLkV4YWN0PEEsIFByaXNtYS5BcmdzPFQsICdmaW5kTWFueSc+Wyd3aGVyZSddPlxyXG4gICAgICAgICAgKTogUHJvbWlzZTxHZW5lcmljUmVzcG9uc2VPYmplY3Q8UHJpc21hLlJlc3VsdDxULCBBLCAnZmluZE1hbnknPj4+IHtcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICBpZiAocGFnaW5hdGlvbk9iamVjdCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAocGFnaW5hdGlvbk9iamVjdD8uY3Vzb3IgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgICAvLyBjdXJzb3IgYW5kIHBhZ2luYXRpb24gcHJvdmlkZWQgc2Vjb25kIHBhZ2UgYW5kIHNvIG9uXHJcbiAgICAgICAgICAgICAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCB0aGlzLmZpbmRNYW55KFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgIHRha2U6IHBhZ2luYXRpb25PYmplY3QucGFnaW5hdGlvbixcclxuICAgICAgICAgICAgICAgICAgICAgIHNraXA6IDEsXHJcbiAgICAgICAgICAgICAgICAgICAgICBjdXJzb3I6IHBhZ2luYXRpb25PYmplY3QuY3Vzb3IsXHJcbiAgICAgICAgICAgICAgICAgICAgICBpbmNsdWRlOiBpbmNsdWRlRmllbGRzLFxyXG4gICAgICAgICAgICAgICAgICAgICAgb3JkZXJCeTogeyBjcmVhdGVkQXQ6ICdkZXNjJyB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgd2hlcmU6IGZpbHRlciA9PT0gdW5kZWZpbmVkID8gdW5kZWZpbmVkIDogZmlsdGVyXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgUmVzcG9uc2VPYmplY3QobnVsbCwgdHJ1ZSwgZGF0YSlcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgIC8vIGZpcnN0IHBhZ2UgY2FzZSBwYWdpbmF0aW9uT2JqZWN0IG5vdCB1bmRlZmluZWQgY3Vyc29yIG5vdCBwcml2aWRlZFxyXG4gICAgICAgICAgICAgICAgICBjb25zdCBkYXRhID0gYXdhaXQgdGhpcy5maW5kTWFueShcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICB0YWtlOiBwYWdpbmF0aW9uT2JqZWN0LnBhZ2luYXRpb24sXHJcbiAgICAgICAgICAgICAgICAgICAgICBpbmNsdWRlOiBpbmNsdWRlRmllbGRzLFxyXG4gICAgICAgICAgICAgICAgICAgICAgb3JkZXJCeTogeyBjcmVhdGVkQXQ6ICdkZXNjJyB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgd2hlcmU6IGZpbHRlciA9PT0gdW5kZWZpbmVkID8gdW5kZWZpbmVkIDogZmlsdGVyXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgUmVzcG9uc2VPYmplY3QobnVsbCwgdHJ1ZSwgZGF0YSlcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgLy8gbm8gcGFnaW5hdGlvbiBvYmplY3QgZGVmaW5lZCByZXF1ZXN0IHRoZSBlbnRpcmUgY29sbGVjdGlvblxyXG4gICAgICAgICAgICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IHRoaXMuZmluZE1hbnkoXHJcbiAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBpbmNsdWRlOiBpbmNsdWRlRmllbGRzLFxyXG4gICAgICAgICAgICAgICAgICAgIG9yZGVyQnk6IHsgY3JlYXRlZEF0OiAnZGVzYycgfSxcclxuICAgICAgICAgICAgICAgICAgICB3aGVyZTogZmlsdGVyID09PSB1bmRlZmluZWQgPyB1bmRlZmluZWQgOiBmaWx0ZXJcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBSZXNwb25zZU9iamVjdChudWxsLCB0cnVlLCBkYXRhKVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICBsb2dnZXIuZXJyb3Ioe1xyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb246ICdEYXRhYmFzZUhhbmRsZXIuR2V0QWxsJywgZXJyb3JcclxuICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgIHJldHVybiBuZXcgUmVzcG9uc2VPYmplY3QoZXJyb3IsIGZhbHNlLCBudWxsKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgYXN5bmMgZ0dldE48VD4odGhpczogVCAmIHsgZmluZE1hbnk6IGFueSB9LCBudW1iZXI6IG51bWJlciwgbGFzdElkPzogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgbGV0IGRhdGFcclxuICAgICAgICAgICAgICBpZiAobGFzdElkICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIGRhdGEgPSBhd2FpdCB0aGlzLmZpbmRNYW55KHtcclxuICAgICAgICAgICAgICAgICAgc2tpcDogMSxcclxuICAgICAgICAgICAgICAgICAgdGFrZTogbnVtYmVyLFxyXG4gICAgICAgICAgICAgICAgICBjdXJzb3I6IHsgaWQ6IGxhc3RJZCB9LFxyXG4gICAgICAgICAgICAgICAgICBvcmRlckJ5OiB7IGlkOiAnYXNjJyB9XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBkYXRhID0gYXdhaXQgdGhpcy5maW5kTWFueSh7IHNraXA6IDEsIHRha2U6IG51bWJlciwgb3JkZXJCeTogeyBpZDogJ2FzYycgfSB9KVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICByZXR1cm4gbmV3IFJlc3BvbnNlT2JqZWN0KG51bGwsIHRydWUsIGRhdGEpXHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgbG9nZ2VyLmVycm9yKHtcclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uOiAnRGF0YWJhc2VIYW5kbGVyLkdldE4nLCBlcnJvclxyXG4gICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgcmV0dXJuIG5ldyBSZXNwb25zZU9iamVjdChlcnJvciwgZmFsc2UsIG51bGwpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBhc3luYyBnRGVsZXRlPFQsIEE+KHRoaXM6IFQgJiB7IGRlbGV0ZTogYW55IH0sIGlkOiBQcmlzbWEuRXhhY3Q8QSwgUHJpc21hLkFyZ3M8VCwgJ2RlbGV0ZSc+Wyd3aGVyZSddWydpZCddPik6IFByb21pc2U8R2VuZXJpY1Jlc3BvbnNlT2JqZWN0PFByaXNtYS5SZXN1bHQ8VCwgQSwgJ2RlbGV0ZSc+Pj4ge1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCB0aGlzLmRlbGV0ZSh7IHdoZXJlOiB7IGlkIH0gfSlcclxuICAgICAgICAgICAgICByZXR1cm4gbmV3IFJlc3BvbnNlT2JqZWN0KG51bGwsIHRydWUsIGRhdGEpXHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgbG9nZ2VyLmVycm9yKHtcclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uOiAnRGF0YWJhc2VIYW5kbGVyLkRlbGV0ZScsIGVycm9yXHJcbiAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICByZXR1cm4gbmV3IFJlc3BvbnNlT2JqZWN0KGVycm9yLCBmYWxzZSwgbnVsbClcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICB9XHJcblxyXG4gICAgfVxyXG4gICAgKVxyXG5cclxuICApIHtcclxuICAgIGlmIChEYXRhYmFzZUhhbmRsZXIuSW5zdGFuY2UgIT09IHVuZGVmaW5lZCkgcmV0dXJuIERhdGFiYXNlSGFuZGxlci5JbnN0YW5jZVxyXG4gICAgRGF0YWJhc2VIYW5kbGVyLkluc3RhbmNlID0gdGhpc1xyXG4gICAgcmV0dXJuIERhdGFiYXNlSGFuZGxlci5JbnN0YW5jZVxyXG4gIH1cclxufVxyXG5leHBvcnQgY29uc3QgcHJpc21hQ2xpZW50ID0gbmV3IERhdGFiYXNlSGFuZGxlcigpXHJcbi8vIGV4cG9ydCBsZXQgcHJpc21hQ2xpZW50OiBhbnlcclxuLy8gdHJ5IHtcclxuLy8gICBwcmlzbWFDbGllbnQgPSBuZXcgRGF0YWJhc2VIYW5kbGVyKClcclxuLy8gfSBjYXRjaCAoZSkgeyBjb25zb2xlLmxvZyhlLCAneHh4eHh4eHh4eHgnKSB9XHJcbiJdLCJuYW1lcyI6WyJEYXRhYmFzZUhhbmRsZXIiLCJwcmlzbWFDbGllbnQiLCJkb3RlbnYiLCJjb25maWciLCJjb25zdHJ1Y3RvciIsInVuRXh0ZW5kZWRQcmlzbWEiLCJQcmlzbWFDbGllbnQiLCJwcmlzbWEiLCIkZXh0ZW5kcyIsIm1vZGVsIiwiJGFsbE1vZGVscyIsImdDcmVhdGUiLCJhcmdzIiwiZGF0YSIsImNyZWF0ZSIsInNlbGVjdCIsImF1dGhvciIsIm5hbWUiLCJsYXN0TmFtZSIsImlkIiwiY3JlYXRlZEF0IiwidGl0bGUiLCJoZWFkaW5nIiwidGV4dCIsImNsYXNzaWZpY2F0aW9uIiwidXNlcnNJZCIsImltcG9ydGFuY2UiLCJpc1Zpc2libGUiLCJpbWFnZXMiLCJsb2dnZXIiLCJkZWJ1ZyIsImZ1bmN0aW9uIiwiUmVzcG9uc2VPYmplY3QiLCJlcnJvciIsImdVcGRhdGUiLCJkYXRhT2JqZWN0IiwidXBkYXRlIiwid2hlcmUiLCJnRmluZEJ5SWQiLCJpbmNsdWRlRmllbGQiLCJ1bmRlZmluZWQiLCJmaW5kVW5pcXVlT3JUaHJvdyIsImdHZXRBbGwiLCJpbmNsdWRlRmllbGRzIiwicGFnaW5hdGlvbk9iamVjdCIsImZpbHRlciIsImN1c29yIiwiZmluZE1hbnkiLCJ0YWtlIiwicGFnaW5hdGlvbiIsInNraXAiLCJjdXJzb3IiLCJpbmNsdWRlIiwib3JkZXJCeSIsImdHZXROIiwibnVtYmVyIiwibGFzdElkIiwiZ0RlbGV0ZSIsImRlbGV0ZSIsIkluc3RhbmNlIl0sInJhbmdlTWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7IiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0lBU2FBLGVBQWU7ZUFBZkE7O0lBeUpBQyxZQUFZO2VBQVpBOzs7d0JBbEs2QjsrQkFDbkI7MEJBQ29DOytEQUd4Qzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ25CQyxlQUFNLENBQUNDLE1BQU07QUFHTixNQUFNSDtJQUVYSSxZQUNFLEFBQU9DLG1CQUFtQixJQUFJQyxvQkFBWSxFQUFFLEVBRTVDLEFBQU9DLFNBQVNGLGlCQUFpQkcsUUFBUSxDQUFDO1FBRXhDQyxPQUFPO1lBRUxDLFlBQ0E7Z0JBQ1NDLFNBRUxDLElBQXlIOzJCQUMxRCxvQkFBQTt3QkFDL0QsSUFBSTs0QkFDRixN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
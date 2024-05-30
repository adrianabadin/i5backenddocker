"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AdsService", {
    enumerable: true,
    get: function() {
        return AdsService;
    }
});
const _databaseservice = require("../Services/database.service");
const _loggerservice = require("../Services/logger.service");
const _googleerrors = require("../Services/google.errors");
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
var _this = void 0;
var _this1 = void 0;
var _this2 = void 0;
var _this3 = void 0;
var _this4 = void 0;
var _this5 = void 0;
var _this6 = void 0;
class AdsService {
    constructor(prisma = _databaseservice.prismaClient.prisma, createAd = function() {
        var _ref = _async_to_generator(function*(data) {
            try {
                const response = yield _this.prisma.ads.create({
                    data: {
                        importance: data.importance,
                        photoUrl: data.photoUrl,
                        title: data.title,
                        url: data.url,
                        user: {
                            connect: {
                                id: data.usersId
                            }
                        }
                    }
                });
                return new _googleerrors.ResponseObject(null, true, response);
            } catch (error) {
                _loggerservice.logger.error({
                    function: 'AdsService.createAd',
                    error
                });
                return new _googleerrors.ResponseObject(error, false, null);
            }
        });
        return function(data) {
            return _ref.apply(this, arguments);
        };
    }(), getAds = /*#__PURE__*/ _async_to_generator(function*() {
        try {
            const response = yield _this1.prisma.ads.findMany({});
            return new _googleerrors.ResponseObject(null, true, response);
        } catch (error) {
            _loggerservice.logger.error({
                function: 'AdsService.getAds',
                error
            });
            return new _googleerrors.ResponseObject(error, false, null);
        }
    }), setActive = function() {
        var _ref = _async_to_generator(function*(id) {
            try {
                const result = yield _this2.prisma.ads.update({
                    where: {
                        id
                    },
                    data: {
                        isActive: true
                    }
                });
                return new _googleerrors.ResponseObject(null, true, result);
            } catch (error) {
                _loggerservice.logger.error({
                    function: 'AdsService.setActive',
                    error
                });
                return new _googleerrors.ResponseObject(error, false, null);
            }
        });
        return function(id) {
            return _ref.apply(this, arguments);
        };
    }(), setInactive = function() {
        var _ref = _async_to_generator(function*(id) {
            try {
                const result = yield _this3.prisma.ads.update({
                    where: {
                        id
                    },
                    data: {
                        isActive: false
                    }
                });
                return new _googleerrors.ResponseObject(null, true, result);
            } catch (error) {
                _loggerservice.logger.error({
                    function: 'AdsService.setInactive',
                    error
                });
                return new _googleerrors.ResponseObject(error, false, null);
            }
        });
        return function(id) {
            return _ref.apply(this, arguments);
        };
    }(), deleteAd = function() {
        var _ref = _async_to_generator(function*(id) {
            try {
                const response = yield _this4.prisma.ads.delete({
                    where: {
                        id
                    }
                });
                return new _googleerrors.ResponseObject(null, true, response);
            } catch (error) {
                _loggerservice.logger.error({
                    function: 'AdsService.deleteAd',
                    error
                });
                return new _googleerrors.ResponseObject(error, false, null);
            }
        });
        return function(id) {
            return _ref.apply(this, arguments);
        };
    }(), getAd = function() {
        var _ref = _async_to_generator(function*(id) {
            try {
                const response = yield _this5.prisma.ads.findUnique({
                    where: {
                        id
                    }
                });
                console.log(response, 'getAd');
                return new _googleerrors.ResponseObject(null, true, response);
            } catch (error) {
                _loggerservice.logger.error({
                    function: 'AdsService.getAd',
                    error
                });
            }
        });
        return function(id) {
            return _ref.apply(this, arguments);
        };
    }(), updateAd = function() {
        var _ref = _async_to_generator(function*(data, id) {
            try {
                const response = yield _this6.prisma.ads.update({
                    where: {
                        id
                    },
                    data
                });
                return new _googleerrors.ResponseObject(null, true, response);
            } catch (error) {
                _loggerservice.logger.error({
                    function: 'AdsService.updateAd',
                    error
                });
                return new _googleerrors.ResponseObject(error, false, null);
            }
        });
        return function(data, id) {
            return _ref.apply(this, arguments);
        };
    }()){
        _define_property(this, "prisma", void 0);
        _define_property(this, "createAd", void 0);
        _define_property(this, "getAds", void 0);
        _define_property(this, "setActive", void 0);
        _define_property(this, "setInactive", void 0);
        _define_property(this, "deleteAd", void 0);
        _define_property(this, "getAd", void 0);
        _define_property(this, "updateAd", void 0);
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hZHMvYWRzLnNlcnZpY2UudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgcHJpc21hQ2xpZW50IH0gZnJvbSAnLi4vU2VydmljZXMvZGF0YWJhc2Uuc2VydmljZSdcclxuaW1wb3J0IHsgbG9nZ2VyIH0gZnJvbSAnLi4vU2VydmljZXMvbG9nZ2VyLnNlcnZpY2UnXHJcbmltcG9ydCB7IHR5cGUgY3JlYXRlQWRUeXBlIH0gZnJvbSAnLi9hZHMuc2NoZW1hJ1xyXG5pbXBvcnQgeyBSZXNwb25zZU9iamVjdCwgdHlwZSBHZW5lcmljUmVzcG9uc2VPYmplY3QgfSBmcm9tICcuLi9TZXJ2aWNlcy9nb29nbGUuZXJyb3JzJ1xyXG5cclxuZXhwb3J0IGNsYXNzIEFkc1NlcnZpY2Uge1xyXG4gIGNvbnN0cnVjdG9yIChcclxuICAgIHB1YmxpYyBwcmlzbWEgPSBwcmlzbWFDbGllbnQucHJpc21hLFxyXG4gICAgcHVibGljIGNyZWF0ZUFkID0gYXN5bmMgPFQ+KGRhdGE6IGNyZWF0ZUFkVHlwZSAmIHsgcGhvdG9Vcmw6IHN0cmluZyB9KTogUHJvbWlzZTxHZW5lcmljUmVzcG9uc2VPYmplY3Q8VCB8IG51bGw+PiA9PiB7XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCB0aGlzLnByaXNtYS5hZHMuY3JlYXRlKHsgZGF0YTogeyBpbXBvcnRhbmNlOiBkYXRhLmltcG9ydGFuY2UsIHBob3RvVXJsOiBkYXRhLnBob3RvVXJsLCB0aXRsZTogZGF0YS50aXRsZSwgdXJsOiBkYXRhLnVybCwgdXNlcjogeyBjb25uZWN0OiB7IGlkOiBkYXRhLnVzZXJzSWQgfSB9IH0gfSlcclxuICAgICAgICByZXR1cm4gbmV3IFJlc3BvbnNlT2JqZWN0KG51bGwsIHRydWUsIHJlc3BvbnNlIGFzIFQpXHJcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgbG9nZ2VyLmVycm9yKHsgZnVuY3Rpb246ICdBZHNTZXJ2aWNlLmNyZWF0ZUFkJywgZXJyb3IgfSlcclxuICAgICAgICByZXR1cm4gbmV3IFJlc3BvbnNlT2JqZWN0KGVycm9yLCBmYWxzZSwgbnVsbClcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIHB1YmxpYyBnZXRBZHMgPSBhc3luYyAoKSA9PiB7XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCB0aGlzLnByaXNtYS5hZHMuZmluZE1hbnkoe30pXHJcbiAgICAgICAgcmV0dXJuIG5ldyBSZXNwb25zZU9iamVjdChudWxsLCB0cnVlLCByZXNwb25zZSlcclxuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICBsb2dnZXIuZXJyb3IoeyBmdW5jdGlvbjogJ0Fkc1NlcnZpY2UuZ2V0QWRzJywgZXJyb3IgfSlcclxuICAgICAgICByZXR1cm4gbmV3IFJlc3BvbnNlT2JqZWN0KGVycm9yLCBmYWxzZSwgbnVsbClcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIHB1YmxpYyBzZXRBY3RpdmUgPSBhc3luYyAoaWQ6IHN0cmluZykgPT4ge1xyXG4gICAgICB0cnkge1xyXG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHRoaXMucHJpc21hLmFkcy51cGRhdGUoeyB3aGVyZTogeyBpZCB9LCBkYXRhOiB7IGlzQWN0aXZlOiB0cnVlIH0gfSlcclxuICAgICAgICByZXR1cm4gbmV3IFJlc3BvbnNlT2JqZWN0KG51bGwsIHRydWUsIHJlc3VsdClcclxuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICBsb2dnZXIuZXJyb3IoeyBmdW5jdGlvbjogJ0Fkc1NlcnZpY2Uuc2V0QWN0aXZlJywgZXJyb3IgfSlcclxuICAgICAgICByZXR1cm4gbmV3IFJlc3BvbnNlT2JqZWN0KGVycm9yLCBmYWxzZSwgbnVsbClcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIHB1YmxpYyBzZXRJbmFjdGl2ZSA9IGFzeW5jIChpZDogc3RyaW5nKSA9PiB7XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgdGhpcy5wcmlzbWEuYWRzLnVwZGF0ZSh7IHdoZXJlOiB7IGlkIH0sIGRhdGE6IHsgaXNBY3RpdmU6IGZhbHNlIH0gfSlcclxuICAgICAgICByZXR1cm4gbmV3IFJlc3BvbnNlT2JqZWN0KG51bGwsIHRydWUsIHJlc3VsdClcclxuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICBsb2dnZXIuZXJyb3IoeyBmdW5jdGlvbjogJ0Fkc1NlcnZpY2Uuc2V0SW5hY3RpdmUnLCBlcnJvciB9KVxyXG4gICAgICAgIHJldHVybiBuZXcgUmVzcG9uc2VPYmplY3QoZXJyb3IsIGZhbHNlLCBudWxsKVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgcHVibGljIGRlbGV0ZUFkID0gYXN5bmMgKGlkOiBzdHJpbmcpID0+IHtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHRoaXMucHJpc21hLmFkcy5kZWxldGUoeyB3aGVyZTogeyBpZCB9IH0pXHJcbiAgICAgICAgcmV0dXJuIG5ldyBSZXNwb25zZU9iamVjdChudWxsLCB0cnVlLCByZXNwb25zZSlcclxuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICBsb2dnZXIuZXJyb3IoeyBmdW5jdGlvbjogJ0Fkc1NlcnZpY2UuZGVsZXRlQWQnLCBlcnJvciB9KVxyXG4gICAgICAgIHJldHVybiBuZXcgUmVzcG9uc2VPYmplY3QoZXJyb3IsIGZhbHNlLCBudWxsKVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgcHVibGljIGdldEFkID0gYXN5bmMgKGlkOiBzdHJpbmcpID0+IHtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHRoaXMucHJpc21hLmFkcy5maW5kVW5pcXVlKHsgd2hlcmU6IHsgaWQgfSB9KVxyXG4gICAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlLCAnZ2V0QWQnKVxyXG4gICAgICAgIHJldHVybiBuZXcgUmVzcG9uc2VPYmplY3QobnVsbCwgdHJ1ZSwgcmVzcG9uc2UpXHJcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgbG9nZ2VyLmVycm9yKHsgZnVuY3Rpb246ICdBZHNTZXJ2aWNlLmdldEFkJywgZXJyb3IgfSlcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIHB1YmxpYyB1cGRhdGVBZCA9IGFzeW5jIChkYXRhOiBhbnkgJiB7IHBob3RvVXJsOiBzdHJpbmcgfSwgaWQ6IHN0cmluZykgPT4ge1xyXG4gICAgICB0cnkge1xyXG4gICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgdGhpcy5wcmlzbWEuYWRzLnVwZGF0ZSh7IHdoZXJlOiB7IGlkIH0sIGRhdGEgfSlcclxuICAgICAgICByZXR1cm4gbmV3IFJlc3BvbnNlT2JqZWN0KG51bGwsIHRydWUsIHJlc3BvbnNlKVxyXG4gICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgIGxvZ2dlci5lcnJvcih7IGZ1bmN0aW9uOiAnQWRzU2VydmljZS51cGRhdGVBZCcsIGVycm9yIH0pXHJcbiAgICAgICAgcmV0dXJuIG5ldyBSZXNwb25zZU9iamVjdChlcnJvciwgZmFsc2UsIG51bGwpXHJcbiAgICAgIH1cclxuICAgIH1cclxuICApIHsgIH1cclxufVxyXG4iXSwibmFtZXMiOlsiQWRzU2VydmljZSIsImNvbnN0cnVjdG9yIiwicHJpc21hIiwicHJpc21hQ2xpZW50IiwiY3JlYXRlQWQiLCJkYXRhIiwicmVzcG9uc2UiLCJhZHMiLCJjcmVhdGUiLCJpbXBvcnRhbmNlIiwicGhvdG9VcmwiLCJ0aXRsZSIsInVybCIsInVzZXIiLCJjb25uZWN0IiwiaWQiLCJ1c2Vyc0lkIiwiUmVzcG9uc2VPYmplY3QiLCJlcnJvciIsImxvZ2dlciIsImZ1bmN0aW9uIiwiZ2V0QWRzIiwiZmluZE1hbnkiLCJzZXRBY3RpdmUiLCJyZXN1bHQiLCJ1cGRhdGUiLCJ3aGVyZSIsImlzQWN0aXZlIiwic2V0SW5hY3RpdmUiLCJkZWxldGVBZCIsImRlbGV0ZSIsImdldEFkIiwiZmluZFVuaXF1ZSIsImNvbnNvbGUiLCJsb2ciLCJ1cGRhdGVBZCJdLCJyYW5nZU1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzsiLCJtYXBwaW5ncyI6Ijs7OzsrQkFLYUE7OztlQUFBQTs7O2lDQUxnQjsrQkFDTjs4QkFFb0M7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRXBELE1BQU1BO0lBQ1hDLFlBQ0UsQUFBT0MsU0FBU0MsNkJBQVksQ0FBQ0QsTUFBTSxFQUNuQyxBQUFPRTttQkFBVyxvQkFBQSxVQUFVQztZQUMxQixJQUFJO2dCQUNGLE1BQU1DLFdBQVcsTUFBTSxNQUFLSixNQUFNLENBQUNLLEdBQUcsQ0FBQ0MsTUFBTSxDQUFDO29CQUFFSCxNQUFNO3dCQUFFSSxZQUFZSixLQUFLSSxVQUFVO3dCQUFFQyxVQUFVTCxLQUFLSyxRQUFRO3dCQUFFQyxPQUFPTixLQUFLTSxLQUFLO3dCQUFFQyxLQUFLUCxLQUFLTyxHQUFHO3dCQUFFQyxNQUFNOzRCQUFFQyxTQUFTO2dDQUFFQyxJQUFJVixLQUFLVyxPQUFPOzRCQUFDO3dCQUFFO29CQUFFO2dCQUFFO2dCQUMxTCxPQUFPLElBQUlDLDRCQUFjLENBQUMsTUFBTSxNQUFNWDtZQUN4QyxFQUFFLE9BQU9ZLE9BQU87Z0JBQ2RDLHFCQUFNLENBQUNELEtBQUssQ0FBQztvQkFBRUUsVUFBVTtvQkFBdUJGO2dCQUFNO2dCQUN0RCxPQUFPLElBQUlELDRCQUFjLENBQUNDLE9BQU8sT0FBTztZQUMxQztRQUNGO3dCQVI0QmI7OztPQVEzQixFQUNELEFBQU9nQix1QkFBUyxvQkFBQTtRQUNkLElBQUk7WUFDRixNQUFNZixXQUFXLE1BQU0sT0FBS0osTUFBTSxDQUFDSyxHQUFHLENBQUNlLFFBQVEsQ0FBQyxDQUFDO1lBQ2pELE9BQU8sSUFBSUwsNEJBQWMsQ0FBQyxNQUFNLE1BQU1YO1FBQ3hDLEVBQUUsT0FBT1ksT0FBTztZQUNkQyxxQkFBTSxDQUFDRCxLQUFLLENBQUM7Z0JBQUVFLFVBQVU7Z0JBQXFCRjtZQUFNO1lBQ3BELE9BQU8sSUFBSUQsNEJBQWMsQ0FBQ0MsT0FBTyxPQUFPO1FBQzFDO0lBQ0YsRUFBQyxFQUNELEFBQU9LO21CQUFZLG9CQUFBLFVBQU9SO1lBQ3hCLElBQUk7Z0JBQ0YsTUFBTVMsU0FBUyxNQUFNLE9BQUt0QixNQUFNLENBQUNLLEdBQUcsQ0FBQ2tCLE1BQU0sQ0FBQztvQkFBRUMsT0FBTzt3QkFBRVg7b0JBQUc7b0JBQUdWLE1BQU07d0JBQUVzQixVQUFVO29CQUFLO2dCQUFFO2dCQUN0RixPQUFPLElBQUlWLDRCQUFjLENBQUMsTUFBTSxNQUFNTztZQUN4QyxFQUFFLE9BQU9OLE9BQU87Z0JBQ2RDLHFCQUFNLENBQUNELEtBQUssQ0FBQztvQkFBRUUsVUFBVTtvQkFBd0JGO2dCQUFNO2dCQUN2RCxPQUFPLElBQUlELDRCQUFjLENBQUNDLE9BQU8sT0FBTztZQUMxQztRQUNGO3dCQVIwQkg7OztPQVF6QixFQUNELEFBQU9hO21CQUFjLG9CQUFBLFVBQU9iO1lBQzFCLElBQUk7Z0JBQ0YsTUFBTVMsU0FBUyxNQUFNLE9BQUt0QixNQUFNLENBQUNLLEdBQUcsQ0FBQ2tCLE1BQU0sQ0FBQztvQkFBRUMsT0FBTzt3QkFBRVg7b0JBQUc7b0JBQUdWLE1BQU07d0JBQUVzQixVQUFVO29CQUFNO2dCQUFFO2dCQUN2RixPQUFPLElBQUlWLDRCQUFjLENBQUMsTUFBTSxNQUFNTztZQUN4QyxFQUFFLE9BQU9OLE9BQU87Z0JBQ2RDLHFCQUFNLENBQUNELEtBQUssQ0FBQztvQkFBRUUsVUFBVTtvQkFBMEJGO2dCQUFNO2dCQUN6RCxPQUFPLElBQUlELDRCQUFjLENBQUNDLE9BQU8sT0FBTztZQUMxQztRQUNGO3dCQVI0Qkg7OztPQVEzQixFQUNELEFBQU9jO21CQUFXLG9CQUFBLFVBQU9kO1lBQ3ZCLElBQUk7Z0JBQ0YsTUFBTVQsV0FBVyxNQUFNLE9BQUtKLE1BQU0sQ0FBQ0ssR0FBRyxDQUFDdUIsTUFBTSxDQUFDO29CQUFFSixPQUFPO3dCQUFFWDtvQkFBRztnQkFBRTtnQkFDOUQsT0FBTyxJQUFJRSw0QkFBYyxDQUFDLE1BQU0sTUFBTVg7WUFDeEMsRUFBRSxPQUFPWSxPQUFPO2dCQUNkQyxxQkFBTSxDQUFDRCxLQUFLLENBQUM7b0JBQUVFLFVBQVU7b0JBQXVCRjtnQkFBTTtnQkFDdEQsT0FBTyxJQUFJRCw0QkFBYyxDQUFDQyxPQUFPLE9BQU87WUFDMUM7UUFDRjt3QkFSeUJIOzs7T0FReEIsRUFDRCxBQUFPZ0I7bUJBQVEsb0JBQUEsVUFBT2hCO1lBQ3BCLElBQUk7Z0JBQ0YsTUFBTVQsV0FBVyxNQUFNLE9BQUtKLE1BQU0sQ0FBQ0ssR0FBRyxDQUFDeUIsVUFBVSxDQUFDO29CQUFFTixPQUFPO3dCQUFFWDtvQkFBRztnQkFBRTtnQkFDbEVrQixRQUFRQyxHQUFHLENBQUM1QixVQUFVO2dCQUN0QixPQUFPLElBQUlXLDRCQUFjLENBQUMsTUFBTSxNQUFNWDtZQUN4QyxFQUFFLE9BQU9ZLE9BQU87Z0JBQ2RDLHFCQUFNLENBQUNELEtBQUssQ0FBQztvQkFBRUUsVUFBVTtvQkFBb0JGO2dCQUFNO1lBQ3JEO1FBQ0Y7d0JBUnNCSDs7O09BUXJCLEVBQ0QsQUFBT29CO21CQUFXLG9CQUFBLFVBQU85QixNQUFrQ1U7WUFDekQsSUFBSTtnQkFDRixNQUFNVCxXQUFXLE1BQU0sT0FBS0osTUFBTSxDQUFDSyxHQUFHLENBQUNrQixNQUFNLENBQUM7b0JBQUVDLE9BQU87d0JBQUVYO29CQUFHO29CQUFHVjtnQkFBSztnQkFDcEUsT0FBTyxJQUFJWSw0QkFBYyxDQUFDLE1BQU0sTUFBTVg7WUFDeEMsRUFBRSxPQUFPWSxPQUFPO2dCQUNkQyxxQkFBTSxDQUFDRCxLQUFLLENBQUM7b0JBQUVFLFVBQVU7b0JBQXVCRjtnQkFBTTtnQkFDdEQsT0FBTyxJQUFJRCw0QkFBYyxDQUFDQyxPQUFPLE9BQU87WUFDMUM7UUFDRjt3QkFSeUJiLE1BQWtDVTs7O09BUTFELENBQ0Q7Ozs7Ozs7OzthQWhFT2IsU0FBQUE7YUFDQUUsV0FBQUE7YUFTQWlCLFNBQUFBO2FBU0FFLFlBQUFBO2FBU0FLLGNBQUFBO2FBU0FDLFdBQUFBO2FBU0FFLFFBQUFBO2FBU0FJLFdBQUFBO0lBU0o7QUFDUCJ9
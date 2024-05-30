"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "UsersService", {
    enumerable: true,
    get: function() {
        return UsersService;
    }
});
const _databaseservice = require("../Services/database.service");
const _loggerservice = require("../Services/logger.service");
const _prismaerrors = require("../Services/prisma.errors");
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
function _object_spread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _define_property(target, key, source[key]);
        });
    }
    return target;
}
function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        if (enumerableOnly) {
            symbols = symbols.filter(function(sym) {
                return Object.getOwnPropertyDescriptor(object, sym).enumerable;
            });
        }
        keys.push.apply(keys, symbols);
    }
    return keys;
}
function _object_spread_props(target, source) {
    source = source != null ? source : {};
    if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
        ownKeys(Object(source)).forEach(function(key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
    }
    return target;
}
class UsersService {
    findById(id) {
        var _this = this;
        return _async_to_generator(function*() {
            try {
                const response = yield _this.prisma.users.findUniqueOrThrow({
                    where: {
                        id
                    }
                });
                const user = _object_spread_props(_object_spread({}, response), {
                    rol: response.rol,
                    gender: response.gender
                });
                return user;
            } catch (error) {
                _loggerservice.logger.error({
                    function: 'UsersService.findById',
                    error
                });
                return new _prismaerrors.UnknownPrismaError(error);
            }
        })();
    }
    findByUserName(username) {
        var _this = this;
        return _async_to_generator(function*() {
            try {
                const response = yield _this.prisma.users.findUniqueOrThrow({
                    where: {
                        username
                    }
                });
                const user = _object_spread_props(_object_spread({}, response), {
                    rol: response.rol,
                    gender: response.gender
                });
                const returnType = user;
                return returnType;
            } catch (error) {
                _loggerservice.logger.error({
                    function: 'UsersService.findById',
                    error
                });
                return new _prismaerrors.UnknownPrismaError(error);
            }
        })();
    }
    createUser(user, fbid, accessToken) {
        var _this = this;
        return _async_to_generator(function*() {
            try {
                const response = yield _this.prisma.users.create({
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
                const responseType = _object_spread_props(_object_spread({}, response), {
                    rol: response.rol,
                    gender: response.gender
                });
                return responseType;
            } catch (error) {
                _loggerservice.logger.error({
                    function: 'UsersService.createUser',
                    error
                });
                return new _prismaerrors.UnknownPrismaError(error);
            }
        })();
    }
    constructor(prisma = _databaseservice.prismaClient.prisma){
        _define_property(this, "prisma", void 0);
        this.prisma = prisma;
        this.findById = this.findById.bind(this);
    }
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91c2Vycy91c2Vycy5zZXJ2aWNlLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIlxyXG5pbXBvcnQgeyAgUHJpc21hIH0gZnJvbSAnQHByaXNtYS9jbGllbnQnO1xyXG5pbXBvcnQgeyBwcmlzbWFDbGllbnQgfSBmcm9tICcuLi9TZXJ2aWNlcy9kYXRhYmFzZS5zZXJ2aWNlJztcclxuaW1wb3J0IHsgbG9nZ2VyIH0gZnJvbSAnLi4vU2VydmljZXMvbG9nZ2VyLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyAgUHJpc21hRXJyb3IsIFVua25vd25QcmlzbWFFcnJvciB9IGZyb20gJy4uL1NlcnZpY2VzL3ByaXNtYS5lcnJvcnMnO1xyXG5pbXBvcnQgeyAgU2lnblVwVHlwZSB9IGZyb20gJy4uL2F1dGgvc2lnblVwLnNjaGVtYSc7XHJcbmludGVyZmFjZSBVc2VyVHlwZSB7XHJcbiAgZ2VuZGVyPzogJ01BTEUnIHwgJ0ZFTUFMRScgfCAnTk9UX0JJTkFSWSdcclxuICBpZDogc3RyaW5nXHJcbiAgbmFtZTogc3RyaW5nXHJcbiAgbGFzdE5hbWU6IHN0cmluZ1xyXG4gIHVzZXJuYW1lOiBzdHJpbmdcclxuICBwaG9uZTogc3RyaW5nXHJcbiAgaGFzaDogc3RyaW5nIHwgbnVsbFxyXG4gIGJpcnRoRGF0ZTogRGF0ZSB8IG51bGxcclxuICBhdmF0YXI/OiBzdHJpbmcgfCBudWxsXHJcbiAgZmJpZD86IHN0cmluZ1xyXG4gIGlzVmVyaWZpZWQ6IGJvb2xlYW5cclxuICByZWZyZXNoVG9rZW4/OiBzdHJpbmdcclxuICByb2w6ICdHT0QnIHwgJ0FETUlOJyB8ICdXUklURVInIHwgJ1VTRVInXHJcbiAgY3JlYXRlZEF0OiBEYXRlXHJcbiAgdXBkYXRlZEF0OiBEYXRlXHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBVc2Vyc1NlcnZpY2Uge1xyXG4gIGNvbnN0cnVjdG9yIChwcm90ZWN0ZWQgcHJpc21hID0gcHJpc21hQ2xpZW50LnByaXNtYSkge1xyXG4gICAgdGhpcy5maW5kQnlJZCA9IHRoaXMuZmluZEJ5SWQuYmluZCh0aGlzKVxyXG4gIH1cclxuXHJcbiAgYXN5bmMgZmluZEJ5SWQgKGlkOiBzdHJpbmcpOiBQcm9taXNlPFByaXNtYS5Vc2Vyc0NyZWF0ZUlucHV0ICYgeyByb2w6IHN0cmluZywgZ2VuZGVyOiBzdHJpbmcgfSB8IFByaXNtYUVycm9yPiB7XHJcbiAgICB0cnkge1xyXG4gICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHRoaXMucHJpc21hLnVzZXJzLmZpbmRVbmlxdWVPclRocm93KFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIHdoZXJlOiB7IGlkIH1cclxuXHJcbiAgICAgICAgfSlcclxuICAgICAgY29uc3QgdXNlciA9IHsgLi4ucmVzcG9uc2UsIHJvbDogcmVzcG9uc2Uucm9sLCBnZW5kZXI6IHJlc3BvbnNlLmdlbmRlciB9XHJcbiAgICAgIHJldHVybiB1c2VyIGFzIFByaXNtYS5Vc2Vyc0NyZWF0ZUlucHV0ICYgeyByb2w6IHN0cmluZywgZ2VuZGVyOiBzdHJpbmcgfVxyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgbG9nZ2VyLmVycm9yKHsgZnVuY3Rpb246ICdVc2Vyc1NlcnZpY2UuZmluZEJ5SWQnLCBlcnJvciB9KVxyXG4gICAgICByZXR1cm4gbmV3IFVua25vd25QcmlzbWFFcnJvcihlcnJvcilcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGFzeW5jIGZpbmRCeVVzZXJOYW1lICh1c2VybmFtZTogc3RyaW5nKTogUHJvbWlzZTxQcmlzbWEuVXNlcnNDcmVhdGVJbnB1dCAmIHsgcm9sOiBzdHJpbmcsIGdlbmRlcjogc3RyaW5nIH0gfCBQcmlzbWFFcnJvcj4ge1xyXG4gICAgdHJ5IHtcclxuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCB0aGlzLnByaXNtYS51c2Vycy5maW5kVW5pcXVlT3JUaHJvdyhcclxuICAgICAgICB7XHJcbiAgICAgICAgICB3aGVyZTogeyB1c2VybmFtZSB9XHJcblxyXG4gICAgICAgIH0pXHJcblxyXG4gICAgICBjb25zdCB1c2VyID0geyAuLi5yZXNwb25zZSwgcm9sOiByZXNwb25zZS5yb2wsIGdlbmRlcjogcmVzcG9uc2UuZ2VuZGVyIH1cclxuICAgICAgY29uc3QgcmV0dXJuVHlwZSA9IHVzZXJcclxuICAgICAgcmV0dXJuIHJldHVyblR5cGUgYXMgUHJpc21hLlVzZXJzQ3JlYXRlSW5wdXQgJiB7IHJvbDogc3RyaW5nLCBnZW5kZXI6IHN0cmluZyB9XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICBsb2dnZXIuZXJyb3IoeyBmdW5jdGlvbjogJ1VzZXJzU2VydmljZS5maW5kQnlJZCcsIGVycm9yIH0pXHJcbiAgICAgIHJldHVybiBuZXcgVW5rbm93blByaXNtYUVycm9yKGVycm9yKVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgYXN5bmMgY3JlYXRlVXNlciAodXNlcjogU2lnblVwVHlwZSAmIHsgaGFzaDogc3RyaW5nLCBhdmF0YXI/OiBzdHJpbmcgfSwgZmJpZD86IHN0cmluZywgYWNjZXNzVG9rZW4/OiBzdHJpbmcpOiBQcm9taXNlPFByaXNtYS5Vc2Vyc0NyZWF0ZUlucHV0ICYgeyByb2w6IHN0cmluZywgZ2VuZGVyOiBzdHJpbmcgfSB8IFByaXNtYUVycm9yPiB7XHJcbiAgICB0cnkge1xyXG4gICAgICBjb25zdCByZXNwb25zZSA9XHJcbiAgICAgICAgIGF3YWl0IHRoaXMucHJpc21hLnVzZXJzLmNyZWF0ZShcclxuICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICAgICAgIGhhc2g6IHVzZXIuaGFzaCxcclxuICAgICAgICAgICAgICAgYXZhdGFyOiB1c2VyLmF2YXRhcixcclxuICAgICAgICAgICAgICAgdXNlcm5hbWU6IHVzZXIudXNlcm5hbWUsXHJcbiAgICAgICAgICAgICAgIHJvbDogZmJpZCA9PT0gdW5kZWZpbmVkID8gJ1VTRVInIDogJ0FETUlOJyxcclxuICAgICAgICAgICAgICAgZ2VuZGVyOiB1c2VyLmdlbmRlciA9PT0gdW5kZWZpbmVkID8gJ05PVF9CSU5BUlknIDogdXNlci5nZW5kZXIsXHJcbiAgICAgICAgICAgICAgIG5hbWU6IHVzZXIubmFtZSxcclxuICAgICAgICAgICAgICAgbGFzdE5hbWU6IHVzZXIubGFzdE5hbWUsXHJcbiAgICAgICAgICAgICAgIHBob25lOiB1c2VyLnBob25lLFxyXG4gICAgICAgICAgICAgICBiaXJ0aERhdGU6IHVzZXIuYmlydGhEYXRlLFxyXG4gICAgICAgICAgICAgICBpc1ZlcmlmaWVkOiBmYmlkICE9PSB1bmRlZmluZWQsXHJcbiAgICAgICAgICAgICAgIGZiaWQsXHJcbiAgICAgICAgICAgICAgIGFjY2Vzc1Rva2VuXHJcbiAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgfSlcclxuICAgICAgY29uc3QgcmVzcG9uc2VUeXBlID0geyAuLi5yZXNwb25zZSwgcm9sOiByZXNwb25zZS5yb2wgYXMgVXNlclR5cGVbJ3JvbCddLCBnZW5kZXI6IHJlc3BvbnNlLmdlbmRlciBhcyBVc2VyVHlwZVsnZ2VuZGVyJ10gfVxyXG4gICAgICByZXR1cm4gcmVzcG9uc2VUeXBlIGFzIFByaXNtYS5Vc2Vyc0NyZWF0ZUlucHV0ICYgeyByb2w6IHN0cmluZywgZ2VuZGVyOiBzdHJpbmcgfVxyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgbG9nZ2VyLmVycm9yKHsgZnVuY3Rpb246ICdVc2Vyc1NlcnZpY2UuY3JlYXRlVXNlcicsIGVycm9yIH0pXHJcbiAgICAgIHJldHVybiBuZXcgVW5rbm93blByaXNtYUVycm9yKGVycm9yKVxyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iXSwibmFtZXMiOlsiVXNlcnNTZXJ2aWNlIiwiZmluZEJ5SWQiLCJpZCIsInJlc3BvbnNlIiwicHJpc21hIiwidXNlcnMiLCJmaW5kVW5pcXVlT3JUaHJvdyIsIndoZXJlIiwidXNlciIsInJvbCIsImdlbmRlciIsImVycm9yIiwibG9nZ2VyIiwiZnVuY3Rpb24iLCJVbmtub3duUHJpc21hRXJyb3IiLCJmaW5kQnlVc2VyTmFtZSIsInVzZXJuYW1lIiwicmV0dXJuVHlwZSIsImNyZWF0ZVVzZXIiLCJmYmlkIiwiYWNjZXNzVG9rZW4iLCJjcmVhdGUiLCJkYXRhIiwiaGFzaCIsImF2YXRhciIsInVuZGVmaW5lZCIsIm5hbWUiLCJsYXN0TmFtZSIsInBob25lIiwiYmlydGhEYXRlIiwiaXNWZXJpZmllZCIsInJlc3BvbnNlVHlwZSIsImNvbnN0cnVjdG9yIiwicHJpc21hQ2xpZW50IiwiYmluZCJdLCJyYW5nZU1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OyIsIm1hcHBpbmdzIjoiOzs7OytCQXdCYUE7OztlQUFBQTs7O2lDQXRCZ0I7K0JBQ047OEJBQzBCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBb0IxQyxNQUFNQTtJQUtMQyxTQUFVQyxFQUFVOztlQUExQixvQkFBQTtZQUNFLElBQUk7Z0JBQ0YsTUFBTUMsV0FBVyxNQUFNLE1BQUtDLE1BQU0sQ0FBQ0MsS0FBSyxDQUFDQyxpQkFBaUIsQ0FDeEQ7b0JBQ0VDLE9BQU87d0JBQUVMO29CQUFHO2dCQUVkO2dCQUNGLE1BQU1NLE9BQU8sd0NBQUtMO29CQUFVTSxLQUFLTixTQUFTTSxHQUFHO29CQUFFQyxRQUFRUCxTQUFTTyxNQUFNOztnQkFDdEUsT0FBT0Y7WUFDVCxFQUFFLE9BQU9HLE9BQU87Z0JBQ2RDLHFCQUFNLENBQUNELEtBQUssQ0FBQztvQkFBRUUsVUFBVTtvQkFBeUJGO2dCQUFNO2dCQUN4RCxPQUFPLElBQUlHLGdDQUFrQixDQUFDSDtZQUNoQztRQUNGOztJQUVNSSxlQUFnQkMsUUFBZ0I7O2VBQXRDLG9CQUFBO1lBQ0UsSUFBSTtnQkFDRixNQUFNYixXQUFXLE1BQU0sTUFBS0MsTUFBTSxDQUFDQyxLQUFLLENBQUNDLGlCQUFpQixDQUN4RDtvQkFDRUMsT0FBTzt3QkFBRVM7b0JBQVM7Z0JBRXBCO2dCQUVGLE1BQU1SLE9BQU8sd0NBQUtMO29CQUFVTSxLQUFLTixTQUFTTSxHQUFHO29CQUFFQyxRQUFRUCxTQUFTTyxNQUFNOztnQkFDdEUsTUFBTU8sYUFBYVQ7Z0JBQ25CLE9BQU9TO1lBQ1QsRUFBRSxPQUFPTixPQUFPO2dCQUNkQyxxQkFBTSxDQUFDRCxLQUFLLENBQUM7b0JBQUVFLFVBQVU7b0JBQXlCRjtnQkFBTTtnQkFDeEQsT0FBTyxJQUFJRyxnQ0FBa0IsQ0FBQ0g7WUFDaEM7UUFDRjs7SUFFTU8sV0FBWVYsSUFBb0QsRUFBRVcsSUFBYSxFQUFFQyxXQUFvQjs7ZUFBM0csb0JBQUE7WUFDRSxJQUFJO2dCQUNGLE1BQU1qQixXQUNILE1BQU0sTUFBS0MsTUFBTSxDQUFDQyxLQUFLLENBQUNnQixNQUFNLENBQzVCO29CQUNFQyxNQUFNO3dCQUNKQyxNQUFNZixLQUFLZSxJQUFJO3dCQUNmQyxRQUFRaEIsS0FBS2dCLE1BQU07d0JBQ25CUixVQUFVUixLQUFLUSxRQUFRO3dCQUN2QlAsS0FBS1UsU0FBU00sWUFBWSxTQUFTO3dCQUNuQ2YsUUFBUUYsS0FBS0UsTUFBTSxLQUFLZSxZQUFZLGVBQWVqQixLQUFLRSxNQUFNO3dCQUM5RGdCLE1BQU1sQixLQUFLa0IsSUFBSTt3QkFDZkMsVUFBVW5CLEtBQUttQixRQUFRO3dCQUN2QkMsT0FBT3BCLEtBQUtvQixLQUFLO3dCQUNqQkMsV0FBV3JCLEtBQUtxQixTQUFTO3dCQUN6QkMsWUFBWVgsU0FBU007d0JBQ3JCTjt3QkFDQUM7b0JBQ0Y7Z0JBQ0Y7Z0JBQ0wsTUFBTVcsZUFBZSx3Q0FBSzVCO29CQUFVTSxLQUFLTixTQUFTTSxHQUFHO29CQUFxQkMsUUFBUVAsU0FBU08sTUFBTTs7Z0JBQ2pHLE9BQU9xQjtZQUNULEVBQUUsT0FBT3BCLE9BQU87Z0JBQ2RDLHFCQUFNLENBQUNELEtBQUssQ0FBQztvQkFBRUUsVUFBVTtvQkFBMkJGO2dCQUFNO2dCQUMxRCxPQUFPLElBQUlHLGdDQUFrQixDQUFDSDtZQUNoQztRQUNGOztJQTlEQXFCLFlBQWEsQUFBVTVCLFNBQVM2Qiw2QkFBWSxDQUFDN0IsTUFBTSxDQUFFOzthQUE5QkEsU0FBQUE7UUFDckIsSUFBSSxDQUFDSCxRQUFRLEdBQUcsSUFBSSxDQUFDQSxRQUFRLENBQUNpQyxJQUFJLENBQUMsSUFBSTtJQUN6QztBQTZERiJ9
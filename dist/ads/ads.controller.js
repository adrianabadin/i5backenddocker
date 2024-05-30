"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AdsController", {
    enumerable: true,
    get: function() {
        return AdsController;
    }
});
const _adsservice = require("./ads.service");
const _loggerservice = require("../Services/logger.service");
const _Entities = require("../Entities");
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
const adsServiceLoad = new _adsservice.AdsService();
class AdsController {
    createAd(req, res) {
        var _this = this;
        return _async_to_generator(function*() {
            console.log('valido');
            try {
                var _req_file;
                const response = yield _this.service.createAd(_object_spread_props(_object_spread({}, req.body), {
                    photoUrl: (_req_file = req.file) === null || _req_file === void 0 ? void 0 : _req_file.filename
                }));
                res.status(200).send({
                    error: null,
                    ok: true,
                    data: response
                });
            } catch (error) {
                _loggerservice.logger.error({
                    function: 'AdsController.createAd',
                    error
                });
                res.status(500).send({
                    error,
                    ok: false,
                    data: null
                });
            }
        })();
    }
    getAds(_req, res) {
        var _this = this;
        return _async_to_generator(function*() {
            try {
                const response = yield _this.service.getAds();
                res.status(200).send(response);
            } catch (error) {
                _loggerservice.logger.error({
                    function: 'AdsController.getAds',
                    error
                });
                res.status(400).send({
                    error,
                    ok: false,
                    data: null
                });
            }
        })();
    }
    setActive(req, res) {
        var _this = this;
        return _async_to_generator(function*() {
            console.log(req.params, 'cosas');
            try {
                const response = yield _this.service.setActive(req.params.id);
                console.log(response, req.params.id, 'texo');
                res.status(200).send(response);
            } catch (error) {
                _loggerservice.logger.error({
                    function: 'AdsController.setActive',
                    error
                });
                res.status(400).send(new _Entities.ResponseObject(error, false, null));
            }
        })();
    }
    setInactive(req, res) {
        var _this = this;
        return _async_to_generator(function*() {
            console.log(req.params);
            try {
                const response = yield _this.service.setInactive(req.params.id);
                res.status(200).send(response);
            } catch (error) {
                _loggerservice.logger.error({
                    function: 'AdsController.setInactive',
                    error
                });
                res.status(400).send(new _Entities.ResponseObject(error, false, null));
            }
        })();
    }
    deleteAd(req, res) {
        var _this = this;
        return _async_to_generator(function*() {
            try {
                const { id } = req.params;
                const response = yield _this.service.deleteAd(id);
                res.status(200).send(response);
            } catch (error) {
                _loggerservice.logger.error({
                    function: 'adsController.delete',
                    error
                });
                res.status(404).send({
                    error,
                    ok: false,
                    data: null
                });
            }
        })();
    }
    getAd(req, res) {
        var _this = this;
        return _async_to_generator(function*() {
            try {
                const response = yield _this.service.getAd(req.params.id);
                res.status(200).send(response);
            } catch (error) {
                _loggerservice.logger.error({
                    function: 'AdsController.getAd',
                    error
                });
                res.status(404).send(error);
            }
        })();
    }
    updateAd(req, res) {
        var _this = this;
        return _async_to_generator(function*() {
            try {
                console.log(req.body, 'text', req.params, req.file);
                const { photoUrl } = req.body;
                let filename;
                if (req.file !== undefined) {
                    filename = req.file.filename;
                }
                const response = yield _this.service.updateAd(_object_spread_props(_object_spread({}, req.body), {
                    photoUrl: filename !== undefined ? filename : photoUrl
                }), req.params.id);
                console.log(photoUrl, filename, response);
                res.status(200).send(response);
            } catch (error) {
                _loggerservice.logger.error({
                    function: 'AdsController.updateAd',
                    error
                });
                res.status(404).send({
                    error,
                    ok: false,
                    data: null
                });
            }
        })();
    }
    constructor(){
        _define_property(this, "service", new _adsservice.AdsService());
        this.service = adsServiceLoad;
        this.createAd = this.createAd.bind(this);
        this.getAds = this.getAds.bind(this);
        this.setActive = this.setActive.bind(this);
        this.setInactive = this.setInactive.bind(this);
        this.deleteAd = this.deleteAd.bind(this);
        this.getAd = this.getAd.bind(this);
        this.updateAd = this.updateAd.bind(this);
    }
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hZHMvYWRzLmNvbnRyb2xsZXIudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgdHlwZSBSZXF1ZXN0LCB0eXBlIFJlc3BvbnNlIH0gZnJvbSAnZXhwcmVzcydcclxuaW1wb3J0IHsgQWRzU2VydmljZSB9IGZyb20gJy4vYWRzLnNlcnZpY2UnXHJcbmltcG9ydCB7IHR5cGUgY3JlYXRlQWRUeXBlIH0gZnJvbSAnLi9hZHMuc2NoZW1hJ1xyXG5pbXBvcnQgeyBsb2dnZXIgfSBmcm9tICcuLi9TZXJ2aWNlcy9sb2dnZXIuc2VydmljZSdcclxuaW1wb3J0IHsgUmVzcG9uc2VPYmplY3QgfSBmcm9tICcuLi9FbnRpdGllcydcclxuaW1wb3J0IHsgTXVsdGVyIH0gZnJvbSAnbXVsdGVyJ1xyXG5pbXBvcnQgZXhwcmVzcyBmcm9tICdleHByZXNzJ1xyXG5cclxuY29uc3QgYWRzU2VydmljZUxvYWQgPSBuZXcgQWRzU2VydmljZSgpXHJcbmV4cG9ydCBjbGFzcyBBZHNDb250cm9sbGVyIHtcclxuICBzZXJ2aWNlID0gbmV3IEFkc1NlcnZpY2UoKVxyXG4gIGNvbnN0cnVjdG9yICgpIHtcclxuICAgIHRoaXMuc2VydmljZSA9IGFkc1NlcnZpY2VMb2FkXHJcbiAgICB0aGlzLmNyZWF0ZUFkID0gdGhpcy5jcmVhdGVBZC5iaW5kKHRoaXMpXHJcbiAgICB0aGlzLmdldEFkcyA9IHRoaXMuZ2V0QWRzLmJpbmQodGhpcylcclxuICAgIHRoaXMuc2V0QWN0aXZlID0gdGhpcy5zZXRBY3RpdmUuYmluZCh0aGlzKVxyXG4gICAgdGhpcy5zZXRJbmFjdGl2ZSA9IHRoaXMuc2V0SW5hY3RpdmUuYmluZCh0aGlzKVxyXG4gICAgdGhpcy5kZWxldGVBZCA9IHRoaXMuZGVsZXRlQWQuYmluZCh0aGlzKVxyXG4gICAgdGhpcy5nZXRBZCA9IHRoaXMuZ2V0QWQuYmluZCh0aGlzKVxyXG4gICAgdGhpcy51cGRhdGVBZCA9IHRoaXMudXBkYXRlQWQuYmluZCh0aGlzKVxyXG4gIH1cclxuXHJcbiAgYXN5bmMgY3JlYXRlQWQgKHJlcTogUmVxdWVzdDxhbnksIGFueSwgY3JlYXRlQWRUeXBlICYgeyBwaG90b1VybDogc3RyaW5nIH0+LCByZXM6IFJlc3BvbnNlKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICBjb25zb2xlLmxvZygndmFsaWRvJylcclxuICAgIHRyeSB7XHJcbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgdGhpcy5zZXJ2aWNlLmNyZWF0ZUFkKHsgLi4ucmVxLmJvZHksIHBob3RvVXJsOiByZXEuZmlsZT8uZmlsZW5hbWUgYXMgc3RyaW5nIH0pXHJcbiAgICAgIHJlcy5zdGF0dXMoMjAwKS5zZW5kKHsgZXJyb3I6IG51bGwsIG9rOiB0cnVlLCBkYXRhOiByZXNwb25zZSB9KVxyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgbG9nZ2VyLmVycm9yKHsgZnVuY3Rpb246ICdBZHNDb250cm9sbGVyLmNyZWF0ZUFkJywgZXJyb3IgfSlcclxuXHJcbiAgICAgIHJlcy5zdGF0dXMoNTAwKS5zZW5kKHsgZXJyb3IsIG9rOiBmYWxzZSwgZGF0YTogbnVsbCB9KVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgYXN5bmMgZ2V0QWRzIChfcmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICB0cnkge1xyXG4gICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHRoaXMuc2VydmljZS5nZXRBZHMoKVxyXG4gICAgICByZXMuc3RhdHVzKDIwMCkuc2VuZChyZXNwb25zZSlcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgIGxvZ2dlci5lcnJvcih7IGZ1bmN0aW9uOiAnQWRzQ29udHJvbGxlci5nZXRBZHMnLCBlcnJvciB9KVxyXG4gICAgICByZXMuc3RhdHVzKDQwMCkuc2VuZCh7IGVycm9yLCBvazogZmFsc2UsIGRhdGE6IG51bGwgfSlcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGFzeW5jIHNldEFjdGl2ZSAocmVxOiBSZXF1ZXN0PHsgaWQ6IHN0cmluZyB9PiwgcmVzOiBSZXNwb25zZSk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgY29uc29sZS5sb2cocmVxLnBhcmFtcywgJ2Nvc2FzJylcclxuICAgIHRyeSB7XHJcbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgdGhpcy5zZXJ2aWNlLnNldEFjdGl2ZShyZXEucGFyYW1zLmlkKVxyXG4gICAgICBjb25zb2xlLmxvZyhyZXNwb25zZSwgcmVxLnBhcmFtcy5pZCwgJ3RleG8nKVxyXG4gICAgICByZXMuc3RhdHVzKDIwMCkuc2VuZChyZXNwb25zZSlcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgIGxvZ2dlci5lcnJvcih7IGZ1bmN0aW9uOiAnQWRzQ29udHJvbGxlci5zZXRBY3RpdmUnLCBlcnJvciB9KVxyXG4gICAgICByZXMuc3RhdHVzKDQwMCkuc2VuZChuZXcgUmVzcG9uc2VPYmplY3QoZXJyb3IsIGZhbHNlLCBudWxsKSlcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGFzeW5jIHNldEluYWN0aXZlIChyZXE6IFJlcXVlc3Q8eyBpZDogc3RyaW5nIH0+LCByZXM6IFJlc3BvbnNlKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICBjb25zb2xlLmxvZyhyZXEucGFyYW1zKVxyXG4gICAgdHJ5IHtcclxuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCB0aGlzLnNlcnZpY2Uuc2V0SW5hY3RpdmUocmVxLnBhcmFtcy5pZClcclxuICAgICAgcmVzLnN0YXR1cygyMDApLnNlbmQocmVzcG9uc2UpXHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICBsb2dnZXIuZXJyb3IoeyBmdW5jdGlvbjogJ0Fkc0NvbnRyb2xsZXIuc2V0SW5hY3RpdmUnLCBlcnJvciB9KVxyXG4gICAgICByZXMuc3RhdHVzKDQwMCkuc2VuZChuZXcgUmVzcG9uc2VPYmplY3QoZXJyb3IsIGZhbHNlLCBudWxsKSlcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGFzeW5jIGRlbGV0ZUFkIChyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGNvbnN0IHsgaWQgfSA9IHJlcS5wYXJhbXNcclxuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCB0aGlzLnNlcnZpY2UuZGVsZXRlQWQoaWQpXHJcbiAgICAgIHJlcy5zdGF0dXMoMjAwKS5zZW5kKHJlc3BvbnNlKVxyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgbG9nZ2VyLmVycm9yKHsgZnVuY3Rpb246ICdhZHNDb250cm9sbGVyLmRlbGV0ZScsIGVycm9yIH0pXHJcbiAgICAgIHJlcy5zdGF0dXMoNDA0KS5zZW5kKHsgZXJyb3IsIG9rOiBmYWxzZSwgZGF0YTogbnVsbCB9KVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgYXN5bmMgZ2V0QWQgKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgdHJ5IHtcclxuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCB0aGlzLnNlcnZpY2UuZ2V0QWQocmVxLnBhcmFtcy5pZClcclxuICAgICAgcmVzLnN0YXR1cygyMDApLnNlbmQocmVzcG9uc2UpXHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICBsb2dnZXIuZXJyb3IoeyBmdW5jdGlvbjogJ0Fkc0NvbnRyb2xsZXIuZ2V0QWQnLCBlcnJvciB9KVxyXG4gICAgICByZXMuc3RhdHVzKDQwNCkuc2VuZChlcnJvcilcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGFzeW5jIHVwZGF0ZUFkIChyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKHJlcS5ib2R5LCAndGV4dCcsIHJlcS5wYXJhbXMsIHJlcS5maWxlKVxyXG5cclxuICAgICAgY29uc3QgeyBwaG90b1VybCB9ID0gcmVxLmJvZHlcclxuICAgICAgbGV0IGZpbGVuYW1lXHJcbiAgICAgIGlmIChyZXEuZmlsZSAhPT0gdW5kZWZpbmVkKSB7IGZpbGVuYW1lID0gcmVxLmZpbGUuZmlsZW5hbWUgYXMgYW55IH1cclxuXHJcbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgdGhpcy5zZXJ2aWNlLnVwZGF0ZUFkKHsgLi4ucmVxLmJvZHksIHBob3RvVXJsOiBmaWxlbmFtZSAhPT0gdW5kZWZpbmVkID8gZmlsZW5hbWUgOiBwaG90b1VybCB9LCByZXEucGFyYW1zLmlkKVxyXG4gICAgICBjb25zb2xlLmxvZyhwaG90b1VybCwgZmlsZW5hbWUsIHJlc3BvbnNlKVxyXG4gICAgICByZXMuc3RhdHVzKDIwMCkuc2VuZChyZXNwb25zZSlcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgIGxvZ2dlci5lcnJvcih7IGZ1bmN0aW9uOiAnQWRzQ29udHJvbGxlci51cGRhdGVBZCcsIGVycm9yIH0pXHJcbiAgICAgIHJlcy5zdGF0dXMoNDA0KS5zZW5kKHsgZXJyb3IsIG9rOiBmYWxzZSwgZGF0YTogbnVsbCB9KVxyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iXSwibmFtZXMiOlsiQWRzQ29udHJvbGxlciIsImFkc1NlcnZpY2VMb2FkIiwiQWRzU2VydmljZSIsImNyZWF0ZUFkIiwicmVxIiwicmVzIiwiY29uc29sZSIsImxvZyIsInJlc3BvbnNlIiwic2VydmljZSIsImJvZHkiLCJwaG90b1VybCIsImZpbGUiLCJmaWxlbmFtZSIsInN0YXR1cyIsInNlbmQiLCJlcnJvciIsIm9rIiwiZGF0YSIsImxvZ2dlciIsImZ1bmN0aW9uIiwiZ2V0QWRzIiwiX3JlcSIsInNldEFjdGl2ZSIsInBhcmFtcyIsImlkIiwiUmVzcG9uc2VPYmplY3QiLCJzZXRJbmFjdGl2ZSIsImRlbGV0ZUFkIiwiZ2V0QWQiLCJ1cGRhdGVBZCIsInVuZGVmaW5lZCIsImNvbnN0cnVjdG9yIiwiYmluZCJdLCJyYW5nZU1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7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
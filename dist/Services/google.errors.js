/* eslint-disable n/handle-callback-err */ "use strict";
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
    FileCreateError: function() {
        return FileCreateError;
    },
    FolderCreateError: function() {
        return FolderCreateError;
    },
    GoogleError: function() {
        return GoogleError;
    },
    NeverAuthError: function() {
        return NeverAuthError;
    },
    PermissionsCreateError: function() {
        return PermissionsCreateError;
    },
    QuotaExceededError: function() {
        return QuotaExceededError;
    },
    ResponseObject: function() {
        return ResponseObject;
    },
    TokenError: function() {
        return TokenError;
    },
    UnknownGoogleError: function() {
        return UnknownGoogleError;
    },
    VideoCreateError: function() {
        return VideoCreateError;
    }
});
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
class ResponseObject {
    constructor(error, ok, data){
        _define_property(this, "error", void 0);
        _define_property(this, "ok", void 0);
        _define_property(this, "data", void 0);
        this.error = error;
        this.ok = ok;
        this.data = data;
    }
}
class GoogleError extends Error {
    constructor(ErrorContent, message = 'Generic Google Error', code = 2000){
        super(message);
        _define_property(this, "ErrorContent", void 0);
        _define_property(this, "message", void 0);
        _define_property(this, "code", void 0);
        this.ErrorContent = ErrorContent;
        this.message = message;
        this.code = code;
        this.name = 'Google Error';
        this.message = message;
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, GoogleError);
        }
    }
}
class TokenError extends GoogleError {
    constructor(ErrorContent, message = 'El token es invalido intente reautenticar', code = 1001){
        super(ErrorContent, message, code);
        _define_property(this, "ErrorContent", void 0);
        _define_property(this, "message", void 0);
        _define_property(this, "code", void 0);
        _define_property(this, "text", void 0);
        this.ErrorContent = ErrorContent;
        this.message = message;
        this.code = code;
        this.text = message;
        this.name = 'Token Error';
    }
}
class UnknownGoogleError extends GoogleError {
    constructor(ErrorContent, message = 'Error Desconocido de Google', code = 1000){
        super(ErrorContent, message, code);
        _define_property(this, "ErrorContent", void 0);
        _define_property(this, "message", void 0);
        _define_property(this, "code", void 0);
        _define_property(this, "text", void 0);
        this.ErrorContent = ErrorContent;
        this.message = message;
        this.code = code;
        this.text = message;
        this.name = 'Unknown Google Error';
    }
}
class NeverAuthError extends GoogleError {
    constructor(ErrorContent, message = 'No existe el refresh token en la base de datos', code = 1002){
        super(ErrorContent, message, code);
        _define_property(this, "ErrorContent", void 0);
        _define_property(this, "message", void 0);
        _define_property(this, "code", void 0);
        _define_property(this, "text", void 0);
        this.ErrorContent = ErrorContent;
        this.message = message;
        this.code = code;
        this.text = message;
        this.name = 'Never Authenticated Error';
    }
}
class FolderCreateError extends GoogleError {
    constructor(ErrorContent, message = 'Error al crear la carpeta en Google Drive', code = 1003){
        super(ErrorContent, message, code);
        _define_property(this, "message", void 0);
        _define_property(this, "code", void 0);
        _define_property(this, "text", void 0);
        this.message = message;
        this.code = code;
        this.text = message;
        this.name = 'Folder Create Error';
    }
}
class FileCreateError extends GoogleError {
    constructor(ErrorContent, message = 'Error al crear el archivo en Google Drive', code = 1004){
        super(ErrorContent, message, code);
        _define_property(this, "ErrorContent", void 0);
        _define_property(this, "message", void 0);
        _define_property(this, "code", void 0);
        _define_property(this, "text", void 0);
        this.ErrorContent = ErrorContent;
        this.message = message;
        this.code = code;
        this.text = message;
        this.name = 'File Create Error';
    }
}
class PermissionsCreateError extends GoogleError {
    constructor(ErrorContent, message = 'Error al asignar los permisos en Google Drive', code = 1005){
        super(ErrorContent, message, code);
        _define_property(this, "ErrorContent", void 0);
        _define_property(this, "message", void 0);
        _define_property(this, "code", void 0);
        _define_property(this, "text", void 0);
        this.ErrorContent = ErrorContent;
        this.message = message;
        this.code = code;
        this.text = message;
        this.name = 'Permissions Create Error';
    }
}
class VideoCreateError extends GoogleError {
    constructor(ErrorContent, message = 'Error al crear el video en youtube', code = 1006){
        super(ErrorContent, message, code);
        _define_property(this, "ErrorContent", void 0);
        _define_property(this, "message", void 0);
        _define_property(this, "code", void 0);
        _define_property(this, "text", void 0);
        this.ErrorContent = ErrorContent;
        this.message = message;
        this.code = code;
        this.text = message;
        this.name = 'Video Create Error';
    }
}
class QuotaExceededError extends GoogleError {
    constructor(ErrorContent, message = 'Se ha exedido la quota de Youtube carga el link de tu video para continuar', code = 1007){
        super(ErrorContent, message, code);
        _define_property(this, "ErrorContent", void 0);
        _define_property(this, "message", void 0);
        _define_property(this, "code", void 0);
        _define_property(this, "text", void 0);
        this.ErrorContent = ErrorContent;
        this.message = message;
        this.code = code;
        this.text = message;
        this.name = 'Quota Exceeded Error';
    }
} /**
 * videos.delete
Tipo de error	Detalle del error	Descripción
forbidden (403)	forbidden	El video que intentas eliminar no se puede eliminar. Puede que la solicitud no esté debidamente autorizada.
notFound (404)	videoNotFound	El video que intentas eliminar no se puede encontrar. Comprueba el valor del parámetro id de la solicitud para asegurarte de que sea correcto.
 */ 

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9TZXJ2aWNlcy9nb29nbGUuZXJyb3JzLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qIGVzbGludC1kaXNhYmxlIG4vaGFuZGxlLWNhbGxiYWNrLWVyciAqL1xyXG5leHBvcnQgaW50ZXJmYWNlIElSZXNwb25zZU9iamVjdCB7XHJcbiAgZXJyb3I/OiBhbnlcclxuICBvazogYm9vbGVhblxyXG4gIGRhdGE6IGFueVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgUmVzcG9uc2VPYmplY3QgaW1wbGVtZW50cyBJUmVzcG9uc2VPYmplY3Qge1xyXG4gIGNvbnN0cnVjdG9yIChcclxuICAgIHB1YmxpYyBlcnJvcjogYW55LFxyXG4gICAgcHVibGljIG9rOiBib29sZWFuLFxyXG4gICAgcHVibGljIGRhdGE6IGFueSkge31cclxufVxyXG5leHBvcnQgaW50ZXJmYWNlIEdlbmVyaWNSZXNwb25zZU9iamVjdDxUPiB7XHJcbiAgZXJyb3I6IGFueVxyXG4gIG9rOiBib29sZWFuXHJcbiAgZGF0YTogVFxyXG59XHJcblxyXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgR29vZ2xlRXJyb3IgZXh0ZW5kcyBFcnJvciB7XHJcbiAgY29uc3RydWN0b3IgKHB1YmxpYyBFcnJvckNvbnRlbnQ/OiBhbnksIHB1YmxpYyBtZXNzYWdlOiBzdHJpbmcgPSAnR2VuZXJpYyBHb29nbGUgRXJyb3InLCBwdWJsaWMgY29kZTogbnVtYmVyID0gMjAwMCkge1xyXG4gICAgc3VwZXIobWVzc2FnZSlcclxuICAgIHRoaXMubmFtZSA9ICdHb29nbGUgRXJyb3InXHJcbiAgICB0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlXHJcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L3N0cmljdC1ib29sZWFuLWV4cHJlc3Npb25zXHJcbiAgICBpZiAoRXJyb3IuY2FwdHVyZVN0YWNrVHJhY2UpIHtcclxuICAgICAgRXJyb3IuY2FwdHVyZVN0YWNrVHJhY2UodGhpcywgR29vZ2xlRXJyb3IpXHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbmV4cG9ydCBjbGFzcyBUb2tlbkVycm9yIGV4dGVuZHMgR29vZ2xlRXJyb3Ige1xyXG4gIHB1YmxpYyB0ZXh0OiBzdHJpbmdcclxuICBjb25zdHJ1Y3RvciAocHVibGljIEVycm9yQ29udGVudD86IGFueSwgcHVibGljIG1lc3NhZ2U6IHN0cmluZyA9ICdFbCB0b2tlbiBlcyBpbnZhbGlkbyBpbnRlbnRlIHJlYXV0ZW50aWNhcicsIHB1YmxpYyBjb2RlOiBudW1iZXIgPSAxMDAxKSB7XHJcbiAgICBzdXBlcihFcnJvckNvbnRlbnQsIG1lc3NhZ2UsIGNvZGUpXHJcbiAgICB0aGlzLnRleHQgPSBtZXNzYWdlXHJcbiAgICB0aGlzLm5hbWUgPSAnVG9rZW4gRXJyb3InXHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgVW5rbm93bkdvb2dsZUVycm9yIGV4dGVuZHMgR29vZ2xlRXJyb3Ige1xyXG4gIHB1YmxpYyB0ZXh0OiBzdHJpbmdcclxuXHJcbiAgY29uc3RydWN0b3IgKHB1YmxpYyBFcnJvckNvbnRlbnQ6IGFueSwgcHVibGljIG1lc3NhZ2U6IHN0cmluZyA9ICdFcnJvciBEZXNjb25vY2lkbyBkZSBHb29nbGUnLCBwdWJsaWMgY29kZTogbnVtYmVyID0gMTAwMCkge1xyXG4gICAgc3VwZXIoRXJyb3JDb250ZW50LCBtZXNzYWdlLCBjb2RlKVxyXG4gICAgdGhpcy50ZXh0ID0gbWVzc2FnZVxyXG4gICAgdGhpcy5uYW1lID0gJ1Vua25vd24gR29vZ2xlIEVycm9yJ1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIE5ldmVyQXV0aEVycm9yIGV4dGVuZHMgR29vZ2xlRXJyb3Ige1xyXG4gIHB1YmxpYyB0ZXh0OiBzdHJpbmdcclxuXHJcbiAgY29uc3RydWN0b3IgKHB1YmxpYyBFcnJvckNvbnRlbnQ/OiBhbnksIHB1YmxpYyBtZXNzYWdlOiBzdHJpbmcgPSAnTm8gZXhpc3RlIGVsIHJlZnJlc2ggdG9rZW4gZW4gbGEgYmFzZSBkZSBkYXRvcycsIHB1YmxpYyBjb2RlOiBudW1iZXIgPSAxMDAyKSB7XHJcbiAgICBzdXBlcihFcnJvckNvbnRlbnQsIG1lc3NhZ2UsIGNvZGUpXHJcbiAgICB0aGlzLnRleHQgPSBtZXNzYWdlXHJcbiAgICB0aGlzLm5hbWUgPSAnTmV2ZXIgQXV0aGVudGljYXRlZCBFcnJvcidcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBGb2xkZXJDcmVhdGVFcnJvciBleHRlbmRzIEdvb2dsZUVycm9yIHtcclxuICBwdWJsaWMgdGV4dDogc3RyaW5nXHJcblxyXG4gIGNvbnN0cnVjdG9yIChFcnJvckNvbnRlbnQ/OiBhbnksIHB1YmxpYyBtZXNzYWdlOiBzdHJpbmcgPSAnRXJyb3IgYWwgY3JlYXIgbGEgY2FycGV0YSBlbiBHb29nbGUgRHJpdmUnLCBwdWJsaWMgY29kZTogbnVtYmVyID0gMTAwMykge1xyXG4gICAgc3VwZXIoRXJyb3JDb250ZW50LCBtZXNzYWdlLCBjb2RlKVxyXG4gICAgdGhpcy50ZXh0ID0gbWVzc2FnZVxyXG4gICAgdGhpcy5uYW1lID0gJ0ZvbGRlciBDcmVhdGUgRXJyb3InXHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgRmlsZUNyZWF0ZUVycm9yIGV4dGVuZHMgR29vZ2xlRXJyb3Ige1xyXG4gIHB1YmxpYyB0ZXh0OiBzdHJpbmdcclxuXHJcbiAgY29uc3RydWN0b3IgKHB1YmxpYyBFcnJvckNvbnRlbnQ/OiBhbnksIHB1YmxpYyBtZXNzYWdlOiBzdHJpbmcgPSAnRXJyb3IgYWwgY3JlYXIgZWwgYXJjaGl2byBlbiBHb29nbGUgRHJpdmUnLCBwdWJsaWMgY29kZTogbnVtYmVyID0gMTAwNCkge1xyXG4gICAgc3VwZXIoRXJyb3JDb250ZW50LCBtZXNzYWdlLCBjb2RlKVxyXG4gICAgdGhpcy50ZXh0ID0gbWVzc2FnZVxyXG4gICAgdGhpcy5uYW1lID0gJ0ZpbGUgQ3JlYXRlIEVycm9yJ1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFBlcm1pc3Npb25zQ3JlYXRlRXJyb3IgZXh0ZW5kcyBHb29nbGVFcnJvciB7XHJcbiAgcHVibGljIHRleHQ6IHN0cmluZ1xyXG5cclxuICBjb25zdHJ1Y3RvciAocHVibGljIEVycm9yQ29udGVudD86IGFueSwgcHVibGljIG1lc3NhZ2U6IHN0cmluZyA9ICdFcnJvciBhbCBhc2lnbmFyIGxvcyBwZXJtaXNvcyBlbiBHb29nbGUgRHJpdmUnLCBwdWJsaWMgY29kZTogbnVtYmVyID0gMTAwNSkge1xyXG4gICAgc3VwZXIoRXJyb3JDb250ZW50LCBtZXNzYWdlLCBjb2RlKVxyXG4gICAgdGhpcy50ZXh0ID0gbWVzc2FnZVxyXG4gICAgdGhpcy5uYW1lID0gJ1Blcm1pc3Npb25zIENyZWF0ZSBFcnJvcidcclxuICB9XHJcbn1cclxuZXhwb3J0IGNsYXNzIFZpZGVvQ3JlYXRlRXJyb3IgZXh0ZW5kcyBHb29nbGVFcnJvciB7XHJcbiAgcHVibGljIHRleHQ6IHN0cmluZ1xyXG4gIGNvbnN0cnVjdG9yIChwdWJsaWMgRXJyb3JDb250ZW50PzogYW55LCBwdWJsaWMgbWVzc2FnZTogc3RyaW5nID0gJ0Vycm9yIGFsIGNyZWFyIGVsIHZpZGVvIGVuIHlvdXR1YmUnLCBwdWJsaWMgY29kZTogbnVtYmVyID0gMTAwNikge1xyXG4gICAgc3VwZXIoRXJyb3JDb250ZW50LCBtZXNzYWdlLCBjb2RlKVxyXG4gICAgdGhpcy50ZXh0ID0gbWVzc2FnZVxyXG4gICAgdGhpcy5uYW1lID0gJ1ZpZGVvIENyZWF0ZSBFcnJvcidcclxuICB9XHJcbn1cclxuZXhwb3J0IGNsYXNzIFF1b3RhRXhjZWVkZWRFcnJvciBleHRlbmRzIEdvb2dsZUVycm9yIHtcclxuICBwdWJsaWMgdGV4dDogc3RyaW5nXHJcbiAgY29uc3RydWN0b3IgKHB1YmxpYyBFcnJvckNvbnRlbnQ/OiBhbnksIHB1YmxpYyBtZXNzYWdlOiBzdHJpbmcgPSAnU2UgaGEgZXhlZGlkbyBsYSBxdW90YSBkZSBZb3V0dWJlIGNhcmdhIGVsIGxpbmsgZGUgdHUgdmlkZW8gcGFyYSBjb250aW51YXInLCBwdWJsaWMgY29kZTogbnVtYmVyID0gMTAwNykge1xyXG4gICAgc3VwZXIoRXJyb3JDb250ZW50LCBtZXNzYWdlLCBjb2RlKVxyXG4gICAgdGhpcy50ZXh0ID0gbWVzc2FnZVxyXG4gICAgdGhpcy5uYW1lID0gJ1F1b3RhIEV4Y2VlZGVkIEVycm9yJ1xyXG4gIH1cclxufVxyXG4vKipcclxuICogdmlkZW9zLmRlbGV0ZVxyXG5UaXBvIGRlIGVycm9yXHREZXRhbGxlIGRlbCBlcnJvclx0RGVzY3JpcGNpw7NuXHJcbmZvcmJpZGRlbiAoNDAzKVx0Zm9yYmlkZGVuXHRFbCB2aWRlbyBxdWUgaW50ZW50YXMgZWxpbWluYXIgbm8gc2UgcHVlZGUgZWxpbWluYXIuIFB1ZWRlIHF1ZSBsYSBzb2xpY2l0dWQgbm8gZXN0w6kgZGViaWRhbWVudGUgYXV0b3JpemFkYS5cclxubm90Rm91bmQgKDQwNClcdHZpZGVvTm90Rm91bmRcdEVsIHZpZGVvIHF1ZSBpbnRlbnRhcyBlbGltaW5hciBubyBzZSBwdWVkZSBlbmNvbnRyYXIuIENvbXBydWViYSBlbCB2YWxvciBkZWwgcGFyw6FtZXRybyBpZCBkZSBsYSBzb2xpY2l0dWQgcGFyYSBhc2VndXJhcnRlIGRlIHF1ZSBzZWEgY29ycmVjdG8uXHJcbiAqL1xyXG4iXSwibmFtZXMiOlsiRmlsZUNyZWF0ZUVycm9yIiwiRm9sZGVyQ3JlYXRlRXJyb3IiLCJHb29nbGVFcnJvciIsIk5ldmVyQXV0aEVycm9yIiwiUGVybWlzc2lvbnNDcmVhdGVFcnJvciIsIlF1b3RhRXhjZWVkZWRFcnJvciIsIlJlc3BvbnNlT2JqZWN0IiwiVG9rZW5FcnJvciIsIlVua25vd25Hb29nbGVFcnJvciIsIlZpZGVvQ3JlYXRlRXJyb3IiLCJjb25zdHJ1Y3RvciIsImVycm9yIiwib2siLCJkYXRhIiwiRXJyb3IiLCJFcnJvckNvbnRlbnQiLCJtZXNzYWdlIiwiY29kZSIsIm5hbWUiLCJjYXB0dXJlU3RhY2tUcmFjZSIsInRleHQiXSwicmFuZ2VNYXBwaW5n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
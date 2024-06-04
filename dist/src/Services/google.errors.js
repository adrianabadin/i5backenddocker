"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuotaExceededError = exports.VideoCreateError = exports.PermissionsCreateError = exports.FileCreateError = exports.FolderCreateError = exports.NeverAuthError = exports.UnknownGoogleError = exports.TokenError = exports.GoogleError = exports.ResponseObject = void 0;
class ResponseObject {
    constructor(error, ok, data) {
        this.error = error;
        this.ok = ok;
        this.data = data;
    }
}
exports.ResponseObject = ResponseObject;
class GoogleError extends Error {
    constructor(ErrorContent, message = 'Generic Google Error', code = 2000) {
        super(message);
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
exports.GoogleError = GoogleError;
class TokenError extends GoogleError {
    constructor(ErrorContent, message = 'El token es invalido intente reautenticar', code = 1001) {
        super(ErrorContent, message, code);
        this.ErrorContent = ErrorContent;
        this.message = message;
        this.code = code;
        this.text = message;
        this.name = 'Token Error';
    }
}
exports.TokenError = TokenError;
class UnknownGoogleError extends GoogleError {
    constructor(ErrorContent, message = 'Error Desconocido de Google', code = 1000) {
        super(ErrorContent, message, code);
        this.ErrorContent = ErrorContent;
        this.message = message;
        this.code = code;
        this.text = message;
        this.name = 'Unknown Google Error';
    }
}
exports.UnknownGoogleError = UnknownGoogleError;
class NeverAuthError extends GoogleError {
    constructor(ErrorContent, message = 'No existe el refresh token en la base de datos', code = 1002) {
        super(ErrorContent, message, code);
        this.ErrorContent = ErrorContent;
        this.message = message;
        this.code = code;
        this.text = message;
        this.name = 'Never Authenticated Error';
    }
}
exports.NeverAuthError = NeverAuthError;
class FolderCreateError extends GoogleError {
    constructor(ErrorContent, message = 'Error al crear la carpeta en Google Drive', code = 1003) {
        super(ErrorContent, message, code);
        this.message = message;
        this.code = code;
        this.text = message;
        this.name = 'Folder Create Error';
    }
}
exports.FolderCreateError = FolderCreateError;
class FileCreateError extends GoogleError {
    constructor(ErrorContent, message = 'Error al crear el archivo en Google Drive', code = 1004) {
        super(ErrorContent, message, code);
        this.ErrorContent = ErrorContent;
        this.message = message;
        this.code = code;
        this.text = message;
        this.name = 'File Create Error';
    }
}
exports.FileCreateError = FileCreateError;
class PermissionsCreateError extends GoogleError {
    constructor(ErrorContent, message = 'Error al asignar los permisos en Google Drive', code = 1005) {
        super(ErrorContent, message, code);
        this.ErrorContent = ErrorContent;
        this.message = message;
        this.code = code;
        this.text = message;
        this.name = 'Permissions Create Error';
    }
}
exports.PermissionsCreateError = PermissionsCreateError;
class VideoCreateError extends GoogleError {
    constructor(ErrorContent, message = 'Error al crear el video en youtube', code = 1006) {
        super(ErrorContent, message, code);
        this.ErrorContent = ErrorContent;
        this.message = message;
        this.code = code;
        this.text = message;
        this.name = 'Video Create Error';
    }
}
exports.VideoCreateError = VideoCreateError;
class QuotaExceededError extends GoogleError {
    constructor(ErrorContent, message = 'Se ha exedido la quota de Youtube carga el link de tu video para continuar', code = 1007) {
        super(ErrorContent, message, code);
        this.ErrorContent = ErrorContent;
        this.message = message;
        this.code = code;
        this.text = message;
        this.name = 'Quota Exceeded Error';
    }
}
exports.QuotaExceededError = QuotaExceededError;
/**
 * videos.delete
Tipo de error	Detalle del error	Descripción
forbidden (403)	forbidden	El video que intentas eliminar no se puede eliminar. Puede que la solicitud no esté debidamente autorizada.
notFound (404)	videoNotFound	El video que intentas eliminar no se puede encontrar. Comprueba el valor del parámetro id de la solicitud para asegurarte de que sea correcto.
 */

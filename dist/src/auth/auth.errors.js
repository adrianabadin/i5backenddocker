"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserExistsError = exports.UserCreateError = exports.AuthError = void 0;
class AuthError extends Error {
    constructor(errorContent, message = 'Error de autenticacion', code = 1000) {
        super(message);
        this.errorContent = errorContent;
        this.message = message;
        this.code = code;
        this.text = message;
        this.name = 'Auth Error';
        this.code = code;
    }
}
exports.AuthError = AuthError;
class UserCreateError extends AuthError {
    constructor(errorContent, message = 'Error al crear el usuario', code = 1001) {
        super(errorContent, message, code);
    }
}
exports.UserCreateError = UserCreateError;
class UserExistsError extends AuthError {
    constructor(errorContent, message = 'El usuario ya existe', code = 1002) {
        super(errorContent, message, code);
    }
}
exports.UserExistsError = UserExistsError;

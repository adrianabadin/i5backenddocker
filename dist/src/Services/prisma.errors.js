"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnknownPrismaError = exports.NotFoundPrismaError = exports.ColumnPrismaError = exports.UniqueRestraintError = exports.PrismaError = void 0;
class PrismaError extends Error {
    constructor(errorContent, target, message = 'Generic prisma error', code = 3000) {
        super(message);
        this.errorContent = errorContent;
        this.target = target;
        this.code = code;
        this.name = 'Prisma Error';
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        if (Error.captureStackTrace)
            Error.captureStackTrace(this, PrismaError);
    }
}
exports.PrismaError = PrismaError;
class UniqueRestraintError extends PrismaError {
    constructor(errorContent, target, message = 'No se puede duplicar un campo unico', code = 3001) {
        super(errorContent, target, message, code);
        this.errorContent = errorContent;
        this.target = target;
        this.code = code;
        this.name = 'Unique Restraint Error';
    }
}
exports.UniqueRestraintError = UniqueRestraintError;
class ColumnPrismaError extends PrismaError {
    constructor(errorContent, target, message = 'El dato excede el tamaño de la columna', code = 3002) {
        super(errorContent, target, message, code);
        this.errorContent = errorContent;
        this.target = target;
        this.code = code;
        this.name = 'Column Prisma Error';
    }
}
exports.ColumnPrismaError = ColumnPrismaError;
class NotFoundPrismaError extends PrismaError {
    constructor(errorContent, target, message = 'El registro no se encontro', code = 3003) {
        super(errorContent, target, message, code);
        this.errorContent = errorContent;
        this.target = target;
        this.code = code;
        this.name = 'Not Found Prisma Error';
    }
}
exports.NotFoundPrismaError = NotFoundPrismaError;
class UnknownPrismaError extends PrismaError {
    constructor(errorContent, target, message = 'Error desconocido en la base de datos', code = 3000) {
        super(errorContent, target, message, code);
        this.errorContent = errorContent;
        this.target = target;
        this.code = code;
        this.name = 'Unknown Prisma Error';
    }
}
exports.UnknownPrismaError = UnknownPrismaError;

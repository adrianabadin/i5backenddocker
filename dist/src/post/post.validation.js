"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postValidation = void 0;
const express_validator_1 = require("express-validator");
const Entities_1 = require("../Entities");
const logger_service_1 = require("../Services/logger.service");
exports.postValidation = [
    (0, express_validator_1.body)('title').isString().withMessage('El titulo debe ser un String').isLength({ min: 3 }).withMessage('Debe tener al menos 3 caracteres'),
    (0, express_validator_1.body)('heading').isString().withMessage('El encabezado debe ser un String').isLength({ min: 3 }).withMessage('Debe tener al menos 3 caracteres'),
    (0, express_validator_1.body)('text').isString().withMessage('El Texto debe ser un String').isLength({ min: 3 }).withMessage('Debe tener al menos 3 caracteres'),
    (0, express_validator_1.body)('classification').isString().withMessage('La clasificacion debe ser un string').isIn(['Municipales', 'Economia', 'Politica']).withMessage('Debes elegir una categoria Valida'),
    (0, express_validator_1.body)('importance').isString().withMessage('La clasificacion debe ser un string').isNumeric().withMessage('debe ser un numero'),
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (errors.isEmpty())
            next();
        else {
            logger_service_1.logger.debug({ function: 'postValidation', errors });
            res.status(404).send(new Entities_1.ResponseObject(errors, false, null));
        }
    }
];

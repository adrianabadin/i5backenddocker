"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.schemaValidator = void 0;
const zod_1 = require("zod");
const logger_service_1 = require("../Services/logger.service");
const schemaValidator = (schema) => (req, res, next) => {
    try {
        if (Array.isArray(schema)) {
            schema.forEach(singleSchema => {
                singleSchema.parse({
                    body: req.body,
                    query: req.query,
                    params: req.params
                });
            });
        }
        else {
            schema.parse({
                body: req.body,
                query: req.query,
                params: req.params
            });
        }
        next();
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            res.status(404).send({
                error: error.issues.map(issue => ({ path: issue.path, message: issue.message, code: issue.code }))
            });
            logger_service_1.logger.error({ function: 'schemaValidator', error: error.issues.map(issue => ({ path: issue.path, message: issue.message, code: issue.code })) });
        }
    }
};
exports.schemaValidator = schemaValidator;

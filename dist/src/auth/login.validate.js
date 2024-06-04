"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginValidator = void 0;
const express_validator_1 = require("express-validator");
exports.loginValidator = [
    (0, express_validator_1.body)('username').notEmpty().withMessage('Cant post an empty String').isEmail().withMessage('Doesnt match a email type'),
    (0, express_validator_1.body)('password').notEmpty(),
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (errors.isEmpty()) {
            next();
        }
        else {
            const data = errors.array();
            req.flash('errors', data);
            res.redirect('/auth/failedlogin');
        }
    }
];

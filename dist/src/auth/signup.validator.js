"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signupValidator = void 0;
const express_validator_1 = require("express-validator");
exports.signupValidator = [
    (0, express_validator_1.body)('username').notEmpty().withMessage('Cant post an empty String').isEmail().withMessage('Doesnt match a email type'),
    (0, express_validator_1.body)('password').isStrongPassword({ minLowercase: 3, minUppercase: 3, minNumbers: 1, minSymbols: 1 }).withMessage('Password must be have at least 3 lowercase leters 3 Upercase 1 number and 1 symbol'),
    (0, express_validator_1.body)('name').isString().isLength({ min: 3 }),
    (0, express_validator_1.body)('lastName').isString().isLength({ min: 3 }),
    (0, express_validator_1.body)('phone').isMobilePhone('any', { strictMode: false }),
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

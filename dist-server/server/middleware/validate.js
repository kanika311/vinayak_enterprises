"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const express_validator_1 = require("express-validator");
const helpers_1 = require("../utils/helpers");
const validate = (req, _res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        const message = errors
            .array()
            .map((e) => e.msg)
            .join(', ');
        return next(new helpers_1.AppError(message, 400));
    }
    next();
};
exports.validate = validate;

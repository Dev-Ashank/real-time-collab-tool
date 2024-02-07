"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginInputValidation = exports.validateUserInput = void 0;
const express_validator_1 = require("express-validator");
const logger_1 = __importDefault(require("../config/logger"));
exports.validateUserInput = [
    // Validate and sanitize user input fields
    (0, express_validator_1.body)("userName").trim().isLength({ min: 5 }).escape(),
    (0, express_validator_1.body)("email").trim().isEmail().normalizeEmail(),
    (0, express_validator_1.body)("password").trim().isLength({ min: 5 }),
    (0, express_validator_1.body)("profilePicture").optional().trim().escape(),
    (0, express_validator_1.body)("dateOfBirth").isISO8601().toDate(),
    (0, express_validator_1.body)("bio").optional().trim().escape(),
    // Custom middleware to check for validation errors
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            const errorMessages = errors
                .array()
                .map((error) => error.msg);
            logger_1.default.error("Validation errors:", errorMessages);
            return res.status(400).json({ errors: errorMessages });
        }
        next();
    },
];
exports.loginInputValidation = [
    (0, express_validator_1.body)("email").isEmail().normalizeEmail(),
    (0, express_validator_1.body)("password").isLength({ min: 5 }),
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            logger_1.default.error("Login validation errors:", errors.array());
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
];

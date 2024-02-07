"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const express_validator_1 = require("express-validator");
const logger_1 = __importDefault(require("../config/logger"));
const validate = (validations) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            for (let validation of validations) {
                const result = yield validation.run(req);
                if (result.isEmpty())
                    break;
            }
            const errors = (0, express_validator_1.validationResult)(req);
            if (errors.isEmpty()) {
                return next();
            }
            else {
                logger_1.default.error("Validation errors:", errors.array());
                res.status(400).json({ errors: errors.array() });
            }
        }
        catch (error) {
            logger_1.default.error("Validation error:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    });
};
exports.validate = validate;

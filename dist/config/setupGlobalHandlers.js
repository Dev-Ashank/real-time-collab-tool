"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupGlobalHandlers = void 0;
const logger_1 = __importDefault(require("./logger"));
const setupGlobalHandlers = () => {
    process.on("uncaughtException", (error) => {
        logger_1.default.error("Uncaught Exception:", error);
        process.exit(1);
    });
    process.on("unhandledRejection", (error) => {
        logger_1.default.error("Unhandled Rejection:", error);
    });
};
exports.setupGlobalHandlers = setupGlobalHandlers;

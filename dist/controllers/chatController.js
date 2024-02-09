"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.deleteMessage = exports.updateMessage = exports.getMessageById = exports.getAllMessages = exports.createChatMessage = void 0;
const chatService = __importStar(require("../services/messageService"));
const logger_1 = __importDefault(require("../config/logger"));
const mongoose_1 = __importDefault(require("mongoose"));
const createChatMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { message, senderId, receiverId } = req.body;
        const chat = yield chatService.saveChatMessage(message, senderId, receiverId);
        res.status(201).json(chat);
    }
    catch (error) {
        if (error instanceof mongoose_1.default.Error.ValidationError) {
            // If the error is a validation error due to casting issues with ObjectId
            logger_1.default.error("Invalid senderId or receiverId");
            res.status(400).json({ error: "Invalid senderId or receiverId" });
        }
        else {
            // For other errors, log the error and return a 500 response
            logger_1.default.error(`Error creating chat message: ${error}`);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
});
exports.createChatMessage = createChatMessage;
const getAllMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // Extract user ID from request object
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        // Retrieve messages related to the user making the request
        const messages = yield chatService.getAllChatMessages(userId);
        res.json(messages);
    }
    catch (error) {
        logger_1.default.error(`Error getting all chat messages: ${error}`);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.getAllMessages = getAllMessages;
const getMessageById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const message = yield chatService.getChatMessageById(req.params.id);
        if (!message) {
            return res.status(404).send();
        }
        res.json(message);
    }
    catch (error) {
        logger_1.default.error(`Error getting chat message by ID: ${error}`);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.getMessageById = getMessageById;
const updateMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedMessage = yield chatService.updateChatMessage(req.params.id, req.body.message);
        if (!updatedMessage) {
            return res.status(404).json({ error: "Message not found" });
        }
        res.json(updatedMessage);
    }
    catch (error) {
        logger_1.default.error(`Error updating chat message: ${error}`);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.updateMessage = updateMessage;
const deleteMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedMessage = yield chatService.deleteChatMessage(req.params.id);
        if (!deletedMessage) {
            return res.status(404).send();
        }
        res.status(204).send();
    }
    catch (error) {
        logger_1.default.error(`Error deleting chat message: ${error}`);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.deleteMessage = deleteMessage;

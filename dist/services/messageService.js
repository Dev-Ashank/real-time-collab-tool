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
exports.getChatMessagesByUser = exports.deleteChatMessage = exports.updateChatMessage = exports.getChatMessageById = exports.getAllChatMessages = exports.saveChatMessage = void 0;
const Chat_1 = __importDefault(require("../models/Chat"));
const saveChatMessage = (message, senderId, receiverId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Chat_1.default.create({ message, sender: senderId, receiver: receiverId });
});
exports.saveChatMessage = saveChatMessage;
const getAllChatMessages = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Chat_1.default.find({
        $or: [{ sender: userId }, { receiver: userId }],
    }).populate("sender receiver");
});
exports.getAllChatMessages = getAllChatMessages;
const getChatMessageById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Chat_1.default.findById(id).populate("sender receiver");
});
exports.getChatMessageById = getChatMessageById;
const updateChatMessage = (id, message) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Chat_1.default.findByIdAndUpdate(id, { message }, { new: true });
});
exports.updateChatMessage = updateChatMessage;
const deleteChatMessage = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Chat_1.default.findByIdAndDelete(id);
});
exports.deleteChatMessage = deleteChatMessage;
const getChatMessagesByUser = (userId, receiverId) => __awaiter(void 0, void 0, void 0, function* () {
    // Fetch messages where the sender is the current user and the receiver is the specified user
    return yield Chat_1.default.find({ sender: userId, receiver: receiverId }).populate("sender receiver");
});
exports.getChatMessagesByUser = getChatMessagesByUser;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const chatController_1 = require("../controllers/chatController");
const router = express_1.default.Router();
router.post("/", chatController_1.createChatMessage);
router.get("/", chatController_1.getAllMessages);
router.get("/:id", chatController_1.getMessageById);
router.put("/:id", chatController_1.updateMessage);
router.delete("/:id", chatController_1.deleteMessage);
exports.default = router;

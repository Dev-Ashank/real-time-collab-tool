import express from "express";
import {
  createChatMessage,
  getAllMessages,
  getMessageById,
  updateMessage,
  deleteMessage,
} from "../controllers/chatController";
import { loginMiddleware } from "../middlewares/loginMiddleware";

const router = express.Router();

router.use(loginMiddleware);

router.post("/", createChatMessage);
router.get("/", getAllMessages);
router.get("/:id", getMessageById);
router.put("/:id", updateMessage);
router.delete("/:id", deleteMessage);

export default router;

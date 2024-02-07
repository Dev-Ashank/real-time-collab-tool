import { Request, Response } from "express";
import * as chatService from "../services/messageService";
import logger from "../config/logger";
import mongoose from "mongoose";
import { CustomRequest } from "../middlewares/loginMiddleware";

export const createChatMessage = async (req: CustomRequest, res: Response) => {
  try {
    const { message, senderId, receiverId } = req.body;
    const chat = await chatService.saveChatMessage(
      message,
      senderId,
      receiverId
    );
    res.status(201).json(chat);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      // If the error is a validation error due to casting issues with ObjectId
      logger.error("Invalid senderId or receiverId");
      res.status(400).json({ error: "Invalid senderId or receiverId" });
    } else {
      // For other errors, log the error and return a 500 response
      logger.error(`Error creating chat message: ${error}`);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
};
export const getAllMessages = async (req: Request, res: Response) => {
  try {
    // Extract user ID from request object
    const userId = (req as CustomRequest).user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Retrieve messages related to the user making the request
    const messages = await chatService.getAllChatMessages(userId);
    res.json(messages);
  } catch (error) {
    logger.error(`Error getting all chat messages: ${error}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getMessageById = async (req: Request, res: Response) => {
  try {
    const message = await chatService.getChatMessageById(req.params.id);
    if (!message) {
      return res.status(404).send();
    }
    res.json(message);
  } catch (error) {
    logger.error(`Error getting chat message by ID: ${error}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const updateMessage = async (req: Request, res: Response) => {
  try {
    const updatedMessage = await chatService.updateChatMessage(
      req.params.id,
      req.body.message
    );
    if (!updatedMessage) {
      return res.status(404).json({ error: "Message not found" });
    }
    res.json(updatedMessage);
  } catch (error) {
    logger.error(`Error updating chat message: ${error}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const deleteMessage = async (req: Request, res: Response) => {
  try {
    const deletedMessage = await chatService.deleteChatMessage(req.params.id);
    if (!deletedMessage) {
      return res.status(404).send();
    }
    res.status(204).send();
  } catch (error) {
    logger.error(`Error deleting chat message: ${error}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

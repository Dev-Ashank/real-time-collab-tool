// Import WebSocket and HTTP server types
import { Server as WebSocketServer } from "ws";
import { Server as HttpServer } from "http";
import logger from "./logger";
import { saveChatMessage } from "../services/messageService";
import mongoose from "mongoose";

// Function to initialize WebSocket server
export const initializeWebSocketServer = (server: HttpServer) => {
  logger.info("WebSocket server has been initialized.");
  // Create a WebSocket server attached to an existing HTTP server
  const wss = new WebSocketServer({ server });

  wss.on("connection", (ws) => {
    logger.info("A new client connected.");

    // Send a welcome message to the newly connected client
    ws.send("Welcome to the chat!");

    // Broadcast incoming messages to all clients except the sender
    ws.on("message", async (clientMessage) => {
      try {
        // Parse the incoming message as JSON
        const parsedMessage = JSON.parse(clientMessage.toString());

        // Extract senderId, receiverId, and message from the parsed message
        const { senderId, receiverId, message } = parsedMessage;

        // Save the chat message to the database
        const chatMessage = await saveChatMessage(
          message,
          senderId,
          receiverId
        );

        // Broadcast the saved chat message to all clients
        wss.clients.forEach((client) => {
          if (client !== ws && client.readyState === ws.OPEN) {
            client.send(JSON.stringify(chatMessage));
          }
        });
      } catch (error) {
        logger.error(`Error processing chat message: ${error}`);

        // Send appropriate error status code to the client
        if (error instanceof mongoose.Error.ValidationError) {
          // If the error is due to validation issues
          ws.send(JSON.stringify({ error: "Invalid request data" }));
        } else {
          // For other errors, send a generic error message
          ws.send(JSON.stringify({ error: "Internal Server Error" }));
        }
      }
    });

    // Log when a client disconnects
    ws.on("close", () => {
      logger.info("Client has disconnected.");
    });
  });
};

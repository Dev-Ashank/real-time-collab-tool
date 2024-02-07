"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeWebSocketServer = void 0;
// Import WebSocket and HTTP server types
const ws_1 = require("ws");
const logger_1 = __importDefault(require("./logger"));
// Function to initialize WebSocket server
const initializeWebSocketServer = (server) => {
    logger_1.default.info("WebSocket server has been initialized.");
    // Create a WebSocket server attached to an existing HTTP server
    const wss = new ws_1.Server({ server });
    wss.on("connection", (ws) => {
        logger_1.default.info("A new client connected.");
        // Send a welcome message to the newly connected client
        ws.send("Welcome to the chat!");
        // Broadcast incoming messages to all clients except the sender
        ws.on("message", (message) => {
            wss.clients.forEach((client) => {
                if (client !== ws && client.readyState === ws.OPEN) {
                    client.send(message.toString());
                }
            });
        });
        // Log when a client disconnects
        ws.on("close", () => {
            logger_1.default.info("Client has disconnected.");
        });
    });
};
exports.initializeWebSocketServer = initializeWebSocketServer;

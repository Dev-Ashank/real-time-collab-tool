import { Server as WebSocketServer, WebSocket } from "ws";
import { Server as HttpServer } from "http";
import logger from "./logger";
import Document from "../models/Document";
import { broadcastOperation } from "../engines/otEngine";
import {
  applyOperationToDocument,
  constructOperation,
} from "../engines/constructOperations";

export const documentClients = new Map<string, Set<WebSocket>>();

const addClientToDocument = (documentId: string, client: WebSocket) => {
  if (!documentClients.has(documentId)) {
    documentClients.set(documentId, new Set());
  }
  documentClients.get(documentId)?.add(client);
};
// Maintain a set to store active WebSocket clients
const activeClients = new Set<WebSocket>();

// Function to add a client to the active clients set
const addActiveClient = (ws: WebSocket) => {
  activeClients.add(ws);
  logger.info(`Client connected. Total active clients: ${activeClients.size}`);
};

// Function to remove a client from the active clients set
const removeActiveClient = (ws: WebSocket) => {
  activeClients.delete(ws);
  logger.info(
    `Client disconnected. Total active clients: ${activeClients.size}`
  );
};

// Function to list all active clients
const listActiveClients = () => {
  return Array.from(activeClients);
};
export const initializeWebSocketServer = (server: HttpServer) => {
  logger.info("WebSocket server has been initialized.");
  const wss = new WebSocketServer({ server });

  wss.on("connection", (ws) => {
    logger.info("A new client connected.");
    addActiveClient(ws);
    ws.send(
      JSON.stringify({
        type: "welcome",
        message: "Welcome to the document editing service!",
      })
    );

    let loadedDocumentId: any = null;
    let loadedDocumentContent: any = null;
    let modifiedDocumentContent: any = null;
    // First ws.on event to load the document
    ws.on("message", async (clientMessage) => {
      try {
        const parsedMessage = JSON.parse(clientMessage.toString());
        const documentId = parsedMessage.documentId;

        // Check if the document has already been loaded
        if (loadedDocumentContent !== null) {
          // If the document is already loaded, exit the function
          return;
        }

        const document = await Document.findById(documentId);

        if (!document) {
          ws.send(
            JSON.stringify({ type: "error", message: "Document not found" })
          );
          return;
        }

        // Store the loaded document ID and content
        loadedDocumentId = documentId;
        loadedDocumentContent = document.content;
        modifiedDocumentContent = loadedDocumentContent;
        // Send the document content to the client
        ws.send(
          JSON.stringify({
            type: "document",
            documentId: document.id,
            content: document.content,
            lastUpdated: document.lastUpdated,
          })
        );

        // Add this client to the list of clients that are editing this document
        addClientToDocument(documentId, ws);
      } catch (error) {
        logger.error(
          `Error processing message: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
        ws.send(
          JSON.stringify({
            type: "error",
            message: "Error processing your request",
          })
        );
      }
    });

    // Second ws.on event to handle document editing
    ws.on("message", async (clientMessage) => {
      try {
        // Check if the document is loaded
        if (loadedDocumentContent === null) {
          // If the document is not loaded, exit the function
          return;
        }

        const parsedMessage = JSON.parse(clientMessage.toString());
        const operation = JSON.parse(clientMessage.toString());

        constructOperation(operation);

        // Apply the received operation to the document state

        modifiedDocumentContent = applyOperationToDocument(
          operation,
          modifiedDocumentContent
        );
        console.log(modifiedDocumentContent);
        await Document.updateOne(
          { _id: loadedDocumentId },
          { content: modifiedDocumentContent }
        );
        // Broadcast the transformed operation to all clients
        broadcastOperation(
          modifiedDocumentContent,
          loadedDocumentId,
          WebSocket
        );
      } catch (error) {
        logger.error(
          `Error processing message: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
        ws.send(
          JSON.stringify({
            type: "error",
            message: "Error processing your request",
          })
        );
      }
    });

    ws.on("close", () => {
      // Remove client from any document editing sessions
      documentClients.forEach((clients, documentId) => {
        clients.delete(ws);
        if (clients.size === 0) {
          documentClients.delete(documentId);
        }
      });
      removeActiveClient(ws);
      logger.info("Client has disconnected.");
    });
  });
};

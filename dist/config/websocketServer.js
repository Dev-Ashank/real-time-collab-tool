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
exports.initializeWebSocketServer = void 0;
const ws_1 = require("ws");
const logger_1 = __importDefault(require("./logger"));
const Document_1 = __importDefault(require("../models/Document"));
const otEngine_1 = require("../engines/otEngine");
const constructOperations_1 = require("../engines/constructOperations");
const documentClients = new Map();
const addClientToDocument = (documentId, client) => {
    var _a;
    if (!documentClients.has(documentId)) {
        documentClients.set(documentId, new Set());
    }
    (_a = documentClients.get(documentId)) === null || _a === void 0 ? void 0 : _a.add(client);
};
const broadcastDocumentUpdate = (documentId, message) => {
    var _a;
    (_a = documentClients.get(documentId)) === null || _a === void 0 ? void 0 : _a.forEach((client) => {
        if (client.readyState === ws_1.WebSocket.OPEN) {
            client.send(message);
        }
    });
};
const initializeWebSocketServer = (server) => {
    logger_1.default.info("WebSocket server has been initialized.");
    const wss = new ws_1.Server({ server });
    wss.on("connection", (ws) => {
        logger_1.default.info("A new client connected.");
        ws.send(JSON.stringify({
            type: "welcome",
            message: "Welcome to the document editing service!",
        }));
        ws.on("message", (clientMessage) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const parsedMessage = JSON.parse(clientMessage.toString());
                if (parsedMessage.type === "requestDocument") {
                    const { documentId } = parsedMessage;
                    const document = yield Document_1.default.findById(documentId);
                    addClientToDocument(documentId, ws);
                    if (document) {
                        ws.send(JSON.stringify({
                            type: "document",
                            documentId: document.id,
                            content: document.content,
                            lastUpdated: document.lastUpdated,
                        }));
                    }
                    else {
                        ws.send(JSON.stringify({ type: "error", message: "Document not found" }));
                    }
                }
                else if (parsedMessage.type === "editDocument") {
                    const { documentId, content } = parsedMessage;
                    // Fetch the document by ID
                    const document = yield Document_1.default.findById(documentId);
                    if (!document) {
                        ws.send(JSON.stringify({ type: "error", message: "Document not found" }));
                        return;
                    }
                    // Construct the operation based on the edit
                    const operation = (0, constructOperations_1.constructOperation)(content);
                    // Apply the received operation to the document state
                    (0, otEngine_1.applyOperationToDocument)(operation);
                    // Update the document's content and lastUpdated fields
                    document.content = otEngine_1.documentState;
                    document.lastUpdated = new Date();
                    yield document.save();
                    // Broadcast the transformed operation to all clients
                    broadcastDocumentUpdate(documentId, JSON.stringify(operation));
                    // Broadcast the document change
                    wss.clients.forEach((client) => {
                        if (client !== ws && client.readyState === ws_1.WebSocket.OPEN) {
                            client.send(JSON.stringify({
                                type: "documentUpdated",
                                documentId,
                                content: document.content,
                                lastUpdated: document.lastUpdated,
                            }));
                        }
                    });
                }
            }
            catch (error) {
                logger_1.default.error(`Error processing message: ${error instanceof Error ? error.message : "Unknown error"}`);
                ws.send(JSON.stringify({
                    type: "error",
                    message: "Error processing your request",
                }));
            }
        }));
        ws.on("close", () => {
            // Remove client from any document editing sessions
            documentClients.forEach((clients, documentId) => {
                clients.delete(ws);
                if (clients.size === 0) {
                    documentClients.delete(documentId); // Optionally clean up empty sets
                }
            });
            logger_1.default.info("Client has disconnected.");
        });
    });
};
exports.initializeWebSocketServer = initializeWebSocketServer;

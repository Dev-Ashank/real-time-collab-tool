"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const logger_1 = __importDefault(require("./config/logger"));
const database_1 = __importDefault(require("./config/database"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const chatRoutes_1 = __importDefault(require("./routes/chatRoutes"));
const documentRoutes_1 = __importDefault(require("./routes/documentRoutes"));
const http_1 = require("http");
const websocketServer_1 = require("./config/websocketServer");
const dotenv_1 = __importDefault(require("dotenv"));
const setupGlobalHandlers_1 = require("./config/setupGlobalHandlers");
if (process.env.NODE_ENV === "test") {
    dotenv_1.default.config({ path: ".env.test" });
}
else {
    dotenv_1.default.config();
}
dotenv_1.default.config();
//Global Ecxeption and rejection handler
(0, setupGlobalHandlers_1.setupGlobalHandlers)();
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
(0, websocketServer_1.initializeWebSocketServer)(server);
app.use(express_1.default.json());
const PORT = process.env.PORT || 3000;
// Define your routes
app.get("/", (req, res) => {
    res.send("HTTP and WebSocket server running.");
});
app.use("/api/users", userRoutes_1.default);
app.use("/api/chats", chatRoutes_1.default);
app.use("/api/documents", documentRoutes_1.default);
(0, database_1.default)();
// Use server.listen instead of app.listen
server.listen(PORT, () => {
    logger_1.default.info(`server is running on port ${PORT}`);
});
exports.default = app;

import express from "express";
import logger from "./config/logger";
import connectDB from "./config/database";
import userRoutes from "./routes/userRoutes";
import chatRoutes from "./routes/chatRoutes";
import { createServer } from "http";
import { initializeWebSocketServer } from "./config/websocketServer";
import dotenv from "dotenv";
import { setupGlobalHandlers } from "./config/setupGlobalHandlers";
if (process.env.NODE_ENV === "test") {
  dotenv.config({ path: ".env.test" });
} else {
  dotenv.config();
}
dotenv.config();
//Global Ecxeption and rejection handler
setupGlobalHandlers();

const app = express();
const server = createServer(app);

initializeWebSocketServer(server);

app.use(express.json());

const PORT = process.env.PORT || 3000;

// Define your routes
app.get("/", (req, res) => {
  res.send("HTTP and WebSocket server running.");
});

app.use("/api/users", userRoutes);
app.use("/api/chats", chatRoutes);

connectDB();
// Use server.listen instead of app.listen
server.listen(PORT, () => {
  logger.info(`server is running on port ${PORT}`);
});

export default app;

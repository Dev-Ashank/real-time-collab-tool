import express from "express";
import logger from "./config/logger";
import connectDB from "./config/database";
import userRoutes from "./routes/userRoutes";
import dotenv from "dotenv";
dotenv.config();
const app = express();
app.use(express.json());
const PORT = process.env.PORT ;
require("dotenv").config();
app.get("/", (req, res) => {
  res.send("collab server is running");
});
app.use("/api/users", userRoutes);

app.listen(PORT, () => {
  logger.info(`server is running on port ${PORT}`);
});
connectDB();

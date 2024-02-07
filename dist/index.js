"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const logger_1 = __importDefault(require("./config/logger"));
const database_1 = __importDefault(require("./config/database"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
const PORT = process.env.PORT;
require("dotenv").config();
app.get("/", (req, res) => {
    res.send("collab server is running");
});
app.use("/api/users", userRoutes_1.default);
app.listen(PORT, () => {
    logger_1.default.info(`server is running on port ${PORT}`);
});
(0, database_1.default)();

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
exports.loginMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken")); // Import JwtPayload for decoded token type
const User_1 = __importDefault(require("../models/User")); // Import IUser interface for User model
const logger_1 = __importDefault(require("../config/logger"));
// Define the middleware function
const loginMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // Extract the JWT token from the request headers
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
        if (!token) {
            logger_1.default.error("No token provided");
            return res.status(401).json({ error: "Unauthorized" });
        }
        // Verify the token
        const decodedToken = jsonwebtoken_1.default.verify(token, process.env.JWT_KEY || ""); // Define type for decodedToken as JwtPayload
        if (!decodedToken) {
            logger_1.default.error("Invalid token");
            return res.status(401).json({ error: "Invalid token" });
        }
        // Find the user by the decoded user ID
        const user = yield User_1.default.findById(decodedToken.userId);
        if (!user) {
            logger_1.default.error("User not found");
            return res.status(404).json({ error: "User not found" });
        }
        // Attach the user to the request object
        req.user = user;
        // Proceed to the next middleware or route handler
        next();
    }
    catch (error) {
        logger_1.default.error("Error in login middleware:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.loginMiddleware = loginMiddleware;

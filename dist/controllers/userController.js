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
exports.login = exports.createUser = void 0;
const User_1 = __importDefault(require("../models/User"));
const logger_1 = __importDefault(require("../config/logger"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userName, email, password, profilePicture, dateOfBirth, bio } = req.body;
        const user = new User_1.default({
            userName,
            email,
            password,
            profilePicture,
            dateOfBirth,
            bio,
        });
        yield user.save();
        logger_1.default.info("User registered successfully");
        res.status(201).json({ message: "User registered successfully" });
    }
    catch (error) {
        logger_1.default.error("Error in User Registration: " + error);
        res.status(500).json({ error: error });
    }
});
exports.createUser = createUser;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield User_1.default.findOne({ email });
        if (!user) {
            logger_1.default.error("User not found");
            return res.status(404).json({ message: "User not found" });
        }
        const passwordMatch = yield bcrypt_1.default.compare(password, user.password);
        if (!passwordMatch) {
            logger_1.default.error("Incorrect password");
            return res.status(401).json({ message: "Incorrect password" });
        }
        const SECRET_KEY = process.env.JWT_KEY;
        if (!SECRET_KEY) {
            console.error("SECRET_KEY is not defined");
            process.exit(1);
        }
        // Generate a JWT token
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, SECRET_KEY, {
            expiresIn: "1h",
        });
        logger_1.default.info("User logged in successfully");
        res.status(200).json({ token });
    }
    catch (error) {
        logger_1.default.error("Error during login:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.login = login;

import { Request, RequestHandler, Response } from "express";
import User from "../models/User";
import logger from "../config/logger";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const createUser: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const { userName, email, password, profilePicture, dateOfBirth, bio } =
      req.body;
    const user = new User({
      userName,
      email,
      password,
      profilePicture,
      dateOfBirth,
      bio,
    });
    await user.save();
    logger.info("User registered successfully");
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    logger.error("Error in User Registration: " + error);
    res.status(500).json({ error: error });
  }
};
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      logger.error("User not found");
      return res.status(404).json({ message: "User not found" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      logger.error("Incorrect password");
      return res.status(401).json({ message: "Incorrect password" });
    }
    const SECRET_KEY = process.env.JWT_KEY;

    if (!SECRET_KEY) {
      console.error("SECRET_KEY is not defined");
      process.exit(1);
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user._id }, SECRET_KEY, {
      expiresIn: "1h",
    });

    logger.info("User logged in successfully");
    res.status(200).json({ token });
  } catch (error) {
    logger.error("Error during login:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

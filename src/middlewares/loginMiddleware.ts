import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken"; // Import JwtPayload for decoded token type
import User, { IUser } from "../models/User"; // Import IUser interface for User model
import logger from "../config/logger";

// Define a custom interface for the request object with the user property
export interface CustomRequest extends Request {
  user?: IUser;
}

// Define the middleware function
export const loginMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Extract the JWT token from the request headers
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      logger.error("No token provided");
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Verify the token
    const decodedToken: JwtPayload | undefined = jwt.verify(
      token,
      process.env.JWT_KEY || ""
    ) as JwtPayload | undefined; // Define type for decodedToken as JwtPayload

    if (!decodedToken) {
      logger.error("Invalid token");
      return res.status(401).json({ error: "Invalid token" });
    }

    // Find the user by the decoded user ID
    const user = await User.findById(decodedToken.userId);

    if (!user) {
      logger.error("User not found");
      return res.status(404).json({ error: "User not found" });
    }

    // Attach the user to the request object
    (req as CustomRequest).user = user;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    logger.error("Error in login middleware:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

import { body, validationResult, ValidationError } from "express-validator";
import { Request, Response, NextFunction } from "express";
import logger from "../config/logger";

export const validateUserInput = [
  // Validate and sanitize user input fields
  body("userName").trim().isLength({ min: 5 }).escape(),
  body("email").trim().isEmail().normalizeEmail(),
  body("password").trim().isLength({ min: 5 }),
  body("profilePicture").optional().trim().escape(),
  body("dateOfBirth").isISO8601().toDate(),
  body("bio").optional().trim().escape(),

  // Custom middleware to check for validation errors
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errorMessages: string[] = errors
        .array()
        .map((error: ValidationError) => error.msg);
      logger.error("Validation errors:", errorMessages);
      return res.status(400).json({ errors: errorMessages });
    }

    next();
  },
];

export const loginInputValidation = [
  body("email").isEmail().normalizeEmail(),
  body("password").isLength({ min: 5 }),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      logger.error("Login validation errors:", errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    next();
  },
];

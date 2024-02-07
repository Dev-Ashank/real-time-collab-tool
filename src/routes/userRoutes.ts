import express from "express";
import * as userController from "../controllers/userController";
import {
  loginInputValidation,
  validateUserInput,
} from "../middlewares/validation";
const router = express.Router();

router.post("/register", validateUserInput, userController.createUser);
router.post("/login", loginInputValidation, userController.login);
export default router;

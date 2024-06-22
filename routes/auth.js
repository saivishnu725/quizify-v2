import { Router } from "express";
const router = Router();
import { login, register } from "../controllers/userController.js";

// Login route
router.post("/login", login);

// Register route
router.post("/register", register);

export default router;

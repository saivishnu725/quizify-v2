import { Router } from "express";
const router = Router();
import { login, register } from "../controllers/userController.js";

// Login route
router.post("/login", login);

// Register route
router.post("/register", register);

// logout route
router.get('/logout', (req, res, next) => {
    try {
        // Destroy the session to log the user out
        req.session = null;
        // Redirect to start page after logging out
        res.redirect('/');
    } catch (err) {
        console.error('Error during session destruction:', err);
        // Handle any errors
        const error = new Error('Error during session destruction!');
        error.status = 500;
        next(error);
    }
});

export default router;

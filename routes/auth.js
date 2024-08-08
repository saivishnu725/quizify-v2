import { Router } from "express";
const router = Router();
import { login, register } from "../controllers/userController.js";

// Login route
router.post("/login", login);

// Register route
router.post("/register", register);

// logout route
router.get('/logout', (req, res) => {
    try {
        // Destroy the session to log the user out
        req.session = null;
        // Redirect to start page after logging out
        res.redirect('/');
    } catch (err) {
        console.error('Error during session destruction:', err);
        return res.status(500).json({ message: 'Internal server error', error: err });
    }
});

export default router;

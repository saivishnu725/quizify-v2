import { Router } from "express";
const router = Router();
import { checkTokenAndRedirect, authenticateToken } from "../controllers/userController.js";

// GET: home page
router.get('/', checkTokenAndRedirect, (req, res) => {
    console.log('User in /: ', req.user);
    res.render('startpage', { user: req.user });
});

// GET: app page
router.get('/app', authenticateToken, (req, res) => {
    console.log('User in /app: ', req.user);
    // TODO: get user details based on user.id
    res.send("Welcome to the app page.");
    // res.send("Welcome to the app page.", { user: req.user });
});

// GET: login page
router.get('/login', (req, res) => {
    console.log('Token: ', req.session.token);
    // check if token is present. if yes, send to /app
    if (req.session.token)
        res.redirect('/app');
    else
        res.render('login');
});

// GET: register page
router.get('/register', (req, res) => {
    // check if token is present. if yes, send to /app
    if (req.session.token)
        res.redirect('/app');
    else
        res.render('register');
});

// TODO: get: settings
// TODO: get: 404 Not Found
// TODO: get: user profile
// TODO: get: create-quiz
// TODO: get: quiz
// TODO: get: quiz-results

export default router;

import { Router } from "express";
const router = Router();
import { checkTokenAndRedirect, authenticateToken } from "../controllers/userController.js";
import { getUserDetails } from "../controllers/dataController.js";

// GET: home page
router.get('/', checkTokenAndRedirect, (req, res) => {
    console.log('User in /: ', req.user);
    res.render('startpage', { user: req.user });
});

// GET: app page
router.get('/app', authenticateToken, async (req, res) => {
    console.log('User.id in /app: ', req.user);
    // TODO: get user details based on user.id
    const user = await getUserDetails(req.user.id);
    console.log('User details in /app: ', user);
    res.render("home", { user: user });
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

// Get: create-quiz
router.get('/create-quiz', async (req, res) => {
    // check if token is present. if yes, send to /app
    if (req.session.token) {
        console.log('Token: ', req.session.token);
        res.render('create-quiz');
    } else
        res.redirect('/');
});

// TODO: Get: settings
// TODO: Get: 404 Not Found
// TODO: Get: user profile
// TODO: Get: quiz
// TODO: Get: quiz-results

export default router;

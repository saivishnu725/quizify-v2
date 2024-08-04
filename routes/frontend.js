import { Router } from "express";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { checkTokenAndRedirect, authenticateToken } from "../controllers/userController.js";
import { getUserDetails, getQuizDetails } from "../controllers/dataController.js";

const router = Router();
dotenv.config();

const secret = process.env.JWT_SECRET || "secret";


// GET: home page
router.get('/', checkTokenAndRedirect, (req, res) => {
    console.log('User in /: ', req.user);
    res.render('startpage', { user: req.user });
});

// GET: app page
router.get('/app', authenticateToken, async (req, res) => {
    console.log('User.id in /app: ', req.user);
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
// TODO: Get: quiz
router.get('/quiz/:quiz_id', async (req, res) => {
    console.log('Preview request for quiz: ', req.params.quiz_id);
    try {
        const quizId = req.params.quiz_id;

        // get userID
        console.log("Token: ", req.session.token);
        if (req.session.token) {

            let userInfo = {};
            jwt.verify(req.session.token, secret, (err, user) => {
                if (err)
                    console.error("Error in jwtTokenVerify: ", err.message);
                console.log("User:", user);
                userInfo = user || {};
            });
            console.log("UserID: ", userInfo.id);
            const userId = userInfo.id;

            // TODO: get quiz details
            const quiz = await getQuizDetails(quizId);
            console.log('Quiz details in /quiz/:quiz_id: ', quiz);

            if (quiz == 'Quiz not found' || quiz == 'Quiz collection not found')
                res.status(404).json({ message: 'Quiz not found' });
            else {
                const isHost = quiz.user_id === userId;
                if (isHost)
                    res.render('quiz-preview', { quiz, isHost });
                else
                    res.render('quiz-details', { quiz: quiz, isHost: false });
            }

        } else
            res.redirect('/login');
    } catch (error) {
        console.error('Error fetching quiz details:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});



// TODO: Get: settings
// TODO: Get: 404 Not Found
// TODO: Get: user profile
// TODO: Get: quiz-results

export default router;

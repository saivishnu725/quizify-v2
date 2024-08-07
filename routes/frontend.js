import { Router } from "express";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { checkTokenAndRedirect, authenticateToken } from "../controllers/userController.js";
import { getUserDetails, getQuizDetails } from "../controllers/dataController.js";
import Quiz from "../models/quiz.js";
import QuizCollection from "../models/quizCollection.js";
import UserQuizAnswersCollection from "../models/userQuizAnswersCollection.js";

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
// Get: quiz
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

// Get: quiz participation page
router.get('/participate/:quiz_id', async (req, res) => {
    try {
        const quizId = req.params.quiz_id;
        const quiz = await getQuizDetails(quizId);
        console.log('Quiz details in /participate/:quiz_id: ', quiz);
        if (quiz === 'Quiz not found' || quiz === 'Quiz collection not found') {
            return res.status(404).json({ message: 'Quiz not found' });
        }
        res.render('participate', { quiz });
    } catch (error) {
        console.error('Error fetching quiz participation page:', error);
        return res.status(500).json({ message: 'Internal server error', error: error });
    }
});

// Get: quiz-results
router.get('/results', (req, res) => {

    // check if token is quiz results.if yes, send to / app
    if (req.session.quizResults) {
        console.log('quizResults received: ', req.session.quizResult);
        const quizResult = req.session.quizResult;
        res.render('quiz-results', {
            questionsCount: quizResult.questionsCount,
            correctQuestions: quizResult.correctQuestions,
            wrongQuestions: quizResult.wrongQuestions,
            finalPercentage: quizResult.finalPercentage,
            quizTitle: quizResult.quizTitle
        });
    } else
        res.redirect('/');
});

// Get: user quiz list
router.get('/my-quizzes', async (req, res) => {
    try {
        // redirect to /login if token is not found
        if (!req.session.token)
            return res.redirect('/login');

        let userInfo = {};
        try {
            jwt.verify(req.session.token, secret, (err, user) => {
                if (err) {
                    console.error("Error in jwtTokenVerify: ", err.message);
                    return res.redirect('/login');
                }
                userInfo = user || {};
            });
        } catch (err) {
            console.error('Error in jwtTokenVerify: ', err.message);
            delete req.session.token; // remove faulty/expired token from session
            return res.redirect('/login');
        }
        const userId = userInfo.id;

        // Fetch quizzes created by the user from MariaDB
        const quizzes = await Quiz.findAll({ where: { creator_id: userId } });

        res.render('my-quizzes', { quizzes });
    } catch (error) {
        console.error('Error fetching user quizzes:', error);
        res.status(500).json({ message: 'Internal server error', error: error });
    }
});

// Get: overall result of quizzes created by the user
router.get('/quiz/:quizTag/results', async (req, res) => {
    try {
        const quizTag = req.params.quizTag;

        if (!req.session.token) {
            return res.redirect('/login');
        }

        let userInfo = {};
        try {
            jwt.verify(req.session.token, secret, (err, user) => {
                if (err) {
                    console.error("Error in jwtTokenVerify: ", err.message);
                    return res.redirect('/login');
                }
                userInfo = user || {};
            });
        } catch (err) {
            console.error('Error in jwtTokenVerify: ', err.message);
            delete req.session.token; // remove faulty / expired token from session
            return res.redirect('/login');
        }

        const userId = userInfo.id;
        console.log("UserID: ", userId);

        // Fetch quiz details
        const quiz = await Quiz.findOne({ where: { quizTag: quizTag } });
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        // if the user is not the creator of the quiz, redirect to /app
        if (quiz.creator_id !== userId) {
            return res.redirect('/app');
        }

        // Fetch quiz collection
        const quizCollection = await QuizCollection.findOne({ quiz_tag: quizTag });
        if (!quizCollection) {
            return res.status(404).json({ message: 'Quiz collection not found' });
        }

        // Fetch quiz results from your results table (assuming a UserQuizAnswersCollection table exists)
        const quizResults = await UserQuizAnswersCollection.find({ quiz_tag: quizTag });

        // Calculate overall correct and wrong answers
        let totalCorrect = 0;
        let totalWrong = 0;
        const participants = [];

        quizResults.forEach(result => {
            let correctCount = 0;
            let wrongCount = 0;
            result.answers.forEach(answer => {
                const question = quizCollection.questions.find(q => q.question_id === answer.question_id);
                if (question && question.correctOption === answer.selected_option_id) {
                    correctCount++;
                    totalCorrect++;
                } else {
                    wrongCount++;
                    totalWrong++;
                }
            });

            participants.push({
                user_id: result.user_id,
                correct: correctCount,
                wrong: wrongCount
            });
        });

        res.render('host-quiz-results', {
            quiz: quizCollection,
            totalCorrect,
            totalWrong,
            participants,
            isHost: true
        });
    } catch (error) {
        console.error('Error fetching quiz results:', error);
        return res.status(500).json({ message: 'Internal server error', error: error });
    }
});

// TODO: Get: settings
// TODO: Get: 404 Not Found
// TODO: Get: user profile

export default router;

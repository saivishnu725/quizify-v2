import { Router } from "express";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// controllers
import { checkTokenAndRedirect, authenticateToken } from "../controllers/userController.js";
import { getUserDetails, getQuizDetails, getAvailableQuizzes, getCreatedQuizzes, getParticipatedQuizzes } from "../controllers/dataController.js";

// models
import Quiz from "../models/quiz.js";
import User from "../models/user.js";
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
router.get('/app', async (req, res, next) => {
    try {
        if (!req.session.token)
            return res.redirect('/login');

        let userInfo = {};
        try {
            jwt.verify(req.session.token, secret, (err, user) => {
                if (err) {
                    console.error("Error in jwtTokenVerify: ", err.message);
                    return res.redirect('/api/auth/logout');
                }
                userInfo = user || {};
            });
        } catch (err) {
            console.error('Error in jwtTokenVerify: ', err.message);
            return res.redirect('/api/auth/logout'); // remove faulty / expired token from session
        }
        const userId = userInfo.id;

        // Fetch data based on user type (host or participant)
        let user = await getUserDetails(userId);
        // console.log('User in /dashboard: ', user);
        let createdQuizzes = [];
        let participatedQuizzes = [];
        let availableQuizzes = [];

        createdQuizzes = await getCreatedQuizzes(userId);
        // console.log("Created quizzes in /dash: ", createdQuizzes);
        participatedQuizzes = await getParticipatedQuizzes(userId);
        // console.log("Participated quizzes in /dash: ", participatedQuizzes);
        availableQuizzes = await getAvailableQuizzes(userId);
        // console.log("Available quizzes in /dash: ", availableQuizzes);
        res.render('dashboard', {
            user: user,
            createdQuizzes,
            participatedQuizzes,
            availableQuizzes
        });
    } catch (err) {
        console.error('Error fetching dashboard data:', err);
        // Handle any errors
        console.error(err.message);
        const error = new Error(`Error fetching dashboard data: ${err.message}!`);
        error.status = 500;
        next(error);
    }
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
router.get('/quiz/:quiz_id', async (req, res, next) => {
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

            // Get quiz details
            const quiz = await getQuizDetails(quizId);
            console.log('Quiz details in /quiz/:quiz_id: ', quiz);

            if (quiz == 'Quiz not found' || quiz == 'Quiz collection not found') {
                const error = new Error('Quiz not found!');
                error.status = 500;
                next(error);
            }
            else {
                const isHost = quiz.user_id === userId;
                if (isHost) {
                    res.render('quiz-preview', { quiz, isHost });
                } else {
                    res.render('quiz-details', { quiz: quiz, isHost: false });
                }
            }

        } else
            res.redirect('/login');
    } catch (err) {
        console.error('Error fetching quiz details:', err);
        // Handle any errors
        console.error(err.message);
        const error = new Error(`Error fetching quiz details: ${err.message}!`);
        error.status = 500;
        next(error);
    }
});

// Get: quiz participation page
router.get('/participate/:quiz_id', async (req, res, next) => {
    try {
        const quizId = req.params.quiz_id;
        const quiz = await getQuizDetails(quizId);
        // console.log('Quiz details in /participate/:quiz_id: ', quiz);
        if (quiz === 'Quiz not found' || quiz === 'Quiz collection not found') {
            // Handle any errors
            console.error(err.message);
            const error = new Error(`Quiz not found ${err.message}!`);
            error.status = 404;
            next(error);
        }
        console.log("Quiz details in /participate/:quiz_id", quiz);
        res.render('participate', { quiz });
    } catch (err) {
        console.error('Error fetching quiz participation page:', err);
        // Handle any errors
        console.error(err.message);
        const error = new Error(`Error fetching quiz participation page: ${err.message}`);
        error.status = 500;
        next(error);
    }
});

// Get: quiz-results
router.get('/results/:quiz_tag', async (req, res) => {
    try {
        // 1. Retrieve user ID from session token
        let userInfo = {};
        try {
            jwt.verify(req.session.token, secret, (err, user) => {
                if (err) {
                    console.error("Error in jwtTokenVerify:", err.message);
                    return res.redirect('/api/auth/logout');
                }
                userInfo = user || {};
            });
        } catch (e) {
            console.error('Error in jwtTokenVerify:', e.message);
            return res.redirect('/api/auth/logout');
        }
        const userId = userInfo.id;

        // 2. Retrieve the user's quiz answers from the database
        const userQuizAnswers = await UserQuizAnswersCollection.findOne({
            user_id: userId,
            quiz_tag: req.params.quiz_tag
        });

        if (!userQuizAnswers) {
            // Handle any errors
            console.error(err.message);
            const error = new Error(`Quiz not found ${err.message}!`);
            error.status = 404;
            next(error);
        }

        // 3. Retrieve the quiz data to display the results
        const quiz = await QuizCollection.findOne({ quiz_tag: req.params.quiz_tag });
        if (!quiz) {
            // Handle any errors
            console.error(err.message);
            const error = new Error(`Quiz not found ${err.message}!`);
            error.status = 404;
            next(error);
        }

        const totalQuestions = quiz.questions.length;
        const correctAnswersCount = userQuizAnswers.answers.filter((answer, index) => {
            return quiz.questions[index].correctOption === answer.selected_option_id;
        }).length;

        const wrongAnswersCount = totalQuestions - correctAnswersCount;

        // 4. Calculate the final score using the score and negativeScore from QuizCollection
        const scorePerCorrect = quiz.score;
        const negativeScorePerWrong = quiz.negativeScore;
        const finalScore = (correctAnswersCount * scorePerCorrect) + (wrongAnswersCount * negativeScorePerWrong);

        // 5. Calculate the final percentage
        const finalPercentage = (correctAnswersCount / totalQuestions) * 100;

        // 5. Calculate the maximum possible score
        const maxScore = totalQuestions * scorePerCorrect;

        // 6. Render the results page with the calculated score and quiz data
        // console.log("Result data: ", {
        //     questionsCount: totalQuestions,
        //     correctQuestions: correctAnswersCount,
        //     wrongQuestions: wrongAnswersCount,
        //     finalScore: finalScore,
        //     maxScore: maxScore,
        //     finalPercentage: finalPercentage,
        //     quizTitle: quiz.title
        // });

        res.render('quiz-results', {
            questionsCount: totalQuestions,
            correctQuestions: correctAnswersCount,
            wrongQuestions: wrongAnswersCount,
            finalScore: finalScore,
            maxScore: maxScore,
            finalPercentage: finalPercentage,
            quizTitle: quiz.title
        });

    } catch (err) {
        console.error("Error retrieving quiz results:", err);
        // Handle any errors
        console.error(err.message);
        const error = new Error(`Error retrieving quiz results: ${err.message}!`);
        error.status = 500;
        next(error);
    }
});


// Get: user quiz list
router.get('/my-quizzes', async (req, res, next) => {
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
            return res.redirect('/api/auth/logout');
        }
        const userId = userInfo.id;

        // Fetch quizzes created by the user from MariaDB
        const quizzes = await Quiz.findAll({ where: { creator_id: userId } });

        res.render('my-quizzes', { quizzes });
    } catch (err) {
        console.error('Error fetching user quizzes:', err);
        // Handle any errors
        console.error(err.message);
        const error = new Error(`Error fetching user quizzes: ${err.message}!`);
        error.status = 500;
        next(error);
    }
});

// Get: overall result of quizzes created by the user
router.get('/quiz/:quizTag/results', async (req, res, next) => {
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
            return res.redirect('/api/auth/logout');
        }

        const userId = userInfo.id;
        console.log("UserID: ", userId);

        // Fetch quiz details
        const quiz = await Quiz.findOne({ where: { quizTag: quizTag } });
        if (!quiz) {
            // Handle any errors
            console.error(err.message);
            const error = new Error(`Quiz not found ${err.message}!`);
            error.status = 404;
            next(error);
        }

        // if the user is not the creator of the quiz, redirect to /app
        if (quiz.creator_id !== userId) {
            return res.redirect('/app');
        }

        // Fetch quiz collection
        const quizCollection = await QuizCollection.findOne({ quiz_tag: quizTag });
        if (!quizCollection) {
            // Handle any errors
            console.error(err.message);
            const error = new Error(`Quiz Collection not found ${err.message}!`);
            error.status = 404;
            next(error);
        }

        // Fetch quiz results from your results table (assuming a UserQuizAnswersCollection table exists)
        const quizResults = await UserQuizAnswersCollection.find({ quiz_tag: quizTag });

        // Calculate overall correct and wrong answers
        let totalCorrect = 0;
        let totalWrong = 0;
        const participants = [];

        for (const result of quizResults) {
            let correctCount = 0;
            let wrongCount = 0;

            // Fetch the username from the user ID
            const user = await User.findOne({ where: { id: result.user_id } });
            const username = user ? user.username : 'Unknown';

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
                username: username,
                correct: correctCount,
                wrong: wrongCount
            });
        }

        console.log("host quiz results data: ", {
            quiz: quizCollection,
            totalCorrect,
            totalWrong,
            participants,
            isHost: true
        });
        res.render('host-quiz-results', {
            quiz: quizCollection,
            totalCorrect,
            totalWrong,
            participants,
            isHost: true
        });
    } catch (err) {
        console.error('Error fetching quiz results:', err);
        // Handle any errors
        console.error(err.message);
        const error = new Error(`Error fetching quiz results: ${err.message}!`);
        error.status = 500;
        next(error);
    }
});

// TODO: Get: settings
// TODO: Get: user profile

export default router;

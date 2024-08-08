import jwt from 'jsonwebtoken';
import { Router } from "express";
import dotenv from 'dotenv';
import { saveQuiz } from '../controllers/dataController.js';

// models
import UserQuiz from '../models/userQuiz.js';
import UserQuizAnswersCollection from '../models/userQuizAnswersCollection.js';
import QuizCollection from '../models/quizCollection.js';
import User from '../models/user.js';

const router = Router();
dotenv.config();

const secret = process.env.JWT_SECRET || "secret";

// TODO: get: user info route

// Post: create quiz
router.post("/create-quiz", async (req, res) => {
    console.log("Form posted");
    console.log("Quiz created: ", req.body);
    console.log("Token: ", req.session.token);
    let userInfo = {};
    jwt.verify(req.session.token, secret, (err, user) => {
        if (err)
            console.error("Error in jwtTokenVerify: ", err.message);
        console.log("User:", user);
        userInfo = user || {};
    });
    console.log("UserID: ", userInfo.id);

    // save the quiz
    const { quizTag, quizId } = await saveQuiz(req.body, userInfo.id);
    console.log("Quiz ID: ", quizId);
    console.log("Quiz Tag: ", quizTag);

    // Increment quiz_created column in Users table
    const user = await User.findOne({ where: { id: userInfo.id } });
    if (user) {
        user.quiz_created += 1;
        await user.save();
    }

    res.status(201).json({ message: "Quiz created successfully", quiz: req.body, userID: userInfo.id, quizId: quizId, quizTag: quizTag });
});

// Handle quiz submission
router.post('/submit-quiz', async (req, res) => {
    console.log('Quiz submitted');
    console.log('Quiz body in submit-quiz: ', req.body);

    try {
        // 1. Get the current userID from session token.
        let userInfo = {};
        jwt.verify(req.session.token, secret, (err, user) => {
            if (err) {
                console.error("Error in jwtTokenVerify:", err.message);
                return res.status(401).json({ message: "Unauthorized" });
            }
            userInfo = user || {};
        });
        const userId = userInfo.id;
        console.log('userID: ', userId);
        console.log('Quiz answers: ', req.body['answers']);
        const answers = JSON.parse(req.body.answers); // array of selected options per question
        console.log('answers: ', answers);
        const quizTag = req.body.quizTag;
        console.log('quizTag: ', quizTag);
        let correctAnswersCount = 0;

        // 2. Retrieve the quiz data
        const quiz = await QuizCollection.findOne({ quiz_tag: quizTag });
        if (!quiz) return res.status(404).json({ message: "Quiz not found" });

        const totalQuestions = quiz.questions.length;

        // 3. Calculate the correct answers
        let userAnswers = [];
        try {
            userAnswers = quiz.questions.map((q, index) => {
                console.log('answers[index]:', answers[index]);
                const correct = q.correctOption === parseInt(answers[index]);
                if (correct) correctAnswersCount++;
                return {
                    question_id: q.question_id,
                    selected_option_id: parseInt(answers[index])
                };
            });
            console.log('correct answers count:', correctAnswersCount);
        } catch (error) {
            console.log("Error in calculating correct answers:", error);
            res.status(500).json({ message: "Internal server error", error: error });
            return;  // won't continue
        }

        const wrongAnswersCount = totalQuestions - correctAnswersCount;
        const finalPercentage = (correctAnswersCount / totalQuestions) * 100;

        // 4. Save data in UserQuiz
        try {
            let userQuiz = await UserQuiz.findOne({
                where: { user_id: userId, quiz_at: quiz.quiz_id }
            });

            if (userQuiz) {
                // Update existing record
                userQuiz.joined_at = new Date(); // Update the timestamp
                await userQuiz.save();
            } else {
                // Create new record
                userQuiz = await UserQuiz.create({
                    user_id: userId,
                    quiz_at: quiz.quiz_id,
                    quiz_tag: quizTag
                });
                console.log('UserQuiz:', userQuiz);
            }
        } catch (error) {
            console.error("Error in saving or updating UserQuiz:", error);
            res.status(500).json({ message: "Internal server error", error: error });
            return;  // won't continue
        }

        // 5. Update or Replace in UserQuizAnswersCollection
        try {
            // Find the previous attempt
            let userQuizAnswers = await UserQuizAnswersCollection.findOne({
                user_id: userId,
                quiz_id: quiz.quiz_id
            });

            if (userQuizAnswers) {
                // Remove the previous document
                await UserQuizAnswersCollection.deleteOne({ _id: userQuizAnswers._id });
            }

            // Save new attempt
            userQuizAnswers = new UserQuizAnswersCollection({
                user_id: userId,
                quiz_id: quiz.quiz_id,
                answers: userAnswers,
                quiz_tag: quizTag
            });
            console.log('UserQuizAnswers:', userQuizAnswers);
            await userQuizAnswers.save();
        } catch (error) {
            console.error("Error in saving or updating UserQuizAnswersCollection:", error);
            res.status(500).json({ message: "Internal server error", error: error });
            return;  // won't continue
        }

        // 6. Wrap the final result into JSON and redirect to quiz-result
        const result = {
            questionsCount: totalQuestions,
            correctQuestions: correctAnswersCount,
            wrongQuestions: wrongAnswersCount,
            finalPercentage: finalPercentage,
            quizTitle: quiz.title
        };

        // res.status(200).json(result);
        // redirect to the result page
        req.session.quizResult = result;
        res.redirect('/results/');

    } catch (error) {
        console.error("Error in submitting quiz:", error);
        res.status(500).json({ message: "Internal server error", error: error });
    }

});


// TODO: get user full profile
// TODO: get: user quiz details
// TODO: get: quiz data
// TODO: get: quiz results
// TODO: post: update user details


export default router;

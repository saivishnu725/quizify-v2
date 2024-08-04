import jwt from 'jsonwebtoken';
import { Router } from "express";
import dotenv from 'dotenv';
import { saveQuiz } from '../controllers/dataController.js';

const router = Router();
dotenv.config();

const secret = process.env.JWT_SECRET || "secret";

// TODO: get: user info route

// TODO: post: create quiz
router.post("/create-quiz", async (req, res) => {
    console.log("Form posted");
    // TODO: create quiz using req.body
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
    res.status(201).json({ message: "Quiz created successfully", quiz: req.body, userID: userInfo.id, quizId: quizId, quizTag: quizTag });
});

// TODO: get user full profile
// TODO: get: user quiz details
// TODO: get: quiz data
// TODO: get: quiz results
// TODO: post: update user details


export default router;

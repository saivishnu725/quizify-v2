import { Router } from "express";
const router = Router();

// TODO: get: user info route
// router.post("/user-info", method);

// TODO: post: create quiz
router.post("/create-quiz", (req, res) => {
    console.log("Form posted");
    // TODO: create quiz using req.body
    console.log("Quiz created: ", req.body);
    res.status(201).json({ message: "Quiz created successfully", quiz: req.body });
});

// TODO: get user full profile
// TODO: get: user quiz details
// TODO: get: quiz data
// TODO: get: quiz results
// TODO: post: update user details


export default router;

import { Schema, model } from 'mongoose';

const optionSchema = new Schema({
    option_id: Number,
    option_text: String,
    is_correct: Boolean,
});

const questionSchema = new Schema({
    question_type: { type: String, required: true },
    question_id: Number,
    question_text: String,
    options: [optionSchema],
    correctOption: Number,
});

const quizSchema = new Schema({
    quiz_id: Number, // Reference to Quizzes
    quiz_tag: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    maxTime: { type: Number, required: true },
    score: { type: Number, required: true },
    negativeScore: { type: Number, required: true },
    questions: [questionSchema],
    user_id: Number
});

const QuizCollection = model('QuizzesCollection', quizSchema);

export default QuizCollection;
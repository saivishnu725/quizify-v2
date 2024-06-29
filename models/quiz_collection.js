import { Schema, model } from 'mongoose';

const optionSchema = new Schema({
    option_id: Number,
    option_text: String,
    is_correct: Boolean,
});

const questionSchema = new Schema({
    question_id: Number,
    question_text: String,
    options: [optionSchema],
});

const quizSchema = new Schema({
    quiz_id: Number, // Reference to Quizzes
    title: String,
    description: String,
    questions: [questionSchema],
    // user_id: { type: Schema.Types.ObjectId, ref: 'User' },
    user_id: Number,
});

const QuizCollection = model('QuizzesCollection', quizSchema);

export default QuizCollection;
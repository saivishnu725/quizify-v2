import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const answerSchema = new Schema({
    question_id: { type: Number, required: true },
    selected_option_id: { type: Number, required: true }
});

const userQuizAnswersSchema = new Schema({
    user_id: { type: Number, required: true }, // Reference to Users
    quiz_id: { type: Number, required: true }, // Reference to Quizzes
    answers: { type: [answerSchema], required: true }
});

const UserQuizAnswersCollection = mongoose.model('UserQuizAnswersCollection', userQuizAnswersSchema);

export default UserQuizAnswersCollection;

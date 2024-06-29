import User from "../models/user.js"; // Import the User model
import QuizCollection from "../models/quiz_collection.js"; // Import the User model

export async function getUserDetails(id) {
    try {
        const user = await User.findOne({ where: { id: id } });
        if (!user) {
            return 'User not found';
        }
        const { last_name, email } = user;
        return { id, last_name, email };
    } catch (error) {
        console.error(error);
        return 'An error occurred where requesting user ' + id + '\'s details';
    }
}

// Create a new quiz
export async function saveQuiz(quizData, userId) {
    try {
        console.log("quizData:" + JSON.stringify(quizData));
        const quiz = new QuizCollection({
            quiz_id: quizData.quiz_id, // TODO: Handle unique ID generation
            title: quizData.title,
            description: quizData.description,
            questions: (quizData.quiz || []).map((q, index) => ({
                question_id: index + 1,
                question_type: q.type,
                question_text: q.question,
                options: (q.options || []).map((opt, idx) => ({
                    option_id: idx + 1,
                    option_text: opt,
                    is_correct: q.correctOption === idx.toString(),
                })),
            })),
            user_id: userId,
        });
        console.log('Quiz data:', JSON.stringify(quiz));
        await quiz.save();
        console.log('Quiz saved in mongo successfully');
        return quiz.quiz_id;
    } catch (error) {
        console.error('Error saving quiz in mongo:', error);
    }
};
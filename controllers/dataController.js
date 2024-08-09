import User from "../models/user.js"; // Import the User model
import QuizCollection from "../models/quizCollection.js"; // Import the QuizCollection model | stores the entire quiz
import Quiz from "../models/quiz.js"; // Import the Quiz model | stores the basic quiz details
import UserQuizAnswersCollection from "../models/userQuizAnswersCollection.js"; // Import the UserQuizAnswers model | stores the user's answers

// Get user details
export async function getUserDetails(id) {
    try {
        const user = await User.findOne({ where: { id: id } });
        if (!user) {
            return 'User not found';
        }
        const { username, first_name, last_name, email } = user;
        return { id, username, first_name, last_name, email };
    } catch (error) {
        console.error(error);
        return 'An error occurred where requesting user ' + id + '\'s details';
    }
}

// Create a new quiz
export async function saveQuiz(quizData, userId) {
    try {
        console.log("quizData:" + JSON.stringify(quizData));

        // quiz tag generation
        const quizTag = userId + quizData.title.replace(/\s+/g, '-').toLowerCase();
        console.log("Quiz Tag: " + quizTag);

        // 1. Save the quiz in MariaDB
        let newQuiz = {};
        try {
            newQuiz = await Quiz.create({
                title: quizData.title,
                description: quizData.description,
                quizTag: quizTag,
                creator_id: userId,
                maxTime: quizData.maxTime,
                score: quizData.score,
                negativeScore: quizData.negativeScore,
            });
        } catch (e) {
            console.error("Error saving quiz in MariaDB:", e);
        }

        // Retrieve the quiz_id
        const quizId = newQuiz.id;
        console.log("Quiz ID in MariaDB: " + quizId);
        // 2. Save the quiz in MongoDB

        const quiz = new QuizCollection({
            quiz_id: quizId,
            quiz_tag: quizTag,
            title: quizData.title,
            description: quizData.description,
            maxTime: quizData.maxTime,
            score: quizData.score,
            negativeScore: quizData.negativeScore,
            questions: (quizData.quiz || []).map((q, index) => ({
                question_id: index + 1,
                question_type: q.type,
                question_text: q.question,
                options: (q.options || []).map((opt, idx) => ({
                    option_id: idx + 1,
                    option_text: opt,
                    is_correct: q.correctOption === idx.toString(),

                })),
                correctOption: q.correctOption,
            })),
            user_id: userId,
        });
        console.log('Quiz data:', JSON.stringify(quiz));
        await quiz.save();
        console.log('Quiz saved in mongo successfully');
        // 3. Return the quiz tag and ID
        console.log("Quiz ID right before submitting: ", quizId);
        return { quizTag, quizId };
        // return { quiz.quizTag, quiz.quiz_id };
    } catch (error) {
        console.error('Error saving quiz in mongo:', error);
    }
};

// Get quiz details
export async function getQuizDetails(quizTag) {
    try {
        // 1. Retrieve the quiz from MariaDB
        const quiz = await Quiz.findOne({ where: { quizTag: quizTag } });
        if (!quiz) {
            return 'Quiz not found';
        }
        // 2. Retrieve the quiz from MongoDB
        const quizCollection = await QuizCollection.findOne({ quiz_tag: quizTag });
        if (!quizCollection) {
            return 'Quiz collection not found';
        }

        return quizCollection;
    } catch (error) {
        console.error('Error retrieving quiz details:', error);
    }
}

// Helper functions to fetch data
export async function getCreatedQuizzes(userId) {
    // Fetch quizzes created by the user (host)
    const quizzes = await Quiz.findAll({ where: { creator_id: userId } });
    // console.log('Quizzes retrieved:', quizzes);
    return quizzes;
}

export async function getParticipatedQuizzes(userId) {
    // Fetch quizzes participated by the user
    const participations = await UserQuizAnswersCollection.find({ user_id: userId });
    // console.log('Participations retrieved:', participations);
    return participations;
}

export async function getAvailableQuizzes(userId) {
    let quizzes = [];
    let limit = 5; // get only the first 5 quizzes created by different host(s)
    let skip = 0;

    while (quizzes.length < limit) {
        // Fetch quizzes, excluding those created by the same user
        const newQuizzes = await QuizCollection.find({ user_id: { $ne: userId } })
            .skip(skip)
            .limit(limit - quizzes.length);

        quizzes = quizzes.concat(newQuizzes);
        skip += newQuizzes.length;

        // Break the loop if there are no more quizzes to fetch
        if (newQuizzes.length === 0) {
            break;
        }
    }
    // console.log("Quizzes in getAvailableQuizzes", quizzes);
    return quizzes;
}
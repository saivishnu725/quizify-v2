db = db.getSiblingDB('quizify'); // Switch to quizify database

// Create QuizzesCollection
db.createCollection('QuizzesCollection', {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["quiz_id", "title", "description", "questions"],
            properties: {
                quiz_id: {
                    bsonType: "int",
                    description: "must be an integer and is required"
                },
                title: {
                    bsonType: "string",
                    description: "must be a string and is required"
                },
                description: {
                    bsonType: "string",
                    description: "must be a string and is required"
                },
                questions: {
                    bsonType: "array",
                    items: {
                        bsonType: "object",
                        required: ["question_id", "question_text", "options"],
                        properties: {
                            question_id: {
                                bsonType: "int",
                                description: "must be an integer and is required"
                            },
                            question_text: {
                                bsonType: "string",
                                description: "must be a string and is required"
                            },
                            options: {
                                bsonType: "array",
                                items: {
                                    bsonType: "object",
                                    required: ["option_id", "option_text", "is_correct"],
                                    properties: {
                                        option_id: {
                                            bsonType: "int",
                                            description: "must be an integer and is required"
                                        },
                                        option_text: {
                                            bsonType: "string",
                                            description: "must be a string and is required"
                                        },
                                        is_correct: {
                                            bsonType: "bool",
                                            description: "must be a boolean and is required"
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
});

// Insert sample data into QuizzesCollection
db.QuizzesCollection.insertMany([
    {
        quiz_id: 1,
        title: "Sample Quiz 1",
        description: "This is a sample quiz.",
        questions: [
            {
                question_id: 1,
                question_text: "What is 2 + 2?",
                options: [
                    { option_id: 1, option_text: "3", is_correct: false },
                    { option_id: 2, option_text: "4", is_correct: true },
                    { option_id: 3, option_text: "5", is_correct: false }
                ]
            },
            {
                question_id: 2,
                question_text: "What is the capital of France?",
                options: [
                    { option_id: 1, option_text: "Berlin", is_correct: false },
                    { option_id: 2, option_text: "Madrid", is_correct: false },
                    { option_id: 3, option_text: "Paris", is_correct: true }
                ]
            }
        ]
    }
]);

// Create UserQuizAnswersCollection
db.createCollection('UserQuizAnswersCollection', {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["user_id", "quiz_id", "answers"],
            properties: {
                user_id: {
                    bsonType: "int",
                    description: "must be an integer and is required"
                },
                quiz_id: {
                    bsonType: "int",
                    description: "must be an integer and is required"
                },
                answers: {
                    bsonType: "array",
                    items: {
                        bsonType: "object",
                        required: ["question_id", "selected_option_id"],
                        properties: {
                            question_id: {
                                bsonType: "int",
                                description: "must be an integer and is required"
                            },
                            selected_option_id: {
                                bsonType: "int",
                                description: "must be an integer and is required"
                            }
                        }
                    }
                }
            }
        }
    }
});

// Insert sample data into UserQuizAnswersCollection
db.UserQuizAnswersCollection.insertMany([
    {
        user_id: 1,
        quiz_id: 1,
        answers: [
            { question_id: 1, selected_option_id: 2 },
            { question_id: 2, selected_option_id: 3 }
        ]
    }
]);
import { Sequelize, DataTypes } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mariadb',
    define: {
        timestamps: false,
    },
});

const UserQuiz = sequelize.define('user_quizzes', {
    id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.BIGINT, allowNull: false },
    quiz_at: { type: DataTypes.BIGINT, allowNull: false },
    joined_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
    indexes: [
        { fields: ['user_id'] },
        { fields: ['quiz_at'] }
    ]
});

export default UserQuiz;
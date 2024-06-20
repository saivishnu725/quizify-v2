import { Sequelize, DataTypes } from 'sequelize';
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mariadb',
});

const UserQuiz = sequelize.define('UserQuiz', {
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
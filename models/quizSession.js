import { Sequelize, DataTypes } from 'sequelize';
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mariadb',
});

const QuizSession = sequelize.define('QuizSession', {
    id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
    quiz_id: { type: DataTypes.BIGINT, allowNull: false },
    session_code: { type: DataTypes.BIGINT, unique: true, allowNull: false },
    host_id: { type: DataTypes.BIGINT, allowNull: false },
    start_time: { type: DataTypes.DATE, allowNull: false },
    end_time: { type: DataTypes.DATE, allowNull: false }
}, {
    indexes: [
        { fields: ['quiz_id'] },
        { fields: ['host_id'] }
    ]
});

export default QuizSession;
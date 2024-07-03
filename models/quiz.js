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

const Quiz = sequelize.define('quizzes', {
    id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
    quizTag: { type: DataTypes.STRING, unique: true, allowNull: false },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    creator_id: { type: DataTypes.BIGINT, allowNull: false },
    maxTime: { type: DataTypes.INTEGER, allowNull: false },
    maxPlayers: { type: DataTypes.INTEGER, allowNull: false },
    score: { type: DataTypes.FLOAT, allowNull: false },
    negativeScore: { type: DataTypes.FLOAT, allowNull: false },
    joinTime: { type: DataTypes.INTEGER, allowNull: false },
    creation_date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, onUpdate: DataTypes.NOW }
}, {
    indexes: [
        { fields: ['creator_id'] }
    ]
});

export default Quiz;
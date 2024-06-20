import { Sequelize, DataTypes } from 'sequelize';
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mariadb',
});

const Quiz = sequelize.define('Quiz', {
    id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    creator_id: { type: DataTypes.BIGINT, allowNull: false },
    creation_date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, onUpdate: DataTypes.NOW }
}, {
    indexes: [
        { fields: ['creator_id'] }
    ]
});

export default Quiz;
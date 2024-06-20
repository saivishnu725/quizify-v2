import { Sequelize, DataTypes } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();


console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mariadb',
    define: {
        timestamps: false,
    },
});

const User = sequelize.define('User', {
    id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
    account_created: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    first_name: { type: DataTypes.STRING, allowNull: true },
    last_name: { type: DataTypes.STRING },
    email: { type: DataTypes.TEXT, allowNull: false, unique: true },
    username: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.TEXT, allowNull: false },
    quiz_attended: { type: DataTypes.BIGINT.UNSIGNED, defaultValue: 0 },
    quiz_created: { type: DataTypes.BIGINT.UNSIGNED, defaultValue: 0 }
}, {
    indexes: [
        { unique: true, fields: ['email'] },
        { unique: true, fields: ['username'] }
    ]
});

export default User;
// import packages
import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import mongoose from 'mongoose';
import { fileURLToPath } from "url";
import path from "path";
import cookieSession from 'cookie-session';

// import express routes
import authRoutes from "./routes/auth.js";
import frontendRoutes from "./routes/frontend.js";
import dataRoutes from "./routes/data.js";

// .env config
dotenv.config();

// Connect to MongoDB
console.log('Connecting to MongoDB');
await mongoose.connect('mongodb://127.0.0.1:27017/quizify').then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Failed to connect to MongoDB', err);
});

// Express
const app = express();

//body-parser
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

//path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// bootstrap css
app.use('/css/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist/css'));

// Cookies manager
app.use(cookieSession({
    name: 'session',
    keys: [process.env.COOKIE_KEY],
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

// UI routes
app.use("/", frontendRoutes);

// API routes
app.use("/api", dataRoutes);
// AUTH routes
app.use("/api/auth", authRoutes);

// Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`Server running on http://localhost:${PORT}`);
});

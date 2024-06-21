// import packages
import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import mongoose from 'mongoose';
import { fileURLToPath } from "url";
import path from "path";

// import express routes
import authRoutes from "./routes/auth.js";

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

// UI routes

// GET: home page
app.get('/', (req, res) => {
    // TODO: check if token is present. if yes, send to /app
    res.render('startpage');
});

// GET: login page
app.get('/login', (req, res) => {
    // TODO: check if token is present. if yes, send to /app
    res.render('login');
});

// GET: register page
app.get('/register', (req, res) => {
    // TODO: check if token is present. if yes, send to /app
    res.render('register');
});

// API routes

// AUTH routes
app.use("/api/auth", authRoutes);

// Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`Server running on http://localhost:${PORT}`);
});

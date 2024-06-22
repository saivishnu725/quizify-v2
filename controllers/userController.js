import { compare, genSalt, hash } from "bcrypt";
import jwt from "jsonwebtoken";
const { sign } = jwt;
import User from "../models/user.js"; // Import the User model
import dotenv from 'dotenv';
dotenv.config();

const secret = process.env.JWT_SECRET || "secret";

// Function to handle user login
export async function login(req, res) {
    console.log("/login: ", req.body);
    const { email, password, remember } = req.body;
    console.log(email, password, remember);
    try {
        console.log("Finding user by email");
        // Find user by email
        const user = await User.findOne({ where: { email } });

        // If user not found, return error
        if (!user) {
            console.log("User not found");
            return res
                .status(400)
                .json({ message: "User Not Found: Invalid credentials" });
        }
        console.log("User found: ", user);
        // Compare passwords
        const isMatch = await compare(password, user.password);

        console.log("isMatch: ", isMatch);
        // If passwords don't match, return error
        if (!isMatch) {
            return res
                .status(400)
                .json({ message: "Wrong Password: Invalid credentials" });
        }

        console.log("Creating token");
        // Create JWT token
        let token = "";
        if (remember) {
            token = sign({ id: user.id }, secret, {
                expiresIn: "5d",
            });
        } else {
            token = sign({ id: user.id }, secret, {
                expiresIn: "1h",
            });
        }

        // add it to the cookie
        req.session.token = token;

        // Return token
        console.log("Token: ", token);
        console.log("Returning token");
        res.status(200).json({ token });
    } catch (err) {
        // Handle any errors
        console.error(err.message);
        res.status(500).send(`Server Error\n\n ${err.message}`);
    }
}

// Function to handle user registration
export async function register(req, res) {
    console.log("/register:", req.body);
    const { first_name, last_name, email, username, password } = req.body;

    try {
        // Check if user already exists
        let user = await User.findOne({ where: { email } });

        // If user exists, return error
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Create new user object
        user = new User({
            first_name,
            last_name,
            email,
            username,
            password,
        });

        console.log("User:", user);

        // Hash password
        const salt = await genSalt(10);
        user.password = await hash(password, salt);

        // Save user to database
        await user.save();

        // Create JWT token
        const token = sign({ id: user.id }, secret, {
            expiresIn: "1h",
        });

        // save token in the cookie
        req.session.token = token;

        // Return token
        console.log("\nToken: ", token);
        res.status(200).json({ token });
    } catch (err) {
        // Handle any errors
        console.error(err.message);
        res.status(500).send(`Server Error\n\n ${err.message}`);
    }
}


// Function to handle token checking
export const checkTokenAndRedirect = (req, res, next) => {
    const token = req.session.token;

    if (token) {
        console.log("Token found", token);
        return res.redirect('/app');
    }

    jwt.verify(token, secret, (err, user) => {
        if (err) {
            console.error("Error in authToken: ", err.message);
            // return res.redirect('/login'); // Redirect to login if token is invalid
        }

        req.user = user; // Save user information to request object
        next(); // Call the next middleware or route handler
    });
};

export const authenticateToken = (req, res, next) => {
    const token = req.session.token;

    if (!token) {
        return res.redirect('/login'); // Redirect to login if no token is found
    }

    jwt.verify(token, secret, (err, user) => {
        if (err) {
            console.error("Error in authToken: ", err.message);
            return res.redirect('/login'); // Redirect to login if token is invalid
        }

        req.user = user; // Save user information to request object
        next(); // Call the next middleware or route handler
    });
};
import { compare, genSalt, hash } from "bcrypt";
import jwt from "jsonwebtoken";
const { sign } = jwt;
import User from "../models/user.js"; // Import the User model

const secret = process.env.JWT_TOKEN || "secret";

// Function to handle user login
export async function login(req, res) {
    console.log("/login: ", req.body);
    const { email, password } = req.body;
    console.log(email, password);
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
        const token = sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });

        // TODO: add it to the cookie
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

        console.log(user);

        // Hash password
        const salt = await genSalt(10);
        user.password = await hash(password, salt);

        // Save user to database
        await user.save();

        // Create JWT token
        const token = sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });

        // TODO: save token in the cookie

        // Return token
        res.status(200).json({ token });
    } catch (err) {
        // Handle any errors
        console.error(err.message);
        res.status(500).send(`Server Error\n\n ${err.message}`);
    }
}

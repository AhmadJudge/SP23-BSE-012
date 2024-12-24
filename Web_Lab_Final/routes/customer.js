const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/user.models"); // Path to your user model
const router = express.Router();

// Registration Route

router.post("/registercustomer", async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send("User with this email already exists.");
        }

        // Create a new user
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            username,
            email,
            password: hashedPassword,
        });

        await user.save();
        res.redirect("/logincustomer"); // Redirect to login page after successful registration
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).send("Error registering user.");
    }
});

// Login Route
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send("Invalid email or password.");
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send("Invalid email or password.");
        }

        // Authenticate user (set session, JWT, etc.)
        req.session.userId = user._id; // Example: Using session for authentication
        res.redirect("/"); // Redirect to the homepage or dashboard after login
    } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).send("Error logging in.");
    }
});

module.exports = router;

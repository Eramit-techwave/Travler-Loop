const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 1. SIGNUP
exports.signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check user
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, message: "Email already exists!" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        await User.create({
            username,
            email,
            password: hashedPassword
        });

        res.status(201).json({ success: true, message: "Securely Registered!" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// 2. LOGIN
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ success: false, message: "Invalid Email or Password" });
        }

        const token = jwt.sign({ id: user._id }, 'traveloop_secret_key', { expiresIn: '1d' });

        res.status(200).json({
            success: true,
            token,
            user: { id: user._id, username: user.username }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
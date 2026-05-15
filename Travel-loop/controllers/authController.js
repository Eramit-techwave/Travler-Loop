const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 1. SIGNUP WITH ENCRYPTION
exports.signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Password ko hash (mask) karna
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword
        });

        res.status(201).json({ status: 'success', message: 'Securely Registered!' });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

// 2. LOGIN WITH TOKEN
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: "Invalid Email or Password" });
        }

        // JWT Token banana (Ye user ki identity card jaisa hai)
        const token = jwt.sign({ id: user._id }, 'traveloop_secret_key', { expiresIn: '1d' });

        res.status(200).json({
            status: 'success',
            token,
            data: { id: user._id, name: user.name }
        });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};


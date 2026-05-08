const jwt = require('jsonwebtoken');
const User = require('../models/user');
const config = require('../config');

const JWT_SECRET = config.jwtSecret || 'devsecret';

if (!config.jwtSecret) {
    console.warn('JWT_SECRET not set. Using development fallback secret. Set JWT_SECRET in .env for production.');
}

async function signup(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password are required' });
        }

        if (password.length < 6) {
            return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
        }

        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        const user = new User({ email, password }); // NOTE: hashing omitted for simplicity
        await user.save();

        return res.status(201).json({
            success: true,
            message: 'User created successfully',
            user: { id: user._id, email: user.email }
        });
    } catch (err) {
        console.error('Signup controller error:', err);
        return res.status(500).json({ success: false, message: 'Server error during signup' });
    }
}

async function login(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password are required' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // In a real app compare hashed passwords (bcrypt). Keeping plain compare for this exercise.
        if (user.password !== password) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1d' });

        return res.json({
            success: true,
            message: 'Login successful',
            user: { id: user._id, email: user.email },
            token
        });
    } catch (err) {
        console.error('Login controller error:', err);
        return res.status(500).json({ success: false, message: 'Server error during login' });
    }
}

module.exports = {
    signup,
    login
};

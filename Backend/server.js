const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./db_connect/db');
const User = require('./models/user');
const Todo = require('./models/list');

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Signup route
app.post('/api/signup', async (req, res) => {
    try {
        const { email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = new User({
            email,
            password // TODO: hash this in production
        });

        await user.save();

        res.status(201).json({
            message: 'User created successfully',
            user: { id: user._id, email: user.email }
        });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ message: 'Server error during signup' });
    }
});

// Login route
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // TODO: use bcrypt to compare hashed passwords in production
        if (user.password !== password) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        res.json({
            message: 'Login successful',
            user: { id: user._id, email: user.email }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
});

// Get todos for a user
app.get('/api/todos/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const todos = await Todo.find({ user: userId }).sort({ createdAt: -1 });
        res.json(todos);
    } catch (error) {
        console.error('Error fetching todos:', error);
        res.status(500).json({ message: 'Server error fetching todos' });
    }
});

// Create new todo
app.post('/api/todos', async (req, res) => {
    try {
        const { title, description, userId } = req.body;

        const todo = new Todo({
            title,
            description,
            user: userId
        });

        await todo.save();
        res.status(201).json(todo);
    } catch (error) {
        console.error('Error creating todo:', error);
        res.status(500).json({ message: 'Server error creating todo' });
    }
});

// Update todo
app.put('/api/todos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, completed } = req.body;

        const todo = await Todo.findByIdAndUpdate(
            id,
            { title, description, completed },
            { new: true }
        );

        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        res.json(todo);
    } catch (error) {
        console.error('Error updating todo:', error);
        res.status(500).json({ message: 'Server error updating todo' });
    }
});

// Delete todo
app.delete('/api/todos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const todo = await Todo.findByIdAndDelete(id);

        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        res.json({ message: 'Todo deleted successfully' });
    } catch (error) {
        console.error('Error deleting todo:', error);
        res.status(500).json({ message: 'Server error deleting todo' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
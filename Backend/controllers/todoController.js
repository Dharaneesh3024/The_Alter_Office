const mongoose = require('mongoose');
const Todo = require('../models/list');

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

exports.getTodosByUser = async (req, res) => {
    const { userId } = req.params;

    if (!isValidId(userId)) {
        return res.status(400).json({ success: false, message: 'Invalid user id' });
    }

    try {
        const todos = await Todo.find({ user: userId }).sort({ createdAt: -1 });
        return res.json({ success: true, data: todos });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Error fetching todos' });
    }
};

exports.createTodo = async (req, res) => {
    const { title, description, userId } = req.body;

    if (!title || !userId) {
        return res.status(400).json({ success: false, message: 'Title and userId are required' });
    }

    if (!isValidId(userId)) {
        return res.status(400).json({ success: false, message: 'Invalid user id' });
    }

    try {
        const todo = new Todo({ title, description, user: userId });
        await todo.save();
        return res.status(201).json({ success: true, data: todo });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Error creating todo' });
    }
};

exports.updateTodo = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    if (!isValidId(id)) {
        return res.status(400).json({ success: false, message: 'Invalid todo id' });
    }

    try {
        const todo = await Todo.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
        if (!todo) return res.status(404).json({ success: false, message: 'Todo not found' });
        return res.json({ success: true, data: todo });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Error updating todo' });
    }
};

exports.deleteTodo = async (req, res) => {
    const { id } = req.params;

    if (!isValidId(id)) {
        return res.status(400).json({ success: false, message: 'Invalid todo id' });
    }

    try {
        const todo = await Todo.findByIdAndDelete(id);
        if (!todo) return res.status(404).json({ success: false, message: 'Todo not found' });
        return res.json({ success: true, message: 'Todo deleted' });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Error deleting todo' });
    }
};

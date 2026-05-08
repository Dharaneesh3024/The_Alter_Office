const mongoose = require('mongoose');
const Todo = require('../models/list');
const { success, created, error } = require('../utils/apiResponse');

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

exports.getTodosByUser = async (req, res) => {
    const { userId } = req.params;

    if (!isValidId(userId)) return error(res, 'Invalid user id', 400);

    try {
        const todos = await Todo.find({ user: userId }).sort({ createdAt: -1 });
        return success(res, todos);
    } catch (err) {
        console.error('getTodosByUser error', err);
        return error(res, 'Error fetching todos');
    }
};

exports.createTodo = async (req, res) => {
    const { title, description, userId } = req.body;

    if (!title || !userId) return error(res, 'Title and userId are required', 400);
    if (!isValidId(userId)) return error(res, 'Invalid user id', 400);

    try {
        const todo = new Todo({ title, description, user: userId });
        await todo.save();
        return created(res, todo);
    } catch (err) {
        console.error('createTodo error', err);
        return error(res, 'Error creating todo');
    }
};

exports.updateTodo = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    if (!isValidId(id)) return error(res, 'Invalid todo id', 400);

    try {
        const todo = await Todo.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
        if (!todo) return error(res, 'Todo not found', 404);
        return success(res, todo);
    } catch (err) {
        console.error('updateTodo error', err);
        return error(res, 'Error updating todo');
    }
};

exports.deleteTodo = async (req, res) => {
    const { id } = req.params;

    if (!isValidId(id)) return error(res, 'Invalid todo id', 400);

    try {
        const todo = await Todo.findByIdAndDelete(id);
        if (!todo) return error(res, 'Todo not found', 404);
        return success(res, { message: 'Todo deleted' });
    } catch (err) {
        console.error('deleteTodo error', err);
        return error(res, 'Error deleting todo');
    }
};

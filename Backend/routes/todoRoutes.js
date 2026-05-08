const express = require('express');
const { verifyToken } = require('../middleware/authMiddleware');
const {
    getTodosByUser,
    createTodo,
    updateTodo,
    deleteTodo
} = require('../controllers/todoController');

const router = express.Router();

// All todo routes require authentication. The middleware populates `req.userId`.
router.get('/todos/:userId', verifyToken, getTodosByUser);
router.post('/todos', verifyToken, createTodo);
router.put('/todos/:id', verifyToken, updateTodo);
router.delete('/todos/:id', verifyToken, deleteTodo);

module.exports = router;

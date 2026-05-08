const express = require('express');
const {
    getTodosByUser,
    createTodo,
    updateTodo,
    deleteTodo
} = require('../controllers/todoController');

const router = express.Router();

router.get('/todos/:userId', getTodosByUser);
router.post('/todos', createTodo);
router.put('/todos/:id', updateTodo);
router.delete('/todos/:id', deleteTodo);

module.exports = router;

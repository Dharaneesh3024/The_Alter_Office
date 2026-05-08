import { useState, useEffect } from 'react';
import './TodoList.css';

function TodoList({ user, onLogout }) {
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState({ title: '', description: '' });
    const [editingTodo, setEditingTodo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchTodos = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/todos/${user.id}`);
            if (response.ok) {
                const data = await response.json();
                setTodos(data);
            } else {
                setError('Failed to fetch todos');
            }
        } catch (error) {
            console.error('Error fetching todos:', error);
            setError('Network error fetching todos');
        }
    };

    // Load todos when component mounts
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchTodos();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleAddTodo = async (e) => {
        e.preventDefault();
        if (!newTodo.title.trim()) return;

        setLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/todos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...newTodo,
                    userId: user.id
                }),
            });

            if (response.ok) {
                const todo = await response.json();
                setTodos([todo, ...todos]);
                setNewTodo({ title: '', description: '' });
            } else {
                setError('Failed to add todo');
            }
        } catch (error) {
            console.error('Error adding todo:', error);
            setError('Network error adding todo');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateTodo = async (id, updates) => {
        try {
            const response = await fetch(`http://localhost:5000/api/todos/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updates),
            });

            if (response.ok) {
                const updatedTodo = await response.json();
                setTodos(todos.map(todo =>
                    todo._id === id ? updatedTodo : todo
                ));
                setEditingTodo(null);
            } else {
                setError('Failed to update todo');
            }
        } catch (error) {
            console.error('Error updating todo:', error);
            setError('Network error updating todo');
        }
    };

    const handleDeleteTodo = async (id) => {
        if (!window.confirm('Are you sure you want to delete this todo?')) return;

        try {
            const response = await fetch(`http://localhost:5000/api/todos/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setTodos(todos.filter(todo => todo._id !== id));
            } else {
                setError('Failed to delete todo');
            }
        } catch (error) {
            console.error('Error deleting todo:', error);
            setError('Network error deleting todo');
        }
    };

    const startEditing = (todo) => {
        setEditingTodo({
            ...todo,
            title: todo.title,
            description: todo.description || ''
        });
    };

    const cancelEditing = () => {
        setEditingTodo(null);
    };

    const saveEditing = () => {
        if (editingTodo) {
            handleUpdateTodo(editingTodo._id, {
                title: editingTodo.title,
                description: editingTodo.description,
                completed: editingTodo.completed
            });
        }
    };

    return (
        <div className="todo-container">
            <header className="todo-header">
                <h1>My Todo List</h1>
                <div className="user-info">
                    <span>Welcome, {user.email}</span>
                    <button onClick={onLogout} className="logout-btn">Logout</button>
                </div>
            </header>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleAddTodo} className="add-todo-form">
                <div className="form-group">
                    <input
                        type="text"
                        placeholder="Todo title..."
                        value={newTodo.title}
                        onChange={(e) => setNewTodo({...newTodo, title: e.target.value})}
                        required
                        disabled={loading}
                    />
                </div>
                <div className="form-group">
                    <textarea
                        placeholder="Description (optional)..."
                        value={newTodo.description}
                        onChange={(e) => setNewTodo({...newTodo, description: e.target.value})}
                        rows="2"
                        disabled={loading}
                    />
                </div>
                <button type="submit" disabled={loading || !newTodo.title.trim()}>
                    {loading ? 'Adding...' : 'Add Todo'}
                </button>
            </form>

            <div className="todos-list">
                {todos.length === 0 ? (
                    <p className="no-todos">No todos yet. Add one above!</p>
                ) : (
                    todos.map(todo => (
                        <div key={todo._id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
                            {editingTodo && editingTodo._id === todo._id ? (
                                <div className="edit-form">
                                    <input
                                        type="text"
                                        value={editingTodo.title}
                                        onChange={(e) => setEditingTodo({...editingTodo, title: e.target.value})}
                                    />
                                    <textarea
                                        value={editingTodo.description}
                                        onChange={(e) => setEditingTodo({...editingTodo, description: e.target.value})}
                                        rows="2"
                                    />
                                    <div className="edit-buttons">
                                        <button onClick={saveEditing}>Save</button>
                                        <button onClick={cancelEditing}>Cancel</button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="todo-content">
                                        <h3>{todo.title}</h3>
                                        {todo.description && <p>{todo.description}</p>}
                                        <small>Created: {new Date(todo.createdAt).toLocaleDateString()}</small>
                                    </div>
                                    <div className="todo-actions">
                                        <button
                                            onClick={() => handleUpdateTodo(todo._id, { completed: !todo.completed })}
                                            className={todo.completed ? 'uncomplete-btn' : 'complete-btn'}
                                        >
                                            {todo.completed ? 'Mark Incomplete' : 'Mark Complete'}
                                        </button>
                                        <button onClick={() => startEditing(todo)} className="edit-btn">
                                            Edit
                                        </button>
                                        <button onClick={() => handleDeleteTodo(todo._id)} className="delete-btn">
                                            Delete
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default TodoList;
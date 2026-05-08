import { useState, useEffect } from 'react';
import './TodoList.css';
import Header from '../components/Header';
import TodoForm from '../components/TodoForm';
import TodoItem from '../components/TodoItem';

function TodoList({ user, onLogout }) {
    const [todos, setTodos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const apiHost = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const apiBase = `${apiHost}/api`;

    const fetchTodos = async () => {
        setLoading(true);
        setError('');
        try {
            const headers = { 'Content-Type': 'application/json' };
            if (user?.token) headers['Authorization'] = `Bearer ${user.token}`;

            const res = await fetch(`${apiBase}/todos/${user.id}`, { headers });
            const body = await res.json().catch(() => null);

            if (!res.ok) throw new Error((body && body.message) || 'Failed to fetch todos');

            const data = body && body.success ? body.data : body;
            setTodos(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
            setError(err.message || 'Network error fetching todos');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!user) return;
        fetchTodos();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    const addTodo = async (payload) => {
        setError('');
        try {
            const headers = { 'Content-Type': 'application/json' };
            if (user?.token) headers['Authorization'] = `Bearer ${user.token}`;

            const res = await fetch(`${apiBase}/todos`, {
                method: 'POST',
                headers,
                body: JSON.stringify(payload),
            });
            const body = await res.json().catch(() => null);
            if (!res.ok) throw new Error((body && body.message) || 'Failed to add todo');
            const created = body && body.success ? body.data : body;
            setTodos(prev => [created, ...prev]);
        } catch (err) {
            console.error('Add todo error', err);
            setError(err.message || 'Network error adding todo');
        }
    };

    const updateTodo = async (id, updates) => {
        setError('');
        try {
            const headers = { 'Content-Type': 'application/json' };
            if (user?.token) headers['Authorization'] = `Bearer ${user.token}`;

            const res = await fetch(`${apiBase}/todos/${id}`, {
                method: 'PUT',
                headers,
                body: JSON.stringify(updates),
            });
            const body = await res.json().catch(() => null);
            if (!res.ok) throw new Error((body && body.message) || 'Failed to update todo');
            const updated = body && body.success ? body.data : body;
            setTodos(prev => prev.map(t => (t._id === id ? updated : t)));
        } catch (err) {
            console.error('Update todo error', err);
            setError(err.message || 'Network error updating todo');
        }
    };

    const deleteTodo = async (id) => {
        if (!window.confirm('Delete this todo?')) return;
        setError('');
        try {
            const headers = {};
            if (user?.token) headers['Authorization'] = `Bearer ${user.token}`;

            const res = await fetch(`${apiBase}/todos/${id}`, { method: 'DELETE', headers });
            const body = await res.json().catch(() => null);
            if (!res.ok) throw new Error((body && body.message) || 'Failed to delete todo');
            setTodos(prev => prev.filter(t => t._id !== id));
        } catch (err) {
            console.error('Delete todo error', err);
            setError(err.message || 'Network error deleting todo');
        }
    };

    return (
        <div className="todo-container">
            <Header userEmail={user?.email} onLogout={onLogout} />

            <div className="content">
                {error && <div className="error-message">{error}</div>}

                <TodoForm onAdd={addTodo} disabled={loading} />

                {loading ? (
                    <div className="loading">Loading todos...</div>
                ) : todos.length === 0 ? (
                    <p className="no-todos">No todos yet. Add one above!</p>
                ) : (
                    <div className="todos-list">
                        {todos.map(todo => (
                            <TodoItem
                                key={todo._id}
                                todo={todo}
                                onToggle={updateTodo}
                                onDelete={deleteTodo}
                                onSave={updateTodo}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default TodoList;
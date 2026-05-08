import React, { useState } from 'react';
import './TodoItem.css';

export default function TodoItem({ todo, onToggle, onDelete, onSave }) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(todo.title || '');
  const [description, setDescription] = useState(todo.description || '');

  const startEdit = () => setEditing(true);
  const cancelEdit = () => {
    setEditing(false);
    setTitle(todo.title || '');
    setDescription(todo.description || '');
  };

  const save = () => {
    const updates = { title: title.trim(), description: description.trim(), completed: !!todo.completed };
    onSave(todo._id, updates);
    setEditing(false);
  };

  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      {editing ? (
        <div className="edit-area">
          <input value={title} onChange={(e) => setTitle(e.target.value)} />
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} />
          <div className="item-actions">
            <button onClick={save}>Save</button>
            <button onClick={cancelEdit}>Cancel</button>
          </div>
        </div>
      ) : (
        <>
          <div className="item-main">
            <h3>{todo.title}</h3>
            {todo.description && <p>{todo.description}</p>}
            <small>Created: {new Date(todo.createdAt).toLocaleDateString()}</small>
          </div>
          <div className="item-actions">
            <button onClick={() => onToggle(todo._id, { completed: !todo.completed })}>
              {todo.completed ? 'Mark Incomplete' : 'Mark Complete'}
            </button>
            <button onClick={startEdit}>Edit</button>
            <button onClick={() => onDelete(todo._id)}>Delete</button>
          </div>
        </>
      )}
    </div>
  );
}

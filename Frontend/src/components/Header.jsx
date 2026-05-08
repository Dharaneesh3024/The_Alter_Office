import React from 'react';
import './Header.css';

export default function Header({ userEmail, onLogout }) {
  return (
    <header className="header">
      <h1 className="app-title">Todo App</h1>
      <div className="user-area">
        <span className="user-email">{userEmail}</span>
        <button className="logout-btn" onClick={onLogout}>Logout</button>
      </div>
    </header>
  );
}

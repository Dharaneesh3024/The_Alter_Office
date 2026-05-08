import { useState, useEffect } from 'react';
import Signup from './pages/Signup';
import Login from './pages/Login';
import TodoList from './pages/TodoList';
import './App.css';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('login');

  // Check if user was already logged in
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCurrentUser(JSON.parse(savedUser));
      setCurrentPage('todos');
    }
  }, []);

  const handleLogin = (user) => {
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
    setCurrentPage('todos');
  };

  const handleSignup = (user) => {
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
    setCurrentPage('todos');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    setCurrentPage('login');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'signup':
        return <Signup onSignup={handleSignup} onSwitchToLogin={() => setCurrentPage('login')} />;
      case 'todos':
        return <TodoList user={currentUser} onLogout={handleLogout} />;
      default:
        return <Login onLogin={handleLogin} onSwitchToSignup={() => setCurrentPage('signup')} />;
    }
  };

  return (
    <div className="app">
      {renderPage()}
    </div>
  );
}

export default App;

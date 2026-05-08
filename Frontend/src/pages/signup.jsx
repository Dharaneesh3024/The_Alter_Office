import { useState } from 'react';
import './signup.css';

function Signup({ onSignup, onSwitchToLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Basic validation
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }

        setLoading(true);

        try {
            const apiHost = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const response = await fetch(`${apiHost}/api/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json().catch(() => null);

            if (response.ok) {
                // created response: { success: true, data: { id, email } }
                const payload = (data && data.data) ? data.data : data;
                const userObj = { id: payload.id || payload._id, email: payload.email };

                // Attempt to login immediately to obtain a token
                try {
                    const loginRes = await fetch(`${apiHost}/api/login`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email, password })
                    });
                    const loginBody = await loginRes.json().catch(() => null);
                    if (loginRes.ok && loginBody && loginBody.data) {
                        const token = loginBody.data.token;
                        onSignup({ id: userObj.id, email: userObj.email, token });
                        return;
                    }
                } catch (err) {
                    // ignore, fall back to returning user without token
                    console.error('Auto-login after signup failed', err);
                }

                onSignup(userObj);
            } else {
                setError((data && data.message) || 'Signup failed');
            }
        } catch (error) {
            console.error('Signup error:', error);
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="signup-container">
            <div className="signup-form">
                <h2>Create Account</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength="6"
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm Password:</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <button type="submit" disabled={loading}>
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>

                <p className="switch-form">
                    Already have an account?{' '}
                    <button onClick={onSwitchToLogin} className="link-button">
                        Login here
                    </button>
                </p>
            </div>
        </div>
    );
}

export default Signup;
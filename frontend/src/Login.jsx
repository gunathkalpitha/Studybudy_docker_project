import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token);
        alert('✅ Login successful!');
        navigate('/dashboard');
      } else {
        alert(`❌ Login failed: ${data.message}`);
      }
    } catch (err) {
      alert('⚠️ Server error. Please check if the backend is running.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleLogin}>
        <h2>Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
        <div className="auth-footer">
          <span>Don't have an account? </span>
          <Link to="/signup">Sign up</Link>
        </div>
      </form>
    </div>
  );
}

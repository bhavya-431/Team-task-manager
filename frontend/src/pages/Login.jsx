import { useState } from 'react';
import { Link } from 'react-router-dom';
import { apiPost } from '../services/api';

export default function Login({ onAuth }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    const response = await apiPost('/auth/login', { email, password });
    if (response.token) {
      onAuth(response);
    } else {
      setError(response.error || 'Login failed');
    }
  };

  return (
    <main className="auth-page shell-card">
      <h1>Sign in</h1>
      <p>Access team projects and manage your tasks.</p>
      <form onSubmit={handleSubmit}>
        <label>
          Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label>
          Password
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        {error && <div className="form-error">{error}</div>}
        <button type="submit" className="primary-button">Login</button>
      </form>
      <p className="soft-link">
        New here? <Link to="/signup">Create an account</Link>
      </p>
    </main>
  );
}

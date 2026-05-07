import { useState } from 'react';
import { Link } from 'react-router-dom';
import { apiPost } from '../services/api';

export default function Signup({ onAuth }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('MEMBER');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    const response = await apiPost('/auth/register', { name, email, password, role });
    if (response.token) {
      onAuth(response);
    } else {
      setError(response.error || 'Registration failed');
    }
  };

  return (
    <main className="auth-page shell-card">
      <h1>Create account</h1>
      <p>Register a new team member or admin account.</p>
      <form onSubmit={handleSubmit}>
        <label>
          Name
          <input value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
        <label>
          Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label>
          Password
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        <label>
          Role
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="MEMBER">Member</option>
            <option value="ADMIN">Admin</option>
          </select>
        </label>
        {error && <div className="form-error">{error}</div>}
        <button type="submit" className="primary-button">Sign up</button>
      </form>
      <p className="soft-link">
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </main>
  );
}

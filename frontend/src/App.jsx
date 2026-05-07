import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import ProjectDetails from './pages/ProjectDetails';

const tokenKey = 'team_task_token';

function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = window.localStorage.getItem(tokenKey);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUser(parsed.user);
      } catch {
        window.localStorage.removeItem(tokenKey);
      }
    }
  }, []);

  const handleAuth = (data) => {
    window.localStorage.setItem(tokenKey, JSON.stringify(data));
    setUser(data.user);
    navigate('/dashboard');
  };

  const handleLogout = () => {
    window.localStorage.removeItem(tokenKey);
    setUser(null);
    navigate('/login');
  };

  return (
    <div className="app-shell">
      <Routes>
        <Route path="/" element={<Navigate to={user ? '/dashboard' : '/login'} />} />
        <Route path="/login" element={<Login onAuth={handleAuth} />} />
        <Route path="/signup" element={<Signup onAuth={handleAuth} />} />
        <Route path="/dashboard" element={user ? <Dashboard user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} />
        <Route path="/project/:id" element={user ? <ProjectDetails user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} />
      </Routes>
    </div>
  );
}

export default App;

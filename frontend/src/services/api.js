const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';

const getToken = () => {
  const stored = window.localStorage.getItem('team_task_token');
  if (!stored) return null;
  try {
    return JSON.parse(stored).token;
  } catch {
    return null;
  }
};

const buildHeaders = () => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const apiPost = async (path, data) => {
  const response = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: buildHeaders(),
    body: JSON.stringify(data),
  });
  return response.json();
};

export const apiGet = async (path) => {
  const response = await fetch(`${API_BASE}${path}`, {
    method: 'GET',
    headers: buildHeaders(),
  });
  return response.json();
};

export const apiPut = async (path, data) => {
  const response = await fetch(`${API_BASE}${path}`, {
    method: 'PUT',
    headers: buildHeaders(),
    body: JSON.stringify(data),
  });
  return response.json();
};

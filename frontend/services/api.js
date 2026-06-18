export const API_URL = 'http://localhost:8000';

export async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) throw new Error(`Erro ${res.status}`);
  if (res.status === 204) return null;
  return res.json();
}

export async function authRequest(path, options = {}) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...options,
  });
  if (!res.ok) throw new Error(`Erro ${res.status}`);
  if (res.status === 204) return null;
  return res.json();
}

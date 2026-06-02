export const API_URL = 'http://localhost:8000';

export async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });
  if (!res.ok) throw new Error(`Erro ${res.status}`);
  return res.json();
}
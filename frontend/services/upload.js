import { API_URL } from './api.js';

export async function uploadImage(file) {
  const token = localStorage.getItem('token');
  const body  = new FormData();
  body.append('file', file);

  const res = await fetch(`${API_URL}/upload/`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body,
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.detail || 'Erro ao carregar a imagem.');
  }

  return res.json();
}

import { request, authRequest } from './api.js';

export const getMe = () => authRequest('/users/me');
export const updateMe = (data) => authRequest('/users/me', { method: 'PATCH', body: JSON.stringify(data) });
export const getUser = (username) => request(`/users/${username}`);

import { request } from './api.js';

export const getPosts = () => request('/posts');
export const createPost = (data) => request('/posts', { method: 'POST', body: JSON.stringify(data) });
export const deletePost = (id) => request(`/posts/${id}`, { method: 'DELETE' });
import { request, authRequest } from './api.js';

export const getPosts = (params = '') => authRequest(`/posts/${params}`);
export const getPopularTags = () => authRequest('/posts/tags');
export const getPost = (id) => authRequest(`/posts/${id}`);
export const createPost = (data) => authRequest('/posts/', { method: 'POST', body: JSON.stringify(data) });
export const updatePost = (id, data) => authRequest(`/posts/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
export const deletePost = (id) => authRequest(`/posts/${id}`, { method: 'DELETE' });

export const likePost = (id) => authRequest(`/posts/${id}/like`, { method: 'POST' });
export const unlikePost = (id) => authRequest(`/posts/${id}/like`, { method: 'DELETE' });

export const savePost = (id) => authRequest(`/posts/${id}/save`, { method: 'POST' });
export const unsavePost = (id) => authRequest(`/posts/${id}/save`, { method: 'DELETE' });
export const getSavedPosts = () => authRequest('/posts/saved');
export const getComments = (id) => request(`/posts/${id}/comments`);
export const createComment = (id, data) => authRequest(`/posts/${id}/comments`, { method: 'POST', body: JSON.stringify(data) });
export const deleteComment = (postId, commentId) => authRequest(`/posts/${postId}/comments/${commentId}`, { method: 'DELETE' });
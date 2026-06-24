import { request, authRequest } from './api.js';

export const getUsers = () => authRequest('/users/');
export const getMe = () => authRequest('/users/me');
export const updateMe = (data) => authRequest('/users/me', { method: 'PATCH', body: JSON.stringify(data) });
export const getUser = (username) => authRequest(`/users/${username}`);
export const followUser    = (username) => authRequest(`/users/${username}/follow`, { method: 'POST' });
export const unfollowUser  = (username) => authRequest(`/users/${username}/follow`, { method: 'DELETE' });
export const getFollowers  = (username) => authRequest(`/users/${username}/followers`);
export const getFollowing  = (username) => authRequest(`/users/${username}/following`);

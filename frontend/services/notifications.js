import { authRequest } from './api.js';

export const getNotifications = () => authRequest('/notifications');
export const markAllRead      = () => authRequest('/notifications/read-all', { method: 'POST' });

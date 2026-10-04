import api from './api';

export const registerUser = (userData) => api.post('/auth/signup', userData);
export const authenticateUser = (credentials) => api.post('/auth/login', credentials);
export const updateUserPassword = (payload) => api.put('/auth/change-password', payload);
export const signOutUser = () => api.post('/auth/logout');

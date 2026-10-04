import api from './api';

export const fetchAdminDashboardMetrics = () => api.get('/admin/dashboard');
export const fetchAdminUsers = (params) => api.get('/admin/users', { params });
export const fetchAdminStores = (params) => api.get('/admin/stores', { params });
export const fetchAdminUserById = (id) => api.get(`/admin/users/${id}`);
export const registerUserByAdmin = (data) => api.post('/admin/users', data);
export const registerStoreByAdmin = (data) => api.post('/admin/stores', data);

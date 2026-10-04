import api from './api';

export const fetchOwnerDashboard = () => api.get('/store-owner/dashboard');
export const fetchOwnerCustomerRatings = (params) => api.get('/store-owner/ratings', { params });

import api from './api';

export const fetchStoresForUser = (params) => api.get('/user/stores', { params });
export const submitStoreRating = (storeId, rating) => api.put(`/user/stores/${storeId}/rating`, { rating });

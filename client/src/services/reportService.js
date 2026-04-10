import api from './api';

export const getDashboardStats = async () => {
  const response = await api.get('/reports/dashboard-stats');
  return response.data;
};

export const getAnalytics = async () => {
  const response = await api.get('/reports/analytics');
  return response.data;
};

export const getCartPerformance = async () => {
  const response = await api.get('/reports/cart-performance');
  return response.data;
};

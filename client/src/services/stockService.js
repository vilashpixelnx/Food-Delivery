import api from './api';

export const getAllStock = async () => {
  const response = await api.get('/stock');
  return response.data;
};

export const getCartStock = async (cartId) => {
  const response = await api.get(`/stock/cart/${cartId}`);
  return response.data;
};

export const getLowStock = async (cartId) => {
  const response = await api.get(`/stock/low-stock/${cartId}`);
  return response.data;
};

export const updateStock = async (stockData) => {
  const response = await api.post('/stock/update', stockData);
  return response.data;
};

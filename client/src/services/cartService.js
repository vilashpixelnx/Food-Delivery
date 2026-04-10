import api from './api';

export const getCarts = async () => {
  const response = await api.get('/carts');
  return response.data;
};

export const createCart = async (cartData) => {
  const response = await api.post('/carts', cartData);
  return response.data;
};

export const updateCart = async (id, cartData) => {
  const response = await api.put(`/carts/${id}`, cartData);
  return response.data;
};

export const deleteCart = async (id) => {
  const response = await api.delete(`/carts/${id}`);
  return response.data;
};

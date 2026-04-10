import api from './api';

export const getPayments = async () => {
  const response = await api.get('/payments');
  return response.data;
};

export const createRazorpayOrder = async (orderData) => {
  const response = await api.post('/payments/create-order', orderData);
  return response.data;
};

export const verifyPayment = async (verificationData) => {
  const response = await api.post('/payments/verify', verificationData);
  return response.data;
};

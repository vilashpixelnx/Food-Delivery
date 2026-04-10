import api from './api';

export const getCustomers = async () => {
  const response = await api.get('/customers');
  return response.data;
};

export const createCustomer = async (customerData) => {
  const response = await api.post('/customers', customerData);
  return response.data;
};

export const searchCustomerByPhone = async (phone) => {
  const response = await api.get(`/customers/search/${phone}`);
  return response.data;
};

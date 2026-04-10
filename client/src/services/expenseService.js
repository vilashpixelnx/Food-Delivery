import api from './api';

export const getExpenses = async (params) => {
  const response = await api.get('/expenses', { params });
  return response.data;
};

export const createExpense = async (expenseData) => {
  const response = await api.post('/expenses', expenseData);
  return response.data;
};

export const getExpenseSummary = async () => {
  const response = await api.get('/expenses/summary');
  return response.data;
};

export const deleteExpense = async (id) => {
  const response = await api.delete(`/expenses/${id}`);
  return response.data;
};

import api from './api';

export const generateBillPDF = async (orderId) => {
  const response = await api.get(`/bills/${orderId}/pdf`, {
    responseType: 'blob', // Important for downloading files
  });
  
  // Create a link to download the PDF
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `bill-${orderId}.pdf`);
  document.body.appendChild(link);
  link.click();
  link.remove();
};

export const getBills = async () => {
  const response = await api.get('/bills');
  return response.data;
};

import API from './axios';

export const generatePayslip = (data) => API.post('/payslips/generate', data);
export const getPayslips = () => API.get('/payslips');
export const downloadPayslip = (id) => API.get(`/payslips/${id}`, { responseType: 'blob' });

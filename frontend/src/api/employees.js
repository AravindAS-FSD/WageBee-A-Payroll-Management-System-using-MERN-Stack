import API from './axios';

export const getAllEmployees = () => API.get('/employees');
export const getEmployeeById = (id) => API.get(`/employees/${id}`);
export const createEmployee = (data) => API.post('/employees', data);
export const updateEmployee = (id, data) => API.put(`/employees/${id}`, data);
export const deleteEmployee = (id) => API.delete(`/employees/${id}`);
export const addEmployee = (data) => API.post('/employees', data);

export async function generatePayslip(employeeId) {
  return Promise.resolve({ data: { message: 'Payslip generated for this month!' } });
}

export async function sendNotification(employeeId, message) {
  return Promise.resolve({ data: { message: 'Notification sent!' } });
}

export const promoteToManager = async (id, data) => {
  return API.post(`/employees/promote/${id}`, data);
}

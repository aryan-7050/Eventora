import api from './index';

export const studentRegister = (data) => api.post('/auth/student/register', data);
export const studentLogin = (data) => api.post('/auth/student/login', data);

export const clubRegister = (data) => api.post('/auth/club/register', data);
export const clubLogin = (data) => api.post('/auth/club/login', data);

export const adminLogin = (data) => api.post('/auth/admin/login', data);

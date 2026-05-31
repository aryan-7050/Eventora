import API from './index';

export const getStudentProfile = (id) => API.get(`/student/profile/${id}`);
export const updateStudentProfile = (id, data) => API.put(`/student/profile/${id}`, data);
export const changePassword = (id, data) => API.put(`/student/change-password/${id}`, data);

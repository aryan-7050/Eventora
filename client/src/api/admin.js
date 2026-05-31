import api from './index';

// Use the centralized api instance and prefix all paths with /admin
const API = {
    get: (url, config) => api.get(`/admin${url}`, config),
    post: (url, data, config) => api.post(`/admin${url}`, data, config),
    put: (url, data, config) => api.put(`/admin${url}`, data, config),
    delete: (url, config) => api.delete(`/admin${url}`, config),
};

export const getPendingClubs = () => API.get('/pending-clubs');
export const approveClub = (id) => API.put(`/approve-club/${id}`);
export const rejectClub = (id, reason) => API.delete(`/reject-club/${id}`, { data: { reason } });
export const getApprovedClubs = () => API.get('/clubs');
export const removeClub = (id) => API.delete(`/club/${id}`);

// Student Management
export const getStudents = () => API.get('/students');
export const removeStudent = (id) => API.delete(`/student/${id}`);

// Event Management
export const getPendingEvents = () => API.get('/pending-events');
export const approveEvent = (id) => API.put(`/approve-event/${id}`);
export const rejectEvent = (id, reason) => API.put(`/reject-event/${id}`, { reason });
export const getConductedEvents = () => API.get('/conducted-events');

// Edited Event Management
export const getPendingEditedEvents = () => API.get('/pending-edited-events');
export const approveEditedEvent = (id) => API.put(`/approve-edited-event/${id}`);
export const rejectEditedEvent = (id, reason) => API.put(`/reject-edited-event/${id}`, { reason });

export const getAdminProfile = (id) => API.get(`/profile/${id}`);
export const getAdminDashboard = (id) => API.get(`/dashboard/${id}`);
export const updateAdminProfile = (id, data) => API.put(`/profile/${id}`, data);
export const changeAdminPassword = (id, data) => API.put(`/change-password/${id}`, data);
export const uploadOfficialSeal = (id, data) => API.put(`/official-seal/${id}`, data);
export const getOfficialSeal = () => API.get('/get-official-seal');

export default API;

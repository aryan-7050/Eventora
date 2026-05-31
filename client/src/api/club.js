import API from './index';

export const getClubProfile = (id) => API.get(`/club/profile/${id}`);
export const getClubDashboard = (id) => API.get(`/club/dashboard/${id}`);
export const updateClubProfile = (id, data) => API.put(`/club/profile/${id}`, data);
export const changeClubPassword = (id, data) => API.put(`/club/change-password/${id}`, data);

// Certificate Management
export const uploadSignature = (id, data) => API.put(`/club/signature/${id}`, data);
export const uploadSeal = (id, data) => API.put(`/club/seal/${id}`, data);
export const getCertificateEvents = (id) => API.get(`/club/certificate-events/${id}`);
export const getEventAttendees = (eventId) => API.get(`/club/event-attendees/${eventId}`);
export const saveCertificates = (eventId, data) => API.put(`/club/save-certificates/${eventId}`, data);
export const postCertificates = (eventId) => API.put(`/club/post-certificates/${eventId}`);

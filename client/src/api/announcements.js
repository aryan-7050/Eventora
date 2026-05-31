import API from './index';

export const createAnnouncement = (data) => API.post('/announcements/create', data);
export const getStudentAnnouncements = (studentId) => API.get(`/announcements/student/${studentId}`);
export const getAnnouncementHistory = (senderId) => API.get(`/announcements/history/${senderId}`);

export default API;

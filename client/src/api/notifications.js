import api from './index';

export const getStudentNotifications = (studentId) => api.get(`/notifications/${studentId}`);
export const markAsRead = (id) => api.put(`/notifications/read/${id}`);

// Club Notifications
export const getClubNotifications = (clubId) => api.get(`/notifications/club/${clubId}`);
export const markClubNotificationRead = (id) => api.put(`/notifications/read/${id}?isClub=true`);
export const markAllClubNotificationsRead = (clubId) => api.put(`/notifications/club/${clubId}/read-all`);

export default api;

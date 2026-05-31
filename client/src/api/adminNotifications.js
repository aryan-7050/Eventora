import API from './index';

export const getAdminNotifications = () => API.get('/admin-notifications');
export const markAdminNotificationRead = (id) => API.put(`/admin-notifications/${id}/read`);
export const markAllAdminNotificationsRead = () => API.put('/admin-notifications/read-all');

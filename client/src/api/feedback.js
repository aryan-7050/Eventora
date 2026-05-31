import API from './index';

export const submitFeedback = (data) => API.post('/feedback/submit', data);
export const getEventFeedback = (eventId) => API.get(`/feedback/event/${eventId}`);
export const getStudentFeedback = (studentId) => API.get(`/feedback/student/${studentId}`);

import API from './index';

export const getEventBudget = (eventId, clubId) => API.get(`/budget/event/${eventId}?clubId=${clubId}`);
export const updateEventBudget = (eventId, data) => API.put(`/budget/update/${eventId}`, data);

export default API;

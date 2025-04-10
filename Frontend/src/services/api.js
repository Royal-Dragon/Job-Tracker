import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const fetchApplications = (params) => API.get('/applications', { params });
export const createApplication = (data) => API.post('/applications', data);
export const updateApplication = (id, data) => API.put(`/applications/${id}`, data);
export const deleteApplication = (id) => API.delete(`/applications/${id}`);
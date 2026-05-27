import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message = err.response?.data?.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

export const leadsApi = {
  getAll: (params = {}) => api.get('/leads', { params }),
  getStats: () => api.get('/leads/stats'),
  create: (data) => api.post('/leads', data),
  updateStatus: (id, status) => api.patch(`/leads/${id}/status`, { status }),
  update: (id, data) => api.put(`/leads/${id}`, data),
  delete: (id) => api.delete(`/leads/${id}`),
};

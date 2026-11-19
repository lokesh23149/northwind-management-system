import axiosClient from '../api/axiosClient';

export const customerService = {
  getAll: (search = '') => {
    const params = search ? { search } : {};
    return axiosClient.get('/customers', { params });
  },

  getById: (id) => {
    return axiosClient.get(`/customers/${id}`);
  },

  create: (data) => {
    return axiosClient.post('/customers', data);
  },

  update: (id, data) => {
    return axiosClient.put(`/customers/${id}`, data);
  },

  delete: (id) => {
    return axiosClient.delete(`/customers/${id}`);
  },
};

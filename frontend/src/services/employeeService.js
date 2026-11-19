import axiosClient from '../api/axiosClient';

export const employeeService = {
  getAll: (search = '') => {
    const params = search ? { search } : {};
    return axiosClient.get('/employees', { params });
  },

  getById: (id) => {
    return axiosClient.get(`/employees/${id}`);
  },

  create: (data) => {
    return axiosClient.post('/employees', data);
  },

  update: (id, data) => {
    return axiosClient.put(`/employees/${id}`, data);
  },

  delete: (id) => {
    return axiosClient.delete(`/employees/${id}`);
  },
};

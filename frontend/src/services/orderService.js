import axiosClient from '../api/axiosClient';

export const orderService = {
  getAll: (params = {}) => {
    return axiosClient.get('/orders', { params });
  },

  getById: (id) => {
    return axiosClient.get(`/orders/${id}`);
  },

  create: (orderPayload) => {
    return axiosClient.post('/orders', orderPayload);
  },

  cancel: (id) => {
    return axiosClient.put(`/orders/${id}/cancel`);
  },

  getShippers: () => {
    return axiosClient.get('/shippers');
  },
};

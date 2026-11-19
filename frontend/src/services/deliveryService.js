import axiosClient from '../api/axiosClient';

export const deliveryService = {
  getAll: (params = {}) => {
    return axiosClient.get('/deliveries', { params });
  },

  getById: (orderId) => {
    return axiosClient.get(`/deliveries/${orderId}`);
  },

  updateStatus: (orderId, payload) => {
    return axiosClient.patch(`/deliveries/${orderId}/status`, payload);
  },
};

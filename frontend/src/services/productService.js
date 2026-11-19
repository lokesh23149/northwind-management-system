import axiosClient from '../api/axiosClient';

export const productService = {
  getAll: (params = {}) => {
    return axiosClient.get('/products', { params });
  },

  getById: (id) => {
    return axiosClient.get(`/products/${id}`);
  },

  create: (data) => {
    return axiosClient.post('/products', data);
  },

  update: (id, data) => {
    return axiosClient.put(`/products/${id}`, data);
  },

  updateStock: (id, unitsInStock) => {
    return axiosClient.patch(`/products/${id}/stock`, { unitsInStock });
  },

  delete: (id) => {
    return axiosClient.delete(`/products/${id}`);
  },

  getCategories: () => {
    return axiosClient.get('/categories');
  },
};

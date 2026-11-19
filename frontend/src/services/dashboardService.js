import axiosClient from '../api/axiosClient';

export const dashboardService = {
  getStats: () => {
    return axiosClient.get('/dashboard/stats');
  },
};

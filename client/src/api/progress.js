import api from './axios';

export const getProgress = async (params = {}) => {
  const res = await api.get('/progress', { params });
  return res.data;
};

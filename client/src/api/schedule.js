import api from './axios';

export const getSchedules = async (params = {}) => {
  const res = await api.get('/schedule', { params });
  return res.data;
};

export const createSchedule = async (data) => {
  const res = await api.post('/schedule', data);
  return res.data;
};

export const updateSchedule = async (id, data) => {
  const res = await api.put(`/schedule/${id}`, data);
  return res.data;
};

export const deleteSchedule = async (id) => {
  const res = await api.delete(`/schedule/${id}`);
  return res.data;
};

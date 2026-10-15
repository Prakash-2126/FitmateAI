import api from './axios';

export const getMeals = async (params = {}) => {
  const res = await api.get('/meals', { params });
  return res.data;
};

export const getMealById = async (id) => {
  const res = await api.get(`/meals/${id}`);
  return res.data;
};

export const createMeal = async (data) => {
  const res = await api.post('/meals', data);
  return res.data;
};

export const updateMeal = async (id, data) => {
  const res = await api.put(`/meals/${id}`, data);
  return res.data;
};

export const deleteMeal = async (id) => {
  const res = await api.delete(`/meals/${id}`);
  return res.data;
};

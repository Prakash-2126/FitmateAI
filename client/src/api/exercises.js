import api from './axios';

export const getExercises = async (params = {}) => {
  const res = await api.get('/exercises', { params });
  return res.data;
};

export const getExerciseById = async (id) => {
  const res = await api.get(`/exercises/${id}`);
  return res.data;
};

export const createCustomExercise = async (data) => {
  const res = await api.post('/exercises', data);
  return res.data;
};

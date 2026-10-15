import api from './axios';

export const getWorkoutCompletions = async (params = {}) => {
  const res = await api.get('/workout-completions', { params });
  return res.data;
};

export const getWorkoutCompletionById = async (id) => {
  const res = await api.get(`/workout-completions/${id}`);
  return res.data;
};

export const createWorkoutCompletion = async (data) => {
  const res = await api.post('/workout-completions', data);
  return res.data;
};

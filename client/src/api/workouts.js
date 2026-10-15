import api from './axios';

export const getWorkouts = async () => {
  const res = await api.get('/workouts');
  return res.data;
};

export const getWorkoutById = async (id) => {
  const res = await api.get(`/workouts/${id}`);
  return res.data;
};

export const createWorkout = async (data) => {
  const res = await api.post('/workouts', data);
  return res.data;
};

export const updateWorkout = async (id, data) => {
  const res = await api.put(`/workouts/${id}`, data);
  return res.data;
};

export const deleteWorkout = async (id) => {
  const res = await api.delete(`/workouts/${id}`);
  return res.data;
};

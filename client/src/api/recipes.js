import api from './axios';

export const getRecipes = async (params = {}) => {
  const response = await api.get('/recipes', { params });
  return response.data;
};

export const getRecipeById = async (id) => {
  const response = await api.get(`/recipes/${id}`);
  return response.data;
};

export const logRecipeToMeal = async (id) => {
  const response = await api.post(`/recipes/${id}/log-to-meal`);
  return response.data;
};

import api from './axios';

export const changePassword = async (data) => {
  const res = await api.put('/settings/change-password', data);
  return res.data;
};

export const deleteAccount = async (password) => {
  const res = await api.delete('/settings/delete-account', { data: { password } });
  return res.data;
};

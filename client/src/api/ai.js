import api from './axios';

export const sendAIChatMessage = async (message, conversationId = null) => {
  const res = await api.post('/ai/chat', { message, conversationId });
  return res.data;
};

export const getAIConversations = async () => {
  const res = await api.get('/ai/conversations');
  return res.data;
};

export const getAIConversationById = async (id) => {
  const res = await api.get(`/ai/conversations/${id}`);
  return res.data;
};

export const deleteAIConversation = async (id) => {
  const res = await api.delete(`/ai/conversations/${id}`);
  return res.data;
};

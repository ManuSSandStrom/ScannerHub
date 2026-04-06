import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'We could not complete that request right now.';

    return Promise.reject(new Error(message));
  }
);

export const saveQrData = async (payload) => {
  const response = await api.post('/qr/save', payload);
  return response.data.data;
};

export const fetchQrData = async (id) => {
  const response = await api.get(`/qr/${id}`);
  return response.data.data;
};

export default api;

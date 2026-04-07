import axios from 'axios';

const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();
const isNativePlatform =
  typeof window !== 'undefined' &&
  typeof window.Capacitor?.isNativePlatform === 'function' &&
  window.Capacitor.isNativePlatform();
const nativeApiConfigMessage =
  'This Android build needs VITE_API_BASE_URL pointed at your deployed HTTPS API, for example https://your-api.example.com/api.';
const resolvedBaseUrl = configuredBaseUrl || (!isNativePlatform ? '/api' : null);

const api = axios.create({
  baseURL: resolvedBaseUrl || '/api',
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  if (!resolvedBaseUrl) {
    return Promise.reject(new Error(nativeApiConfigMessage));
  }

  return config;
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

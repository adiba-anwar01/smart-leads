import axios, { AxiosError } from 'axios';
import { useAuthStore } from '../store/auth.store';

const baseURL = import.meta.env.VITE_API_BASE_URL;

export const axiosInstance = axios.create({
  baseURL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    // Add Authorization header - MUST be done first
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Set Content-Type only for non-blob responses
    if (config.responseType !== 'blob') {
      if (!config.headers.get('Content-Type')) {
        config.headers['Content-Type'] = 'application/json';
      }
    }

    return config;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<{ message?: string }>;
      
      if (axiosError.response?.status === 401) {
        useAuthStore.getState().logout();
        window.location.href = '/login';
      }

      const message = axiosError.response?.data?.message || axiosError.message;
      const newError = new Error(message);
      return Promise.reject(newError);
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;

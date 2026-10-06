import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '../stores/authStore';

// ============================================
// Axios Instance
// ============================================
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// ============================================
// Request Interceptor — Attach Bearer Token
// ============================================
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ============================================
// Response Interceptor — Handle 401 / 403
// ============================================
apiClient.interceptors.response.use(
  (response) => response,

  (error: AxiosError) => {
    const status = error.response?.status;

    if (status === 401) {
      // Token invalid or expired — clear auth state
      useAuthStore.getState().clearAuth();

      // Redirect to login (avoid redirect loop)
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    if (status === 403) {
      // Not authorized — keep auth state, but don't retry
      // Individual components can handle the error message
    }

    return Promise.reject(error);
  }
);

export default apiClient;
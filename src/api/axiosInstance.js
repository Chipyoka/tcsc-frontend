import axios from 'axios';
import useAuthStore from '../store/auth.store'; // adjust path

const URL = import.meta.env.VITE_API_BASE_URL;

if (!URL) {
  throw new Error('VITE_API_BASE_URL is not defined in environment variables');
} else {
  console.log('API Base URL:', URL);
}

// ---------------------------
// Axios Instances
// ---------------------------

// Main Axios instance for all API calls
const axiosInstance = axios.create({
  baseURL: URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true, // send HTTP-only cookies
});

// Dedicated Axios instance for refresh token requests
const refreshClient = axios.create({
  baseURL: URL,
  withCredentials: true, // browser will attach refresh cookie
});

// ---------------------------
// Request Interceptor
// ---------------------------
axiosInstance.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// ---------------------------
// Response Interceptor
// ---------------------------
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Do not attempt refresh on refresh endpoint itself
    if (originalRequest.url?.includes('/auth/refresh')) {
      return Promise.reject(error);
    }

    // Only retry once
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Refresh access token using dedicated client
        const { data } = await refreshClient.post('/auth/refresh');

        // Update access token in memory
        useAuthStore.getState().setAccessToken(data.accessToken);

        // Retry original request with new access token
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return axiosInstance(originalRequest);
      } catch (err) {
        // Refresh failed → optional: logout user
        // useAuthStore.getState().logout();
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;

import axios from 'axios';
import useAuthStore  from '../store/auth.store'; // adjust path

const URL = import.meta.env.VITE_API_BASE_URL;

if (!URL) {
  throw new Error('VITE_API_BASE_URL is not defined in environment variables');
} else {
  console.log('API Base URL:', URL);
}

// Create Axios instance
const axiosInstance = axios.create({
  baseURL: URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true, // send HTTP-only cookies
});

// Request interceptor: attach access token
axiosInstance.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// Response interceptor: handle 401 with refresh token
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only retry once
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Call refresh endpoint (refresh token is in HTTP-only cookie)
        const { data } = await axiosInstance.post('/auth/refresh');
        // Update access token in memory
        useAuthStore.getState().setAccessToken(data.accessToken);
        // Retry original request with new access token
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return axiosInstance(originalRequest);
      } catch (err) {
        // Refresh failed → logout user
        useAuthStore.getState().logout();
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;

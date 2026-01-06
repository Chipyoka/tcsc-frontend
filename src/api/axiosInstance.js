import axios from 'axios';
import useAuthStore from '../store/auth.store';

const URL = import.meta.env.VITE_API_BASE_URL;

if (!URL) {
  throw new Error('VITE_API_BASE_URL is not defined in environment variables');
}

// ---------------------------
// Axios Instances
// ---------------------------

const axiosInstance = axios.create({
  baseURL: URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

const refreshClient = axios.create({
  baseURL: URL,
  withCredentials: true,
});

// ---------------------------
// Refresh Coordination State
// ---------------------------

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  failedQueue = [];
};

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

    // Never intercept refresh endpoint
    if (originalRequest?.url?.includes('/auth/refresh')) {
      return Promise.reject(error);
    }

    // Only handle 401 once per request
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // If refresh already in progress, queue request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(axiosInstance(originalRequest));
            },
            reject,
          });
        });
      }

      isRefreshing = true;

      try {
        const { data } = await refreshClient.post('/auth/refresh');

        // Update global auth state
        useAuthStore.getState().setAccessToken(data.accessToken);

        processQueue(null, data.accessToken);

        // Retry original request
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return axiosInstance(originalRequest);
      } catch (err) {
        processQueue(err, null);
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;

import axios from 'axios';

const URL = import.meta.env.VITE_API_BASE_URL;

if(!URL){
  throw new Error('VITE_API_BASE_URL is not defined in environment variables');
}else{
  console.log('API Base URL:', URL);
}

const axiosInstance = axios.create({
  baseURL: URL,
  headers: { 'Content-Type': 'application/json' },
});

export default axiosInstance;

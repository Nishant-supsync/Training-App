import axios from 'axios';
import { API_ENDPOINTS } from './endpoints';

// Create axios instance with base URL from environment variable
const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
export default api;
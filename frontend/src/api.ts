import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export const api = axios.create({
  baseURL: API_URL,
});

export function setToken(token: string) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
} 
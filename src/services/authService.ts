// src/services/authService.ts
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const login = (email, password) => {
  return axios.post(`${API_BASE_URL}/auth/login`, { email, password });
};

export const register = (userData) => {
  return axios.post(`${API_BASE_URL}/auth/register`, userData);
};

// src/services/deviceService.ts
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getDevices = () => {
  return axios.get(`${API_BASE_URL}/devices`);
};

export const getDeviceById = (id) => {
  return axios.get(`${API_BASE_URL}/devices/${id}`);
};

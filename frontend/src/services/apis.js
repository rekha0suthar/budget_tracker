import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8000/api',
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const fetchTransactions = async () => {
  const response = await API.get('/transactions/');
  return response.data;
};

export const addTransaction = async (data) => {
  const response = await API.post('/transactions/', data);
  return response.data;
};

export const deleteTransaction = async (id) => {
  const response = await API.delete(`/transactions/${id}/`);
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await API.post('/token/', credentials);
  return response.data;
};

export default API;

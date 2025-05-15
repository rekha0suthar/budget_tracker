import axios from 'axios';

const API = axios.create({
  baseURL: 'https://budjet-tracker.onrender.com/api',
});

API.interceptors.request.use((config) => {
  const token =
    localStorage.getItem('access') || localStorage.getItem('refresh');
  //   console.log(token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // ✅ This must be set
  }
  return config;
});

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      error.response.data.code === 'token_not_valid' &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      const refresh = localStorage.getItem('refresh');
      if (!refresh) {
        window.location.href = '/'; // redirect to login
        return Promise.reject(error);
      }

      try {
        const response = await axios.post('/token/refresh/', {
          refresh,
        });

        const newAccess = response.data.access;
        localStorage.setItem('access', newAccess);

        // Retry original request
        originalRequest.headers.Authorization = `Bearer ${newAccess}`;
        return API(originalRequest);
      } catch (refreshError) {
        console.error('Token refresh failed', refreshError);
        localStorage.clear();
        window.location.href = '/';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export const fetchTransactions = async (page = 1, filters = {}) => {
  const params = new URLSearchParams({ page });

  if (filters.start_date) params.append('start_date', filters.start_date);
  if (filters.end_date) params.append('end_date', filters.end_date);
  if (filters.category) params.append('category', filters.category);
  if (filters.min_amount) params.append('min_amount', filters.min_amount);
  if (filters.max_amount) params.append('max_amount', filters.max_amount);

  const res = await API.get(`/transactions/?${params.toString()}`);
  return res.data;
};

export const addTransaction = async (data) => {
  const response = await API.post('/transactions/', data);
  return response.data;
};

export const updateTransaction = async (id, data) => {
  const res = await API.put(`/transactions/${id}/`, data);
  return res.data;
};

export const deleteTransaction = async (id) => {
  const response = await API.delete(`/transactions/${id}/`);
  return response.data;
};

export const fetchBudget = async (month) => {
  const response = await API.get(`/budget/?month=${month}`);
  return response.data;
};

export const updateBudget = async (month, data) => {
  const response = await API.put(`/budget/?month=${month}`, data);
  return response.data;
};

export const fetchSummary = async () => {
  const response = await API.get('/summary/');
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await API.post('/token/', credentials);
  localStorage.setItem('access', response.data.access);
  localStorage.setItem('refresh', response.data.refresh);
  return response.data;
};

export default API;

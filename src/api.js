// src/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',   // 여기에 /api 포함 여부를 맞춰주세요
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터: localStorage의 token 가져와서 자동 부착
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = 
      token.startsWith('Bearer ') ? token : `Bearer ${token}`;
  }
  return config;
});

export default api;

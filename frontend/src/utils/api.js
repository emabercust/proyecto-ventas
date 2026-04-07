//Qué hace esto
//Cada request automáticamente envía:
//Authorization: Bearer TOKEN

import axios from 'axios';
import { Navigate } from "react-router-dom";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API_URL = `${BACKEND_URL}/api`;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

//Ahora cuando el backend (Django REST Framework) responda:
//401 Unauthorized, el frontend automáticamente:
//elimina el token y luego redirige al login
//Así cuando el token expire: usuario → login automáticamente
api.interceptors.response.use(
  response => response,
  async (error) => {
    const originalRequest = error.config;

    // si el token expiró
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refresh_token");

      if (!refreshToken) {
        window.location.href = "/admin/login";
        return Promise.reject(error);
      }

      try {
        const res = await axios.post(
          `${BACKEND_URL}/api/token/refresh/`,
          { refresh: refreshToken }
        );

        const newAccessToken = res.data.access;

        localStorage.setItem("token", newAccessToken);

        // actualizar header
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return api(originalRequest);

      } catch (err) {
        // refresh falló → logout
        localStorage.clear();
        window.location.href = "/admin/login";
      }
    }

    return Promise.reject(error);
  }
);
export default api;
export { API_URL, BACKEND_URL };

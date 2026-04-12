//Qué hace esto
//Cada request automáticamente envía:
//Authorization: Bearer TOKEN

import axios from 'axios';
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API_URL = `${BACKEND_URL}/api`;

let isRefreshing = false;

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
    if (error.response?.status === 401 && !originalRequest._retry && !isRefreshing) {
      isRefreshing = true ;
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

        //Guardar nuevo token
        localStorage.setItem("token", newAccessToken);

        // actualizar header
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);

      } catch (err) {
         localStorage.removeItem("token");
         localStorage.removeItem("refresh_token");
         localStorage.removeItem("user");

         if (window.location.pathname.startsWith("/admin")) {
           window.location.href = "/admin/login";
         } else {
           window.location.href = "/";
         }
      } finally{
        isRefreshing= false;
      }
    }

    return Promise.reject(error);
  }
);
export default api;
export { API_URL, BACKEND_URL };

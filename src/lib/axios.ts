import axios from "axios";
import { ACCESS_TOKEN_KEY, getToken } from "../services/auth";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

const api = axios.create({
  baseURL: BACKEND_URL,
});

// Interceptor de requisições: adiciona o token JWT ao header Authorization, se existir
api.interceptors.request.use((config) => {
  const token = getToken(ACCESS_TOKEN_KEY);
  console.log(token)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
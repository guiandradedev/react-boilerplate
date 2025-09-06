import axios from "axios";
import { getToken } from "../services/auth";

const api = axios.create({
  baseURL: "https://sua-api.com/api", // ajuste para a sua API real
});

// Interceptor de requisições: adiciona o token JWT ao header Authorization, se existir
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
// src/services/authService.js
export const KEY = "@flaamer";
export const ACCESS_TOKEN_KEY = `${KEY}-access-token`;
export const REFRESH_TOKEN_KEY = `${KEY}-refresh-token`;


// Verifica se já tem um token no localStorage (usuário logado)
export const isAuthenticated = () => localStorage.getItem(ACCESS_TOKEN_KEY) !== null;

// Pega o token do localStorage
export const getToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);

export const saveTokenLocal = (key: string, token: string) => localStorage.setItem(key, token);
export const saveTokenSession = (key: string, token: string) => sessionStorage.setItem(key, token);

export const retrieveTokenLocal = (key: string) => localStorage.getItem(key)
export const retrieveTokenSession = (key: string) => sessionStorage.getItem(key)

// Salva o token (login)
export const login = (token: string) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
};

// Remove o token (logout)
export const logout = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);

  sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  sessionStorage.removeItem(REFRESH_TOKEN_KEY);
};
// src/contexts/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext, type ReactNode } from "react";
import { TOKEN_KEY } from "../services/auth";
type User = {
    name: string
}
type AuthContextProps = {
    isAuthenticated: boolean, 
    user: User | null,
    loading: boolean, 
    login: (email: string, password: string) => Promise<void>, 
    logout: () => void
}
const AuthContext = createContext<AuthContextProps | null>(null);



export const AuthProvider = ({ children }: {children: ReactNode}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Verifica se há token no localStorage quando a aplicação carrega
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      // Aqui você poderia validar o token com a API e obter os dados reais do usuário
      setUser({ name: "Diego" }); // usuário mockado para exemplo
    }
    setLoading(false);
  }, []);

  // Função de login
  const login = async (email: string, password: string) => {
    // Em produção: faça uma chamada à API de login e receba { token, user }
    const token = "jwt-token-de-exemplo";
    const loggedUser = { name: "Diego", email };

    localStorage.setItem(TOKEN_KEY, token);
    setUser(loggedUser);
  };

  // Função de logout
  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!user, user, loading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook para acessar facilmente o contexto
export const useAuth = () => useContext(AuthContext);
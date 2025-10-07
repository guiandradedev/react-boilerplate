import api from '@/lib/axios'
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from '@/services/auth'
import type { ResponseAdapter } from '@/types/api'
import type { UserAuthenticateResponse } from '@/types/auth'
import axios, { type AxiosResponse } from 'axios'
import React, { createContext, useContext, useState, useEffect } from 'react'

export type TypeUserRoles = 'USER' | 'ADMIN'

export interface User {
  id?: string,
  name: string,
  email: string,
  password?: string,
  role: TypeUserRoles,
  account_activate_at: Date | null,
  createdAt: Date,
  updatedAt: Date,
}

export interface AuthContextProps {
  isAuthenticated: boolean
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void;
  googleAuth: (token: string) => Promise<void>
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined)


export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Restore auth state on app load
  useEffect(() => {
    async function getUser() {
      const token = localStorage.getItem(ACCESS_TOKEN_KEY)
      if (token) {
        setIsAuthenticated(true)
        setIsLoading(false)
        const user = await api.get('/user/me')
        console.log(user)
        // // Validate token with your API
        // fetch('/api/validate-token', {
        //   headers: { Authorization: `Bearer ${token}` },
        // })
        //   .then((response) => response.json())
        //   .then((userData) => {
        //     if (userData.valid) {
        //       setUser(userData.user)
        //       setIsAuthenticated(true)
        //     } else {
        //       localStorage.removeItem('auth-token')
        //     }
        //   })
        //   .catch(() => {
        //     localStorage.removeItem('auth-token')
        //   })
        //   .finally(() => {
        //     setIsLoading(false)
        //   })
      } else {
        setIsLoading(false)
      }
    }
    getUser()

  }, [])

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    )
  }

  function persistLogin(response: AxiosResponse<UserAuthenticateResponse>) {
    console.log(response.data.data.token.access_token)
    console.log('Login bem-sucedido!', response.data)

    setUser({
      id: response.data.data.id,
      ...response.data.data.attributes
    })
    setIsAuthenticated(true)
    console.log(response.data.data.token)
    localStorage.setItem(ACCESS_TOKEN_KEY, response.data.data.token.access_token)
    localStorage.setItem(REFRESH_TOKEN_KEY, response.data.data.token.refresh_token)

    console.log("deu")
  }

  const googleAuth = async (token: string) => {
    try {
      const response: AxiosResponse<UserAuthenticateResponse> = await api.post('/auth/social-login', {
        token: token,
        provider: 'Google',
      })
      persistLogin(response)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw error
      } else {
        console.error('Erro inesperado:', error)
      }
    }
  }
  const login = async (email: string, password: string) => {
    try {
      const response: AxiosResponse<UserAuthenticateResponse> = await api.post('/auth/login', {
        email: email,
        password: password
      })

      persistLogin(response)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw error
      } else {
        console.error('Erro inesperado:', error)
      }
    }
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem(ACCESS_TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, googleAuth }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

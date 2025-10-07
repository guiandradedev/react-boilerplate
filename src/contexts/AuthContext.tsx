import api from '@/lib/axios'
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, saveTokenLocal, logout as logoutService } from '@/services/auth'
import type { ResponseAdapter } from '@/types/api'
import type { UserAuthenticateResponse } from '@/types/auth'
import axios, { type AxiosResponse } from 'axios'
import React, { createContext, useContext, useState, useEffect } from 'react'
import { router } from '@/router'

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

type LoginProps = {
  email: string,
  password: string
}
export interface AuthContextProps {
  isAuthenticated: boolean
  user: User | null
  login: (data: LoginProps, remember: boolean) => Promise<void>
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
        try {
          const response: AxiosResponse<{ data: ResponseAdapter<User>}> = await api.get('/user/me')
          setUser({
            id: response.data.data.id,
            ...response.data.data.attributes
          })
        } catch (err) {
          logout()
        }
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

  function persistLogin(response: AxiosResponse<UserAuthenticateResponse>, remember: boolean) {
    const accessToken = response.data.data.token.access_token
    const refreshToken = response.data.data.token.refresh_token

    setUser({
      id: response.data.data.id,
      ...response.data.data.attributes
    })
    setIsAuthenticated(true)
    if (remember) {
      saveTokenLocal(ACCESS_TOKEN_KEY, accessToken)
      saveTokenLocal(REFRESH_TOKEN_KEY, refreshToken)
    } else {
      saveTokenLocal(ACCESS_TOKEN_KEY, accessToken)
    }
  }

  const googleAuth = async (token: string) => {
    try {
      const response: AxiosResponse<UserAuthenticateResponse> = await api.post('/auth/social-login', {
        token: token,
        provider: 'Google',
      })
      // Em autenticacao via google, considera que vai persistir
      persistLogin(response, true)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw error
      } else {
        console.error('Erro inesperado:', error)
      }
    }
  }
  const login = async ({ email, password }: LoginProps, remember: boolean) => {
    try {
      const response: AxiosResponse<UserAuthenticateResponse> = await api.post('/auth/login', {
        email: email,
        password: password
      })

      persistLogin(response, remember)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw error
      } else {
        console.error('Erro inesperado:', error)
      }
    }
  }

  function logout(){
    setUser(null)
    setIsAuthenticated(false)

    logoutService()

    try {
      router.navigate({ to: "/" })
    } catch(err) {
      console.log("Falha ao navegar", err)
    }
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

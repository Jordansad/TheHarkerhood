import { createContext, useEffect, useState, type ReactNode } from 'react'
import { api, setAuthToken, clearAuthToken } from './api-client'
import type { AuthResponseDTO, UserDTO } from '@hackerhood/types'

export interface AuthContextValue {
  user: UserDTO | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, displayName: string) => Promise<void>
  logout: () => Promise<void>
  refresh: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserDTO | null>(null)
  const [loading, setLoading] = useState(true)

  async function refresh() {
    try {
      const { user } = await api.get<AuthResponseDTO>('/api/auth/me')
      setUser(user)
    } catch {
      setUser(null)
    }
  }

  useEffect(() => {
    refresh().finally(() => setLoading(false))
  }, [])

  async function login(email: string, password: string) {
    const { user, token } = await api.post<AuthResponseDTO>('/api/auth/login', { email, password })
    setAuthToken(token)
    setUser(user)
  }

  async function register(email: string, password: string, displayName: string) {
    const { user, token } = await api.post<AuthResponseDTO>('/api/auth/register', { email, password, displayName })
    setAuthToken(token)
    setUser(user)
  }

  async function logout() {
    await api.post('/api/auth/logout')
    clearAuthToken()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  )
}

'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react'
import {
  getToken,
  setToken as saveToken,
  removeToken,
  getUserInfo,
  setUserInfo,
  removeUserInfo,
} from '@/lib/auth'
import { authApi } from '@/lib/api'
import type { UserInfo } from '@/lib/api/services/auth'

interface AuthContextType {
  user: UserInfo | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (token: string, user: UserInfo) => void
  logout: () => Promise<void>
  updateUser: (user: UserInfo) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // 初始化時檢查 token
  useEffect(() => {
    const token = getToken()
    if (token) {
      // Token 存在，從 cookie 讀取快取的 user info
      const cachedUser = getUserInfo()
      if (cachedUser) {
        setUser(cachedUser)
      } else {
        // 如果沒有 user info，清除 token
        removeToken()
      }
    }
    setIsLoading(false)
  }, [])

  const login = useCallback((token: string, userData: UserInfo) => {
    saveToken(token)
    setUserInfo(userData)
    setUser(userData)
  }, [])

  const logout = useCallback(async () => {
    try {
      // Call backend API to invalidate token (add to blacklist)
      await authApi.logout()
    } catch (error) {
      // Even if API call fails, we should still clear local state
      console.error('Logout API call failed:', error)
    } finally {
      // Always clear local storage and state
      removeToken()
      removeUserInfo()
      setUser(null)
    }
  }, [])

  const updateUser = useCallback((userData: UserInfo) => {
    setUserInfo(userData)
    setUser(userData)
  }, [])

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    updateUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

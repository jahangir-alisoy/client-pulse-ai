import { createContext, useCallback, useContext, useMemo, useSyncExternalStore, type ReactNode } from 'react'
import { authApi } from '../api/endpoints'
import { tokenStorage, usernameFromToken } from './tokenStorage'

type AuthContextValue = {
  username: string | null
  isAuthenticated: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const tokens = useSyncExternalStore(tokenStorage.subscribe, tokenStorage.get)

  const login = useCallback(async (username: string, password: string) => {
    tokenStorage.set(await authApi.login(username, password))
  }, [])

  const logout = useCallback(() => tokenStorage.clear(), [])

  const value = useMemo<AuthContextValue>(
    () => ({
      username: tokens ? usernameFromToken(tokens.accessToken) : null,
      isAuthenticated: tokens !== null,
      login,
      logout,
    }),
    [tokens, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }
  return context
}

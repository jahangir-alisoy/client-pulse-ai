import type { TokenResponse } from '../api/types'

const STORAGE_KEY = 'clientpulse.session'

type Listener = () => void

const listeners = new Set<Listener>()
let current: TokenResponse | null = read()

function read(): TokenResponse | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as TokenResponse) : null
  } catch {
    return null
  }
}

function write(tokens: TokenResponse | null) {
  current = tokens
  try {
    if (tokens) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tokens))
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  } catch {
    return
  } finally {
    listeners.forEach((listener) => listener())
  }
}

export const tokenStorage = {
  get: (): TokenResponse | null => current,
  set: (tokens: TokenResponse) => write(tokens),
  clear: () => write(null),
  subscribe(listener: Listener) {
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  },
}

export function usernameFromToken(token: string): string | null {
  try {
    const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    return (JSON.parse(atob(payload)) as { sub?: string }).sub ?? null
  } catch {
    return null
  }
}

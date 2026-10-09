import { tokenStorage } from '../auth/tokenStorage'
import type { TokenResponse } from './types'

const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL ?? '/api/v1'

export class ApiError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

type RequestOptions = {
  method?: 'GET' | 'POST'
  body?: unknown
  authenticated?: boolean
}

let pendingRefresh: Promise<boolean> | null = null

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const authenticated = options.authenticated ?? true
  const response = await send(path, options, authenticated)
  if (response.status === 401 && authenticated) {
    if (await refreshSession()) {
      return parse<T>(await send(path, options, authenticated))
    }
    tokenStorage.clear()
  }
  return parse<T>(response)
}

function send(path: string, options: RequestOptions, authenticated: boolean): Promise<Response> {
  const headers: Record<string, string> = { Accept: 'application/json' }
  if (options.body !== undefined) {
    headers['Content-Type'] = 'application/json'
  }
  const accessToken = tokenStorage.get()?.accessToken
  if (authenticated && accessToken) {
    headers.Authorization = `Bearer ${accessToken}`
  }
  return fetch(`${API_BASE_URL}${path}`, {
    method: options.method ?? 'GET',
    headers,
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  }).catch(() => {
    throw new ApiError(0, 'Cannot reach the server. Check that the backend is running.')
  })
}

async function parse<T>(response: Response): Promise<T> {
  if (response.ok) {
    return (response.status === 204 ? undefined : await response.json()) as T
  }
  throw new ApiError(response.status, await errorMessage(response))
}

async function errorMessage(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as { detail?: string; message?: string; error?: string }
    return body.detail ?? body.message ?? body.error ?? `Request failed (${response.status})`
  } catch {
    return `Request failed (${response.status})`
  }
}

function refreshSession(): Promise<boolean> {
  pendingRefresh ??= refreshTokens().finally(() => {
    pendingRefresh = null
  })
  return pendingRefresh
}

async function refreshTokens(): Promise<boolean> {
  const refreshToken = tokenStorage.get()?.refreshToken
  if (!refreshToken) {
    return false
  }
  try {
    const tokens = await apiRequest<TokenResponse>('/auth/refresh', {
      method: 'POST',
      body: { refreshToken },
      authenticated: false,
    })
    tokenStorage.set(tokens)
    return true
  } catch {
    return false
  }
}

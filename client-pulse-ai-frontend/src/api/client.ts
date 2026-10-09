import { tokenStorage } from '../auth/tokenStorage'
import type { TokenResponse } from './types'

const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL ?? '/api/v1'

export const API_KEY_UNAVAILABLE = 'API_KEY_UNAVAILABLE'

export class ApiError extends Error {
  readonly status: number
  readonly code?: string

  constructor(status: number, message: string, code?: string) {
    super(message)
    this.status = status
    this.code = code
  }
}

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
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

export function absoluteApiUrl(path: string): string {
  return new URL(`${API_BASE_URL}${path}`, window.location.origin).toString()
}

async function parse<T>(response: Response): Promise<T> {
  if (response.ok) {
    return (response.status === 204 ? undefined : await response.json()) as T
  }
  const problem = await readProblem(response)
  throw new ApiError(response.status, problem.message, problem.code)
}

type Problem = {
  message: string
  code?: string
}

async function readProblem(response: Response): Promise<Problem> {
  const fallback = `Request failed (${response.status})`
  try {
    const body = (await response.json()) as { detail?: string; message?: string; error?: string; code?: unknown }
    return {
      message: body.detail ?? body.message ?? body.error ?? fallback,
      code: typeof body.code === 'string' ? body.code : undefined,
    }
  } catch {
    return { message: fallback }
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

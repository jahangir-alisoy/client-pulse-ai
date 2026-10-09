import { apiRequest } from './client'
import type {
  Account,
  AnalysisQuery,
  AnalysisRequestDetail,
  AnalysisRequestSummary,
  AnalysisStatistics,
  ApiKey,
  CreatedApiKeyResponse,
  Customer,
  Page,
  SimulationChatRequest,
  SimulationChatResponse,
  SupportAgent,
  TokenResponse,
  VerificationSentResponse,
} from './types'

function toSearchParams(query: AnalysisQuery, extra: Record<string, string> = {}): string {
  const params = new URLSearchParams(extra)
  Object.entries(query).forEach(([key, value]) => {
    if (value) {
      params.set(key, value)
    }
  })
  return params.toString()
}

export const authApi = {
  login: (username: string, password: string) =>
    apiRequest<TokenResponse>('/auth/login', {
      method: 'POST',
      body: { username, password },
      authenticated: false,
    }),
}

export const simulationApi = {
  chat: (request: SimulationChatRequest) =>
    apiRequest<SimulationChatResponse>('/simulation/chat', { method: 'POST', body: request }),
}

export const directoryApi = {
  customers: () => apiRequest<Customer[]>('/customers'),
  supportAgents: () => apiRequest<SupportAgent[]>('/support-agents'),
}

export const analysisApi = {
  list: (page: number, size: number, query: AnalysisQuery = {}) =>
    apiRequest<Page<AnalysisRequestSummary>>(
      `/analysis-requests?${toSearchParams(query, { page: String(page), size: String(size), sort: 'createdAt,desc' })}`,
    ),
  get: (id: number) => apiRequest<AnalysisRequestDetail>(`/analysis-requests/${id}`),
  statistics: (query: AnalysisQuery = {}) =>
    apiRequest<AnalysisStatistics>(`/analysis-requests/statistics?${toSearchParams(query)}`),
}

export const apiKeysApi = {
  list: () => apiRequest<ApiKey[]>('/api-keys'),
  create: (name: string) => apiRequest<CreatedApiKeyResponse>('/api-keys', { method: 'POST', body: { name } }),
  rename: (id: number, name: string) => apiRequest<ApiKey>(`/api-keys/${id}`, { method: 'PUT', body: { name } }),
  rotate: (id: number) => apiRequest<CreatedApiKeyResponse>(`/api-keys/${id}/rotate`, { method: 'POST' }),
  remove: (id: number) => apiRequest<void>(`/api-keys/${id}`, { method: 'DELETE' }),
}

export const accountApi = {
  get: () => apiRequest<Account>('/account'),
  changeUsername: (newUsername: string, currentPassword: string) =>
    apiRequest<TokenResponse>('/account/username', { method: 'PUT', body: { newUsername, currentPassword } }),
  changePassword: (currentPassword: string, newPassword: string) =>
    apiRequest<void>('/account/password', { method: 'PUT', body: { currentPassword, newPassword } }),
  sendVerificationCode: (email: string) =>
    apiRequest<VerificationSentResponse>('/account/notification-email', { method: 'POST', body: { email } }),
  verifyNotificationEmail: (code: string) =>
    apiRequest<Account>('/account/notification-email/verify', { method: 'POST', body: { code } }),
  setNotificationsEnabled: (enabled: boolean) =>
    apiRequest<Account>('/account/notifications', { method: 'PUT', body: { enabled } }),
  removeNotificationEmail: () => apiRequest<Account>('/account/notification-email', { method: 'DELETE' }),
}

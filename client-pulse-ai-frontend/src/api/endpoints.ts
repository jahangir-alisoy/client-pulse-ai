import { apiRequest } from './client'
import type {
  AnalysisQuery,
  AnalysisRequestDetail,
  AnalysisRequestSummary,
  AnalysisStatistics,
  Customer,
  Page,
  SimulationChatRequest,
  SimulationChatResponse,
  SupportAgent,
  TokenResponse,
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

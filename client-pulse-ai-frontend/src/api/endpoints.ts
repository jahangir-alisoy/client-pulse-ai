import { apiRequest } from './client'
import type {
  AnalysisRequestDetail,
  AnalysisRequestSummary,
  AnalysisStatistics,
  Page,
  SimulationChatRequest,
  SimulationChatResponse,
  TokenResponse,
} from './types'

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

export const analysisApi = {
  list: (page: number, size: number) =>
    apiRequest<Page<AnalysisRequestSummary>>(`/analysis-requests?page=${page}&size=${size}&sort=createdAt,desc`),
  get: (id: number) => apiRequest<AnalysisRequestDetail>(`/analysis-requests/${id}`),
  statistics: () => apiRequest<AnalysisStatistics>('/analysis-requests/statistics'),
}

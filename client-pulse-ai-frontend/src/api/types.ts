export type ChatRole = 'USER' | 'ASSISTANT'

export type AnalysisStatus = 'PENDING' | 'COMPLETED' | 'FAILED'

export type Channel = 'CHAT' | 'PHONE' | 'EMAIL'

export type Customer = {
  id: number
  customerNumber: string
  fullName: string
  email: string | null
  phone: string | null
}

export type SupportAgent = {
  id: number
  employeeNumber: string
  fullName: string
  team: string | null
}

export type AnalysisQuery = {
  from?: string
  to?: string
  channel?: Channel
}

export type ChatMessage = {
  role: ChatRole
  content: string
}

export type TokenResponse = {
  accessToken: string
  refreshToken: string
}

export type SimulationChatRequest = {
  sessionId: string
  channel: Channel
  customerId: number
  supportAgentId: number
  message: string
  history: ChatMessage[]
}

export type SimulationChatResponse = {
  reply: string
}

export type AnalysisRequestSummary = {
  id: number
  sessionId: string
  channel: Channel
  customer: Customer | null
  supportAgent: SupportAgent | null
  status: AnalysisStatus
  score: number | null
  description: string | null
  failureReason: string | null
  createdAt: string
  analyzedAt: string | null
}

export type AnalysisRequestDetail = AnalysisRequestSummary & {
  messages: ChatMessage[]
}

export type PageMetadata = {
  size: number
  number: number
  totalElements: number
  totalPages: number
}

export type Page<T> = {
  content: T[]
  page: PageMetadata
}

export type DailyStatistics = {
  date: string
  requestCount: number
  averageScore: number | null
}

export type ScoreRangeStatistics = {
  from: number
  to: number
  count: number
}

export type ChannelStatistics = {
  channel: Channel
  requestCount: number
  averageScore: number | null
}

export type AnalysisStatistics = {
  totalRequests: number
  pendingRequests: number
  completedRequests: number
  failedRequests: number
  averageScore: number | null
  dailyStatistics: DailyStatistics[]
  channelStatistics: ChannelStatistics[]
  scoreDistribution: ScoreRangeStatistics[]
}

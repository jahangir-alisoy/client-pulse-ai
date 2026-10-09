import { useEffect, useState } from 'react'
import { analysisApi, apiKeysApi, directoryApi, simulationApi } from '../../api/endpoints'
import { ApiError } from '../../api/client'
import { Alert } from '../../components/Alert'
import { ButtonLink } from '../../components/Button'
import { useToast } from '../../components/Toast'
import { Card } from '../../components/Card'
import { CHANNEL_LABELS } from '../../components/ChannelBadge'
import { ErrorNotice } from '../../components/Notice'
import { PageHeader } from '../../components/PageHeader'
import { usePolling } from '../../lib/usePolling'
import { useResource } from '../../lib/useResource'
import { Composer } from './Composer'
import { Conversation } from './Conversation'
import { SessionPanel } from './SessionPanel'
import { SessionSetupPanel } from './SessionSetupPanel'
import { useSimulationSession } from './useSimulationSession'
import styles from './Simulation.module.css'

const RECENT_REQUESTS = 50

export function SimulationPage() {
  const { session, appendTurn, removeLastTurn, updateSetup, startNewSession } = useSimulationSession()
  const directory = useResource(() => Promise.all([directoryApi.customers(), directoryApi.supportAgents()]), [])
  const [customers, supportAgents] = directory.data ?? [[], []]
  const { setup } = session
  const customer = customers.find((entry) => entry.id === setup.customerId)
  const supportAgent = supportAgents.find((entry) => entry.id === setup.supportAgentId)
  const apiKeys = useResource(() => apiKeysApi.list(), [])
  const availableKeys = apiKeys.data ?? []
  const apiKey = availableKeys.find((entry) => entry.id === setup.apiKeyId)
  const paused = apiKeys.data !== undefined && availableKeys.length === 0
  const { show } = useToast()

  useEffect(() => {
    if (!apiKey && availableKeys.length > 0) {
      updateSetup({ apiKeyId: availableKeys[0].id })
    }
  }, [apiKey, availableKeys])

  useEffect(() => {
    if (!customer && customers.length > 0) {
      updateSetup({ customerId: customers[0].id })
    }
    if (!supportAgent && supportAgents.length > 0) {
      updateSetup({ supportAgentId: supportAgents[0].id })
    }
  }, [customer, supportAgent, customers, supportAgents])
  const [draft, setDraft] = useState('')
  const [replying, setReplying] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const analysis = useResource(() => analysisApi.list(0, RECENT_REQUESTS), [session.sessionId])
  const sessionRequests = (analysis.data?.content ?? []).filter((request) => request.sessionId === session.sessionId)
  const replies = session.turns.filter((turn) => turn.role === 'ASSISTANT').length
  const awaitingScores = sessionRequests.length < replies || sessionRequests.some((request) => request.status === 'PENDING')
  usePolling(analysis.refresh, 2000, awaitingScores)

  const send = async () => {
    const message = draft.trim()
    if (message === '' || replying || !customer || !supportAgent || !apiKey) {
      return
    }
    const history = session.turns.map(({ role, content }) => ({ role, content }))
    appendTurn({ role: 'USER', content: message, sentAt: new Date().toISOString() })
    setDraft('')
    setError(null)
    setReplying(true)
    try {
      const { reply } = await simulationApi.chat({
        sessionId: session.sessionId,
        channel: setup.channel,
        customerId: customer.id,
        supportAgentId: supportAgent.id,
        apiKeyId: apiKey.id,
        message,
        history,
      })
      appendTurn({ role: 'ASSISTANT', content: reply, sentAt: new Date().toISOString() })
    } catch (exception) {
      removeLastTurn()
      setDraft(message)
      if (exception instanceof ApiError && exception.code === 'API_KEY_UNAVAILABLE') {
        show({ tone: 'error', title: 'API key was deleted', description: 'Select another API key or create a new one to continue.' })
        void apiKeys.reload()
      } else {
        setError(exception instanceof Error ? exception.message : 'The message could not be sent.')
      }
    } finally {
      setReplying(false)
    }
  }

  const newSession = () => {
    startNewSession()
    setDraft('')
    setError(null)
  }

  const setupSummary = [CHANNEL_LABELS[setup.channel], customer?.fullName, supportAgent?.fullName].filter(Boolean).join(' · ')

  return (
    <div className={styles.page}>
      <PageHeader
        title="Simulation"
        description="Pick a channel, customer and support assistant, then chat as the customer. Each turn is also sent to Client Pulse AI, which scores it in the background."
      />
      {paused && (
        <Alert
          tone="warning"
          title="Simulation is paused"
          className={styles.pausedAlert}
          action={
            <ButtonLink to="/api-keys" variant="primary" size="small">
              Create API key
            </ButtonLink>
          }
        >
          There is no API key for your account. Client Pulse AI needs an active key to receive conversations.
        </Alert>
      )}
      <div className={styles.layout}>
        <Card className={styles.chat}>
          <Conversation
            customerName={customer?.fullName ?? 'Client'}
            assistantName={supportAgent?.fullName ?? 'Assistant'}
            turns={session.turns}
            replying={replying}
          />
          {directory.error && <ErrorNotice message={directory.error} className={styles.error} />}
          {error && <ErrorNotice message={error} className={styles.error} />}
          <Composer value={draft} disabled={replying || !customer || !supportAgent || !apiKey} onChange={setDraft} onSubmit={() => void send()} />
        </Card>
        <SessionPanel
          setup={
            <SessionSetupPanel
              setup={setup}
              customers={customers}
              supportAgents={supportAgents}
              apiKeys={availableKeys}
              locked={session.turns.length > 0}
              onChange={updateSetup}
            />
          }
          sessionId={session.sessionId}
          turnCount={session.turns.length}
          requests={sessionRequests}
          onNewSession={newSession}
          summary={setupSummary}
        />
      </div>
    </div>
  )
}

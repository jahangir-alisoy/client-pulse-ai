import { useEffect, useState } from 'react'
import { analysisApi, directoryApi, simulationApi } from '../../api/endpoints'
import { Card } from '../../components/Card'
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
    if (message === '' || replying || !customer || !supportAgent) {
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
        message,
        history,
      })
      appendTurn({ role: 'ASSISTANT', content: reply, sentAt: new Date().toISOString() })
    } catch (exception) {
      removeLastTurn()
      setDraft(message)
      setError(exception instanceof Error ? exception.message : 'The message could not be sent.')
    } finally {
      setReplying(false)
    }
  }

  const newSession = () => {
    startNewSession()
    setDraft('')
    setError(null)
  }

  return (
    <>
      <PageHeader
        title="Simulation"
        description="Pick a channel, customer and support assistant, then chat as the customer. Each turn is also sent to Client Pulse, which scores it in the background."
      />
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
          <Composer value={draft} disabled={replying || !customer || !supportAgent} onChange={setDraft} onSubmit={() => void send()} />
        </Card>
        <SessionPanel
          setup={
            <SessionSetupPanel
              setup={setup}
              customers={customers}
              supportAgents={supportAgents}
              locked={session.turns.length > 0}
              onChange={updateSetup}
            />
          }
          sessionId={session.sessionId}
          turnCount={session.turns.length}
          requests={sessionRequests}
          onNewSession={newSession}
        />
      </div>
    </>
  )
}

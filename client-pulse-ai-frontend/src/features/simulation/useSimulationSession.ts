import { useEffect, useState } from 'react'
import type { Channel, ChatMessage } from '../../api/types'
import { createUuid } from '../../lib/uuid'

const STORAGE_KEY = 'clientpulse.simulation'

export type Turn = ChatMessage & { sentAt: string }

export type SessionSetup = {
  channel: Channel
  customerId: number | null
  supportAgentId: number | null
}

export type SimulationSession = {
  sessionId: string
  setup: SessionSetup
  turns: Turn[]
}

const DEFAULT_SETUP: SessionSetup = { channel: 'CHAT', customerId: null, supportAgentId: null }

function createSession(setup: SessionSetup = DEFAULT_SETUP): SimulationSession {
  return { sessionId: createUuid(), setup, turns: [] }
}

function readSession(): SimulationSession {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return createSession()
    }
    const stored = JSON.parse(raw) as Partial<SimulationSession>
    return { ...createSession(), ...stored, setup: { ...DEFAULT_SETUP, ...stored.setup } }
  } catch {
    return createSession()
  }
}

export function useSimulationSession() {
  const [session, setSession] = useState<SimulationSession>(readSession)

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session))
    } catch {
      return
    }
  }, [session])

  const appendTurn = (turn: Turn) => setSession((current) => ({ ...current, turns: [...current.turns, turn] }))
  const removeLastTurn = () => setSession((current) => ({ ...current, turns: current.turns.slice(0, -1) }))
  const updateSetup = (update: Partial<SessionSetup>) =>
    setSession((current) => ({ ...current, setup: { ...current.setup, ...update } }))
  const startNewSession = () => setSession((current) => createSession(current.setup))

  return { session, appendTurn, removeLastTurn, updateSetup, startNewSession }
}

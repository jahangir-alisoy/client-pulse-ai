import { useEffect, useState } from 'react'
import type { ChatMessage } from '../../api/types'
import { createUuid } from '../../lib/uuid'

const STORAGE_KEY = 'clientpulse.simulation'

export type Turn = ChatMessage & { sentAt: string }

export type SimulationSession = {
  sessionId: string
  turns: Turn[]
}

function createSession(): SimulationSession {
  return { sessionId: createUuid(), turns: [] }
}

function readSession(): SimulationSession {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as SimulationSession) : createSession()
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
  const startNewSession = () => setSession(createSession())

  return { session, appendTurn, removeLastTurn, startNewSession }
}

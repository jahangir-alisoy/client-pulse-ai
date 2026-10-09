import { MessagesSquare } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { formatTime } from '../../lib/format'
import type { Turn } from './useSimulationSession'
import styles from './Simulation.module.css'

type ConversationProps = {
  customerName: string
  assistantName: string
  turns: Turn[]
  replying: boolean
}

export function Conversation({ customerName, assistantName, turns, replying }: ConversationProps) {
  const container = useRef<HTMLDivElement>(null)

  useEffect(() => {
    container.current?.scrollTo({ top: container.current.scrollHeight })
  }, [turns.length, replying])

  return (
    <div ref={container} className={styles.messages} aria-live="polite">
      {turns.length === 0 && !replying ? (
        <div className={styles.intro}>
          <span className={styles.introIcon} aria-hidden="true">
            <MessagesSquare size={20} strokeWidth={1.75} />
          </span>
          <h2 className={styles.introTitle}>Simulate a client conversation</h2>
          <p className={styles.introText}>
            Write as a client would. The assistant answers right away, and each turn is sent to Client Pulse AI to be scored in the background.
          </p>
        </div>
      ) : (
        <>
          {turns.map((turn, index) => (
            <div key={index} className={`${styles.turn} ${turn.role === 'USER' ? styles.turnUser : ''}`}>
              <span className={styles.turnMeta}>
                {turn.role === 'USER' ? customerName : assistantName} · {formatTime(turn.sentAt)}
              </span>
              <div className={styles.bubble}>{turn.content}</div>
            </div>
          ))}
          {replying && (
            <div className={styles.turn}>
              <span className={styles.turnMeta}>{assistantName}</span>
              <span className={styles.replying} aria-label="Assistant is replying">
                <span />
                <span />
                <span />
              </span>
            </div>
          )}
        </>
      )}
    </div>
  )
}

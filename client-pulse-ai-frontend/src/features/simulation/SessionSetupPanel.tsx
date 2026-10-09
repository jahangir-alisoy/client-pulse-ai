import type { Channel, Customer, SupportAgent } from '../../api/types'
import { CHANNEL_LABELS, CHANNELS } from '../../components/ChannelBadge'
import type { SessionSetup } from './useSimulationSession'
import styles from './Simulation.module.css'

type SessionSetupPanelProps = {
  setup: SessionSetup
  customers: Customer[]
  supportAgents: SupportAgent[]
  locked: boolean
  onChange: (update: Partial<SessionSetup>) => void
}

export function SessionSetupPanel({ setup, customers, supportAgents, locked, onChange }: SessionSetupPanelProps) {
  return (
    <div className={styles.setup}>
      <label className={styles.setupField}>
        <span>Channel</span>
        <select
          className={styles.select}
          disabled={locked}
          value={setup.channel}
          onChange={(event) => onChange({ channel: event.target.value as Channel })}
        >
          {CHANNELS.map((channel) => (
            <option key={channel} value={channel}>
              {CHANNEL_LABELS[channel]}
            </option>
          ))}
        </select>
      </label>
      <label className={styles.setupField}>
        <span>Customer</span>
        <select
          className={styles.select}
          disabled={locked}
          value={setup.customerId ?? ''}
          onChange={(event) => onChange({ customerId: Number(event.target.value) })}
        >
          {customers.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.fullName} · {customer.customerNumber}
            </option>
          ))}
        </select>
      </label>
      <label className={styles.setupField}>
        <span>Support assistant</span>
        <select
          className={styles.select}
          disabled={locked}
          value={setup.supportAgentId ?? ''}
          onChange={(event) => onChange({ supportAgentId: Number(event.target.value) })}
        >
          {supportAgents.map((agent) => (
            <option key={agent.id} value={agent.id}>
              {agent.fullName} · {agent.team}
            </option>
          ))}
        </select>
      </label>
      {locked && <p className={styles.setupHint}>Start a new session to change these.</p>}
    </div>
  )
}

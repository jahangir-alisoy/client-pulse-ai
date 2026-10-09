import type { ApiKey, Channel, Customer, SupportAgent } from '../../api/types'
import { CHANNEL_LABELS, CHANNELS } from '../../components/ChannelBadge'
import { Field, Select } from '../../components/Field'
import type { SessionSetup } from './useSimulationSession'
import styles from './Simulation.module.css'

type SessionSetupPanelProps = {
  setup: SessionSetup
  customers: Customer[]
  supportAgents: SupportAgent[]
  apiKeys: ApiKey[]
  locked: boolean
  onChange: (update: Partial<SessionSetup>) => void
}

export function SessionSetupPanel({ setup, customers, supportAgents, apiKeys, locked, onChange }: SessionSetupPanelProps) {
  return (
    <div className={styles.setup}>
      <Field label="Channel">
        <Select disabled={locked} value={setup.channel} onChange={(event) => onChange({ channel: event.target.value as Channel })}>
          {CHANNELS.map((channel) => (
            <option key={channel} value={channel}>
              {CHANNEL_LABELS[channel]}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Customer">
        <Select
          disabled={locked}
          value={setup.customerId ?? ''}
          onChange={(event) => onChange({ customerId: Number(event.target.value) })}
        >
          {customers.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.fullName} · {customer.customerNumber}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Support assistant">
        <Select
          disabled={locked}
          value={setup.supportAgentId ?? ''}
          onChange={(event) => onChange({ supportAgentId: Number(event.target.value) })}
        >
          {supportAgents.map((agent) => (
            <option key={agent.id} value={agent.id}>
              {agent.fullName} · {agent.team}
            </option>
          ))}
        </Select>
      </Field>
      {locked && <p className={styles.setupHint}>Start a new session to change these.</p>}
      <Field label="API key" hint={apiKeys.length === 0 ? 'No API key available.' : undefined}>
        <Select
          disabled={apiKeys.length === 0}
          value={setup.apiKeyId ?? ''}
          onChange={(event) => onChange({ apiKeyId: Number(event.target.value) })}
        >
          {apiKeys.map((apiKey) => (
            <option key={apiKey.id} value={apiKey.id}>
              {apiKey.name} · {apiKey.maskedKey}
            </option>
          ))}
        </Select>
      </Field>
    </div>
  )
}

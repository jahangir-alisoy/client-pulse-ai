import type { Customer, SupportAgent } from '../api/types'
import { PersonInfo } from './PersonInfo'

export function CustomerInfo({ customer }: { customer: Customer | null }) {
  return (
    <PersonInfo
      name={customer?.fullName}
      kind="Customer"
      details={[
        ['Customer no.', customer?.customerNumber],
        ['Email', customer?.email],
        ['Phone', customer?.phone],
      ]}
    />
  )
}

export function SupportAgentInfo({ supportAgent }: { supportAgent: SupportAgent | null }) {
  return (
    <PersonInfo
      name={supportAgent?.fullName}
      kind="Support assistant"
      details={[
        ['Employee no.', supportAgent?.employeeNumber],
        ['Team', supportAgent?.team],
      ]}
    />
  )
}

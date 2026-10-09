import { absoluteApiUrl } from '../../api/client'
import { Card } from '../../components/Card'
import { CopyButton } from '../../components/CopyButton'
import styles from './ApiKeys.module.css'

const INGEST_PATH = '/ingest/conversations'

function exampleRequest(endpoint: string): string {
  return [
    `curl -X POST ${endpoint} \\`,
    '  -H "Content-Type: application/json" \\',
    '  -H "X-API-Key: $CLIENT_PULSE_API_KEY" \\',
    "  -d '{",
    '    "channel": "CHAT",',
    '    "messages": [',
    '      { "role": "USER", "content": "My order has not arrived yet." },',
    '      { "role": "ASSISTANT", "content": "Sorry about that. Let me check it for you." }',
    '    ]',
    "  }'",
  ].join('\n')
}

export function IntegrationGuide() {
  const endpoint = absoluteApiUrl(INGEST_PATH)
  const example = exampleRequest(endpoint)

  return (
    <Card className={styles.guide}>
      <div className={styles.cardHeader}>
        <div className={styles.cardHeading}>
          <h2 className={styles.cardTitle}>Send conversations from your systems</h2>
          <p className={styles.cardDescription}>
            Call this endpoint from your CRM or help desk. Each conversation is scored in the background and appears under Requests.
          </p>
        </div>
      </div>
      <div className={styles.guideBody}>
        <div className={styles.endpoint}>
          <span className={styles.method}>POST</span>
          <code className={styles.endpointUrl} translate="no">
            {endpoint}
          </code>
          <CopyButton value={endpoint} label="Copy" accessibleLabel="Copy endpoint URL" variant="ghost" />
        </div>
        <dl className={styles.facts}>
          <div className={styles.fact}>
            <dt>Header</dt>
            <dd>
              <code translate="no">X-API-Key: &lt;your key&gt;</code>
            </dd>
          </div>
          <div className={styles.fact}>
            <dt>Required</dt>
            <dd>
              <code>channel</code> and 1–200 <code>messages</code>
            </dd>
          </div>
          <div className={styles.fact}>
            <dt>Optional</dt>
            <dd>
              <code>sessionId</code>, <code>customerId</code>, <code>supportAgentId</code>
            </dd>
          </div>
          <div className={styles.fact}>
            <dt>Response</dt>
            <dd>
              <code>202 Accepted</code> with the session ID
            </dd>
          </div>
        </dl>
        <div className={styles.code}>
          <div className={styles.codeHeader}>
            <span>Example request</span>
            <CopyButton value={example} accessibleLabel="Copy example request" variant="ghost" />
          </div>
          <pre className={styles.codeBody} tabIndex={0} aria-label="Example request">
            <code translate="no">{example}</code>
          </pre>
        </div>
      </div>
    </Card>
  )
}

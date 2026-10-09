import { Plus } from 'lucide-react'
import { useState } from 'react'
import { apiKeysApi } from '../../api/endpoints'
import type { ApiKey, CreatedApiKeyResponse } from '../../api/types'
import { Alert } from '../../components/Alert'
import { Button } from '../../components/Button'
import { ConfirmDialog } from '../../components/ConfirmDialog'
import { PageHeader } from '../../components/PageHeader'
import { useToast } from '../../components/Toast'
import { useResource } from '../../lib/useResource'
import { ApiKeyList } from './ApiKeyList'
import { ApiKeyNameModal } from './ApiKeyNameModal'
import { IntegrationGuide } from './IntegrationGuide'
import { KeySecurityCard } from './KeySecurityCard'
import { SecretKeyModal } from './SecretKeyModal'
import styles from './ApiKeys.module.css'

const MAX_API_KEYS = 5

type Dialog =
  | { kind: 'create' }
  | { kind: 'rename'; apiKey: ApiKey }
  | { kind: 'rotate'; apiKey: ApiKey }
  | { kind: 'delete'; apiKey: ApiKey }

type IssuedSecret = CreatedApiKeyResponse & {
  reason: 'created' | 'rotated'
}

export function ApiKeysPage() {
  const keys = useResource(() => apiKeysApi.list(), [])
  const toast = useToast()
  const [dialog, setDialog] = useState<Dialog | null>(null)
  const [busy, setBusy] = useState(false)
  const [issued, setIssued] = useState<IssuedSecret | null>(null)
  const apiKeys = keys.data ?? []
  const loaded = keys.data !== undefined
  const atLimit = apiKeys.length >= MAX_API_KEYS

  const perform = async <T,>(action: () => Promise<T>, onSuccess: (result: T) => void, failureTitle: string) => {
    setBusy(true)
    try {
      const result = await action()
      setDialog(null)
      onSuccess(result)
    } catch (exception) {
      toast.show({ tone: 'error', title: failureTitle, description: messageOf(exception) })
    } finally {
      setBusy(false)
      void keys.refresh()
    }
  }

  const create = (name: string) =>
    perform(
      () => apiKeysApi.create(name),
      (result) => {
        setIssued({ ...result, reason: 'created' })
        toast.show({ tone: 'success', title: 'API key created', description: 'Copy the secret now. It is shown only once.' })
      },
      'Could not create the API key',
    )

  const rename = (apiKey: ApiKey, name: string) =>
    perform(
      () => apiKeysApi.rename(apiKey.id, name),
      (result) => toast.show({ tone: 'success', title: 'API key renamed', description: `It is now called “${result.name}”.` }),
      'Could not rename the API key',
    )

  const rotate = (apiKey: ApiKey) =>
    perform(
      () => apiKeysApi.rotate(apiKey.id),
      (result) => {
        setIssued({ ...result, reason: 'rotated' })
        toast.show({ tone: 'success', title: 'API key rotated', description: 'The previous secret no longer works.' })
      },
      'Could not rotate the API key',
    )

  const remove = (apiKey: ApiKey) => {
    const lastKey = apiKeys.length <= 1
    return perform(
      () => apiKeysApi.remove(apiKey.id),
      () =>
        toast.show(
          lastKey
            ? { tone: 'warning', title: 'API key deleted', description: 'Simulation is paused until you create a new key.' }
            : { tone: 'success', title: 'API key deleted', description: `“${apiKey.name}” no longer works.` },
        ),
      'Could not delete the API key',
    )
  }

  const closeDialog = () => {
    if (!busy) {
      setDialog(null)
    }
  }

  return (
    <>
      <PageHeader
        title="API keys"
        description="Customer companies send their conversations to Client Pulse AI with these keys. The simulation uses them too, so at least one key keeps it running."
        actions={
          <Button
            variant="primary"
            onClick={() => setDialog({ kind: 'create' })}
            disabled={!loaded || atLimit}
            title={atLimit ? `You can have at most ${MAX_API_KEYS} API keys` : undefined}
          >
            <Plus size={15} strokeWidth={2} aria-hidden="true" />
            Create key
          </Button>
        }
      />

      <div className={styles.stack}>
        {loaded && apiKeys.length === 0 && (
          <Alert
            tone="warning"
            title="Simulation is paused until you create an API key"
            action={
              <Button variant="primary" onClick={() => setDialog({ kind: 'create' })}>
                <Plus size={15} strokeWidth={2} aria-hidden="true" />
                Create key
              </Button>
            }
          >
            Client Pulse AI needs an active key to receive conversations from the simulation and from your systems.
          </Alert>
        )}

        {keys.error && !loaded ? (
          <Alert
            tone="error"
            title="Could not load your API keys"
            action={
              <Button onClick={() => void keys.reload()} disabled={keys.loading}>
                Try again
              </Button>
            }
          >
            {keys.error}
          </Alert>
        ) : (
          <ApiKeyList
            apiKeys={apiKeys}
            loading={!loaded}
            limit={MAX_API_KEYS}
            onRename={(apiKey) => setDialog({ kind: 'rename', apiKey })}
            onRotate={(apiKey) => setDialog({ kind: 'rotate', apiKey })}
            onDelete={(apiKey) => setDialog({ kind: 'delete', apiKey })}
          />
        )}

        <div className={styles.secondary}>
          <IntegrationGuide />
          <KeySecurityCard />
        </div>
      </div>

      {dialog?.kind === 'create' && (
        <ApiKeyNameModal
          title="Create API key"
          description="Give the key a name that tells you where it is used, for example the system that will send conversations."
          submitLabel="Create key"
          busy={busy}
          onSubmit={(name) => void create(name)}
          onClose={closeDialog}
        />
      )}

      {dialog?.kind === 'rename' && (
        <ApiKeyNameModal
          title="Rename API key"
          description="Only the name changes. The secret keeps working as before."
          submitLabel="Save name"
          initialName={dialog.apiKey.name}
          busy={busy}
          onSubmit={(name) => void rename(dialog.apiKey, name)}
          onClose={closeDialog}
        />
      )}

      <ConfirmDialog
        open={dialog?.kind === 'rotate'}
        title={dialog?.kind === 'rotate' ? `Rotate “${dialog.apiKey.name}”?` : 'Rotate API key?'}
        description="A new secret is created right away. The current secret stops working immediately, so update every integration that uses it."
        confirmLabel="Rotate key"
        busy={busy}
        onConfirm={() => dialog?.kind === 'rotate' && void rotate(dialog.apiKey)}
        onCancel={closeDialog}
      />

      <ConfirmDialog
        open={dialog?.kind === 'delete'}
        tone="danger"
        title={dialog?.kind === 'delete' ? `Delete “${dialog.apiKey.name}”?` : 'Delete API key?'}
        description={
          apiKeys.length <= 1
            ? 'Simulation and integrations using this key stop working. It is your only key, so the simulation pauses until you create a new one. This cannot be undone.'
            : 'Simulation and integrations using this key stop working. This cannot be undone.'
        }
        confirmLabel="Delete key"
        busy={busy}
        onConfirm={() => dialog?.kind === 'delete' && void remove(dialog.apiKey)}
        onCancel={closeDialog}
      />

      {issued && (
        <SecretKeyModal
          apiKey={issued.apiKey}
          secret={issued.secret}
          rotated={issued.reason === 'rotated'}
          onClose={() => setIssued(null)}
        />
      )}
    </>
  )
}

function messageOf(exception: unknown): string {
  return exception instanceof Error ? exception.message : 'Something went wrong. Try again.'
}

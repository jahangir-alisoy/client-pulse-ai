import { useId, useState, type FormEvent } from 'react'
import { Button } from '../../components/Button'
import { Field, Input } from '../../components/Field'
import { Modal } from '../../components/Modal'
import { Spinner } from '../../components/Spinner'

const MAX_NAME_LENGTH = 60

type ApiKeyNameModalProps = {
  title: string
  description: string
  submitLabel: string
  initialName?: string
  busy: boolean
  onSubmit: (name: string) => void
  onClose: () => void
}

export function ApiKeyNameModal({ title, description, submitLabel, initialName = '', busy, onSubmit, onClose }: ApiKeyNameModalProps) {
  const formId = useId()
  const [name, setName] = useState(initialName)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmed = name.trim()
    if (trimmed === '') {
      setError('Enter a name for the key.')
      return
    }
    if (trimmed.length > MAX_NAME_LENGTH) {
      setError(`Use at most ${MAX_NAME_LENGTH} characters.`)
      return
    }
    setError(null)
    onSubmit(trimmed)
  }

  return (
    <Modal
      open
      title={title}
      description={description}
      onClose={onClose}
      size="small"
      footer={
        <>
          <Button onClick={onClose} disabled={busy}>
            Cancel
          </Button>
          <Button type="submit" form={formId} variant="primary" disabled={busy} aria-busy={busy}>
            {busy && <Spinner />}
            {submitLabel}
          </Button>
        </>
      }
    >
      <form id={formId} onSubmit={handleSubmit} noValidate>
        <Field label="Name" error={error} hint={error ? undefined : `Up to ${MAX_NAME_LENGTH} characters, for example “Production CRM”.`}>
          <Input
            name="apiKeyName"
            value={name}
            maxLength={MAX_NAME_LENGTH}
            autoComplete="off"
            placeholder="Production CRM"
            readOnly={busy}
            onChange={(event) => {
              setName(event.target.value)
              setError(null)
            }}
          />
        </Field>
      </form>
    </Modal>
  )
}

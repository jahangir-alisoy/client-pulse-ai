import { ArrowUp } from 'lucide-react'
import { useRef, type FormEvent, type KeyboardEvent } from 'react'
import { Button } from '../../components/Button'
import styles from './Simulation.module.css'

type ComposerProps = {
  value: string
  disabled: boolean
  onChange: (value: string) => void
  onSubmit: () => void
}

const MAX_HEIGHT = 160

export function Composer({ value, disabled, onChange, onSubmit }: ComposerProps) {
  const textarea = useRef<HTMLTextAreaElement>(null)

  const resize = () => {
    const element = textarea.current
    if (element) {
      element.style.height = 'auto'
      element.style.height = `${Math.min(element.scrollHeight, MAX_HEIGHT)}px`
    }
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSubmit()
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault()
      onSubmit()
    }
  }

  return (
    <div className={styles.composerArea}>
      <form className={styles.composer} onSubmit={handleSubmit}>
        <textarea
          ref={textarea}
          className={styles.textarea}
          rows={1}
          placeholder="Write a message as the client…"
          aria-label="Message"
          value={value}
          onChange={(event) => {
            onChange(event.target.value)
            resize()
          }}
          onKeyDown={handleKeyDown}
        />
        <Button type="submit" variant="primary" iconOnly disabled={disabled || value.trim() === ''} aria-label="Send message">
          <ArrowUp size={16} strokeWidth={2} />
        </Button>
      </form>
      <p className={styles.hint}>Enter to send · Shift + Enter for a new line</p>
    </div>
  )
}

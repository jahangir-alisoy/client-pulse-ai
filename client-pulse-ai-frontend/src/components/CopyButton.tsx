import { Check, Copy } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { copyToClipboard } from '../lib/clipboard'
import { Button } from './Button'
import { useToast } from './Toast'
import styles from './CopyButton.module.css'

type CopyButtonProps = {
  value: string
  label?: string
  accessibleLabel?: string
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'medium' | 'small'
  className?: string
}

const COPIED_DURATION_MS = 2000

export function CopyButton({ value, label = 'Copy', accessibleLabel, variant = 'secondary', size = 'small', className }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)
  const button = useRef<HTMLButtonElement>(null)
  const toast = useToast()

  useEffect(() => {
    if (!copied) {
      return
    }
    const timer = window.setTimeout(() => setCopied(false), COPIED_DURATION_MS)
    return () => window.clearTimeout(timer)
  }, [copied])

  const copy = async () => {
    const succeeded = await copyToClipboard(value)
    button.current?.focus()
    if (succeeded) {
      setCopied(true)
    } else {
      toast.show({ tone: 'error', title: 'Could not copy', description: 'Your browser blocked clipboard access. Select the text and copy it manually.' })
    }
  }

  return (
    <>
      <Button
        ref={button}
        variant={variant}
        size={size}
        className={`${styles.button} ${copied ? styles.copied : ''} ${className ?? ''}`}
        aria-label={accessibleLabel}
        onClick={() => void copy()}
      >
        {copied ? <Check size={14} strokeWidth={2} aria-hidden="true" /> : <Copy size={14} strokeWidth={1.75} aria-hidden="true" />}
        {copied ? 'Copied' : label}
      </Button>
      <span className="visually-hidden" aria-live="polite">
        {copied ? 'Copied to clipboard' : ''}
      </span>
    </>
  )
}

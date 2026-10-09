import { Info } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import styles from './PersonInfo.module.css'

type PersonInfoProps = {
  name: string | null | undefined
  kind: string
  details: [string, string | null | undefined][]
}

type Position = { top: number; left: number }

const POPOVER_WIDTH = 260

export function PersonInfo({ name, kind, details }: PersonInfoProps) {
  const [position, setPosition] = useState<Position | null>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  const popover = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!position) {
      return
    }
    const close = () => setPosition(null)
    const handlePointer = (event: MouseEvent) => {
      const target = event.target as Node
      if (!popover.current?.contains(target) && !trigger.current?.contains(target)) {
        close()
      }
    }
    const handleKey = (event: KeyboardEvent) => event.key === 'Escape' && close()
    document.addEventListener('mousedown', handlePointer)
    document.addEventListener('keydown', handleKey)
    window.addEventListener('scroll', close, true)
    window.addEventListener('resize', close)
    return () => {
      document.removeEventListener('mousedown', handlePointer)
      document.removeEventListener('keydown', handleKey)
      window.removeEventListener('scroll', close, true)
      window.removeEventListener('resize', close)
    }
  }, [position])

  if (!name) {
    return <span className={styles.empty}>—</span>
  }

  const toggle = () => {
    if (position || !trigger.current) {
      setPosition(null)
      return
    }
    const bounds = trigger.current.getBoundingClientRect()
    setPosition({
      top: bounds.bottom + 6,
      left: Math.max(8, Math.min(bounds.left - 8, window.innerWidth - POPOVER_WIDTH - 8)),
    })
  }

  return (
    <span className={styles.wrapper} onClick={(event) => event.stopPropagation()}>
      <span className={styles.name}>{name}</span>
      <button
        ref={trigger}
        type="button"
        className={`${styles.trigger} ${position ? styles.open : ''}`}
        aria-label={`${kind} details for ${name}`}
        aria-expanded={position !== null}
        onClick={toggle}
      >
        <Info size={14} strokeWidth={1.75} />
      </button>
      {position &&
        createPortal(
          <div
            ref={popover}
            className={styles.popover}
            style={{ top: position.top, left: position.left, width: POPOVER_WIDTH }}
            role="dialog"
            aria-label={`${kind} details`}
          >
            <div className={styles.title}>{name}</div>
            <div className={styles.kind}>{kind}</div>
            <dl className={styles.list}>
              {details.map(([label, value]) => (
                <div key={label} className={styles.row}>
                  <dt>{label}</dt>
                  <dd>{value || '—'}</dd>
                </div>
              ))}
            </dl>
          </div>,
          document.body,
        )}
    </span>
  )
}

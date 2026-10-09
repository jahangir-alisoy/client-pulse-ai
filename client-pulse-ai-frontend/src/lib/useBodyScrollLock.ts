import { useEffect } from 'react'

let activeLocks = 0
let previousOverflow = ''
let previousPaddingRight = ''

function lock() {
  activeLocks += 1
  if (activeLocks > 1) {
    return
  }
  const { style } = document.body
  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
  previousOverflow = style.overflow
  previousPaddingRight = style.paddingRight
  style.overflow = 'hidden'
  if (scrollbarWidth > 0) {
    style.paddingRight = `${scrollbarWidth}px`
  }
}

function unlock() {
  activeLocks = Math.max(0, activeLocks - 1)
  if (activeLocks > 0) {
    return
  }
  const { style } = document.body
  style.overflow = previousOverflow
  style.paddingRight = previousPaddingRight
}

export function useBodyScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) {
      return
    }
    lock()
    return unlock
  }, [active])
}

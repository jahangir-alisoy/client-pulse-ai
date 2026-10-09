import { useCallback, useEffect, useRef, useState, type DependencyList } from 'react'

type ResourceState<T> = {
  data?: T
  error?: string
  loading: boolean
}

export type Resource<T> = ResourceState<T> & {
  reload: () => Promise<void>
  refresh: () => Promise<void>
}

export function useResource<T>(load: () => Promise<T>, deps: DependencyList): Resource<T> {
  const [state, setState] = useState<ResourceState<T>>({ loading: true })
  const loadRef = useRef(load)
  const latestRequest = useRef(0)

  useEffect(() => {
    loadRef.current = load
  })

  const run = useCallback(async (showLoading: boolean) => {
    const request = ++latestRequest.current
    if (showLoading) {
      setState((current) => ({ ...current, loading: true }))
    }
    try {
      const data = await loadRef.current()
      if (request === latestRequest.current) {
        setState({ data, loading: false })
      }
    } catch (error) {
      if (request === latestRequest.current) {
        setState((current) => ({ ...current, error: toMessage(error), loading: false }))
      }
    }
  }, [])

  const reload = useCallback(() => run(true), [run])
  const refresh = useCallback(() => run(false), [run])

  useEffect(() => {
    void reload()
  }, deps)

  return { ...state, reload, refresh }
}

function toMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Something went wrong'
}

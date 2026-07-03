import { useCallback, useEffect, useState } from 'react'
import { api, ApiError } from './api-client'

export function useApiGet<T>(path: string | null) {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [version, setVersion] = useState(0)

  useEffect(() => {
    if (!path) return
    setError(null)
    api
      .get<T>(path)
      .then(setData)
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Impossible de contacter le serveur.'))
  }, [path, version])

  const retry = useCallback(() => setVersion((v) => v + 1), [])

  return { data, error, retry }
}

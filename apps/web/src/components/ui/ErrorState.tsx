import { AlertTriangle } from 'lucide-react'
import { Button } from './Button'

export function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 text-center">
      <AlertTriangle className="h-8 w-8 text-danger" />
      <p className="text-sm text-text-muted">{message}</p>
      <Button variant="secondary" onClick={onRetry}>Réessayer</Button>
    </div>
  )
}

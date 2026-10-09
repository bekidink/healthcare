import type { ErrorComponentProps } from '@tanstack/react-router'
import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'

/**
 * Default error boundary for every route (set on the root route's
 * `errorComponent`). A route can still override this with its own for a
 * more specific recovery UI — this is the floor, not the only option.
 */
export function RouteErrorBoundary({ error, reset }: ErrorComponentProps) {
  const message = error instanceof Error ? error.message : 'An unexpected error occurred.'

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 p-6 text-center">
      <AlertTriangle className="size-10 text-destructive" />
      <h1 className="text-lg font-semibold">Something went wrong</h1>
      <p className="max-w-md text-sm text-muted-foreground">{message}</p>
      <Button onClick={reset}>Try again</Button>
    </div>
  )
}

import { Link } from '@tanstack/react-router'
import { FileQuestion } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function RouteNotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 p-6 text-center">
      <FileQuestion className="size-10 text-muted-foreground" />
      <h1 className="text-lg font-semibold">Page not found</h1>
      <p className="max-w-md text-sm text-muted-foreground">
        The page you're looking for doesn't exist or may have moved.
      </p>
      <Button render={<Link to="/">Back to dashboard</Link>} />
    </div>
  )
}

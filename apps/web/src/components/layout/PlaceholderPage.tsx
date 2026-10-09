import type { LucideIcon } from 'lucide-react'

/**
 * Standard "this route exists and is wired into navigation, but the real
 * workflow isn't built yet" page — used by every module route that Phase 1
 * scaffolds but Phase 3+ actually implements. Never silently fake data
 * here; an honest placeholder beats a convincing-looking mock.
 */
export function PlaceholderPage({
  title,
  description,
  icon: Icon,
}: {
  title: string
  description: string
  icon: LucideIcon
}) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border p-10 text-center">
      <Icon className="size-8 text-muted-foreground" aria-hidden="true" />
      <h1 className="text-lg font-semibold">{title}</h1>
      <p className="max-w-md text-sm text-muted-foreground">{description}</p>
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground/70">
        Not yet implemented
      </p>
    </div>
  )
}

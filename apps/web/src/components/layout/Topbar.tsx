import { Bell, Building2, Menu, Search, UserCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ThemeToggle'

/**
 * Facility selector, global search, notifications, and user menu are all
 * structural placeholders here — wired to real data starting Phase 2
 * (identity/facility context). They're disabled rather than faked, so
 * nothing here pretends to work before the backend integration exists.
 */
export function Topbar({ onMenuClick }: { onMenuClick?: () => void }) {
  return (
    <header className="flex h-14 items-center gap-3 border-b border-border bg-card px-4">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="md:hidden"
        aria-label="Open navigation menu"
        onClick={onMenuClick}
      >
        <Menu />
      </Button>

      <Button type="button" variant="outline" size="sm" disabled className="gap-2">
        <Building2 className="size-4" aria-hidden="true" />
        Select facility
      </Button>

      <div className="relative ml-2 hidden max-w-sm flex-1 md:block">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          disabled
          placeholder="Search patients, appointments…"
          aria-label="Global search"
          className="h-9 w-full rounded-md border border-input bg-background pl-8 pr-3 text-sm placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-60"
        />
      </div>

      <div className="ml-auto flex items-center gap-1">
        <ThemeToggle />
        <Button type="button" variant="ghost" size="icon" disabled aria-label="Notifications">
          <Bell />
        </Button>
        <Button type="button" variant="ghost" size="icon" disabled aria-label="User menu">
          <UserCircle />
        </Button>
      </div>
    </header>
  )
}

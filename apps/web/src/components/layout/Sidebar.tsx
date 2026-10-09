import { Link } from '@tanstack/react-router'
import { HeartPulse } from 'lucide-react'
import { PRIMARY_NAV } from '@/lib/navigation'
import { cn } from '@/lib/utils'

function SidebarContent() {
  return (
    <>
      <div className="flex h-14 items-center gap-2 border-b border-border px-4">
        <HeartPulse className="size-5 text-primary" aria-hidden="true" />
        <span className="font-semibold">Healthcare Platform</span>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {PRIMARY_NAV.map(({ label, to, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            activeOptions={{ exact: to === '/' }}
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
            activeProps={{
              className: cn('bg-secondary text-secondary-foreground'),
              'aria-current': 'page',
            }}
          >
            <Icon className="size-4 shrink-0" aria-hidden="true" />
            {label}
          </Link>
        ))}
      </nav>
    </>
  )
}

/** The permanent desktop sidebar — hidden below the md breakpoint, where AppShell's mobile drawer takes over. */
export function Sidebar() {
  return (
    <aside aria-label="Primary navigation" className="hidden w-64 shrink-0 flex-col border-r border-border bg-card md:flex">
      <SidebarContent />
    </aside>
  )
}

/** The same nav content, unconditionally visible — for AppShell's mobile drawer, which already controls its own visibility. */
export function MobileSidebarContent() {
  return (
    <div aria-label="Primary navigation" className="flex h-full flex-col">
      <SidebarContent />
    </div>
  )
}

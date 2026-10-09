import type { ReactNode } from 'react'
import { X } from 'lucide-react'
import { useUiStore } from '@/stores/ui-store'
import { Button } from '@/components/ui/button'
import { MobileSidebarContent, Sidebar } from './Sidebar'
import { Topbar } from './Topbar'

export function AppShell({ children }: { children: ReactNode }) {
  const mobileSidebarOpen = useUiStore((s) => s.mobileSidebarOpen)
  const setMobileSidebarOpen = useUiStore((s) => s.setMobileSidebarOpen)

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />

      {mobileSidebarOpen ? (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <button
            type="button"
            aria-label="Close navigation menu"
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="relative z-10 flex w-64 flex-col bg-card">
            <div className="absolute right-2 top-2">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Close navigation menu"
                onClick={() => setMobileSidebarOpen(false)}
              >
                <X />
              </Button>
            </div>
            <MobileSidebarContent />
          </div>
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onMenuClick={() => setMobileSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  )
}

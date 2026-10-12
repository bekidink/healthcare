import { Bell, Building2, LogOut, Menu, Search, UserCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ThemeToggle } from '@/components/ThemeToggle'
import { useAuthStore } from '@/stores/auth-store'
import { useFacilityStore } from '@/stores/facility-store'
import { useFacilitiesQuery } from '@/hooks/useFacilities'
import { useLogoutMutation } from '@/hooks/useAuth'

/**
 * Global search and notifications are still structural placeholders —
 * there's no backend endpoint for either yet (confirmed: no search or
 * notification routes in the gateway's route table). Facility selection and
 * the user menu are real as of Phase 2.
 */
export function Topbar({ onMenuClick }: { onMenuClick?: () => void }) {
  const user = useAuthStore((s) => s.user)
  const organizationId = useFacilityStore((s) => s.organizationId)
  const facilityId = useFacilityStore((s) => s.facilityId)
  const setFacility = useFacilityStore((s) => s.setFacility)
  const { data: facilities, isLoading: facilitiesLoading } = useFacilitiesQuery(organizationId)
  const logoutMutation = useLogoutMutation()

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

      <Select value={facilityId ?? undefined} onValueChange={(value) => setFacility(value as string)}>
        <SelectTrigger
          size="sm"
          disabled={!organizationId || facilitiesLoading}
          aria-label="Select facility"
        >
          <Building2 className="size-4" aria-hidden="true" />
          <SelectValue placeholder={organizationId ? 'Select facility' : 'No organization'} />
        </SelectTrigger>
        <SelectContent>
          {facilities?.map((facility) => (
            <SelectItem key={facility.id} value={facility.id}>
              {facility.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

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
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button type="button" variant="ghost" size="icon" aria-label="User menu">
                <UserCircle />
              </Button>
            }
          />
          <DropdownMenuContent align="end">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-medium">{user?.email ?? 'Signed in'}</span>
                {user?.memberships[0] ? (
                  <span className="text-xs text-muted-foreground">{user.memberships[0].role}</span>
                ) : null}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              disabled={logoutMutation.isPending}
              onClick={() => logoutMutation.mutate()}
            >
              <LogOut />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

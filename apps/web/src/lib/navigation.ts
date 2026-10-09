import type { LucideIcon } from 'lucide-react'
import {
  BarChart3,
  CalendarClock,
  FlaskConical,
  LayoutDashboard,
  ListOrdered,
  Package,
  Pill,
  Receipt,
  Settings,
  Shield,
  Stethoscope,
  Users,
} from 'lucide-react'

export interface NavItem {
  label: string
  to: string
  icon: LucideIcon
}

/**
 * The staff app's primary navigation — one entry per domain module from the
 * platform spec. Every route it points to exists (even where the page
 * itself is still a Phase 3+ placeholder) — this list is not aspirational.
 * Capability-driven visibility (hiding items the caller's role/facility
 * can't access) is a Phase 2 concern once real permissions are wired; for
 * now every item is always shown.
 */
export const PRIMARY_NAV: NavItem[] = [
  { label: 'Dashboard', to: '/', icon: LayoutDashboard },
  { label: 'Patients', to: '/patients', icon: Users },
  { label: 'Appointments', to: '/appointments', icon: CalendarClock },
  { label: 'Queue & Triage', to: '/queue', icon: ListOrdered },
  { label: 'Clinical', to: '/clinical', icon: Stethoscope },
  { label: 'Laboratory', to: '/lab', icon: FlaskConical },
  { label: 'Pharmacy', to: '/pharmacy', icon: Pill },
  { label: 'Billing', to: '/billing', icon: Receipt },
  { label: 'Insurance', to: '/insurance', icon: Shield },
  { label: 'Inventory', to: '/inventory', icon: Package },
  { label: 'Reports', to: '/reports', icon: BarChart3 },
  { label: 'Settings', to: '/settings', icon: Settings },
]

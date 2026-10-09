import { createFileRoute } from '@tanstack/react-router'
import { Settings } from 'lucide-react'
import { PlaceholderPage } from '@/components/layout/PlaceholderPage'

export const Route = createFileRoute('/_app/settings/')({
  component: () => (
    <PlaceholderPage
      title="Settings"
      description="Users, roles and memberships, facility configuration, and audit logs — built in Phase 2 (identity/permissions) and Phase 4 (facility config), against the Identity and Facility services."
      icon={Settings}
    />
  ),
})

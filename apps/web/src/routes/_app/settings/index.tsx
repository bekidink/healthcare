import { createFileRoute } from '@tanstack/react-router'
import { useId, type ReactNode } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Building2, Landmark, Loader2, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { useAuthStore } from '@/stores/auth-store'
import { useFacilityStore } from '@/stores/facility-store'
import { useCreateOrganizationMutation, useOrganizationQuery } from '@/hooks/useOrganizations'
import { useCreateFacilityMutation, useFacilitiesQuery } from '@/hooks/useFacilities'
import { ApiError } from '@/lib/api/client'
import type { Organization } from '@/lib/api/organizations'
import type { Facility } from '@/lib/api/facilities'

export const Route = createFileRoute('/_app/settings/')({
  component: SettingsPage,
})

const ORGANIZATION_TYPES: Organization['type'][] = [
  'hospital',
  'clinic',
  'pharmacy_chain',
  'diagnostic_center',
  'healthcare_network',
]
const FACILITY_TYPES: Facility['type'][] = ['hospital', 'clinic', 'pharmacy', 'diagnostic_center']

function SettingsPage() {
  const user = useAuthStore((s) => s.user)
  const organizationId = useFacilityStore((s) => s.organizationId)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Organization and facility setup is live here. Users, roles, and audit logs are still Phase 2/4 work.
        </p>
      </div>

      {organizationId ? <OrganizationOverview organizationId={organizationId} /> : <CreateOrganizationCard />}

      {!user?.isSuperAdmin ? (
        <p className="text-xs text-muted-foreground">
          Creating an organization or facility requires platform super-admin — this account{' '}
          {user?.isSuperAdmin === false ? 'does not have it' : "doesn't appear to"}. Server-side permission checks
          are the real gate; this is just a heads-up.
        </p>
      ) : null}
    </div>
  )
}

function CreateOrganizationCard() {
  const createMutation = useCreateOrganizationMutation()
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<{ legalName: string; displayName: string; type: Organization['type'] }>({
    resolver: zodResolver(
      z.object({
        legalName: z.string().min(2, 'Must be at least 2 characters'),
        displayName: z.string().min(2, 'Must be at least 2 characters'),
        type: z.enum(ORGANIZATION_TYPES as [Organization['type'], ...Organization['type'][]]),
      }),
    ),
    defaultValues: { type: 'hospital' },
  })

  const serverError =
    createMutation.error instanceof ApiError
      ? createMutation.error.message
      : createMutation.error
        ? 'Failed to create organization.'
        : null

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Landmark className="size-4" aria-hidden="true" />
          Create organization
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          No organization is set up for this account yet. Create one to start adding facilities.
        </p>
        <form
          className="grid gap-3 sm:grid-cols-2"
          onSubmit={handleSubmit((values) => createMutation.mutate(values))}
          noValidate
        >
          <Field label="Legal name" error={errors.legalName?.message}>
            {(a11y) => <Input {...register('legalName')} {...a11y} placeholder="Addis General Hospital PLC" />}
          </Field>
          <Field label="Display name" error={errors.displayName?.message}>
            {(a11y) => <Input {...register('displayName')} {...a11y} placeholder="Addis General Hospital" />}
          </Field>
          <Field label="Type" className="sm:col-span-2">
            {(a11y) => (
              <Select
                defaultValue="hospital"
                onValueChange={(value) => setValue('type', value as Organization['type'])}
              >
                <SelectTrigger id={a11y.id} className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ORGANIZATION_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.replace(/_/g, ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </Field>
          <Button type="submit" disabled={createMutation.isPending} className="sm:col-span-2">
            {createMutation.isPending ? <Loader2 className="animate-spin" aria-hidden="true" /> : <Plus />}
            Create organization
          </Button>
        </form>
        {serverError ? (
          <p role="alert" className="text-sm text-destructive">
            {serverError}
          </p>
        ) : null}
      </CardContent>
    </Card>
  )
}

function OrganizationOverview({ organizationId }: { organizationId: string }) {
  const { data: organization, isLoading } = useOrganizationQuery(organizationId)
  const { data: facilities } = useFacilitiesQuery(organizationId)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Landmark className="size-4" aria-hidden="true" />
            {isLoading ? 'Loading organization…' : (organization?.displayName ?? 'Organization')}
          </CardTitle>
        </CardHeader>
        {organization ? (
          <CardContent className="text-sm text-muted-foreground">
            {organization.legalName} <Badge variant="outline">{organization.type.replace(/_/g, ' ')}</Badge>
          </CardContent>
        ) : null}
      </Card>

      <CreateFacilityCard organizationId={organizationId} />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="size-4" aria-hidden="true" />
            Facilities
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!facilities || facilities.length === 0 ? (
            <p className="text-sm text-muted-foreground">No facilities yet.</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {facilities.map((facility) => (
                <li key={facility.id} className="flex items-center justify-between gap-3">
                  <span>{facility.name}</span>
                  <Badge variant="outline">{facility.type}</Badge>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function CreateFacilityCard({ organizationId }: { organizationId: string }) {
  const createMutation = useCreateFacilityMutation(organizationId)
  const setFacility = useFacilityStore((s) => s.setFacility)
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<{ name: string; type: Facility['type'] }>({
    resolver: zodResolver(
      z.object({
        name: z.string().min(2, 'Must be at least 2 characters'),
        type: z.enum(FACILITY_TYPES as [Facility['type'], ...Facility['type'][]]),
      }),
    ),
    defaultValues: { type: 'hospital' },
  })

  const serverError =
    createMutation.error instanceof ApiError
      ? createMutation.error.message
      : createMutation.error
        ? 'Failed to create facility.'
        : null

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="size-4" aria-hidden="true" />
          Add a facility
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form
          className="grid gap-3 sm:grid-cols-2"
          onSubmit={handleSubmit((values) =>
            createMutation.mutate(values, {
              onSuccess: (facility) => {
                setFacility(facility.id)
                reset()
              },
            }),
          )}
          noValidate
        >
          <Field label="Name" error={errors.name?.message}>
            {(a11y) => <Input {...register('name')} {...a11y} placeholder="Main Campus" />}
          </Field>
          <Field label="Type">
            {(a11y) => (
              <Select defaultValue="hospital" onValueChange={(value) => setValue('type', value as Facility['type'])}>
                <SelectTrigger id={a11y.id} className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FACILITY_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.replace(/_/g, ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </Field>
          <Button type="submit" disabled={createMutation.isPending} className="sm:col-span-2">
            {createMutation.isPending ? <Loader2 className="animate-spin" aria-hidden="true" /> : <Plus />}
            Add facility
          </Button>
        </form>
        {serverError ? (
          <p role="alert" className="text-sm text-destructive">
            {serverError}
          </p>
        ) : null}
      </CardContent>
    </Card>
  )
}

interface FieldControlProps {
  id: string
  'aria-describedby': string | undefined
  'aria-invalid': boolean
}

function Field({
  label,
  error,
  className,
  children,
}: {
  label: string
  error?: string
  className?: string
  children: (controlProps: FieldControlProps) => ReactNode
}) {
  const id = useId()
  const errorId = error ? `${id}-error` : undefined

  return (
    <div className={`space-y-1.5 ${className ?? ''}`}>
      <Label htmlFor={id}>{label}</Label>
      {children({ id, 'aria-describedby': errorId, 'aria-invalid': !!error })}
      {error ? (
        <p id={errorId} role="alert" className="text-xs text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  )
}

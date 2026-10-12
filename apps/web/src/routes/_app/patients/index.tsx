import { createFileRoute, Link } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { AlertTriangle, Loader2, Search, UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PatientCandidateCard } from '@/components/patients/PatientCandidateCard'
import { useCreatePatientMutation, useSearchPatientsMutation } from '@/hooks/usePatients'
import { ApiError } from '@/lib/api/client'

export const Route = createFileRoute('/_app/patients/')({
  component: PatientsPage,
})

const searchSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  nationalId: z.string().optional(),
  phone: z.string().optional(),
})
type SearchFormValues = z.infer<typeof searchSchema>

const registerSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  gender: z.string().optional(),
  nationalId: z.string().optional(),
  phone: z.string().optional(),
})
type RegisterFormValues = z.infer<typeof registerSchema>

function PatientsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Patients</h1>
        <p className="text-sm text-muted-foreground">
          Search the Master Patient Index before registering — this helps catch duplicates early.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <SearchPatientCard />
        <RegisterPatientCard />
      </div>
    </div>
  )
}

function SearchPatientCard() {
  const searchMutation = useSearchPatientsMutation()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SearchFormValues>({ resolver: zodResolver(searchSchema) })

  function onSubmit(values: SearchFormValues) {
    searchMutation.mutate(values)
  }

  const serverError =
    searchMutation.error instanceof ApiError
      ? searchMutation.error.message
      : searchMutation.error
        ? 'Search failed. Please try again.'
        : null

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="size-4" aria-hidden="true" />
          Find existing patient
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form className="grid gap-3 sm:grid-cols-2" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Field label="First name" error={errors.firstName?.message}>
            <Input {...register('firstName')} aria-invalid={!!errors.firstName} />
          </Field>
          <Field label="Last name" error={errors.lastName?.message}>
            <Input {...register('lastName')} aria-invalid={!!errors.lastName} />
          </Field>
          <Field label="Date of birth" error={errors.dateOfBirth?.message}>
            <Input type="date" {...register('dateOfBirth')} aria-invalid={!!errors.dateOfBirth} />
          </Field>
          <Field label="National ID (optional)">
            <Input {...register('nationalId')} />
          </Field>
          <Field label="Phone (optional)" className="sm:col-span-2">
            <Input {...register('phone')} />
          </Field>
          <Button type="submit" disabled={searchMutation.isPending} className="sm:col-span-2">
            {searchMutation.isPending ? <Loader2 className="animate-spin" aria-hidden="true" /> : <Search />}
            Search
          </Button>
        </form>

        {serverError ? (
          <p role="alert" className="text-sm text-destructive">
            {serverError}
          </p>
        ) : null}

        {searchMutation.isSuccess ? (
          <div className="space-y-2">
            {searchMutation.data.length === 0 ? (
              <p className="text-sm text-muted-foreground">No matching patients found. Safe to register a new one.</p>
            ) : (
              searchMutation.data.map((candidate) => (
                <PatientCandidateCard key={candidate.patientId} candidate={candidate} />
              ))
            )}
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}

function RegisterPatientCard() {
  const createMutation = useCreatePatientMutation()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RegisterFormValues>({ resolver: zodResolver(registerSchema) })

  function onSubmit(values: RegisterFormValues) {
    createMutation.mutate(values, { onSuccess: () => reset() })
  }

  const serverError =
    createMutation.error instanceof ApiError
      ? createMutation.error.message
      : createMutation.error
        ? 'Registration failed. Please try again.'
        : null

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="size-4" aria-hidden="true" />
          Register new patient
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form className="grid gap-3 sm:grid-cols-2" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Field label="First name" error={errors.firstName?.message}>
            <Input {...register('firstName')} aria-invalid={!!errors.firstName} />
          </Field>
          <Field label="Last name" error={errors.lastName?.message}>
            <Input {...register('lastName')} aria-invalid={!!errors.lastName} />
          </Field>
          <Field label="Date of birth" error={errors.dateOfBirth?.message}>
            <Input type="date" {...register('dateOfBirth')} aria-invalid={!!errors.dateOfBirth} />
          </Field>
          <Field label="Gender (optional)">
            <Input {...register('gender')} placeholder="e.g. female" />
          </Field>
          <Field label="National ID (optional)">
            <Input {...register('nationalId')} />
          </Field>
          <Field label="Phone (optional)">
            <Input {...register('phone')} />
          </Field>
          <Button type="submit" disabled={createMutation.isPending} className="sm:col-span-2">
            {createMutation.isPending ? <Loader2 className="animate-spin" aria-hidden="true" /> : <UserPlus />}
            Register patient
          </Button>
        </form>

        {serverError ? (
          <p role="alert" className="text-sm text-destructive">
            {serverError}
          </p>
        ) : null}

        {createMutation.isSuccess ? (
          <div className="space-y-2 rounded-lg border border-border bg-muted/40 p-3 text-sm">
            <p>
              Registered{' '}
              <Link
                to="/patients/$patientId"
                params={{ patientId: createMutation.data.id }}
                className="font-medium text-primary underline-offset-2 hover:underline"
              >
                {createMutation.data.firstName} {createMutation.data.lastName}
              </Link>
              .
            </p>
            {createMutation.data.possibleDuplicates.length > 0 ? (
              <p className="flex items-start gap-1.5 text-status-warning-foreground">
                <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                {createMutation.data.possibleDuplicates.length} possible duplicate
                {createMutation.data.possibleDuplicates.length === 1 ? '' : 's'} found and opened for review
                (merge case{createMutation.data.openedMergeCaseIds.length === 1 ? '' : 's'}:{' '}
                {createMutation.data.openedMergeCaseIds.join(', ')}). This registration still succeeded — duplicates
                require human review, not an automatic merge.
              </p>
            ) : null}
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
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
  children: ReactNode
}) {
  return (
    <div className={`space-y-1.5 ${className ?? ''}`}>
      <Label>{label}</Label>
      {children}
      {error ? (
        <p role="alert" className="text-xs text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  )
}

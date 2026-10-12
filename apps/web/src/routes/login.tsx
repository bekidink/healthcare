import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { HeartPulse, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useLoginMutation } from '@/hooks/useAuth'
import { ApiError } from '@/lib/api/client'

const loginSearchSchema = z.object({
  redirect: z.string().optional(),
})

export const Route = createFileRoute('/login')({
  validateSearch: loginSearchSchema,
  component: LoginPage,
})

export const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
})

type LoginFormValues = z.infer<typeof loginSchema>

function LoginPage() {
  const { redirect } = Route.useSearch()
  const navigate = useNavigate()
  const loginMutation = useLoginMutation()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })

  async function onSubmit(values: LoginFormValues) {
    try {
      await loginMutation.mutateAsync(values)
      await navigate({ to: redirect ?? '/' })
    } catch {
      // Surfaced below via loginMutation.error; nothing further to do here.
    }
  }

  const serverError =
    loginMutation.error instanceof ApiError
      ? loginMutation.error.message
      : loginMutation.error
        ? 'Something went wrong. Please try again.'
        : null

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="items-center text-center">
          <HeartPulse className="mb-2 size-8 text-primary" aria-hidden="true" />
          <CardTitle>Sign in</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'email-error' : undefined}
                {...register('email')}
              />
              {errors.email ? (
                <p id="email-error" role="alert" className="text-xs text-destructive">
                  {errors.email.message}
                </p>
              ) : null}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? 'password-error' : undefined}
                {...register('password')}
              />
              {errors.password ? (
                <p id="password-error" role="alert" className="text-xs text-destructive">
                  {errors.password.message}
                </p>
              ) : null}
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting || loginMutation.isPending}>
              {isSubmitting || loginMutation.isPending ? (
                <>
                  <Loader2 className="animate-spin" aria-hidden="true" />
                  Signing in…
                </>
              ) : (
                'Sign in'
              )}
            </Button>

            {serverError ? (
              <p role="alert" className="text-center text-xs text-destructive">
                {serverError}
              </p>
            ) : null}
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

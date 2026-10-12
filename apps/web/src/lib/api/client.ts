import { useAuthStore } from '@/stores/auth-store'

const API_BASE = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '')
const API_PREFIX = '/api/v1'

export class ApiError extends Error {
  status: number
  code?: string
  details?: unknown

  constructor(message: string, status: number, code?: string, details?: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
    this.details = details
  }
}

export type QueryValue = string | number | boolean | undefined

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'
  body?: unknown
  query?: Record<string, QueryValue>
  /** Set false for endpoints that must not carry a bearer token (login, register). Defaults to true. */
  auth?: boolean
}

function buildUrl(path: string, query?: Record<string, QueryValue>): string {
  const url = new URL(`${API_BASE}${API_PREFIX}${path}`)
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined) {
        url.searchParams.set(key, String(value))
      }
    }
  }
  return url.toString()
}

interface NormalizedError {
  message: string
  code?: string
  details?: unknown
}

/**
 * Two different error shapes depending on where the failure originates: the
 * gateway's own failures use `{code, message, details, requestId}`, while
 * errors proxied through from identity/patient/scheduling/facility use
 * Nest's default `{statusCode, message, error}` (those services register no
 * custom exception filter). Both are normalized here rather than leaking the
 * distinction into every call site.
 */
async function parseErrorBody(response: Response): Promise<NormalizedError> {
  let body: unknown
  try {
    body = await response.json()
  } catch {
    return { message: response.statusText || `Request failed with status ${response.status}` }
  }
  if (body && typeof body === 'object') {
    if ('code' in body && 'message' in body) {
      const b = body as { code: string; message: string; details?: unknown }
      return { message: b.message, code: b.code, details: b.details }
    }
    if ('statusCode' in body && 'message' in body) {
      const b = body as { statusCode: number; message: string | string[]; error?: string }
      return { message: Array.isArray(b.message) ? b.message.join(', ') : b.message, code: b.error }
    }
  }
  return { message: response.statusText || `Request failed with status ${response.status}` }
}

async function rawFetch<T>(
  path: string,
  { method = 'GET', body, query }: RequestOptions,
  extraHeaders: Record<string, string> = {},
): Promise<T> {
  const response = await fetch(buildUrl(path, query), {
    method,
    headers: {
      ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      ...extraHeaders,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  if (!response.ok) {
    const { message, code, details } = await parseErrorBody(response)
    throw new ApiError(message, response.status, code, details)
  }
  if (response.status === 204) {
    return undefined as T
  }
  return (await response.json()) as T
}

let refreshPromise: Promise<void> | null = null

async function refreshSession(): Promise<void> {
  const { refreshToken } = useAuthStore.getState()
  if (!refreshToken) {
    throw new ApiError('No refresh token available', 401)
  }
  const tokens = await rawFetch<{ accessToken: string; refreshToken: string; expiresIn: number }>('/auth/refresh', {
    method: 'POST',
    body: { refreshToken },
  })
  useAuthStore.getState().setTokens(tokens)
}

/**
 * The one entry point every domain API module should call. Attaches the
 * bearer token, and on a 401 attempts exactly one coalesced token refresh
 * before retrying — concurrent 401s during the same refresh all await the
 * same promise rather than firing duplicate refresh calls. If the refresh
 * itself fails, the session is cleared and the original 401 is rethrown.
 */
export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { auth = true, ...rest } = options

  const authHeader = (): Record<string, string> => {
    if (!auth) {
      return {}
    }
    const { accessToken } = useAuthStore.getState()
    return accessToken ? { Authorization: `Bearer ${accessToken}` } : {}
  }

  try {
    return await rawFetch<T>(path, rest, authHeader())
  } catch (error) {
    if (auth && error instanceof ApiError && error.status === 401) {
      try {
        refreshPromise ??= refreshSession().finally(() => {
          refreshPromise = null
        })
        await refreshPromise
      } catch {
        useAuthStore.getState().clearSession()
        throw error
      }
      return rawFetch<T>(path, rest, authHeader())
    }
    throw error
  }
}

function base64UrlDecode(input: string): string {
  const base64 = input.replace(/-/g, '+').replace(/_/g, '/')
  if (typeof atob === 'function') {
    return atob(base64)
  }
  return Buffer.from(base64, 'base64').toString('utf-8')
}

/**
 * Reads a JWT's payload without verifying its signature — for display
 * purposes only (e.g. showing the active organization in the UI). The
 * backend remains the sole source of authorization truth; nothing here
 * should gate access to anything.
 */
export function decodeJwtPayload<T>(token: string): T | null {
  try {
    const [, payload] = token.split('.')
    if (!payload) {
      return null
    }
    return JSON.parse(base64UrlDecode(payload)) as T
  } catch {
    return null
  }
}

export interface AccessTokenPayload {
  sub: string
  sid: string
  activeOrganizationId?: string
  isSuperAdmin?: boolean
  tokenVersion: number
  iat: number
  exp: number
}

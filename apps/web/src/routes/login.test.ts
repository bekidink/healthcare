import { describe, expect, it } from 'vitest'
import { loginSchema } from './login'

describe('loginSchema', () => {
  it('accepts a valid email and non-empty password', () => {
    const result = loginSchema.safeParse({ email: 'clinician@example.org', password: 'secret' })
    expect(result.success).toBe(true)
  })

  it('rejects a malformed email', () => {
    const result = loginSchema.safeParse({ email: 'not-an-email', password: 'secret' })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0]?.path).toEqual(['email'])
    }
  })

  it('rejects an empty password', () => {
    const result = loginSchema.safeParse({ email: 'clinician@example.org', password: '' })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0]?.path).toEqual(['password'])
    }
  })
})

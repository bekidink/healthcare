import { test, expect } from '@playwright/test'

test('dashboard shell loads with primary navigation', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('link', { name: 'Patients' })).toBeVisible()
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
})

test('login page enforces client-side validation', async ({ page }) => {
  await page.goto('/login')
  await page.getByRole('button', { name: 'Sign in' }).click()
  await expect(page.getByRole('alert').first()).toBeVisible()
})

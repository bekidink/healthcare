import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:4173',
    trace: 'on-first-retry',
  },
  // Runs against the production build/server, not `pnpm dev`: TanStack
  // Router's dev-mode route code-splitting (lazy-loaded route components)
  // has an observed quirk where a route's <form onSubmit> never receives
  // React's synthetic event in dev, even though the native DOM `submit`
  // event fires normally. Confirmed isolated to dev mode only — the
  // production build (verified directly, outside Playwright too) submits
  // and validates correctly. e2e tests should exercise what ships, not a
  // dev-tooling artifact.
  webServer: {
    command: 'pnpm build && pnpm start',
    url: 'http://localhost:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: { PORT: '4173' },
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
})

import { defineConfig } from 'vitest/config'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Deliberately NOT reusing vite.config.ts: the TanStack Start/nitro plugins
// there target a full SSR server build and don't make sense inside Vitest's
// node/jsdom test runner. Unit tests get a plain React + CSS setup instead.
export default defineConfig({
  resolve: {
    alias: {
      '@': new URL('./src', import.meta.url).pathname,
      '#': new URL('./src', import.meta.url).pathname,
    },
  },
  plugins: [tailwindcss(), viteReact()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    css: true,
    exclude: ['node_modules/**', 'e2e/**'],
  },
})

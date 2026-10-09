import { useEffect, useSyncExternalStore } from 'react'
import { Moon, Sun, SunMoon } from 'lucide-react'
import { Button } from '@/components/ui/button'

type ThemeMode = 'light' | 'dark' | 'auto'

const STORAGE_KEY = 'theme'
const listeners = new Set<() => void>()

function readStoredMode(): ThemeMode {
  const stored = window.localStorage.getItem(STORAGE_KEY)
  return stored === 'light' || stored === 'dark' || stored === 'auto' ? stored : 'auto'
}

let cachedMode: ThemeMode = 'auto'
if (typeof window !== 'undefined') {
  cachedMode = readStoredMode()
}

function getSnapshot(): ThemeMode {
  return cachedMode
}

function getServerSnapshot(): ThemeMode {
  return 'auto'
}

function subscribe(onStoreChange: () => void) {
  listeners.add(onStoreChange)
  return () => listeners.delete(onStoreChange)
}

function setStoredMode(mode: ThemeMode) {
  cachedMode = mode
  window.localStorage.setItem(STORAGE_KEY, mode)
  listeners.forEach((listener) => listener())
}

function applyThemeMode(mode: ThemeMode) {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  const resolved = mode === 'auto' ? (prefersDark ? 'dark' : 'light') : mode

  document.documentElement.classList.remove('light', 'dark')
  document.documentElement.classList.add(resolved)

  if (mode === 'auto') {
    document.documentElement.removeAttribute('data-theme')
  } else {
    document.documentElement.setAttribute('data-theme', mode)
  }

  document.documentElement.style.colorScheme = resolved
}

const ICONS: Record<ThemeMode, typeof Sun> = {
  light: Sun,
  dark: Moon,
  auto: SunMoon,
}

export function ThemeToggle() {
  // useSyncExternalStore (not useState+effect) so the first client render
  // matches SSR via getServerSnapshot, with no setState-in-effect needed to
  // pick up the real localStorage value after mount.
  const mode = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  useEffect(() => {
    applyThemeMode(mode)
  }, [mode])

  useEffect(() => {
    if (mode !== 'auto') {
      return
    }

    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => applyThemeMode('auto')

    media.addEventListener('change', onChange)
    return () => {
      media.removeEventListener('change', onChange)
    }
  }, [mode])

  function toggleMode() {
    const nextMode: ThemeMode = mode === 'light' ? 'dark' : mode === 'dark' ? 'auto' : 'light'
    setStoredMode(nextMode)
  }

  const label =
    mode === 'auto'
      ? 'Theme: auto (system). Click to switch to light mode.'
      : `Theme: ${mode}. Click to switch mode.`
  const Icon = ICONS[mode]

  return (
    <Button type="button" variant="ghost" size="icon" onClick={toggleMode} aria-label={label} title={label}>
      <Icon />
    </Button>
  )
}

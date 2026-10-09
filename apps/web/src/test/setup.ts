import '@testing-library/jest-dom/vitest'

// jsdom has no matchMedia implementation; ThemeToggle (and any future
// prefers-color-scheme/responsive logic) depends on it being present.
if (typeof window !== 'undefined' && !window.matchMedia) {
  window.matchMedia = (query: string) =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }) as unknown as MediaQueryList
}

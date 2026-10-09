import { create } from 'zustand'

/**
 * Pure client-side UI state — never server data (that's TanStack Query's
 * job) and never anything shareable/bookmarkable (that belongs in the URL's
 * search params instead). Mobile sidebar open/close is the canonical
 * example of what belongs here.
 */
interface UiState {
  mobileSidebarOpen: boolean
  setMobileSidebarOpen: (open: boolean) => void
}

export const useUiStore = create<UiState>((set) => ({
  mobileSidebarOpen: false,
  setMobileSidebarOpen: (open) => set({ mobileSidebarOpen: open }),
}))

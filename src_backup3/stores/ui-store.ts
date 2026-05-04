import { create } from "zustand";
import { persist } from "zustand/middleware";
import { type Locale } from "@/types/common.types";

export type CurrencyCode = "EGP" | "SAR";

/**
 * UI state management store
 * Handles sidebar state, locale, currency, and global UI preferences
 */
interface UIState {
  sidebarOpen: boolean;
  mobileSidebarOpen: boolean;
  locale: Locale;
  currency: CurrencyCode;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleMobileSidebar: () => void;
  setMobileSidebarOpen: (open: boolean) => void;
  setLocale: (locale: Locale) => void;
  setCurrency: (currency: CurrencyCode) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarOpen: true,
      mobileSidebarOpen: false,
      locale: "ar",
      currency: "EGP",

      toggleSidebar: () =>
        set((state) => ({ sidebarOpen: !state.sidebarOpen })),

      setSidebarOpen: (open) => set({ sidebarOpen: open }),

      toggleMobileSidebar: () =>
        set((state) => ({ mobileSidebarOpen: !state.mobileSidebarOpen })),

      setMobileSidebarOpen: (open) => set({ mobileSidebarOpen: open }),

      setLocale: (locale) => set({ locale }),

      setCurrency: (currency) => set({ currency }),
    }),
    {
      name: "skidy-rein-ui",
      partialize: (state) => ({
        sidebarOpen: state.sidebarOpen,
        locale: state.locale,
        currency: state.currency,
      }),
    }
  )
);

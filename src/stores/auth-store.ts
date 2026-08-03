import { create } from "zustand"
import { persist } from "zustand/middleware"

import type { AuthUser } from "@/interfaces/auth"

interface AuthState {
  user: AuthUser | null
  setAuth: (user: AuthUser) => void
  setUser: (user: AuthUser) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      setAuth: (user) => set({ user }),
      setUser: (user) => set({ user }),
      logout: () => set({ user: null }),
    }),
    {
      name: "tyv-auth",
      partialize: (state) => ({ user: state.user }),
    }
  )
)

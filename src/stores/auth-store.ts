import { create } from "zustand"
import { persist } from "zustand/middleware"

import type { AuthUser } from "@/interfaces/auth"

interface AuthState {
  token: string | null
  user: AuthUser | null
  setAuth: (token: string, user: AuthUser) => void
  setUser: (user: AuthUser) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setAuth: (token, user) => set({ token, user }),
      setUser: (user) => set({ user }),
      logout: () => set({ token: null, user: null }),
    }),
    {
      name: "tyv-auth",
    }
  )
)

/** Đọc token ngoài React (vd: trong axios interceptor). */
export function getAuthToken(): string | null {
  return useAuthStore.getState().token
}

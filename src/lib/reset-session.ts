import API_PATHS from "@/constants/apiPaths"
import { queryClient } from "@/lib/query-client"
import { useAuthStore } from "@/stores/auth-store"
import { useClinicStore } from "@/stores/clinic-store"

const CSRF_COOKIE = "tyv_csrf"
const CSRF_HEADER = "X-CSRF-Token"

function readCookie(name: string): string | null {
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${name.replace(/[$()*+.?[\\\]^{|}]/g, "\\$&")}=([^;]*)`)
  )
  return match ? decodeURIComponent(match[1]) : null
}

/** Gọi BE logout trước (còn cookie), rồi mới clear state local. */
export async function resetSession(): Promise<void> {
  try {
    const headers: HeadersInit = { "Content-Type": "application/json" }
    const csrf = readCookie(CSRF_COOKIE)
    if (csrf) headers[CSRF_HEADER] = csrf
    await fetch(`${import.meta.env.VITE_API_URL}${API_PATHS.AUTH.LOGOUT}`, {
      method: "POST",
      credentials: "include",
      headers,
      body: "{}",
    })
  } catch {
    // Cookie/CSRF có thể thiếu — vẫn clear local.
  }

  queryClient.clear()
  useAuthStore.getState().logout()
  useClinicStore.getState().setActiveClinicId(null)
}

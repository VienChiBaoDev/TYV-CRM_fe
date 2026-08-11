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

/** Xóa cache server data + auth + cơ sở active — gọi khi đăng xuất hoặc 401. */
export async function resetSession(): Promise<void> {
  queryClient.clear()
  useAuthStore.getState().logout()
  useClinicStore.getState().setActiveClinicId(null)

  try {
    const headers: HeadersInit = { "Content-Type": "application/json" }
    const csrf = readCookie(CSRF_COOKIE)
    if (csrf) headers[CSRF_HEADER] = csrf
    await fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
      headers,
      body: "{}",
    })
  } catch {
    // Cookie có thể đã hết hạn — bỏ qua.
  }
}

import { queryClient } from "@/lib/query-client"
import { useAuthStore } from "@/stores/auth-store"
import { useClinicStore } from "@/stores/clinic-store"

/** Xóa cache server data + auth + cơ sở active — gọi khi đăng xuất hoặc 401. */
export async function resetSession(): Promise<void> {
  queryClient.clear()
  useAuthStore.getState().logout()
  useClinicStore.getState().setActiveClinicId(null)

  try {
    await fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    })
  } catch {
    // Cookie có thể đã hết hạn — bỏ qua.
  }
}

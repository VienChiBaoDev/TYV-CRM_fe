import { queryClient } from "@/lib/query-client"
import { useAuthStore } from "@/stores/auth-store"
import { useClinicStore } from "@/stores/clinic-store"

/** Xóa cache server data + auth + cơ sở active — gọi khi đăng xuất hoặc 401. */
export function resetSession(): void {
  queryClient.clear()
  useAuthStore.getState().logout()
  useClinicStore.getState().setActiveClinicId(null)
}

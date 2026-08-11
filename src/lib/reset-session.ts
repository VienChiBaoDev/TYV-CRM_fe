import { postLogout } from "@/lib/post-logout"
import { queryClient } from "@/lib/query-client"
import { useAuthStore } from "@/stores/auth-store"
import { useClinicStore } from "@/stores/clinic-store"

let sessionResetInProgress = false

export function isSessionResetInProgress(): boolean {
  return sessionResetInProgress
}

type ResetSessionOptions = {
  /** Chỉ khi user chủ động đăng xuất — gọi BE xóa cookie HttpOnly. */
  revokeServer?: boolean
}

/** Clear state local; không gọi thêm API sau khi bắt đầu (trừ revokeServer). */
export async function resetSession(options: ResetSessionOptions = {}): Promise<void> {
  if (sessionResetInProgress) return
  sessionResetInProgress = true

  await queryClient.cancelQueries()

  if (options.revokeServer) {
    try {
      await postLogout()
    } catch {
      // Cookie có thể đã hết hạn — vẫn clear local.
    }
  }

  queryClient.clear()
  useAuthStore.getState().logout()
  useClinicStore.getState().setActiveClinicId(null)
}

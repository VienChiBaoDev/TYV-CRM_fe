import type { AuthUser } from "@/interfaces/auth"
import { useClinicStore } from "@/stores/clinic-store"

/**
 * Gán activeClinicId theo cơ sở của nhân viên.
 * ADMIN (clinicId = null) → không đổi, vẫn chọn tay trên Sidebar.
 */
export function syncClinicFromUser(user: AuthUser | null): void {
  if (!user?.clinicId) return
  useClinicStore.getState().setActiveClinicId(user.clinicId)
}

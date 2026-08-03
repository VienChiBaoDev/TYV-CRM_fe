import type { AuthUser } from "@/interfaces/auth"
import {
  getUserClinicIds,
  userHasAllClinics,
} from "@/lib/auth-user-clinics"
import { useClinicStore } from "@/stores/clinic-store"

/**
 * Gán activeClinicId theo cơ sở đầu tiên của nhân viên.
 * ADMIN (allClinics) → không đổi, vẫn chọn tay trên Sidebar.
 */
export function syncClinicFromUser(user: AuthUser | null): void {
  if (!user || userHasAllClinics(user)) return
  const clinicIds = getUserClinicIds(user)
  if (clinicIds.length === 0) return
  useClinicStore.getState().setActiveClinicId(clinicIds[0])
}

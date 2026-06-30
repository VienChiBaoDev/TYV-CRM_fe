import type { AuthUser } from "@/interfaces/auth"
import { getBranchLabel } from "@/lib/clinic-branch"
import { useClinicStore } from "@/stores/clinic-store"

/**
 * Gán activeBranch theo cơ sở của nhân viên.
 * ADMIN (clinicBranch = null) → không đổi, vẫn chọn tay trên Sidebar.
 */
export function syncClinicBranchFromUser(user: AuthUser | null): void {
  if (!user?.clinicBranch) return

  const label = getBranchLabel(user.clinicBranch)
  useClinicStore.getState().setActiveBranch(label)
}

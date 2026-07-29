import type { AuthUser } from "@/interfaces/auth"

/** User persist cũ có thể còn clinicId đơn thay vì clinicIds[]. */
type AuthUserLike = Partial<AuthUser> & {
  clinicId?: string | null
  clinicIds?: string[]
  allClinics?: boolean
  role?: AuthUser["role"]
}

export function getUserClinicIds(user: AuthUserLike | null | undefined): string[] {
  if (!user) return []
  if (Array.isArray(user.clinicIds)) return user.clinicIds
  if (user.clinicId) return [user.clinicId]
  return []
}

export function userHasAllClinics(user: AuthUserLike | null | undefined): boolean {
  if (!user) return false
  if (user.allClinics === true) return true
  if (user.allClinics === false) return false
  return user.role === "ADMIN"
}

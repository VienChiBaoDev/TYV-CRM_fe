import type { PermissionCode } from "@/constants/permissions"
import type { AuthUser } from "@/interfaces/auth"
import { useAuthStore } from "@/stores/auth-store"

/**
 * Kiểm tra xem user có permission code hay không
 * @param user là đối tượng AuthUser
 * @param code là một permission code
 * @returns là một boolean
 */
export function userHasPermission(
  user: Pick<AuthUser, "permissions" | "role"> | null | undefined,
  code: PermissionCode
): boolean {
  // nếu user không tồn tại thì trả về false
  if (!user) return false
  // nếu user là ADMIN thì trả về true
  if (user.role === "ADMIN") return true
  // nếu user không là ADMIN thì trả về true nếu user có permission code
  return (user.permissions ?? []).includes(code)
}

/**
 * Kiểm tra xem user có permission code hay không
 * @param user là đối tượng AuthUser
 * @param codes là một mảng các permission code
 * @returns là một boolean
 */
export function userHasAnyPermission(
  user: Pick<AuthUser, "permissions" | "role"> | null | undefined,
  codes: PermissionCode[]
): boolean {
  // phương thức some kiểm tra xem có ít nhất một phần tử trong mảng thoả mãn điều kiện hay không
  return codes.some((code) => userHasPermission(user, code))
}

/**
 * Hàm dùng để kiểm tra xem user có permission code hay không
 */
export function useCan(code: PermissionCode): boolean {
  const user = useAuthStore((state) => state.user)
  return userHasPermission(user, code)
}

/**
 * Hàm dùng để kiểm tra xem user có permission code hay không
 */
export function useCanAny(codes: PermissionCode[]): boolean {
  const user = useAuthStore((state) => state.user)
  return userHasAnyPermission(user, codes)
}

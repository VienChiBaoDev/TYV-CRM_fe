import { Navigate } from "react-router-dom"

import { urlPaths } from "@/constants/urlPaths"
import { useAuthStore } from "@/stores/auth-store"

/** Chặn truy cập khi chưa đăng nhập, đẩy về trang /login. */
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = useAuthStore((state) => state.token)

  if (!token) {
    return <Navigate to={urlPaths.login} replace />
  }

  return <>{children}</>
}

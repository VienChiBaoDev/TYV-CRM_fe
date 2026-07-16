import { useEffect } from "react"
import { Navigate } from "react-router-dom"

import { urlPaths } from "@/constants/urlPaths"
import { syncClinicBranchFromUser } from "@/lib/sync-clinic-branch-from-user"
import { useAuthStore } from "@/stores/auth-store"

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = useAuthStore((state) => state.token)
  const user = useAuthStore((state) => state.user)

  useEffect(() => {
    syncClinicBranchFromUser(user)
  }, [user])

  if (!token) {
    return <Navigate to={urlPaths.login} replace />
  }

  return <>{children}</>
}

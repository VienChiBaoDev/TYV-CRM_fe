import { useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { Navigate } from "react-router-dom"

import { urlPaths } from "@/constants/urlPaths"
import { syncClinicFromUser } from "@/lib/sync-clinic-from-user"
import { meQueryOptions } from "@/queries/auth-query"
import { useAuthStore } from "@/stores/auth-store"

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = useAuthStore((state) => state.token)
  const setUser = useAuthStore((state) => state.setUser)

  const { data, isError } = useQuery(meQueryOptions(Boolean(token)))

  useEffect(() => {
    if (!data) return
    setUser(data)
    syncClinicFromUser(data)
  }, [data, setUser])

  useEffect(() => {
    if (!isError) return
    syncClinicFromUser(useAuthStore.getState().user)
  }, [isError])

  if (!token) {
    return <Navigate to={urlPaths.login} replace />
  }

  return <>{children}</>
}

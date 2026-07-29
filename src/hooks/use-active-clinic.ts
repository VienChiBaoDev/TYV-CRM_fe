import { useEffect, useMemo } from "react"
import { useQuery } from "@tanstack/react-query"

import {
  getUserClinicIds,
  userHasAllClinics,
} from "@/lib/auth-user-clinics"
import { clinicOptionsQueryOptions } from "@/queries/clinic-query"
import { useAuthStore } from "@/stores/auth-store"
import { useClinicStore } from "@/stores/clinic-store"

/** Active clinic từ store + options API (đã lọc theo quyền user). */
export function useActiveClinic() {
  const user = useAuthStore((state) => state.user)
  const activeClinicId = useClinicStore((state) => state.activeClinicId)
  const setActiveClinicId = useClinicStore((state) => state.setActiveClinicId)
  const { data: clinicOptions = [] } = useQuery(clinicOptionsQueryOptions())

  const userClinicIds = useMemo(() => getUserClinicIds(user), [user])

  useEffect(() => {
    if (clinicOptions.length === 0) {
      setActiveClinicId(null)
      return
    }

    const stillValid = clinicOptions.some(
      (clinic) => clinic.id === activeClinicId
    )
    if (!activeClinicId || !stillValid) {
      const preferredFromUser = userClinicIds.find((id) =>
        clinicOptions.some((clinic) => clinic.id === id)
      )
      setActiveClinicId(preferredFromUser ?? clinicOptions[0].id)
    }
  }, [clinicOptions, activeClinicId, userClinicIds, setActiveClinicId])

  const activeClinic = useMemo(
    () => clinicOptions.find((clinic) => clinic.id === activeClinicId) ?? null,
    [clinicOptions, activeClinicId]
  )

  const canSwitchBranch =
    userHasAllClinics(user) || userClinicIds.length > 1

  return { activeClinicId, activeClinic, clinicOptions, canSwitchBranch }
}

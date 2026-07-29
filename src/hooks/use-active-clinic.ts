import { useEffect, useMemo } from "react"
import { useQuery } from "@tanstack/react-query"

import { clinicOptionsQueryOptions } from "@/queries/clinic-query"
import { useClinicStore } from "@/stores/clinic-store"

/** Active clinic từ store + options API; auto-chọn cơ sở đầu nếu chưa có. */
export function useActiveClinic() {
  const activeClinicId = useClinicStore((state) => state.activeClinicId)
  const setActiveClinicId = useClinicStore((state) => state.setActiveClinicId)
  const { data: clinicOptions = [] } = useQuery(clinicOptionsQueryOptions())

  useEffect(() => {
    if (clinicOptions.length === 0) return
    const stillValid = clinicOptions.some(
      (clinic) => clinic.id === activeClinicId
    )
    if (!activeClinicId || !stillValid) {
      setActiveClinicId(clinicOptions[0].id)
    }
  }, [clinicOptions, activeClinicId, setActiveClinicId])

  const activeClinic = useMemo(
    () => clinicOptions.find((clinic) => clinic.id === activeClinicId) ?? null,
    [clinicOptions, activeClinicId]
  )

  return { activeClinicId, activeClinic, clinicOptions }
}

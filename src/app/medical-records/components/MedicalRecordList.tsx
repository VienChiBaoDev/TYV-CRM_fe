import { useQuery } from "@tanstack/react-query"
import { useEffect, useMemo } from "react"
import { toast } from "sonner"

import { useClinicStore } from "@/stores/clinic-store"
import { patientListQueryOptions } from "@/app/medical-records/queries/patient-query"
import { referrerListQueryOptions } from "@/app/medical-records/queries/referrer-query"

import { ListFilters } from "./List/ListFilters"
import { PatientTable } from "./List/PatientTable"

export default function MedicalRecordList() {
  const activeClinicId = useClinicStore((state) => state.activeClinicId)
  const selectedReferrer = "all" as const

  const patientFilters = useMemo(
    () => ({
      clinicId: activeClinicId ?? undefined,
      referrerId:
        selectedReferrer === "all" ? undefined : selectedReferrer,
    }),
    [activeClinicId, selectedReferrer]
  )

  const {
    data: patients = [],
    isLoading: isPatientsLoading,
    isError: isPatientsError,
  } = useQuery(patientListQueryOptions(patientFilters))

  const { data: referrers = [], isError: isReferrersError } = useQuery(
    referrerListQueryOptions()
  )

  useEffect(() => {
    if (isPatientsError) {
      toast.error("Không tải được danh sách khách hàng")
    }
  }, [isPatientsError])

  useEffect(() => {
    if (isReferrersError) {
      toast.error("Không tải được danh sách người giới thiệu")
    }
  }, [isReferrersError])

  const selectedReferrerName =
    selectedReferrer === "all"
      ? null
      : (referrers.find((r) => r.id === selectedReferrer)?.fullName ?? null)

  return (
    <div className="h-full overflow-y-auto bg-slate-50 p-6">
      <div className="">
        <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
          <ListFilters />
          <PatientTable
            patients={patients}
            loading={isPatientsLoading}
            selectedReferrerName={selectedReferrerName}
          />
        </div>
      </div>
    </div>
  )
}

import { useQuery } from "@tanstack/react-query"
import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"

import { useActiveClinic } from "@/hooks/use-active-clinic"
import { patientListQueryOptions } from "@/app/medical-records/queries/patient-query"
import { referrerListQueryOptions } from "@/app/medical-records/queries/referrer-query"
import ModalCustomer from "@/app/medical-records/components/MedicalRecordList/ModalCustomer"

import { ListFilters } from "./List/ListFilters"
import { PatientTable } from "./List/PatientTable"

export default function MedicalRecordList() {
  const { activeClinicId } = useActiveClinic()
  const selectedReferrer = "all" as const
  const [editingPatientId, setEditingPatientId] = useState<string | null>(null)

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

  const showPatientsLoading = !activeClinicId || isPatientsLoading

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
            loading={showPatientsLoading}
            selectedReferrerName={selectedReferrerName}
            onEditPatient={setEditingPatientId}
          />
        </div>
      </div>

      <ModalCustomer
        key={editingPatientId ?? "closed"}
        patientId={editingPatientId}
        open={editingPatientId !== null}
        onOpenChange={(open) => {
          if (!open) setEditingPatientId(null)
        }}
      />
    </div>
  )
}

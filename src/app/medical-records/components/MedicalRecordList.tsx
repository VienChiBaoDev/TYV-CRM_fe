import { useQuery } from "@tanstack/react-query"
import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"

import ModalCustomer from "@/app/medical-records/components/MedicalRecordList/ModalCustomer"
import { patientListQueryOptions } from "@/app/medical-records/queries/patient-query"
import { referrerListQueryOptions } from "@/app/medical-records/queries/referrer-query"
import { useActiveClinic } from "@/hooks/use-active-clinic"

import { DEFAULT_LIMIT } from "@/types/pagination"
import { ListFilters } from "./List/ListFilters"
import { PatientTable } from "./List/PatientTable"

export default function MedicalRecordList() {
  const [page, setPage] = useState(1)
  const [draftSearch, setDraftSearch] = useState("")
  const [appliedSearch, setAppliedSearch] = useState("")

  const { activeClinicId } = useActiveClinic()
  const selectedReferrer = "all" as const
  const [editingPatientId, setEditingPatientId] = useState<string | null>(null)

  const patientFilters = useMemo(
    () => ({
      clinicId: activeClinicId ?? undefined,
      referrerId: selectedReferrer === "all" ? undefined : selectedReferrer,
      search: appliedSearch.trim() || undefined,
      page,
      limit: DEFAULT_LIMIT,
    }),
    [activeClinicId, selectedReferrer, appliedSearch, page]
  )

  const { data, isLoading, isError } = useQuery(
    patientListQueryOptions(patientFilters)
  )

  const patients = data?.data ?? []
  const meta = data?.meta
  const rowOffset = (page - 1) * DEFAULT_LIMIT

  const handleApplySearch = () => {
    setAppliedSearch(draftSearch)
    setPage(1)
  }

  const showPatientsLoading = !activeClinicId || isLoading

  const { data: referrers = [], isError: isReferrersError } = useQuery(
    referrerListQueryOptions()
  )

  useEffect(() => {
    if (isError) {
      toast.error("Không tải được danh sách khách hàng")
    }
  }, [isError])

  useEffect(() => {
    if (isReferrersError) {
      toast.error("Không tải được danh sách người giới thiệu")
    }
  }, [isReferrersError])

  // Khi đổi cơ sở → reset page + search
  useEffect(() => {
    setTimeout(() => {
      setPage(1)
      setDraftSearch("")
      setAppliedSearch("")
    }, 0)
  }, [activeClinicId])

  const selectedReferrerName =
    selectedReferrer === "all"
      ? null
      : (referrers.find((r) => r.id === selectedReferrer)?.fullName ?? null)

  return (
    <div className="h-full overflow-y-auto bg-slate-50 p-6">
      <div className="">
        <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
          <ListFilters
            search={draftSearch}
            onSearchChange={setDraftSearch}
            onApplySearch={handleApplySearch}
          />
          <PatientTable
            patients={patients}
            loading={showPatientsLoading}
            rowOffset={rowOffset}
            pageIndex={page - 1}
            pageCount={meta?.totalPages ?? 1}
            total={meta?.total ?? 0}
            onPageChange={(nextIndex) => setPage(nextIndex + 1)}
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

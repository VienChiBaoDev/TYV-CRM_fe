import { useEffect, useState } from "react"
import { toast } from "sonner"

import { toClinicBranchCode } from "@/lib/clinic-branch"
import { useClinicStore } from "@/stores/clinic-store"
import { ListFilters } from "./List/ListFilters"
import { PatientTable } from "./List/PatientTable"
import { getPatients, type Patient } from "../data/patientService"
import { getReferrers, type Referrer } from "../data/referrerService"

export default function MedicalRecordList() {
  const activeBranch = useClinicStore((state) => state.activeBranch)
  const branch = toClinicBranchCode(activeBranch)

  const [patients, setPatients] = useState<Patient[]>([])
  const [referrers, setReferrers] = useState<Referrer[]>([])
  const [selectedReferrer, setSelectedReferrer] = useState<string>("all")
  const [loading, setLoading] = useState(true)

  // Nạp danh sách người giới thiệu cho dropdown (1 lần)
  useEffect(() => {
    getReferrers()
      .then(setReferrers)
      .catch(() => toast.error("Không tải được danh sách người giới thiệu"))
  }, [])

  // Nạp khách hàng theo chi nhánh + bộ lọc người giới thiệu (server-side)
  useEffect(() => {
    setLoading(true)
    getPatients({
      branch,
      referrerId: selectedReferrer === "all" ? undefined : selectedReferrer,
    })
      .then(setPatients)
      .catch(() => toast.error("Không tải được danh sách khách hàng"))
      .finally(() => setLoading(false))
  }, [branch, selectedReferrer])

  const selectedReferrerName =
    selectedReferrer === "all"
      ? null
      : (referrers.find((r) => r.id === selectedReferrer)?.fullName ?? null)

  return (
    <div className="h-full overflow-y-auto bg-slate-50 p-6">
      <div className="mx-auto max-w-7xl space-y-2">
        {/* <ListHeader /> */}
        {/* <SummaryCards /> */}

        <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
          <ListFilters
          // referrers={referrers}
          // selectedReferrer={selectedReferrer}
          // onReferrerChange={setSelectedReferrer}
          />
          <PatientTable
            patients={patients}
            loading={loading}
            selectedReferrerName={selectedReferrerName}
          />
        </div>
      </div>
    </div>
  )
}

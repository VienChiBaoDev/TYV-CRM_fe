import { useEffect, useState } from "react"
import { toast } from "sonner"

import { useClinicStore } from "@/stores/clinic-store"
import { ListHeader } from "./List/ListHeader"
import { SummaryCards } from "./List/SummaryCards"
import { ListFilters } from "./List/ListFilters"
import { PatientTable } from "./List/PatientTable"
import { getPatients, type Patient } from "../data/patientService"
import { getReferrers, type Referrer } from "../data/referrerService"

export default function MedicalRecordList() {
  const activeBranch = useClinicStore((state) => state.activeBranch)
  const branch = activeBranch === "Cầu Giấy" ? "CAU_GIAY" : "HANG_BONG"

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
    <div className="h-full bg-slate-50 p-6 overflow-y-auto">
      <div className="max-w-7xl mx-auto space-y-2">
        <ListHeader />
        <SummaryCards />

        <div className="bg-white rounded-xl shadow-sm p-5 border border-slate-100">
          <ListFilters
            referrers={referrers}
            selectedReferrer={selectedReferrer}
            onReferrerChange={setSelectedReferrer}
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

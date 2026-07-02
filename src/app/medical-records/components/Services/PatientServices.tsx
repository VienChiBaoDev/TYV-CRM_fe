import { useMemo, useState } from "react"

import { DataTable } from "@/components/data-table/data-table"
import { Button } from "@/components/ui/button"
import { MOCK_PATIENT_SERVICES } from "@/app/medical-records/data/patient-services-mock"
import type { PatientService } from "@/app/medical-records/interfaces/patient-service"
import { mapPatientServiceFormToRow } from "@/app/medical-records/mappers/map-patient-service-form"
import type { PatientServiceFormValues } from "@/app/medical-records/schemas/patient-service-form"
import type { TreatmentService } from "@/app/treatment-services/types/treatment-service"
import type { AuthUser, Staff } from "@/interfaces/auth"
import { useAuthStore } from "@/stores/auth-store"
import { fetchStaffList } from "@/services/staffService"
import { useQuery } from "@tanstack/react-query"

import { AddPatientServiceDialog } from "./AddPatientServiceDialog"
import { createPatientServiceTableColumns } from "./patient-service-table-columns"

const PRIMARY_BTN =
  "bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-semibold"

function resolveFinalizedBy(
  staffList: Staff[],
  currentUser: AuthUser | null,
  consultant: Staff
): { fullName: string } {
  const matchedStaff = staffList.find((staff) => staff.id === currentUser?.id)
  if (matchedStaff) return matchedStaff
  if (currentUser) return { fullName: currentUser.fullName }
  return consultant
}

export default function PatientServices() {
  const [services, setServices] =
    useState<PatientService[]>(MOCK_PATIENT_SERVICES)
  const [dialogOpen, setDialogOpen] = useState(false)
  const currentUser = useAuthStore((state) => state.user)

  const { data: staffList = [] } = useQuery({
    queryKey: ["staff"],
    queryFn: fetchStaffList,
    enabled: dialogOpen,
  })

  const columns = useMemo(() => createPatientServiceTableColumns(), [])

  const handleSaveService = (
    values: PatientServiceFormValues,
    catalogService: TreatmentService
  ) => {
    const consultant = staffList.find(
      (staff) => staff.id === values.consultantId
    )
    if (!consultant) return

    const finalizedBy = resolveFinalizedBy(
      staffList,
      currentUser,
      consultant
    )

    const row = mapPatientServiceFormToRow({
      values,
      service: catalogService,
      consultant,
      finalizedBy,
    })

    setServices((current) => [row, ...current])
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-end gap-3 rounded-md border border-gray-200 bg-white px-4 py-3">
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            size="sm"
            className={PRIMARY_BTN}
            onClick={() => setDialogOpen(true)}
          >
            Thêm mới
          </Button>
          <Button type="button" size="sm" className={PRIMARY_BTN}>
            Combo
          </Button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={services}
        loading={false}
        classNameTable="!p-4 !pt-0"
      />

      <AddPatientServiceDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSaveService}
      />
    </div>
  )
}

import { useMemo, useState } from "react"
import { useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"

import { DataTable } from "@/components/data-table/data-table"
import { ConfirmDialog } from "@/components/UiCustom/DialogConfirm"
import { Button } from "@/components/ui/button"
import {
  useCreatePatientServiceMutation,
  useDeletePatientServiceMutation,
  useUpdatePatientServiceMutation,
} from "@/app/medical-records/hooks/use-patient-service-mutations"
import type { PatientService } from "@/app/medical-records/interfaces/patient-service"
import { patientServicesQueryOptions } from "@/app/medical-records/queries/patient-service-query"
import type { PatientServiceFormValues } from "@/app/medical-records/schemas/patient-service-form"

import { AddPatientServiceDialog } from "./AddPatientServiceDialog"
import { PatientServiceTableColumns } from "./patient-service-table-columns"

const PRIMARY_BTN =
  "bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-semibold"

export default function PatientServices() {
  const { patientId = "" } = useParams()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingService, setEditingService] = useState<PatientService | null>(
    null
  )
  const [serviceToDelete, setServiceToDelete] = useState<PatientService | null>(
    null
  )

  const { data: services = [], isLoading } = useQuery(
    patientServicesQueryOptions(patientId)
  )

  const createMutation = useCreatePatientServiceMutation(patientId)
  const updateMutation = useUpdatePatientServiceMutation(patientId)
  const deleteMutation = useDeletePatientServiceMutation(patientId)

  const columns = useMemo(
    () =>
      PatientServiceTableColumns({
        onEdit: (service) => {
          setEditingService(service)
          setDialogOpen(true)
        },
        onDelete: (service) => setServiceToDelete(service),
      }),
    []
  )

  const handleOpenCreate = () => {
    setEditingService(null)
    setDialogOpen(true)
  }

  const handleDialogOpenChange = (open: boolean) => {
    setDialogOpen(open)
    if (!open) {
      setEditingService(null)
    }
  }

  const handleSaveService = (values: PatientServiceFormValues) => {
    if (editingService) {
      updateMutation.mutate(
        { serviceId: editingService.id, values },
        {
          onSuccess: () => handleDialogOpenChange(false),
        }
      )
      return
    }

    createMutation.mutate(values, {
      onSuccess: () => handleDialogOpenChange(false),
    })
  }

  const handleConfirmDelete = () => {
    if (!serviceToDelete) return

    deleteMutation.mutate(serviceToDelete.id, {
      onSuccess: () => setServiceToDelete(null),
    })
  }

  const isSubmitting = createMutation.isPending || updateMutation.isPending

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-end gap-3 rounded-md border border-gray-200 bg-white px-4 py-3">
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            size="sm"
            className={PRIMARY_BTN}
            onClick={handleOpenCreate}
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
        loading={isLoading}
        classNameTable="!p-4 !pt-0"
      />

      <AddPatientServiceDialog
        open={dialogOpen}
        onOpenChange={handleDialogOpenChange}
        onSave={handleSaveService}
        isSubmitting={isSubmitting}
        editingService={editingService}
      />

      <ConfirmDialog
        open={serviceToDelete != null}
        onOpenChange={(open) => {
          if (!open) setServiceToDelete(null)
        }}
        title="Xóa dịch vụ"
        message={
          serviceToDelete
            ? `Bạn có chắc muốn xóa dịch vụ "${serviceToDelete.serviceName}"?`
            : ""
        }
        onConfirm={handleConfirmDelete}
        loading={deleteMutation.isPending}
      />
    </div>
  )
}

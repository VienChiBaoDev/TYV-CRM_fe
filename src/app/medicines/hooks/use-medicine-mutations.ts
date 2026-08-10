import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import {
  createMedicine,
  deleteMedicine,
  importMedicines,
  updateMedicine,
} from "../services/medicine-api"
import { medicineKeys } from "../queries/medicine-query"
import type { MedicineFormValues } from "../schemas/medicine-form"
import { getApiErrorMessage } from "@/app/medical-records/mappers/map-visit-request"

export function useCreateMedicineMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createMedicine,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: medicineKeys.all })
      toast.success("Đã thêm thuốc mới.")
    },
    onError: () => toast.error("Không thể thêm thuốc."),
  })
}

export function useUpdateMedicineMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string
      payload: MedicineFormValues
    }) => updateMedicine(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: medicineKeys.all })
      toast.success("Đã cập nhật thuốc.")
    },
    onError: () => toast.error("Không thể cập nhật thuốc."),
  })
}

export function useDeleteMedicineMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteMedicine(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: medicineKeys.all })
      toast.success("Đã xóa thuốc.")
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  })
}
export function useImportMedicinesMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (items: MedicineFormValues[]) => importMedicines(items),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: medicineKeys.all })
      toast.success(
        `Import xong: ${result.created} thêm mới, ${result.skipped} bỏ qua.`
      )
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  })
}

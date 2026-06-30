import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { createMedicine, updateMedicine } from "../services/medicine-api"
import { medicineKeys } from "../queries/medicine-query"
import type { MedicineFormValues } from "../schemas/medicine-form"

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

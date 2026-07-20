import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { createPrescriptionFormula } from "../services/prescription-formula-api"
import { prescriptionFormulaKeys } from "../queries/prescription-formula-query"
import type { CreatePrescriptionFormulaPayload } from "../types/prescription-formula"
import { getApiErrorMessage } from "@/app/medical-records/mappers/map-visit-request"

export function useCreatePrescriptionFormulaMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreatePrescriptionFormulaPayload) =>
      createPrescriptionFormula(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: prescriptionFormulaKeys.all,
      })
      toast.success("Đã lưu công thức")
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error))
    },
  })
}

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { getApiErrorMessage } from "@/app/medical-records/mappers/map-visit-request"
import {
  createPrescriptionFormula,
  deletePrescriptionFormula,
  updatePrescriptionFormula,
} from "../services/prescription-formula-api"
import { prescriptionFormulaKeys } from "../queries/prescription-formula-query"
import type {
  CreatePrescriptionFormulaPayload,
  UpdatePrescriptionFormulaPayload,
} from "../types/prescription-formula"

function invalidateFormulas(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: prescriptionFormulaKeys.all })
}

export function useCreatePrescriptionFormulaMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreatePrescriptionFormulaPayload) =>
      createPrescriptionFormula(payload),
    onSuccess: () => {
      invalidateFormulas(queryClient)
      toast.success("Đã lưu công thức")
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error))
    },
  })
}

export function useUpdatePrescriptionFormulaMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string
      payload: UpdatePrescriptionFormulaPayload
    }) => updatePrescriptionFormula(id, payload),
    onSuccess: () => {
      invalidateFormulas(queryClient)
      toast.success("Đã cập nhật công thức")
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error))
    },
  })
}

export function useDeletePrescriptionFormulaMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deletePrescriptionFormula(id),
    onSuccess: () => {
      invalidateFormulas(queryClient)
      toast.success("Đã xóa công thức")
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error))
    },
  })
}

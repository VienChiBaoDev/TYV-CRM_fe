import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { getApiErrorMessage } from "@/app/medical-records/mappers/map-visit-request"
import { medicalRecordKeys } from "@/app/medical-records/queries/patient-medical-record-query"
import { patientKeys } from "@/app/medical-records/queries/patient-query"
import {
  createPatient,
  importPatientsInBatches,
  updatePatient,
  type CreatePatientPayload,
  type ImportPatientPayload,
  type ImportPatientsBatchProgress,
  type UpdatePatientPayload,
} from "@/app/medical-records/services/patient-api"

export function useCreatePatientMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreatePatientPayload) => createPatient(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: patientKeys.all })
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error))
    },
  })
}

export function useUpdatePatientMutation(patientId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UpdatePatientPayload) =>
      updatePatient(patientId, payload),
    onSuccess: (updated) => {
      queryClient.setQueryData(patientKeys.detail(patientId), updated)
      queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey[0] === patientKeys.all[0] &&
          query.queryKey[1] === "list",
      })
      queryClient.invalidateQueries({
        queryKey: medicalRecordKeys.detail(patientId),
      })
      toast.success("Đã cập nhật hồ sơ khách hàng")
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error))
    },
  })
}

export function useImportPatientsMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      items,
      onProgress,
    }: {
      items: ImportPatientPayload[]
      onProgress?: (progress: ImportPatientsBatchProgress) => void
    }) => importPatientsInBatches(items, { onProgress }),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: patientKeys.all })
      toast.success(
        `Import xong: ${result.created} thêm mới, ${result.skipped} bỏ qua.`
      )
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error))
    },
  })
}

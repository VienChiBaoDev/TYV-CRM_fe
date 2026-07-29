import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { getApiErrorMessage } from "@/app/medical-records/mappers/map-visit-request"
import { medicalRecordKeys } from "@/app/medical-records/queries/patient-medical-record-query"
import { patientKeys } from "@/app/medical-records/queries/patient-query"
import {
  createPatient,
  updatePatient,
  type CreatePatientPayload,
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: patientKeys.all })
      queryClient.invalidateQueries({
        queryKey: patientKeys.detail(patientId),
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

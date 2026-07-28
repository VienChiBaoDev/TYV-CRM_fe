import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import {
  deleteTreatmentSessionImage,
  uploadTreatmentSessionImage,
  upsertTreatmentSession,
} from "@/app/medical-records/services/patient-treatment-api"
import { patientTreatmentKeys } from "@/app/medical-records/queries/patient-treatment-query"
import { patientServiceKeys } from "@/app/medical-records/queries/patient-service-query"
import { consumableKeys } from "@/app/consumables/queries/consumable-query"
import { getApiErrorMessage } from "@/app/medical-records/mappers/map-visit-request"
import type { UpsertTreatmentSessionPayload } from "@/app/medical-records/services/patient-treatment-api"

export function useUpsertTreatmentSessionMutation(
  patientId: string,
  serviceId: string
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UpsertTreatmentSessionPayload) =>
      upsertTreatmentSession(patientId, serviceId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: patientTreatmentKeys.byService(patientId, serviceId),
      })
      queryClient.invalidateQueries({
        queryKey: patientTreatmentKeys.history(patientId),
      })
      queryClient.invalidateQueries({
        queryKey: patientServiceKeys.list(patientId),
      })
      queryClient.invalidateQueries({ queryKey: consumableKeys.all })
      toast.success("Lưu buổi điều trị thành công")
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  })
}
export function useUploadTreatmentSessionImageMutation(
  patientId: string,
  serviceId: string
) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      sessionNumber,
      file,
    }: {
      sessionNumber: number
      file: File
    }) =>
      uploadTreatmentSessionImage(patientId, serviceId, sessionNumber, file),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: patientTreatmentKeys.byService(patientId, serviceId),
      })
      toast.success("Tải ảnh thành công")
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  })
}
export function useDeleteTreatmentSessionImageMutation(
  patientId: string,
  serviceId: string
) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      sessionNumber,
      imageId,
    }: {
      sessionNumber: number
      imageId: string
    }) =>
      deleteTreatmentSessionImage(patientId, serviceId, sessionNumber, imageId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: patientTreatmentKeys.byService(patientId, serviceId),
      })
      toast.success("Xóa ảnh thành công")
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  })
}

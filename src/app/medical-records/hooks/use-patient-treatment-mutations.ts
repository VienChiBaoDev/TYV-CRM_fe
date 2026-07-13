import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { upsertTreatmentSession } from "@/app/medical-records/services/patient-treatment-api"
import { patientTreatmentKeys } from "@/app/medical-records/queries/patient-treatment-query"
import { patientServiceKeys } from "@/app/medical-records/queries/patient-service-query"
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
      toast.success("Lưu buổi điều trị thành công")
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  })
}

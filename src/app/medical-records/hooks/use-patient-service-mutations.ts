import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { createPatientService } from "@/app/medical-records/services/patient-service-api"
import { mapPatientServiceFormToCreatePayload } from "@/app/medical-records/mappers/map-patient-service-request"
import { patientServiceKeys } from "@/app/medical-records/queries/patient-service-query"
import type { PatientServiceFormValues } from "@/app/medical-records/schemas/patient-service-form"
import { getApiErrorMessage } from "@/app/medical-records/mappers/map-visit-request"

export function useCreatePatientServiceMutation(patientId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (values: PatientServiceFormValues) =>
      createPatientService(
        patientId,
        mapPatientServiceFormToCreatePayload(values)
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: patientServiceKeys.list(patientId),
      })
      toast.success("Thêm dịch vụ thành công")
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error))
    },
  })
}

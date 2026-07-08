import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { createPatientPayment } from "@/app/medical-records/services/patient-payment-api"
import { mapPatientPaymentFormToCreatePayload } from "@/app/medical-records/mappers/map-patient-payment-request"
import { patientPaymentKeys } from "@/app/medical-records/queries/patient-payment-query"
import { patientServiceKeys } from "@/app/medical-records/queries/patient-service-query"
import type { PatientPaymentFormValues } from "@/app/medical-records/schemas/patient-payment-form"
import type { UnpaidPaymentItem } from "@/app/medical-records/interfaces/patient-unpaid-item"
import { getApiErrorMessage } from "@/app/medical-records/mappers/map-visit-request"
import { formatPrice } from "@/app/treatment-services/utils/format-price"

export function useCreatePatientPaymentMutation(patientId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      values,
      selectedItems,
    }: {
      values: PatientPaymentFormValues
      selectedItems: { item: UnpaidPaymentItem; collectAmount: number }[]
    }) =>
      createPatientPayment(
        patientId,
        mapPatientPaymentFormToCreatePayload(values, selectedItems)
      ),
    onSuccess: (_data, variables) => {
      const total = variables.selectedItems.reduce(
        (sum, entry) => sum + entry.collectAmount,
        0
      )
      queryClient.invalidateQueries({
        queryKey: patientPaymentKeys.list(patientId),
      })
      queryClient.invalidateQueries({
        queryKey: patientServiceKeys.list(patientId),
      })
      toast.success(`Đã lưu phiếu thanh toán ${formatPrice(total)} đ`)
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error))
    },
  })
}

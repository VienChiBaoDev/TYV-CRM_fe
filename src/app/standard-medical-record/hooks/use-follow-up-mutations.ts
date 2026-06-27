import { useMutation, useQueryClient } from "@tanstack/react-query"
import {
  type ScheduleFollowUpPayload,
  type SubmitAssessmentPayload,
} from "../interfaces/StandardMedicalRecord"
import { scheduleFollowUp } from "../services/follow-up-service"
import { submitAssessment } from "../services/follow-up-service"
import { followUpKeys } from "../queries/follow-up-query"
import { appointmentKeys } from "@/app/appointments/queries/appointment-query"
import { toast } from "sonner"

export function useScheduleFollowUpMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      followUpId,
      payload,
    }: {
      followUpId: string
      payload: ScheduleFollowUpPayload
    }) => scheduleFollowUp(followUpId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: followUpKeys.all })
      queryClient.invalidateQueries({ queryKey: appointmentKeys.all })
      toast.success("Đã đặt lịch tái khám thành công")
    },
    onError: () => {
      toast.error("Đặt lịch thất bại. Vui lòng thử lại.")
    },
  })
}

export function useSubmitAssessmentMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      followUpId,
      payload,
    }: {
      followUpId: string
      payload: SubmitAssessmentPayload
    }) => submitAssessment(followUpId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: followUpKeys.all })
    },
  })
}

import { useMutation, useQueryClient } from "@tanstack/react-query"
import {
  type RescheduleFollowUpPayload,
  type ScheduleFollowUpPayload,
  type SubmitAssessmentPayload,
} from "../interfaces/StandardMedicalRecord"
import {
  rescheduleFollowUp,
  scheduleFollowUp,
} from "../services/follow-up-service"
import { submitAssessment } from "../services/follow-up-service"
import { followUpKeys } from "../queries/follow-up-query"
import { appointmentKeys } from "@/app/appointments/queries/appointment-query"
import { toast } from "sonner"
import { isAxiosError } from "axios"

function getApiErrorMessage(error: unknown, fallback: string): string {
  if (!isAxiosError(error)) return fallback
  const message = error.response?.data?.message
  if (typeof message === "string") return message
  if (Array.isArray(message)) return message[0] ?? fallback
  return fallback
}

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
    onError: (error) => {
      toast.error(
        getApiErrorMessage(error, "Đặt lịch thất bại. Vui lòng thử lại.")
      )
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

export function useRescheduleFollowUpMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      followUpId,
      payload,
    }: {
      followUpId: string
      payload: RescheduleFollowUpPayload
    }) => rescheduleFollowUp(followUpId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: followUpKeys.all })
      toast.success("Đã cập nhật lịch tái khám")
    },
    onError: (error: unknown) => {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message ?? "Không thể đổi lịch. Vui lòng thử lại."
      toast.error(message)
    },
  })
}

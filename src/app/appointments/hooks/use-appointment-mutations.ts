import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import {
  cancelAppointment,
  createAppointment,
  updateAppointment,
  type CreateAppointmentPayload,
  type UpdateAppointmentPayload,
} from "@/app/medical-records/data/appointmentService"
import { appointmentKeys } from "../queries/appointment-query"

export function useCreateAppointmentMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateAppointmentPayload) =>
      createAppointment(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: appointmentKeys.all })
      toast.success("Đã tạo lịch hẹn")
    },
    onError: () => {
      toast.error("Không thể tạo lịch hẹn")
    },
  })
}

export function useUpdateAppointmentMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string
      payload: UpdateAppointmentPayload
    }) => updateAppointment(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: appointmentKeys.all })
      toast.success("Đã cập nhật lịch hẹn")
    },
    onError: () => {
      toast.error("Không thể cập nhật lịch hẹn")
    },
  })
}

export function useCancelAppointmentMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => cancelAppointment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: appointmentKeys.all })
      toast.success("Đã hủy lịch hẹn")
    },
    onError: () => {
      toast.error("Không thể hủy lịch hẹn")
    },
  })
}

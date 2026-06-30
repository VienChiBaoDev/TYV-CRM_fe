import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import {
  cancelAppointment,
  createAppointment,
  updateAppointment,
  type CreateAppointmentPayload,
  type UpdateAppointmentPayload,
  checkInAppointment,
} from "@/app/appointments/services/appointmentService"
import { appointmentKeys } from "../queries/appointment-query"
import { isAxiosError } from "axios"
import { medicalRecordKeys } from "@/app/medical-records/queries/patient-medical-record-query"

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

function getApiErrorMessage(error: unknown, fallback: string): string {
  if (!isAxiosError(error)) return fallback
  const message = error.response?.data?.message
  if (typeof message === "string") return message
  if (Array.isArray(message)) return message[0] ?? fallback
  return fallback
}

export function useCheckInAppointmentMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => checkInAppointment(id),
    onSuccess: (appointment) => {
      queryClient.invalidateQueries({ queryKey: appointmentKeys.all })
      queryClient.invalidateQueries({
        queryKey: medicalRecordKeys.detail(appointment.patientId),
      })
      toast.success("Đã tiếp nhận bệnh nhân")
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Không thể tiếp nhận lịch hẹn"))
    },
  })
}

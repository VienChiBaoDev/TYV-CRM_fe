import { useMutation, useQueryClient } from "@tanstack/react-query"
import { isAxiosError } from "axios"
import { toast } from "sonner"

import {
  createStaffShift,
  deleteStaffShift,
  updateStaffShift,
  type CreateStaffShiftPayload,
  type UpdateStaffShiftPayload,
} from "../services/staffShiftService"
import { staffShiftKeys } from "../queries/staff-shift-query"

function getApiErrorMessage(error: unknown, fallback: string): string {
  if (!isAxiosError(error)) return fallback
  const message = error.response?.data?.message
  if (typeof message === "string") return message
  if (Array.isArray(message)) return message[0] ?? fallback
  return fallback
}

export function useCreateStaffShiftMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateStaffShiftPayload) => createStaffShift(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: staffShiftKeys.all })
      toast.success("Đã tạo ca làm")
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Không thể tạo ca làm"))
    },
  })
}

export function useUpdateStaffShiftMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string
      payload: UpdateStaffShiftPayload
    }) => updateStaffShift(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: staffShiftKeys.all })
      toast.success("Đã cập nhật ca làm")
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Không thể cập nhật ca làm"))
    },
  })
}

export function useDeleteStaffShiftMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteStaffShift(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: staffShiftKeys.all })
      toast.success("Đã xóa ca làm")
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Không thể xóa ca làm"))
    },
  })
}

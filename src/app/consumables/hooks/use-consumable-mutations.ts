import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import {
  createConsumable,
  stockInConsumable,
  updateConsumable,
} from "../services/consumable-api"
import { consumableKeys } from "../queries/consumable-query"
import type {
  ConsumableFormValues,
  StockInFormValues,
} from "../schemas/consumable-form"

function getErrorMessage(error: unknown, fallback: string): string {
  if (
    error &&
    typeof error === "object" &&
    "response" in error &&
    error.response &&
    typeof error.response === "object" &&
    "data" in error.response &&
    error.response.data &&
    typeof error.response.data === "object" &&
    "message" in error.response.data
  ) {
    const message = error.response.data.message
    if (Array.isArray(message)) return message[0] ?? fallback
    if (typeof message === "string") return message
  }
  return fallback
}

export function useCreateConsumableMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createConsumable,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: consumableKeys.all })
      toast.success("Đã thêm vật tư.")
    },
    onError: (error) =>
      toast.error(getErrorMessage(error, "Không thể thêm vật tư.")),
  })
}

export function useUpdateConsumableMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string
      payload: Partial<ConsumableFormValues>
    }) => updateConsumable(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: consumableKeys.all })
      toast.success("Đã cập nhật vật tư.")
    },
    onError: (error) =>
      toast.error(getErrorMessage(error, "Không thể cập nhật vật tư.")),
  })
}

export function useStockInConsumableMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: StockInFormValues }) =>
      stockInConsumable(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: consumableKeys.all })
      toast.success("Đã nhập kho.")
    },
    onError: (error) =>
      toast.error(getErrorMessage(error, "Không thể nhập kho.")),
  })
}

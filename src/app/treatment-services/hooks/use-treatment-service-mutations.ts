import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import {
  createCatalogService,
  createServiceGroup,
  updateCatalogService,
  updateServiceGroup,
} from "../services/treatment-service-api"
import { treatmentServiceKeys } from "../queries/treatment-service-query"
import type { ServiceItemType } from "../types/treatment-service"
import type { CatalogServiceApi } from "../interfaces/treatment-services.interfaces"

export function useCreateServiceGroupMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createServiceGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: treatmentServiceKeys.groups() })
      toast.success("Đã thêm nhóm dịch vụ mới.")
    },
    onError: () => toast.error("Không thể tạo nhóm dịch vụ."),
  })
}

export function useUpdateServiceGroupMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string
      payload: { code: string; name: string; itemType: ServiceItemType }
    }) => updateServiceGroup(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: treatmentServiceKeys.groups() })
      toast.success("Đã cập nhật nhóm dịch vụ.")
    },
    onError: () => toast.error("Không thể cập nhật nhóm dịch vụ."),
  })
}

export function useCreateCatalogServiceMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createCatalogService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: treatmentServiceKeys.all })
      queryClient.invalidateQueries({ queryKey: treatmentServiceKeys.groups() })
      toast.success("Đã thêm dịch vụ mới.")
    },
    onError: () => toast.error("Không thể tạo dịch vụ."),
  })
}

export function useUpdateCatalogServiceMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string
      payload: Omit<CatalogServiceApi, "id">
    }) => updateCatalogService(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: treatmentServiceKeys.all })
      queryClient.invalidateQueries({ queryKey: treatmentServiceKeys.groups() })
      toast.success("Đã cập nhật dịch vụ.")
    },
    onError: () => toast.error("Không thể cập nhật dịch vụ."),
  })
}

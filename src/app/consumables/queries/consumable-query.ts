import { queryOptions } from "@tanstack/react-query"
import {
  fetchConsumableOptions,
  fetchConsumables,
  fetchConsumableUsage,
  type FetchConsumableUsageParams,
} from "../services/consumable-api"

export const consumableKeys = {
  all: ["consumables"] as const,
  list: (filters: object) => [...consumableKeys.all, "list", filters] as const,
  options: () => [...consumableKeys.all, "options"] as const,
  usage: (filters: FetchConsumableUsageParams) =>
    [...consumableKeys.all, "usage", filters] as const,
}

export function consumableListQueryOptions(filters: { search?: string } = {}) {
  return queryOptions({
    queryKey: consumableKeys.list(filters),
    queryFn: () => fetchConsumables(filters),
  })
}

export function consumableOptionsQueryOptions() {
  return queryOptions({
    queryKey: consumableKeys.options(),
    queryFn: fetchConsumableOptions,
    staleTime: 30_000,
  })
}

export function consumableUsageQueryOptions(
  filters: FetchConsumableUsageParams = {}
) {
  return queryOptions({
    queryKey: consumableKeys.usage(filters),
    queryFn: () => fetchConsumableUsage(filters),
  })
}

import { queryOptions } from "@tanstack/react-query"
import type { FetchCatalogServicesParams } from "../interfaces/treatment-services.interfaces"
import {
  fetchCatalogServices,
  fetchServiceGroups,
} from "../services/treatment-service-api"

export const treatmentServiceKeys = {
  all: ["treatment-services"] as const,
  groups: () => [...treatmentServiceKeys.all, "groups"] as const,
  services: (filters: FetchCatalogServicesParams) =>
    [...treatmentServiceKeys.all, "services", filters] as const,
}

// Các options cho query service groups
export function serviceGroupQueryOptions() {
  // queryOptions là một hàm từ @tanstack/react-query để tạo các options cho query (giống như useQuery)
  // QueryOptions khác useQuery ở chỗ nó là một hàm, còn useQuery là một hook
  // QueryOptions là một hàm trả về một object, còn useQuery là một hook trả về một array
  // queryOptions có thể nhận vào một object, còn useQuery nhận vào một array
  return queryOptions({
    // queryKey là một array, còn useQuery nhận vào một array
    queryKey: treatmentServiceKeys.groups(),
    queryFn: () => fetchServiceGroups(),
  })
}

// Các options cho query service catalog
export function catalogServicesQueryOptions(
  filters: FetchCatalogServicesParams
) {
  return queryOptions({
    queryKey: treatmentServiceKeys.services(filters),
    queryFn: () => fetchCatalogServices(filters),
  })
}

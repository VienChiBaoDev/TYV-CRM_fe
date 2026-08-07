import { queryOptions } from "@tanstack/react-query"

import {
  fetchClinicOptions,
  fetchClinics,
  type ClinicOption,
} from "@/services/clinicService"

export const clinicKeys = {
  all: ["clinics"] as const,
  list: () => [...clinicKeys.all, "list"] as const,
  options: () => [...clinicKeys.all, "options"] as const,
}

export function clinicListQueryOptions() {
  return queryOptions({
    queryKey: clinicKeys.list(),
    queryFn: fetchClinics,
    staleTime: 60_000,
  })
}

export function clinicOptionsQueryOptions(enabled = true) {
  return queryOptions({
    queryKey: clinicKeys.options(),
    queryFn: fetchClinicOptions,
    enabled,
    staleTime: 60_000,
  })
}

export type { ClinicOption }

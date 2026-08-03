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

export function clinicOptionsQueryOptions() {
  return queryOptions({
    queryKey: clinicKeys.options(),
    queryFn: fetchClinicOptions,
    staleTime: 60_000,
  })
}

export type { ClinicOption }

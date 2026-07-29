import { queryOptions } from "@tanstack/react-query"

import { getReferrers } from "@/app/medical-records/data/referrerService"

export const referrerKeys = {
  all: ["referrers"] as const,
  list: (search?: string) =>
    [...referrerKeys.all, "list", search ?? ""] as const,
}

export function referrerListQueryOptions(search?: string) {
  return queryOptions({
    queryKey: referrerKeys.list(search),
    queryFn: () => getReferrers(search),
    staleTime: 300_000,
  })
}

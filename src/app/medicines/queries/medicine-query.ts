import { queryOptions } from "@tanstack/react-query"
import { fetchMedicines } from "../services/medicine-api"
import type { FetchMedicinesParams } from "../types/medicine"

export const medicineKeys = {
  all: ["medicines"] as const,
  list: (filters: FetchMedicinesParams) =>
    [...medicineKeys.all, "list", filters] as const,
}

export function medicineListQueryOptions(filters: FetchMedicinesParams) {
  return queryOptions({
    queryKey: medicineKeys.list(filters),
    queryFn: () => fetchMedicines(filters),
  })
}

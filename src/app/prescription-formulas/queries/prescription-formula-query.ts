import { queryOptions } from "@tanstack/react-query"
import { fetchPrescriptionFormulas } from "../services/prescription-formula-api"

export const prescriptionFormulaKeys = {
  all: ["prescription-formulas"] as const,
  list: () => [...prescriptionFormulaKeys.all, "list"] as const,
}

export function prescriptionFormulaListQueryOptions() {
  return queryOptions({
    queryKey: prescriptionFormulaKeys.list(),
    queryFn: fetchPrescriptionFormulas,
    staleTime: 60_000,
  })
}

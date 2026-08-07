import { queryOptions } from "@tanstack/react-query"

import { fetchBankAccountOptions } from "@/services/bankAccountService"

export const bankAccountKeys = {
  all: ["bank-accounts"] as const,
  options: () => [...bankAccountKeys.all, "options"] as const,
}

export function bankAccountOptionsQueryOptions(enabled = true) {
  return queryOptions({
    queryKey: bankAccountKeys.options(),
    queryFn: fetchBankAccountOptions,
    enabled,
    staleTime: 60_000,
  })
}

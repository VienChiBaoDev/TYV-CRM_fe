import type { PaginatedMeta } from "@/types/pagination"

export interface Medicine {
  id: string
  name: string
  unit: string
  unitPrice: number
  category?: string
}

export interface MedicineFilters {
  search?: string
  unit?: string
}

export interface FetchMedicinesParams extends MedicineFilters {
  page: number
  limit: number
}

export interface MedicineListResult {
  data: Medicine[]
  meta: PaginatedMeta
}

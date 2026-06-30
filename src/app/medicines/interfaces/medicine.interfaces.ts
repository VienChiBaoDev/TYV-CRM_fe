import type { PaginatedResponse } from "@/types/pagination"

export interface MedicineApi {
  id: string
  name: string
  unit: string
  unitPrice: number
  category: string | null
}

export type PaginatedMedicinesApi = PaginatedResponse<MedicineApi>

import API_PATHS from "@/constants/apiPaths"
import httpService from "@/services/httpService"
import type {
  ConsumableFormValues,
  StockInFormValues,
} from "../schemas/consumable-form"
import type { PaginatedResponse } from "@/types/pagination"

export interface ConsumableApi {
  id: string
  name: string
  unit: string
  stockQuantity: number
  note: string | null
  sessionQuotaText: string | null
  isActive: boolean
  sortOrder: number
}

export interface ConsumableOptionApi {
  id: string
  name: string
  unit: string
  stockQuantity: number
  sessionQuotaText: string | null
}

export interface ConsumableUsageApi {
  id: string
  consumableName: string
  unit: string
  quantity: number
  performedAt: string
  patientName: string
  patientCode: string
  serviceName: string
  sessionNumber: number
  performedByName: string | null
}

export type PaginatedConsumableUsageApi = PaginatedResponse<ConsumableUsageApi>

export interface FetchConsumableUsageParams {
  page?: number
  limit?: number
  search?: string
  from?: string
  to?: string
  consumableId?: string
}

export async function fetchConsumables(params?: {
  search?: string
  isActive?: boolean
}): Promise<ConsumableApi[]> {
  const { data } = await httpService.get<ConsumableApi[]>(
    API_PATHS.consumables.list,
    { params }
  )
  return data
}

export async function fetchConsumableOptions(): Promise<ConsumableOptionApi[]> {
  const { data } = await httpService.get<ConsumableOptionApi[]>(
    API_PATHS.consumables.options
  )
  return data
}

export async function createConsumable(payload: ConsumableFormValues) {
  const { data } = await httpService.post(API_PATHS.consumables.create, payload)
  return data
}

export async function updateConsumable(
  id: string,
  payload: Partial<ConsumableFormValues>
) {
  const { data } = await httpService.patch(
    API_PATHS.consumables.update(id),
    payload
  )
  return data
}

export async function stockInConsumable(
  id: string,
  payload: StockInFormValues
) {
  const { data } = await httpService.post(
    API_PATHS.consumables.stockIn(id),
    payload
  )
  return data
}

export async function fetchConsumableUsage(
  params: FetchConsumableUsageParams = {}
): Promise<PaginatedConsumableUsageApi> {
  const { data } = await httpService.get<PaginatedConsumableUsageApi>(
    API_PATHS.consumables.usage,
    { params }
  )
  return data
}

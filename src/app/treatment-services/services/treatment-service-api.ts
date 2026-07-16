import API_PATHS from "@/constants/apiPaths"
import httpService from "@/services/httpService"
import type {
  CatalogServiceApi,
  FetchCatalogServicesParams,
  ServiceGroupApi,
} from "../interfaces/treatment-services.interfaces"
import type { ServiceItemType } from "../types/treatment-service"

export async function fetchServiceGroups(): Promise<ServiceGroupApi[]> {
  const { data } = await httpService.get<ServiceGroupApi[]>(
    API_PATHS.serviceCatalog.groups.list
  )
  return data
}

export async function createServiceGroup(payload: {
  code: string
  name: string
  itemType: ServiceItemType
}): Promise<ServiceGroupApi> {
  const { data } = await httpService.post<ServiceGroupApi>(
    API_PATHS.serviceCatalog.groups.create,
    payload
  )
  return data
}

export async function updateServiceGroup(
  id: string,
  payload: {
    code: string
    name: string
    itemType: ServiceItemType
  }
): Promise<ServiceGroupApi> {
  const { data } = await httpService.patch<ServiceGroupApi>(
    API_PATHS.serviceCatalog.groups.update(id),
    payload
  )
  return data
}

export async function fetchCatalogServices(params: FetchCatalogServicesParams) {
  const { data } = await httpService.get<CatalogServiceApi[]>(
    API_PATHS.serviceCatalog.services.list,
    { params }
  )
  return data
}

export async function createCatalogService(
  // Omit là loại bỏ các field không cần thiết
  payload: Omit<CatalogServiceApi, "id">
): Promise<CatalogServiceApi> {
  const { data } = await httpService.post<CatalogServiceApi>(
    API_PATHS.serviceCatalog.services.create,
    payload
  )
  return data
}

export async function updateCatalogService(
  id: string,
  payload: Omit<CatalogServiceApi, "id">
): Promise<CatalogServiceApi> {
  const { data } = await httpService.patch<CatalogServiceApi>(
    API_PATHS.serviceCatalog.services.update(id),
    payload
  )
  return data
}

import API_PATHS from "@/constants/apiPaths"
import httpService from "@/services/httpService"
import type { PaginatedMedicinesApi } from "../interfaces/medicine.interfaces"
import type { MedicineFormValues } from "../schemas/medicine-form"
import type { FetchMedicinesParams, Medicine } from "../types/medicine"
import {
  mapFormValuesToApiPayload,
  mapMedicineFromApi,
} from "../mappers/map-medicine"

export async function fetchMedicines(
  params: FetchMedicinesParams
): Promise<{ data: Medicine[]; meta: PaginatedMedicinesApi["meta"] }> {
  const { data } = await httpService.get<PaginatedMedicinesApi>(
    API_PATHS.medicines.list,
    { params }
  )

  return {
    data: data.data.map(mapMedicineFromApi),
    meta: data.meta,
  }
}

export async function fetchMedicineById(id: string): Promise<Medicine> {
  const { data } = await httpService.get(API_PATHS.medicines.detail(id))
  return mapMedicineFromApi(data)
}

export async function createMedicine(
  payload: MedicineFormValues
): Promise<Medicine> {
  const { data } = await httpService.post(
    API_PATHS.medicines.create,
    mapFormValuesToApiPayload(payload)
  )
  return mapMedicineFromApi(data)
}

export async function updateMedicine(
  id: string,
  payload: MedicineFormValues
): Promise<Medicine> {
  const { data } = await httpService.patch(
    API_PATHS.medicines.update(id),
    mapFormValuesToApiPayload(payload)
  )
  return mapMedicineFromApi(data)
}

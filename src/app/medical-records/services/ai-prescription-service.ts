import httpService from "@/services/httpService"
import API_PATHS from "@/constants/apiPaths"

export interface AiSuggestHerb {
  readonly name: string
  readonly weight: string
  readonly medicineId: string | null
  readonly unit: string | null
  readonly matchedFromCatalog: boolean
}

export interface AiSuggestPrescriptionResponse {
  readonly diagnosis: string
  readonly prescriptionFormula: string
  readonly prescriptionDosage: string
  readonly herbs: AiSuggestHerb[]
  readonly rationale: string
  readonly warnings: string[]
  readonly model: string
}

export interface AiSuggestPrescriptionPayload {
  symptoms: string
  bloodPressure?: string
  pulse?: string
  labResults?: string
  pulseDiagnosis?: {
    ta?: string
    huu?: string
    bung?: string
  }
}

export async function suggestVisitPrescription(
  patientId: string,
  payload: AiSuggestPrescriptionPayload
): Promise<AiSuggestPrescriptionResponse> {
  const { data } = await httpService.post<AiSuggestPrescriptionResponse>(
    API_PATHS.patientVisits.aiSuggest(patientId),
    payload
  )
  return data
}

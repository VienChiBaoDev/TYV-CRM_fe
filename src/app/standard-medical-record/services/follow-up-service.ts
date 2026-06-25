import type { ClinicBranchCode } from "@/app/medical-records/data/patientService"
import httpService from "@/services/httpService"
import type {
  FollowUpScheduleApiResponse,
  PendingAssessmentApiResponse,
  ScheduleFollowUpPayload,
  SubmitAssessmentPayload,
} from "../interfaces/StandardMedicalRecord"
import API_PATHS from "@/constants/apiPaths"

export async function fetchUpcomingFollowUps(params?: {
  branch?: ClinicBranchCode
  daysAhead?: number
}): Promise<FollowUpScheduleApiResponse[]> {
  const { data } = await httpService.get<FollowUpScheduleApiResponse[]>(
    API_PATHS.followUps.upcoming,
    { params }
  )
  return data
}

export async function fetchPendingAssessments(params?: {
  branch?: ClinicBranchCode
}): Promise<PendingAssessmentApiResponse[]> {
  const { data } = await httpService.get<PendingAssessmentApiResponse[]>(
    API_PATHS.followUps.pendingAssessment,
    { params }
  )
  return data
}

export async function scheduleFollowUp(
  followUpId: string,
  payload: ScheduleFollowUpPayload
): Promise<FollowUpScheduleApiResponse> {
  const { data } = await httpService.patch<FollowUpScheduleApiResponse>(
    API_PATHS.followUps.scheduleFollowUp(followUpId),
    payload
  )
  return data
}

export async function submitAssessment(
  followUpId: string,
  payload: SubmitAssessmentPayload
): Promise<PendingAssessmentApiResponse> {
  const { data } = await httpService.patch<PendingAssessmentApiResponse>(
    API_PATHS.followUps.submitAssessment(followUpId),
    payload
  )
  return data
}

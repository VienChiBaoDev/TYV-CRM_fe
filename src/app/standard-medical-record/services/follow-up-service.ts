import type { ClinicBranchCode } from "@/app/medical-records/data/patientService"
import httpService from "@/services/httpService"
import type {
  FollowUpScheduleApiResponse,
  PendingAssessmentApiResponse,
  ScheduleFollowUpPayload,
  SubmitAssessmentPayload,
} from "../interfaces/StandardMedicalRecord"
import API_PATHS from "@/constants/apiPaths"
import type { PaginatedResponse } from "@/types/pagination"
import { DEFAULT_LIMIT, DEFAULT_PAGE } from "@/types/pagination"

interface FollowUpListParams {
  branch?: ClinicBranchCode
  page?: number
  limit?: number
}

export async function fetchUpcomingFollowUps(
  params?: FollowUpListParams & { daysAhead?: number }
): Promise<PaginatedResponse<FollowUpScheduleApiResponse>> {
  const { data } = await httpService.get<
    PaginatedResponse<FollowUpScheduleApiResponse>
  >(API_PATHS.followUps.upcoming, {
    params: {
      branch: params?.branch,
      daysAhead: params?.daysAhead,
      page: params?.page ?? DEFAULT_PAGE,
      limit: params?.limit ?? DEFAULT_LIMIT,
    },
  })
  return data
}

export async function fetchPendingAssessments(
  params?: FollowUpListParams
): Promise<PaginatedResponse<PendingAssessmentApiResponse>> {
  const { data } = await httpService.get<
    PaginatedResponse<PendingAssessmentApiResponse>
  >(API_PATHS.followUps.pendingAssessment, {
    params: {
      branch: params?.branch,
      page: params?.page ?? DEFAULT_PAGE,
      limit: params?.limit ?? DEFAULT_LIMIT,
    },
  })
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

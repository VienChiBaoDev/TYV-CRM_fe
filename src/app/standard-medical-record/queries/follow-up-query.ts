import { keepPreviousData, queryOptions } from "@tanstack/react-query"
import type { ClinicBranchCode } from "@/app/medical-records/data/patientService"
import {
  fetchPendingAssessments,
  fetchUpcomingFollowUps,
} from "../services/follow-up-service"
import {
  mapToClinicalAssessment,
  mapToFollowUpSchedule,
} from "../mappers/map-follow-up-response"
import { DEFAULT_LIMIT, DEFAULT_PAGE } from "@/types/pagination"

export interface PendingAssessmentsQueryParams {
  branch?: ClinicBranchCode
  page?: number
  limit?: number
}

export const followUpKeys = {
  all: ["follow-ups"] as const,
  upcoming: (branch?: ClinicBranchCode, daysAhead = 3) =>
    [...followUpKeys.all, "upcoming", branch, daysAhead] as const,
  pendingAssessments: () =>
    [...followUpKeys.all, "pending-assessment"] as const,
  pendingAssessment: (params: PendingAssessmentsQueryParams) =>
    [
      ...followUpKeys.pendingAssessments(),
      params.branch,
      params.page ?? DEFAULT_PAGE,
      params.limit ?? DEFAULT_LIMIT,
    ] as const,
}

export function upcomingFollowUpsQueryOptions(
  branch?: ClinicBranchCode,
  daysAhead = 3
) {
  return queryOptions({
    queryKey: followUpKeys.upcoming(branch, daysAhead),
    queryFn: async () => {
      const rows = await fetchUpcomingFollowUps({ branch, daysAhead })
      return rows.map(mapToFollowUpSchedule)
    },
  })
}

export function pendingAssessmentsQueryOptions(
  params: PendingAssessmentsQueryParams
) {
  return queryOptions({
    queryKey: followUpKeys.pendingAssessment(params),
    queryFn: async () => {
      const response = await fetchPendingAssessments(params)
      return {
        data: response.data.map(mapToClinicalAssessment),
        meta: response.meta,
      }
    },
    placeholderData: keepPreviousData,
  })
}

import { queryOptions } from "@tanstack/react-query"
import {
  fetchPendingAssessments,
  fetchUpcomingFollowUps,
} from "../services/follow-up-service"
import {
  mapToClinicalAssessment,
  mapToFollowUpSchedule,
} from "../mappers/map-follow-up-response"
import { DEFAULT_LIMIT, DEFAULT_PAGE } from "@/types/pagination"
import type { PaginatedMeta } from "@/types/pagination"
import { UPCOMING_DAYS_AHEAD } from "../components/FollowUpSchedule"

export interface FollowUpListQueryParams {
  clinicId?: string
  page?: number
  limit?: number
}

export interface MappedPaginatedResult<T> {
  data: T[]
  meta: PaginatedMeta
}

export const followUpKeys = {
  all: ["follow-ups"] as const,
  upcoming: (params: FollowUpListQueryParams & { daysAhead?: number }) =>
    [
      ...followUpKeys.all,
      "upcoming",
      params.clinicId,
      params.daysAhead ?? UPCOMING_DAYS_AHEAD,
      params.page ?? DEFAULT_PAGE,
      params.limit ?? DEFAULT_LIMIT,
    ] as const,
  pendingAssessment: (params: FollowUpListQueryParams) =>
    [
      ...followUpKeys.all,
      "pending-assessment",
      params.clinicId,
      params.page ?? DEFAULT_PAGE,
      params.limit ?? DEFAULT_LIMIT,
    ] as const,
}

export function upcomingFollowUpsQueryOptions(
  params: FollowUpListQueryParams & { daysAhead?: number }
) {
  return queryOptions({
    queryKey: followUpKeys.upcoming(params),
    queryFn: async (): Promise<
      MappedPaginatedResult<ReturnType<typeof mapToFollowUpSchedule>>
    > => {
      const response = await fetchUpcomingFollowUps(params)
      return {
        data: response.data.map(mapToFollowUpSchedule),
        meta: response.meta,
      }
    },
  })
}

export function pendingAssessmentsQueryOptions(
  params: FollowUpListQueryParams
) {
  return queryOptions({
    queryKey: followUpKeys.pendingAssessment(params),
    queryFn: async (): Promise<
      MappedPaginatedResult<ReturnType<typeof mapToClinicalAssessment>>
    > => {
      const response = await fetchPendingAssessments(params)
      return {
        data: response.data.map(mapToClinicalAssessment),
        meta: response.meta,
      }
    },
  })
}

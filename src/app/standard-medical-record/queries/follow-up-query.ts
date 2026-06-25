import { queryOptions } from "@tanstack/react-query"
import type { ClinicBranchCode } from "@/app/medical-records/data/patientService"
import {
  fetchPendingAssessments,
  fetchUpcomingFollowUps,
} from "../services/follow-up-service"
import {
  mapToClinicalAssessment,
  mapToFollowUpSchedule,
} from "../mappers/map-follow-up-response"

export const followUpKeys = {
  all: ["follow-ups"] as const,
  upcoming: (branch?: ClinicBranchCode, daysAhead = 3) =>
    [...followUpKeys.all, "upcoming", branch, daysAhead] as const,
  pendingAssessment: (branch?: ClinicBranchCode) =>
    [...followUpKeys.all, "pending-assessment", branch] as const,
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

export function pendingAssessmentsQueryOptions(branch?: ClinicBranchCode) {
  return queryOptions({
    queryKey: followUpKeys.pendingAssessment(branch),
    queryFn: async () => {
      const rows = await fetchPendingAssessments({ branch })
      return rows.map(mapToClinicalAssessment)
    },
  })
}

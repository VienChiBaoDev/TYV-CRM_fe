const API_PATHS = {
  followUps: {
    upcoming: "/follow-ups/upcoming",
    pendingAssessment: "/follow-ups/pending-assessment",
    scheduleFollowUp: (followUpId: string) =>
      `/follow-ups/${followUpId}/schedule`,
    submitAssessment: (followUpId: string) =>
      `/follow-ups/${followUpId}/submit-assessment`,
  },
}

export default API_PATHS

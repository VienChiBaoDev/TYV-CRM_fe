const API_PATHS = {
  AUTH: {
    LOGIN: "/auth/login",
    ME: "/auth/me",
  },
  followUps: {
    upcoming: "/follow-ups/upcoming",
    pendingAssessment: "/follow-ups/pending-assessment",
    scheduleFollowUp: (followUpId: string) =>
      `/follow-ups/${followUpId}/schedule`,
    submitAssessment: (followUpId: string) =>
      `/follow-ups/${followUpId}/assessment`,
  },
}

export default API_PATHS

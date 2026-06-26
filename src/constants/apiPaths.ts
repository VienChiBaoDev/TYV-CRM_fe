const API_PATHS = {
  followUps: {
    upcoming: "/follow-ups/upcoming",
    pendingAssessment: "/follow-ups/pending-assessment",
    scheduleFollowUp: (followUpId: string) =>
      `/follow-ups/${followUpId}/schedule`,
    submitAssessment: (followUpId: string) =>
      `/follow-ups/${followUpId}/assessment`,
  },
  appointments: {
    list: "/appointments",
    detail: (id: string) => `/appointments/${id}`,
  },
}

export default API_PATHS

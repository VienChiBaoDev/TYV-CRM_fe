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
  appointments: {
    list: "/appointments",
    create: "/appointments",
    update: (id: string) => `/appointments/${id}`,
  },
  serviceCatalog: {
    groups: {
      list: "/service-groups",
      create: "/service-groups",
      update: (id: string) => `/service-groups/${id}`,
    },
    services: {
      list: "/catalog-services",
      create: "/catalog-services",
      update: (id: string) => `/catalog-services/${id}`,
    },
  },
}

export default API_PATHS

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
    rescheduleFollowUp: (followUpId: string) =>
      `/follow-ups/${followUpId}/reschedule`,
  },
  appointments: {
    list: "/appointments",
    create: "/appointments",
    update: (id: string) => `/appointments/${id}`,
    checkIn: (id: string) => `/appointments/${id}/check-in`,
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
  medicines: {
    list: "/medicines",
    create: "/medicines",
    detail: (id: string) => `/medicines/${id}`,
    update: (id: string) => `/medicines/${id}`,
  },
  patientServices: {
    list: (patientId: string) => `/patients/${patientId}/services`,
    create: (patientId: string) => `/patients/${patientId}/services`,
    update: (patientId: string, serviceId: string) =>
      `/patients/${patientId}/services/${serviceId}`,
    cancel: (patientId: string, serviceId: string) =>
      `/patients/${patientId}/services/${serviceId}/cancel`,
    delete: (patientId: string, serviceId: string) =>
      `/patients/${patientId}/services/${serviceId}`,
  },
  patientPayments: {
    list: (patientId: string) => `/patients/${patientId}/payments`,
    create: (patientId: string) => `/patients/${patientId}/payments`,
    createRefund: (patientId: string) =>
      `/patients/${patientId}/payments/refunds`,
  },
  patientTreatment: {
    listByPatient: (patientId: string) =>
      `/patients/${patientId}/treatment-sessions`,
    listByService: (patientId: string, serviceId: string) =>
      `/patients/${patientId}/services/${serviceId}/treatment-sessions`,
    upsert: (patientId: string, serviceId: string) =>
      `/patients/${patientId}/services/${serviceId}/treatment-sessions`,
  },
}

export default API_PATHS

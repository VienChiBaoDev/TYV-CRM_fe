const API_PATHS = {
  AUTH: {
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
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
  patients: {
    list: "/patients",
    create: "/patients",
    detail: (id: string) => `/patients/${id}`,
    update: (id: string) => `/patients/${id}`,
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
    uploadImage: (
      patientId: string,
      serviceId: string,
      sessionNumber: number
    ) =>
      `/patients/${patientId}/services/${serviceId}/treatment-sessions/${sessionNumber}/images`,
    deleteImage: (
      patientId: string,
      serviceId: string,
      sessionNumber: number,
      imageId: string
    ) =>
      `/patients/${patientId}/services/${serviceId}/treatment-sessions/${sessionNumber}/images/${imageId}`,
  },
  staffShifts: {
    list: "/staff-shifts",
    create: "/staff-shifts",
    detail: (id: string) => `/staff-shifts/${id}`,
    update: (id: string) => `/staff-shifts/${id}`,
    delete: (id: string) => `/staff-shifts/${id}`,
  },
  prescriptionFormulaTemplates: {
    list: "/prescription-formula-templates",
    create: "/prescription-formula-templates",
    detail: (id: string) => `/prescription-formula-templates/${id}`,
    update: (id: string) => `/prescription-formula-templates/${id}`,
    delete: (id: string) => `/prescription-formula-templates/${id}`,
  },
  consumables: {
    list: "/consumables",
    options: "/consumables/options",
    usage: "/consumables/usage",
    create: "/consumables",
    update: (id: string) => `/consumables/${id}`,
    stockIn: (id: string) => `/consumables/${id}/stock-in`,
    stockAdjust: (id: string) => `/consumables/${id}/stock-adjust`,
  },
  clinics: {
    list: "/clinics",
    options: "/clinics/options",
    create: "/clinics",
    update: (id: string) => `/clinics/${id}`,
    delete: (id: string) => `/clinics/${id}`,
  },
}

export default API_PATHS

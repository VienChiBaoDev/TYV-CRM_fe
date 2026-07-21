export const urlPaths = {
  login: "/login",
  dashboard: "/dashboard",
  appointments: "/appointments",
  patients: "/patients",
  medicalRecords: (patientId: string = ":patientId") =>
    `/medical-record/${patientId}`,
  standardMedicalRecords: "/standard-medical-records",
  revenueKpi: "/revenue-kpi",
  commissionPayroll: "/commission-payroll",
  herbsProducts: "/herbs-products",
  prescriptionFormulas: "/prescription-formulas",
  medicalRecordList: "/medical-record",
  medicalRecordCreate: "/medical-record/create",
  referrers: "/referrers",
  treatmentServices: "/treatment-services",
  settings: "/settings",
  staffSchedules: "/staff-schedules",
} as const

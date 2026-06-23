export const urlPaths = {
  dashboard: "/dashboard",
  appointments: "/appointments",
  patients: "/patients",
  medicalRecords: (patientId: string = ":patientId") =>
    `/medical-record/${patientId}`,
  standardMedicalRecords: "/standard-medical-records",
  revenueKpi: "/revenue-kpi",
  commissionPayroll: "/commission-payroll",
  herbsProducts: "/herbs-products",
  medicalRecordList: "/medical-record",
  medicalRecordCreate: "/medical-record/create",
  referrers: "/referrers",
} as const

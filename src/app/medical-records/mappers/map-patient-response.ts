import type {
  Patient,
  TreatmentStatus,
  Visit,
  VisitFollowUpPlan,
} from "@/app/medical-records/interfaces/types"
import { formatIsoDateToVi } from "@/app/medical-records/constants/visit-form"

export interface PatientDetailApiResponse {
  readonly id: string
  readonly patientCode: string
  readonly fullName: string
  readonly gender: "MALE" | "FEMALE"
  readonly birthDate: string | null
  readonly age: number | null
  readonly occupation: string | null
  readonly phone: string
  readonly address: string | null
  readonly avatarInitials: string | null
  readonly clinicBranch: "HANG_BONG" | "CAU_GIAY"
  readonly tags: string[]
  readonly dietRestrictions: string[]
  readonly nextFollowUpDate: string | null
  readonly customerStatus:
    | "LEAD"
    | "EXAMINING"
    | "IN_TREATMENT"
    | "COMPLETED"
    | "INACTIVE"
  readonly visitsCount: number
  readonly treatmentDays: number
  readonly visits: MedicalVisitApiResponse[]
}

export interface MedicalVisitApiResponse {
  readonly id: string
  readonly patientId: string
  readonly visitNumber: number
  readonly title: string
  readonly visitDate: string
  readonly doctorName: string
  readonly mode: "ONLINE" | "IN_PERSON"
  readonly location: string
  readonly bloodPressure: string | null
  readonly pulse: string | null
  readonly symptoms: string | null
  readonly pulseDiagnosis: {
    readonly ta: string | null
    readonly huu: string | null
    readonly bung: string | null
  }
  readonly prescriptionFormula: string | null
  readonly prescriptionDosage: string | null
  readonly labResults: string | null
  readonly status:
    | "INITIAL_EXAM"
    | "FOLLOW_UP"
    | "ONLINE"
    | "NEED_ADJUSTMENT"
    | "PLANNED"
  readonly herbs: ReadonlyArray<{
    readonly id: string
    readonly name: string
    readonly weight: string
    readonly sortOrder: number
    readonly medicineId: string | null
    readonly unit: string | null
    readonly quantity: number | null
    readonly unitPrice: number | null
    readonly lineTotal: number | null
    readonly decoctionOrder: string | null
    readonly decoctionPrep: string | null
  }>
  readonly clinicalImages: ReadonlyArray<{
    readonly id: string
    readonly imageUrl: string
    readonly category: "DIAGNOSIS" | "LAB_RESULT" | "OTHER"
    readonly sortOrder: number
  }>
  readonly followUpPlan: {
    readonly id: string
    readonly followUpDate: string
    readonly assessmentDate: string
    readonly reminderDaysBefore: number
    readonly physicianInCharge: string
    readonly facility: "HANG_BONG" | "CAU_GIAY"
    readonly scheduleStatus: string
    readonly assessmentResult: string | null
    readonly assessmentNote: string | null
    readonly assessedAt: string | null
  } | null
  readonly createdAt: string
  readonly updatedAt: string
}

const GENDER_LABEL: Record<PatientDetailApiResponse["gender"], Patient["gender"]> =
  {
    MALE: "Nam",
    FEMALE: "Nữ",
  }

const VISIT_MODE_LABEL: Record<MedicalVisitApiResponse["mode"], Visit["mode"]> =
  {
    ONLINE: "Online",
    IN_PERSON: "Trực tiếp",
  }

const VISIT_STATUS_LABEL: Record<
  MedicalVisitApiResponse["status"],
  Visit["status"]
> = {
  INITIAL_EXAM: "Khám đầu",
  FOLLOW_UP: "Tái khám",
  ONLINE: "Online",
  NEED_ADJUSTMENT: "Cần TD",
  PLANNED: "Kế hoạch",
}

const CUSTOMER_STATUS_TO_TREATMENT: Record<
  PatientDetailApiResponse["customerStatus"],
  TreatmentStatus
> = {
  LEAD: "Đang điều trị",
  EXAMINING: "Cần theo dõi",
  IN_TREATMENT: "Đang điều trị",
  COMPLETED: "Kết thúc đợt",
  INACTIVE: "Kết thúc đợt",
}

function mapFollowUpPlan(
  plan: NonNullable<MedicalVisitApiResponse["followUpPlan"]>,
  defaultTreatmentStatus: TreatmentStatus
): VisitFollowUpPlan {
  return {
    followUpDate: plan.followUpDate,
    reminderDaysBefore: plan.reminderDaysBefore,
    treatmentStatus: defaultTreatmentStatus,
  }
}

function mapVisit(
  visit: MedicalVisitApiResponse,
  defaultTreatmentStatus: TreatmentStatus
): Visit {
  return {
    id: visit.id,
    visitNumber: visit.visitNumber,
    title: visit.title,
    date: formatIsoDateToVi(visit.visitDate),
    doctor: visit.doctorName,
    mode: VISIT_MODE_LABEL[visit.mode],
    location: visit.location,
    bloodPressure: visit.bloodPressure ?? "",
    pulse: visit.pulse ?? "",
    symptoms: visit.symptoms ?? "",
    pulseDiagnosis: {
      ta: visit.pulseDiagnosis.ta ?? "",
      huu: visit.pulseDiagnosis.huu ?? "",
      bung: visit.pulseDiagnosis.bung ?? "",
    },
    prescriptionFormula: visit.prescriptionFormula ?? "",
    prescriptionDosage: visit.prescriptionDosage ?? "",
    herbs: visit.herbs.map((herb) => ({
      name: herb.name,
      weight: herb.weight,
      medicineId: herb.medicineId ?? undefined,
      unit: herb.unit ?? undefined,
      quantity: herb.quantity ?? undefined,
      unitPrice: herb.unitPrice ?? undefined,
      lineTotal: herb.lineTotal ?? undefined,
      decoctionOrder: herb.decoctionOrder ?? undefined,
      decoctionPrep: herb.decoctionPrep ?? undefined,
    })),
    clinicalImages: visit.clinicalImages.map((image) => ({
      id: image.id,
      imageUrl: image.imageUrl,
      category: image.category,
      sortOrder: image.sortOrder,
    })),
    labResults: visit.labResults ?? "",
    status: VISIT_STATUS_LABEL[visit.status],
    followUpPlan: visit.followUpPlan
      ? mapFollowUpPlan(visit.followUpPlan, defaultTreatmentStatus)
      : undefined,
  }
}

export function mapPatientDetailToPatient(
  response: PatientDetailApiResponse
): Patient {
  const treatmentStatus =
    CUSTOMER_STATUS_TO_TREATMENT[response.customerStatus] ?? "Đang điều trị"

  return {
    id: response.id,
    patientCode: response.patientCode,
    name: response.fullName,
    gender: GENDER_LABEL[response.gender],
    age: response.age ?? 0,
    job: response.occupation ?? "",
    phone: response.phone,
    address: response.address ?? "",
    tags: [...response.tags],
    dietRestrictions: [...response.dietRestrictions],
    metricVisitsCount: response.visitsCount,
    metricTreatmentDays: response.treatmentDays,
    metricNextExamination: response.nextFollowUpDate
      ? formatIsoDateToVi(response.nextFollowUpDate)
      : "—",
    avatarInitials:
      response.avatarInitials ??
      response.fullName
        .split(" ")
        .filter(Boolean)
        .slice(-2)
        .map((part) => part[0]?.toUpperCase() ?? "")
        .join(""),
    visits: response.visits.map((visit) => mapVisit(visit, treatmentStatus)),
  }
}

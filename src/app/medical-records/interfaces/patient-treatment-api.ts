/**
 * Interface response cho vật tư tiêu hao buổi điều trị
 */
export interface TreatmentSessionConsumableApi {
  id: string
  consumableId: string
  name: string
  unit: string
  quantity: number
}

/**
 * Interface response cho ảnh buổi điều trị
 */
export interface TreatmentSessionImageApi {
  id: string
  imageUrl: string
  sortOrder: number
}

/**
 * Interface response cho màn hình hiển thị danh sách điều trị chi tiết
 */
export interface TreatmentSessionApi {
  id: string
  sessionNumber: number
  doctorId: string | null
  doctorName: string | null
  ptKtvId: string | null
  ptKtvName: string | null
  professionalSupport: string | null
  treatmentContent: string
  note: string | null
  nextContent: string | null
  nextTreatmentDate: string | null
  performedAt: string
  performedByName: string | null
  images: TreatmentSessionImageApi[]
  consumables: TreatmentSessionConsumableApi[]
  hasConsumables: boolean
}

/**
 * Interface response cho màn hình hiển thị danh sách điều trị chi tiết
 */
export interface TreatmentSessionListApi {
  service: {
    id: string
    serviceName: string
    sessionTotal: number
    completedSessions: number
    maxAllowedSession: number
  }
  sessions: TreatmentSessionApi[]
}

/**
 * Interface response cho màn hình hiển thị lịch sử điều trị
 */
export interface TreatmentHistoryItemApi {
  id: string
  serviceId: string
  serviceName: string
  sessionNumber: number
  sessionTotal: number
  treatmentContent: string
  performedAt: string
  doctorName: string | null
  ptKtvName: string | null
  status: "IN_PROGRESS" | "COMPLETED"
}

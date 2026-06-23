import { createContext } from "react"
import type { MedicalRecordContextValue } from "@/app/medical-records/hooks/use-medical-records"

export const MedicalRecordContext =
  createContext<MedicalRecordContextValue | null>(null)

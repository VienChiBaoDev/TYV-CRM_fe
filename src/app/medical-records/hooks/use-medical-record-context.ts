import { useContext } from "react"
import { MedicalRecordContext } from "@/app/medical-records/context/medical-record-context"

export function useMedicalRecordContext() {
  const context = useContext(MedicalRecordContext)
  if (!context) {
    throw new Error(
      "useMedicalRecordContext must be used within MedicalRecordProvider"
    )
  }
  return context
}

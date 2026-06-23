import type { ReactNode } from "react"
import { useMedicalRecords } from "@/app/medical-records/hooks/use-medical-records"
import { MedicalRecordContext } from "@/app/medical-records/context/medical-record-context"

interface MedicalRecordProviderProps {
  children: ReactNode
}

export function MedicalRecordProvider({ children }: MedicalRecordProviderProps) {
  const value = useMedicalRecords()

  return (
    <MedicalRecordContext.Provider value={value}>
      {children}
    </MedicalRecordContext.Provider>
  )
}

import { MedicalRecordProvider } from "@/app/medical-records/context/medical-record-provider"
import { MedicalRecordPage } from "@/app/medical-records/components/MedicalRecordPage"

export default function MedicalRecords() {
  return (
    <MedicalRecordProvider>
      <MedicalRecordPage />
    </MedicalRecordProvider>
  )
}

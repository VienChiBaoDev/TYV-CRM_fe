import { FollowUpSchedule } from "./FollowUpSchedule"
import { ClinicalAssessmentScale } from "./ClinicalAssessmentScale"

export function StandardMedicalRecord() {
  return (
    <div className="h-full bg-[#e1e5e1] p-4">
      <FollowUpSchedule />
      <ClinicalAssessmentScale />
    </div>
  )
}

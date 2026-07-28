import { FollowUpSchedule } from "./FollowUpSchedule"
import { ClinicalAssessmentScale } from "./ClinicalAssessmentScale"

export function StandardMedicalRecord() {
  return (
    <div className="p-4">
      <FollowUpSchedule />
      <ClinicalAssessmentScale />
    </div>
  )
}

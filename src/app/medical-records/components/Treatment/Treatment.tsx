import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { useParams } from "react-router-dom"
import { treatmentHistoryQueryOptions } from "../../queries/patient-treatment-query"
import TreatmentAction from "./TreatmentAction"
import { TreatmentHistoryTable } from "./TreatmentHistoryTable"

export default function Treatment() {
  const { patientId = "" } = useParams()
  const { data = [], isLoading } = useQuery(
    treatmentHistoryQueryOptions(patientId)
  )
  const [treatment, setTreatment] = useState(false)

  return (
    <div>
      {treatment ? (
        <TreatmentAction onClose={() => setTreatment(false)} />
      ) : (
        <TreatmentHistoryTable
          data={data}
          loading={isLoading}
          onStartTreatment={() => setTreatment(true)}
        />
      )}
    </div>
  )
}

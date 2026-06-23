import { ListHeader } from "./List/ListHeader"
import { SummaryCards } from "./List/SummaryCards"
import { ListFilters } from "./List/ListFilters"
import { PatientTable } from "./List/PatientTable"

export default function MedicalRecordList() {
  return (
    <div className="h-full bg-slate-50 p-6 overflow-y-auto">
      <div className="max-w-7xl mx-auto space-y-2">
        <ListHeader />
        <SummaryCards />
        
        <div className="bg-white rounded-xl shadow-sm p-5 border border-slate-100">
          <ListFilters />
          <PatientTable />
        </div>
      </div>
    </div>
  )
}


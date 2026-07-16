import { AlertCircle, Printer, Plus } from "lucide-react"
import { useMedicalRecordContext } from "@/app/medical-records/hooks/use-medical-record-context"
import { formatIsoDateToVi } from "@/app/medical-records/constants/visit-form"
import { Button } from "@/components/ui/button"

export default function PatientProfile() {
  const { activePatient, activeVisit, setShowExportModal, openAddVisitModal } =
    useMedicalRecordContext()

  const followUpDisplayDate = activeVisit?.followUpPlan?.followUpDate
    ? formatIsoDateToVi(activeVisit.followUpPlan.followUpDate)
    : activePatient.metricNextExamination

  return (
    <section
      className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-xs"
      id="patient-profile-card"
    >
      <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
        <div className="flex items-start gap-4 sm:items-center">
          <div className="font-display flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-2 border-emerald-500/20 bg-emerald-50 text-xl font-bold text-emerald-800 shadow-xs select-none">
            {activePatient.avatarInitials}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3
                className="font-display text-xl font-bold tracking-tight text-slate-800"
                id="patient-name"
              >
                {activePatient.name}
              </h3>
              <span className="rounded-md border border-emerald-100 bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                {activePatient.patientCode}
              </span>
            </div>

            <p className="mt-1 text-xs leading-relaxed text-slate-500">
              {activePatient.gender} · {activePatient.age} tuổi ·{" "}
              {activePatient.job} ·{" "}
              <span className="font-mono font-semibold text-slate-600">
                {activePatient.phone}
              </span>{" "}
              · {activePatient.address}
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              {activePatient.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="rounded-md border border-rose-100 bg-rose-50 px-2.5 py-0.5 text-[10px] font-semibold text-rose-700/90 shadow-2xs"
                >
                  {tag}
                </span>
              ))}

              {activePatient.dietRestrictions.length > 0 && (
                <div className="ml-1 flex items-center gap-1 rounded-md border border-red-100 bg-red-50 px-2 py-0.5 text-[10px] font-medium text-red-600">
                  <AlertCircle className="h-3 w-3 shrink-0" />
                  <span>
                    Kiêng: {activePatient.dietRestrictions.join(", ")}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-3 sm:self-center lg:self-auto">
          <div className="min-w-[70px] rounded-xl border border-emerald-100 bg-emerald-50/70 px-4 py-2 text-center shadow-2xs">
            <p className="font-display text-2xl leading-none font-bold text-emerald-800">
              {activePatient.metricVisitsCount}
            </p>
            <p className="mt-1 text-[9px] font-bold tracking-wider text-emerald-600 uppercase">
              Lần khám
            </p>
          </div>

          <div className="min-w-[70px] rounded-xl border border-amber-100 bg-amber-50/60 px-4 py-2 text-center shadow-2xs">
            <p className="font-display text-2xl leading-none font-bold text-amber-700">
              {activePatient.metricTreatmentDays}
            </p>
            <p className="mt-1 text-[9px] font-bold tracking-wider text-amber-600/90 uppercase">
              Ngày đ.trị
            </p>
          </div>

          <div className="min-w-[70px] rounded-xl border border-indigo-100 bg-indigo-50/60 px-4 py-2 text-center shadow-2xs">
            <p className="font-mono text-2xl leading-none font-bold text-indigo-700">
              {followUpDisplayDate}
            </p>
            <p className="mt-1 text-[9px] font-bold tracking-wider text-indigo-600 uppercase">
              Tái khám
            </p>
          </div>

          <div className="flex flex-col gap-2 pl-2 sm:flex-row">
            <button
              id="export-ba-btn"
              onClick={() => setShowExportModal(true)}
              className="border-slate-250 text-slate-705 inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-lg border px-3.5 py-1.5 text-xs font-semibold shadow-2xs transition-colors hover:bg-slate-50"
            >
              <Printer className="h-3.5 w-3.5" />
              Xuất BA
            </button>

            <Button
              id="add-visit-btn"
              onClick={openAddVisitModal}
              className="shadow-emerald-850/10 inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-bold shadow-md transition-colors"
            >
              <Plus className="h-4 w-4" />
              Thêm lần khám
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

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
      className="rounded-xl border border-slate-200/60 bg-white p-3 shadow-xs sm:rounded-2xl sm:p-6"
      id="patient-profile-card"
    >
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
        <div className="flex min-w-0 items-start gap-3 sm:gap-4">
          <div className="font-display flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-emerald-500/20 bg-emerald-50 text-base font-bold text-emerald-800 shadow-xs select-none sm:h-16 sm:w-16 sm:text-xl">
            {activePatient.avatarInitials}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <h3
                className="font-display text-base font-bold tracking-tight text-slate-800 sm:text-xl"
                id="patient-name"
              >
                {activePatient.name}
              </h3>
              <span className="rounded-md border border-emerald-100 bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700 sm:px-2">
                {activePatient.patientCode}
              </span>
            </div>

            <p className="mt-1 space-y-0.5 text-[11px] leading-snug text-slate-500 sm:text-xs sm:leading-relaxed">
              <span className="block sm:inline">
                {activePatient.gender} · {activePatient.age} tuổi ·{" "}
                {activePatient.job}
              </span>
              <span className="block font-mono font-semibold text-slate-600 sm:inline">
                {activePatient.phone}
              </span>
              <span className="block text-slate-500 sm:inline">
                {activePatient.address}
              </span>
            </p>

            {(activePatient.tags.length > 0 ||
              activePatient.dietRestrictions.length > 0) && (
              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                {activePatient.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="rounded-md border border-rose-100 bg-rose-50 px-2 py-0.5 text-[10px] font-semibold text-rose-700/90"
                  >
                    {tag}
                  </span>
                ))}

                {activePatient.dietRestrictions.length > 0 && (
                  <div className="flex items-center gap-1 rounded-md border border-red-100 bg-red-50 px-2 py-0.5 text-[10px] font-medium text-red-600">
                    <AlertCircle className="h-3 w-3 shrink-0" />
                    <span>
                      Kiêng: {activePatient.dietRestrictions.join(", ")}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex w-full flex-col gap-2.5 lg:w-auto lg:items-end">
          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-lg border border-emerald-100 bg-emerald-50/70 px-2 py-1.5 text-center sm:min-w-[70px] sm:rounded-xl sm:px-4 sm:py-2">
              <p className="font-display text-lg leading-none font-bold text-emerald-800 sm:text-2xl">
                {activePatient.metricVisitsCount}
              </p>
              <p className="mt-0.5 text-[8px] font-bold tracking-wider text-emerald-600 uppercase sm:mt-1 sm:text-[9px]">
                Lần khám
              </p>
            </div>

            <div className="rounded-lg border border-amber-100 bg-amber-50/60 px-2 py-1.5 text-center sm:min-w-[70px] sm:rounded-xl sm:px-4 sm:py-2">
              <p className="font-display text-lg leading-none font-bold text-amber-700 sm:text-2xl">
                {activePatient.metricTreatmentDays}
              </p>
              <p className="mt-0.5 text-[8px] font-bold tracking-wider text-amber-600/90 uppercase sm:mt-1 sm:text-[9px]">
                Ngày đ.trị
              </p>
            </div>

            <div className="rounded-lg border border-indigo-100 bg-indigo-50/60 px-2 py-1.5 text-center sm:min-w-[70px] sm:rounded-xl sm:px-4 sm:py-2">
              <p className="font-mono text-sm leading-none font-bold text-indigo-700 sm:text-2xl">
                {followUpDisplayDate}
              </p>
              <p className="mt-0.5 text-[8px] font-bold tracking-wider text-indigo-600 uppercase sm:mt-1 sm:text-[9px]">
                Tái khám
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:flex sm:justify-end">
            <button
              id="export-ba-btn"
              onClick={() => setShowExportModal(true)}
              className="border-slate-250 text-slate-705 inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-lg border px-2.5 py-2 text-[11px] font-semibold shadow-2xs transition-colors hover:bg-slate-50 sm:px-3.5 sm:py-1.5 sm:text-xs"
            >
              <Printer className="h-3.5 w-3.5" />
              Xuất BA
            </button>

            <Button
              id="add-visit-btn"
              onClick={openAddVisitModal}
              className="shadow-emerald-850/10 inline-flex h-auto cursor-pointer items-center justify-center gap-1.5 rounded-lg px-2.5 py-2 text-[11px] font-bold shadow-md sm:px-3.5 sm:py-1.5 sm:text-xs"
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

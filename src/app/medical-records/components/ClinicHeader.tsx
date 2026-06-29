import { useState } from "react"
import { FileText, Plus } from "lucide-react"

import {
  AppointmentDialog,
  type AppointmentDialogContext,
} from "@/app/appointments/components/AppointmentDialog"
import { useMedicalRecordContext } from "@/app/medical-records/hooks/use-medical-record-context"
import { toClinicBranchCode } from "@/lib/clinic-branch"

export default function ClinicHeader() {
  const { activePatient, activeBranch, patientId } = useMedicalRecordContext()
  const branch = toClinicBranchCode(activeBranch)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogContext, setDialogContext] =
    useState<AppointmentDialogContext | null>(null)

  const openAppointmentDialog = () => {
    if (!patientId) return

    const now = new Date()
    setDialogContext({
      mode: "create",
      day: now,
      hour: now.getHours(),
      minute: now.getMinutes(),
      fixedPatient: {
        id: patientId,
        fullName: activePatient.name,
        patientCode: activePatient.patientCode,
        phone: activePatient.phone,
      },
    })
    setDialogOpen(true)
  }

  return (
    <>
      <header
        className="flex shrink-0 flex-col items-center justify-between gap-4 border-b border-slate-200 bg-white px-6 py-4 sm:flex-row"
        id="top-bar"
      >
        <div className="flex w-full items-center gap-4 sm:w-auto">
          <span className="font-display text-md flex items-center gap-2 font-bold text-slate-800">
            <FileText className="h-5 w-5 text-emerald-700" />
            Hồ sơ bệnh án
          </span>
        </div>

        <div className="flex w-full items-center justify-end gap-3 sm:w-auto">
          <button
            id="top-book-btn"
            type="button"
            disabled={!patientId}
            onClick={openAppointmentDialog}
            className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-emerald-800 px-4 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus className="h-3.5 w-3.5" />
            Đặt lịch
          </button>

          <div
            className="text-slate-750 flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-slate-100 bg-linear-to-b from-sky-100 to-indigo-100 text-xs font-bold shadow-2xs"
            title="Tài khoản Đông Y"
          >
            TL
          </div>
        </div>
      </header>

      <AppointmentDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        branch={branch}
        context={dialogContext}
        fixedPatientId={patientId}
      />
    </>
  )
}

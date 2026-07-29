import { useState } from "react"
import { FileText, Plus } from "lucide-react"

import {
  AppointmentDialog,
  type AppointmentDialogContext,
} from "@/app/appointments/components/AppointmentDialog"
import { useMedicalRecordContext } from "@/app/medical-records/hooks/use-medical-record-context"
import { Button } from "@/components/ui/button"

export default function ClinicHeader() {
  const { activePatient, activeClinicId, patientId } = useMedicalRecordContext()
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
        className="flex shrink-0 items-center justify-between gap-2 border-b border-slate-200 bg-white px-3 py-2.5 sm:px-6 sm:py-4"
        id="top-bar"
      >
        <span className="font-display flex min-w-0 items-center gap-1.5 text-sm font-bold text-slate-800 sm:gap-2 sm:text-base">
          <FileText className="h-4 w-4 shrink-0 text-emerald-700 sm:h-5 sm:w-5" />
          <span className="truncate">Hồ sơ bệnh án</span>
        </span>

        <div className="flex shrink-0 items-center gap-2">
          <Button
            id="top-book-btn"
            type="button"
            size="sm"
            disabled={!patientId}
            onClick={openAppointmentDialog}
            className="h-8 cursor-pointer gap-1 rounded-lg px-2.5 text-[11px] font-semibold shadow-sm sm:h-9 sm:px-4 sm:text-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            Đặt lịch
          </Button>
        </div>
      </header>

      <AppointmentDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        clinicId={activeClinicId}
        context={dialogContext}
        fixedPatientId={patientId}
      />
    </>
  )
}

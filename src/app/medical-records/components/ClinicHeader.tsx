import { FileText, Plus } from "lucide-react"
import { useMedicalRecordContext } from "@/app/medical-records/hooks/use-medical-record-context"

export default function ClinicHeader() {
  const { activePatient } = useMedicalRecordContext()

  return (
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
        <div className="hidden text-right text-xs lg:block">
          <span className="text-slate-505 font-medium">
            Thứ Sáu, 19/06/2026
          </span>
          <span className="mx-2 text-slate-300">|</span>
          <span className="rounded border border-emerald-100 bg-emerald-50 px-2 py-0.5 font-bold text-emerald-800">
            Bác sĩ: BS Phi Hưng
          </span>
        </div>

        <button
          id="top-book-btn"
          onClick={() => {
            alert(`Đăng ký lịch hẹn mới thành công cho ${activePatient.name}`)
          }}
          className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-emerald-800 px-4 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700"
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
  )
}

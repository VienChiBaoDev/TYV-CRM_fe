import { MedicalRecordProvider } from "@/app/medical-records/context/medical-record-provider"
import { MedicalRecordPage } from "@/app/medical-records/components/MedicalRecordPage"
import { useMedicalRecordContext } from "@/app/medical-records/hooks/use-medical-record-context"
import { getApiErrorMessage } from "@/app/medical-records/mappers/map-visit-request"

function MedicalRecordContent() {
  const { isLoading, isError, error, refetch, patientId } =
    useMedicalRecordContext()

  if (!patientId) {
    return (
      <div className="flex flex-1 items-center justify-center p-8 text-sm text-slate-500">
        Thiếu mã bệnh nhân trên URL. Ví dụ: /medical-record/&lt;uuid&gt;
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center p-8 text-sm text-slate-500">
        Đang tải hồ sơ bệnh án...
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
        <p className="text-sm text-red-600">
          {error ? getApiErrorMessage(error) : "Không tải được hồ sơ bệnh án."}
        </p>
        <button
          type="button"
          onClick={() => refetch()}
          className="rounded-lg bg-emerald-800 px-4 py-2 text-xs font-semibold text-white hover:bg-primary"
        >
          Thử lại
        </button>
      </div>
    )
  }

  return <MedicalRecordPage />
}

export default function MedicalRecords() {
  return (
    <MedicalRecordProvider>
      <MedicalRecordContent />
    </MedicalRecordProvider>
  )
}

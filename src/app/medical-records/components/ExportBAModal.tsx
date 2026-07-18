import { Printer, X } from "lucide-react"
import type { Patient, Visit } from "@/app/medical-records/interfaces/types"
import { HerbPrescriptionTable } from "@/app/medical-records/components/HerbPrescriptionTable"

interface ExportBAModalProps {
  showExportModal: boolean
  setShowExportModal: (show: boolean) => void
  activeBranch: string
  activePatient: Patient
  activeVisit: Visit | null
}

export default function ExportBAModal({
  showExportModal,
  setShowExportModal,
  activeBranch,
  activePatient,
  activeVisit,
}: ExportBAModalProps) {
  if (!showExportModal || !activeVisit) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/70 p-4 backdrop-blur-xs">
      <div className="relative max-h-[95vh] w-full max-w-3xl animate-in overflow-y-auto rounded-2xl bg-white p-8 shadow-2xl duration-150 zoom-in-95 fade-in">
        {/* Header controls overlay */}
        <div className="no-print absolute top-4 right-4 flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="inline-flex cursor-pointer items-center gap-1 rounded-lg bg-emerald-800 p-1 px-3 text-xs font-bold text-white shadow-sm hover:bg-primary"
          >
            <Printer className="h-3.5 w-3.5" /> In bệnh án
          </button>
          <button
            onClick={() => setShowExportModal(false)}
            className="text-slate-405 cursor-pointer rounded-full border border-slate-200 p-1 hover:text-slate-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* PRINT MATERIAL BODY FORM */}
        <div
          className="space-y-6 rounded-lg border border-slate-100 bg-white bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] p-6 pt-4 font-serif text-slate-900 md:p-8"
          id="printable-area"
        >
          {/* Institutional headers */}
          <div className="flex items-start justify-between border-b-2 border-double border-slate-400 pb-4">
            <div>
              <h4 className="text-base font-bold tracking-tight text-emerald-800 uppercase">
                CHẨN TRỊ ĐÔNG Y THƯỢNG Y VIÊN
              </h4>
              <p className="font-sans text-[10px] font-medium tracking-wide text-slate-500">
                Chi nhánh: {activeBranch} | Số giấy phép: 7824/SYT-GPHĐ
              </p>
              <p className="text-slate-450 font-sans text-[10px]">
                Địa chỉ liên hệ: Hồ Chí Minh - Hà Nội
              </p>
            </div>
            <div className="text-right">
              <h5 className="text-slate-850 text-xs font-bold">
                Mã hồ sơ: {activePatient.id}
              </h5>
              <p className="font-sans text-[10px] text-slate-500">
                Ngày in: {new Date().toLocaleDateString("vi-VN")}
              </p>
            </div>
          </div>

          {/* Title representation */}
          <div className="py-2 text-center">
            <h3 className="font-display text-xl font-bold tracking-wide text-slate-900 uppercase">
              HỒ SƠ BỆNH ÁN CỔ TRUYỀN
            </h3>
            <p className="mt-0.5 font-sans text-xs text-slate-500 italic">
              Lưu hành nội bộ & theo dõi điều trị lâu dài
            </p>
          </div>

          {/* Section 1: Patient Details */}
          <div className="space-y-2">
            <h5 className="border-b border-dashed border-slate-300 pb-1 font-sans text-xs font-bold tracking-wider text-slate-700 uppercase">
              I. HÀNH CHÍNH & TIỀN SỬ
            </h5>

            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs sm:grid-cols-4">
              <div>
                <span className="block font-sans text-slate-500">
                  Họ và tên:
                </span>
                <span className="font-display text-slate-850 font-bold uppercase">
                  {activePatient.name}
                </span>
              </div>
              <div>
                <span className="block font-sans text-slate-500">
                  Tuổi/Năm sinh:
                </span>
                <span className="font-semibold">{activePatient.age} tuổi</span>
              </div>
              <div>
                <span className="block font-sans text-slate-500">
                  Giới tính:
                </span>
                <span className="font-semibold">{activePatient.gender}</span>
              </div>
              <div>
                <span className="block font-sans text-slate-500">
                  Điện thoại liên hệ:
                </span>
                <span className="font-mono font-semibold text-slate-800">
                  {activePatient.phone}
                </span>
              </div>
              <div className="col-span-2">
                <span className="block font-sans text-slate-500">
                  Địa chỉ thường trú:
                </span>
                <span className="font-semibold text-slate-800">
                  {activePatient.address}
                </span>
              </div>
              <div className="col-span-2">
                <span className="block font-sans text-slate-500">
                  Hội chứng bệnh cảnh chính:
                </span>
                <span className="font-bold text-rose-800">
                  {activePatient.tags.join(" • ")}
                </span>
              </div>
            </div>

            {activePatient.dietRestrictions.length > 0 && (
              <p className="text-red-650 mt-2 rounded-lg border border-red-100 bg-red-50/50 p-2.5 font-sans text-xs">
                <strong className="uppercase">
                  ⚠️ Chống chỉ định ăn uống:
                </strong>{" "}
                Kiêng tuyệt đối {activePatient.dietRestrictions.join(", ")} để
                phòng phát bệnh và kích ứng da khớp.
              </p>
            )}
          </div>

          {/* Section 2: Last/Active visit review */}
          <div className="space-y-3 pt-2">
            <h5 className="border-b border-dashed border-slate-300 pb-1 font-sans text-xs font-bold tracking-wider text-slate-700 uppercase">
              II. TÌNH TRẠNG CHẨN ĐOÁN LẦN KHÁM GẦN NHẤT
            </h5>

            <div className="space-y-3">
              <div className="grid grid-cols-1 gap-4 text-xs sm:grid-cols-2">
                <div className="rounded-lg border border-slate-100 bg-slate-50 p-3">
                  <strong className="mb-1 block font-sans text-slate-800">
                    Vọng, văn, vấn, thiết (Tổng hợp triệu chứng):
                  </strong>
                  <p className="leading-relaxed text-slate-700 italic">
                    "{activeVisit.symptoms}"
                  </p>
                </div>

                <div className="space-y-1 rounded-lg border border-slate-100 bg-slate-50 bg-linear-to-b from-emerald-50/20 to-lime-50/10 p-3">
                  <strong className="mb-1 block font-sans text-slate-800">
                    Mạch chẩn chi tiết:
                  </strong>
                  <p className="text-[11px] text-slate-700">
                    <strong>Mạch bộ tả:</strong> {activeVisit.pulseDiagnosis.ta}
                  </p>
                  <p className="text-slate-705 text-[11px]">
                    <strong>Mạch bộ hữu:</strong>{" "}
                    {activeVisit.pulseDiagnosis.huu}
                  </p>
                  <p className="text-slate-705 text-[11px]">
                    <strong>Chẩn bụng sườn:</strong>{" "}
                    {activeVisit.pulseDiagnosis.bung}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Exact Prescription list */}
          <div className="space-y-3 pt-2">
            <h5 className="border-b border-dashed border-slate-300 pb-1 font-sans text-xs font-bold tracking-wider text-slate-700 uppercase">
              III. ĐƠN THUỐC ĐIỀU TRỊ CHỈ ĐỊNH:{" "}
              {activeVisit.prescriptionFormula}
            </h5>

            <div className="border-amber-205 space-y-3 rounded-xl border bg-amber-50/15 p-4">
              <div className="flex items-center justify-between border-b border-dashed border-amber-200 pb-1 text-xs">
                <span className="font-bold text-slate-800">
                  Cổ phương gia giảm: {activeVisit.prescriptionFormula}
                </span>
                <span className="font-semibold text-emerald-800">
                  Phác đồ: {activeVisit.prescriptionDosage}
                </span>
              </div>

              <HerbPrescriptionTable
                herbs={activeVisit.herbs ?? []}
                compact
                emptyMessage="Chưa có chỉ định bốc thuốc tây/đông dược lâm sàng."
              />

              {activeVisit.labResults && (
                <p className="col-span-full rounded bg-slate-50 p-2 font-sans text-[11px] text-slate-500">
                  <strong>Ghi chú bổ sung:</strong> {activeVisit.labResults}
                </p>
              )}
            </div>
          </div>

          {/* Institutional Signatures */}
          <div className="grid grid-cols-2 pt-8 text-center font-sans text-xs">
            <div>
              <p className="text-slate-500">Bệnh nhân ký xác nhận nhận đơn</p>
              <p className="mt-2 text-[10px] text-slate-400 select-none">
                (Ký & ghi rõ họ tên)
              </p>
              <div className="h-16"></div>
              <p className="font-bold text-slate-700 uppercase">
                {activePatient.name}
              </p>
            </div>
            <div>
              <p className="font-bold text-slate-800">
                Bác sĩ chẩn trị & bốc thuốc
              </p>
              <p className="mt-2 text-[10px] text-slate-400 italic">
                Y viên Thượng Y Đường
              </p>
              <div className="h-16"></div>
              <p className="font-bold text-emerald-800">{activeVisit.doctor}</p>
            </div>
          </div>
        </div>

        {/* Close visual buttons inside screen */}
        <div className="no-print mt-4 flex justify-end gap-3 border-t border-slate-100 pt-4">
          <button
            type="button"
            onClick={() => setShowExportModal(false)}
            className="cursor-pointer rounded-lg bg-slate-100 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  )
}

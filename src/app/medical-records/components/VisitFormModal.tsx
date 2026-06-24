import { Edit, Plus, X } from "lucide-react"
import type { Visit } from "@/app/medical-records/interfaces/types"
import {
  VISIT_STATUSES,
  REMINDER_DAYS_OPTIONS,
  TREATMENT_STATUS_OPTIONS,
  computeAssessmentDateIso,
  formatIsoDateToVi,
  getDefaultFollowUpPlan,
} from "@/app/medical-records/constants/visit-form"
import type { VisitFollowUpPlan } from "@/app/medical-records/interfaces/types"
import { useMedicalRecordContext } from "@/app/medical-records/hooks/use-medical-record-context"

const MODAL_CONFIG = {
  add: {
    icon: Plus,
    title: "Thêm lượt khám mới",
    submitLabel: "Lưu phiếu khám",
  },
  edit: {
    icon: Edit,
    title: "Cập nhật thông tin lần khám",
    submitLabel: "Lưu cập nhật",
  },
} as const

export function VisitFormModal() {
  const {
    visitModalMode,
    closeVisitModal,
    visitForm,
    setVisitForm,
    handleVisitSubmit,
    tempHerbName,
    setTempHerbName,
    tempHerbWeight,
    setTempHerbWeight,
    addHerbToVisit,
    removeHerbFromVisit,
  } = useMedicalRecordContext()

  if (!visitModalMode) return null

  const mode = visitModalMode
  const visit = visitForm
  const onClose = closeVisitModal
  const onSubmit = handleVisitSubmit
  const onVisitChange = setVisitForm
  const onTempHerbNameChange = setTempHerbName
  const onTempHerbWeightChange = setTempHerbWeight
  const onAddHerb = addHerbToVisit
  const onRemoveHerb = removeHerbFromVisit

  const { icon: Icon, title, submitLabel } = MODAL_CONFIG[mode]
  const inputClassName =
    "border-slate-250 mt-1 w-full rounded-lg border px-3 py-1.5 text-xs focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"

  const updateVisit = (patch: Partial<Visit>) => {
    onVisitChange({ ...visit, ...patch })
  }

  const followUpPlan = {
    ...getDefaultFollowUpPlan(),
    ...visit.followUpPlan,
  }

  const assessmentDateIso = computeAssessmentDateIso(
    followUpPlan.followUpDate,
    followUpPlan.reminderDaysBefore
  )

  const updateFollowUpPlan = (patch: Partial<VisitFollowUpPlan>) => {
    onVisitChange({
      ...visit,
      followUpPlan: {
        ...followUpPlan,
        ...patch,
      },
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto border bg-slate-900/65 p-4 backdrop-blur-xs">
      <div className="relative max-h-[90vh] w-full max-w-2xl animate-in overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl duration-150 zoom-in-95 fade-in">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 cursor-pointer rounded-full p-1 text-slate-400 transition-colors hover:text-slate-600"
        >
          <X className="h-5 w-5" />
        </button>

        <h3 className="text-slate-850 font-display flex items-center gap-2 border-b border-slate-100 pb-3 text-lg font-bold">
          <Icon className="h-5 w-5 text-emerald-700" />
          {title}
        </h3>

        <form onSubmit={onSubmit} className="mt-4 space-y-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase">
                Tiêu đề lần khám
              </label>
              <input
                type="text"
                value={visit.title || ""}
                onChange={(e) => updateVisit({ title: e.target.value })}
                className={inputClassName}
                placeholder="e.g. Tái khám tuần 2"
                required
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase">
                Ngày khám
              </label>
              <input
                type="text"
                value={visit.date || ""}
                onChange={(e) => updateVisit({ date: e.target.value })}
                className={`${inputClassName} font-mono`}
                placeholder="DD/MM/YYYY"
                required
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase">
                Bác sĩ khám
              </label>
              <input
                type="text"
                value={visit.doctor || ""}
                onChange={(e) => updateVisit({ doctor: e.target.value })}
                className={inputClassName}
                placeholder="BS Phi Hưng"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase">
                Hình thức
              </label>
              <select
                value={visit.mode || "Trực tiếp"}
                onChange={(e) =>
                  updateVisit({
                    mode: e.target.value as Visit["mode"],
                  })
                }
                className="border-slate-250 mt-1 w-full rounded-lg border px-3 py-1.5 text-xs focus:outline-none"
              >
                <option value="Trực tiếp">Trực tiếp</option>
                <option value="Online">Online (Khám xa)</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase">
                Địa điểm
              </label>
              <input
                type="text"
                value={visit.location || ""}
                onChange={(e) => updateVisit({ location: e.target.value })}
                className={inputClassName}
                placeholder="Hàng Bông"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase">
                Huyết áp
              </label>
              <input
                type="text"
                value={visit.bloodPressure || ""}
                onChange={(e) => updateVisit({ bloodPressure: e.target.value })}
                className={`${inputClassName} font-mono`}
                placeholder="120/80"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase">
                Mạch (nhịp tim)
              </label>
              <input
                type="text"
                value={visit.pulse || ""}
                onChange={(e) => updateVisit({ pulse: e.target.value })}
                className={`${inputClassName} font-mono`}
                placeholder="75"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-[11px] font-bold text-slate-500 uppercase">
              Trạng thái tiến trình
            </label>
            <div className="flex flex-wrap gap-2">
              {VISIT_STATUSES.map((stat) => (
                <button
                  key={stat}
                  type="button"
                  onClick={() => updateVisit({ status: stat })}
                  className={`cursor-pointer rounded-lg border px-3 py-1 text-xs font-semibold transition-colors ${
                    visit.status === stat
                      ? "border-emerald-600 bg-emerald-600 text-white"
                      : "border-slate-205 bg-slate-50 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {stat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase">
              Triệu chứng & bệnh sử bệnh nhân
            </label>
            <textarea
              value={visit.symptoms || ""}
              onChange={(e) => updateVisit({ symptoms: e.target.value })}
              rows={mode === "edit" ? 3 : 2}
              className="border-slate-255 mt-1 w-full rounded-lg border px-3 py-1.5 text-xs focus:outline-none"
              placeholder="Mô tả các triệu chứng mệt mỏi, nóng dạ dạ, nhức mỏi xương khớp..."
            />
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <span className="mb-2 block text-[10px] font-bold text-slate-500 uppercase">
              Mạch chẩn (Tứ chẩn)
            </span>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div>
                <label className="block text-[10px] font-medium text-slate-600">
                  Mạch tả
                </label>
                <input
                  type="text"
                  value={visit.pulseDiagnosis?.ta || ""}
                  onChange={(e) =>
                    updateVisit({
                      pulseDiagnosis: {
                        ta: e.target.value,
                        huu: visit.pulseDiagnosis?.huu || "",
                        bung: visit.pulseDiagnosis?.bung || "",
                      },
                    })
                  }
                  className="border-slate-250 mt-1 w-full rounded-md border bg-white px-2 py-1 text-xs"
                  placeholder="e.g. Tế sắc, trầm tế"
                />
              </div>
              <div>
                <label className="block text-[10px] font-medium text-slate-600">
                  Mạch hữu
                </label>
                <input
                  type="text"
                  value={visit.pulseDiagnosis?.huu || ""}
                  onChange={(e) =>
                    updateVisit({
                      pulseDiagnosis: {
                        ta: visit.pulseDiagnosis?.ta || "",
                        huu: e.target.value,
                        bung: visit.pulseDiagnosis?.bung || "",
                      },
                    })
                  }
                  className="border-slate-250 mt-1 w-full rounded-md border bg-white px-2 py-1 text-xs"
                  placeholder="e.g. Tế"
                />
              </div>
              <div>
                <label className="block text-[10px] font-medium text-slate-600">
                  Ấn bụng
                </label>
                <input
                  type="text"
                  value={visit.pulseDiagnosis?.bung || ""}
                  onChange={(e) =>
                    updateVisit({
                      pulseDiagnosis: {
                        ta: visit.pulseDiagnosis?.ta || "",
                        huu: visit.pulseDiagnosis?.huu || "",
                        bung: e.target.value,
                      },
                    })
                  }
                  className="border-slate-250 mt-1 w-full rounded-md border bg-white px-2 py-1 text-xs"
                  placeholder="e.g. Ấn đau tức hạ sườn"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase">
                Tên cổ phương / Bài thuốc
              </label>
              <input
                type="text"
                value={visit.prescriptionFormula || ""}
                onChange={(e) =>
                  updateVisit({ prescriptionFormula: e.target.value })
                }
                className={inputClassName}
                placeholder="e.g. TIỂU SÀI HỒ GIA GIẢM"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase">
                Liều lượng uống
              </label>
              <input
                type="text"
                value={visit.prescriptionDosage || ""}
                onChange={(e) =>
                  updateVisit({ prescriptionDosage: e.target.value })
                }
                className={inputClassName}
                placeholder="e.g. 7 THÁNG x 14 TÚI 150ML"
              />
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 p-3">
            <span className="mb-2 block text-[10px] font-bold text-slate-500 uppercase">
              Thảo dược & Cân lượng bài thuốc
            </span>

            <div className="mb-3 flex gap-2">
              <input
                type="text"
                placeholder="Tên thảo dược (e.g. Sài hồ)"
                value={tempHerbName}
                onChange={(e) => onTempHerbNameChange(e.target.value)}
                className="border-slate-250 flex-1 rounded-lg border px-2.5 py-1 text-xs"
              />
              <input
                type="text"
                placeholder="Cân lượng (e.g. 15g)"
                value={tempHerbWeight}
                onChange={(e) => onTempHerbWeightChange(e.target.value)}
                className="border-slate-250 w-32 rounded-lg border px-2.5 py-1 text-xs"
              />
              <button
                type="button"
                onClick={onAddHerb}
                className="cursor-pointer rounded-lg bg-emerald-700 px-3 py-1 text-xs font-bold text-white hover:bg-emerald-600"
              >
                Thêm vị
              </button>
            </div>

            {visit.herbs && visit.herbs.length > 0 ? (
              <div className="flex max-h-24 flex-wrap gap-1.5 overflow-y-auto pt-1">
                {visit.herbs.map((herb, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1.5 rounded-md border border-emerald-100 bg-emerald-50 px-2 py-0.5 text-xs text-emerald-800"
                  >
                    {herb.name}:{" "}
                    <span className="font-bold">{herb.weight}</span>
                    <button
                      type="button"
                      onClick={() => onRemoveHerb(index)}
                      className="hover:text-red-750 ml-1 cursor-pointer font-bold text-red-500"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-[10px] text-slate-400 italic">
                Chưa kê vị thuốc nào cho bài thuốc này
              </p>
            )}
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase">
              Kết quả Lab
            </label>
            <input
              type="text"
              value={visit.labResults || ""}
              onChange={(e) => updateVisit({ labResults: e.target.value })}
              className={inputClassName}
              placeholder="Nhập kết quả xét nghiệm (nếu có)"
            />
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <span className="mb-2 block text-[10px] font-bold text-slate-500 uppercase">
              Chăm sóc tiếp theo
            </span>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div>
                <label className="block text-[10px] font-medium text-slate-600">
                  Lịch tái khám
                </label>
                <input
                  type="date"
                  value={followUpPlan.followUpDate}
                  onChange={(e) =>
                    updateFollowUpPlan({ followUpDate: e.target.value })
                  }
                  className="border-slate-250 mt-1 w-full rounded-md border bg-white px-2 py-1 text-xs"
                />
              </div>
              <div>
                <label className="block text-[10px] font-medium text-slate-600">
                  Nhắc nhở tự động
                </label>
                <select
                  value={followUpPlan.reminderDaysBefore}
                  onChange={(e) =>
                    updateFollowUpPlan({
                      reminderDaysBefore: Number(e.target.value),
                    })
                  }
                  className="border-slate-250 mt-1 w-full rounded-md border bg-white px-2 py-1 text-xs"
                >
                  {REMINDER_DAYS_OPTIONS.map((days) => (
                    <option key={days} value={days}>
                      {days} ngày trước
                    </option>
                  ))}
                </select>
                {assessmentDateIso && (
                  <p className="mt-1 text-[10px] text-slate-500">
                    Hỏi thăm: {formatIsoDateToVi(assessmentDateIso)}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-[10px] font-medium text-slate-600">
                  Trạng thái điều trị
                </label>
                <select
                  value={followUpPlan.treatmentStatus}
                  onChange={(e) =>
                    updateFollowUpPlan({
                      treatmentStatus: e.target.value as VisitFollowUpPlan["treatmentStatus"],
                    })
                  }
                  className="border-slate-250 mt-1 w-full rounded-md border bg-white px-2 py-1 text-xs"
                >
                  {TREATMENT_STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-100 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="hover:bg-emerald-750 cursor-pointer rounded-lg bg-emerald-800 px-5 py-2 text-xs font-bold text-white shadow-sm"
            >
              {submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

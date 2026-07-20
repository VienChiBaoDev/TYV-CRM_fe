import { useMemo } from "react"
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
import {
  CLINIC_BRANCHES,
  type ClinicBranchLabel,
} from "@/constants/clinic-branches"
import { DatePickerFieldIso } from "@/components/FieldCustom/DatePickerField"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { formatPrice } from "@/app/treatment-services/utils/format-price"
import { MedicineCatalogCombobox } from "@/app/medical-records/components/MedicineCatalogCombobox"
import {
  getHerbLineTotal,
  getPrescriptionHerbsTotal,
  hasPricedHerbs,
} from "@/app/medical-records/utils/herb-pricing"
import { useStaffPickerOptions } from "@/hooks/use-staff-picker-options"
import { toClinicBranchCode } from "@/lib/clinic-branch"
import {
  HERB_DECOCTION_ORDER_OPTIONS,
  HERB_DECOCTION_PREP_OPTIONS,
} from "@/app/medical-records/constants/herb-decoction"
import { applyFormulaToVisit } from "@/app/prescription-formulas/utils/apply-formula-to-visit"
import { FormulaPickerCombobox } from "@/app/prescription-formulas/components/FormulaPickerCombobox"

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

const fieldLabelClassName =
  "block text-[11px] font-bold text-slate-500 uppercase"

const selectTriggerClassName = "mt-1 h-8 w-full text-xs shadow-xs"

const longTextareaClassName =
  "border-slate-255 mt-1 min-h-[100px] w-full resize-y rounded-lg border px-3 py-1.5 text-xs whitespace-pre-wrap focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"

interface VisitFormSelectProps {
  label: string
  value: string
  onValueChange: (value: string) => void
  options: readonly { value: string; label: string }[]
  id?: string
  disabled?: boolean
  placeholder?: string
}

function VisitFormSelect({
  label,
  value,
  onValueChange,
  options,
  id,
  disabled,
  placeholder,
}: VisitFormSelectProps) {
  return (
    <div>
      <label htmlFor={id} className={fieldLabelClassName}>
        {label}
      </label>
      <Select value={value} onValueChange={onValueChange} disabled={disabled}>
        <SelectTrigger id={id} className={selectTriggerClassName}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent position="popper" sideOffset={4}>
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              className="text-xs"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

const VISIT_MODE_OPTIONS = [
  { value: "Trực tiếp", label: "Trực tiếp" },
  { value: "Online", label: "Online (Khám xa)" },
] as const

const LOCATION_OPTIONS = CLINIC_BRANCHES.map((branch) => ({
  value: branch.label,
  label: `${branch.emoji} ${branch.label}`,
}))

const REMINDER_OPTIONS = REMINDER_DAYS_OPTIONS.map((days) => ({
  value: String(days),
  label: `${days} ngày trước`,
}))

const TREATMENT_OPTIONS = TREATMENT_STATUS_OPTIONS.map((status) => ({
  value: status,
  label: status,
}))

function resolveLocationValue(location: string | undefined): ClinicBranchLabel {
  const match = CLINIC_BRANCHES.find((branch) => branch.label === location)
  return match?.label ?? CLINIC_BRANCHES[0].label
}

function buildSelectOptionsWithCurrent(
  options: readonly { value: string; label: string }[],
  currentValue: string | undefined
) {
  const trimmed = currentValue?.trim()
  if (!trimmed || options.some((option) => option.value === trimmed)) {
    return options
  }

  return [{ value: trimmed, label: trimmed }, ...options]
}

export function VisitFormModal() {
  const {
    visitModalMode,
    closeVisitModal,
    visitForm,
    setVisitForm,
    handleVisitSubmit,
    isSubmittingVisit,
    visitSubmitError,
    activeBranch,
    selectedMedicine,
    setSelectedMedicine,
    tempHerbQuantity,
    setTempHerbQuantity,
    tempHerbDecoctionOrder,
    setTempHerbDecoctionOrder,
    tempHerbDecoctionPrep,
    setTempHerbDecoctionPrep,
    addHerbToVisit,
    removeHerbFromVisit,
  } = useMedicalRecordContext()

  const branch = toClinicBranchCode(activeBranch)

  const { doctorOptions, isLoading: isDoctorsLoading } = useStaffPickerOptions(
    !!visitModalMode,
    branch
  )

  const followUpPlanForOptions = {
    ...getDefaultFollowUpPlan(),
    ...visitForm.followUpPlan,
  }

  const doctorSelectOptions = useMemo(
    () =>
      buildSelectOptionsWithCurrent(
        doctorOptions.map((doctor) => ({
          value: doctor.label,
          label: doctor.label,
        })),
        visitForm.doctor
      ),
    [doctorOptions, visitForm.doctor]
  )

  const reminderSelectOptions = useMemo(
    () =>
      buildSelectOptionsWithCurrent(
        REMINDER_OPTIONS,
        String(followUpPlanForOptions.reminderDaysBefore)
      ),
    [followUpPlanForOptions.reminderDaysBefore]
  )

  if (!visitModalMode) return null

  const mode = visitModalMode
  const visit = visitForm
  const onClose = closeVisitModal
  const onSubmit = handleVisitSubmit
  const onVisitChange = setVisitForm
  const onAddHerb = addHerbToVisit
  const onRemoveHerb = removeHerbFromVisit

  const quantityNumber = Number(tempHerbQuantity)
  const previewLineTotal =
    selectedMedicine && Number.isFinite(quantityNumber) && quantityNumber > 0
      ? selectedMedicine.unitPrice * quantityNumber
      : 0
  const herbs = visit.herbs ?? []
  const prescriptionTotal = getPrescriptionHerbsTotal(herbs)
  const showPrescriptionTotal = hasPricedHerbs(herbs)
  const canAddHerb =
    !!selectedMedicine && Number.isFinite(quantityNumber) && quantityNumber > 0

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
      <div className="relative max-h-[90dvh] w-full max-w-7xl animate-in overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl duration-150 zoom-in-95 fade-in">
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
            <VisitFormSelect
              id="visit-doctor"
              label="Bác sĩ khám"
              value={visit.doctor || ""}
              onValueChange={(value) => updateVisit({ doctor: value })}
              options={doctorSelectOptions}
              disabled={isDoctorsLoading}
              placeholder="Chọn bác sĩ"
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
            <VisitFormSelect
              id="visit-mode"
              label="Hình thức"
              value={visit.mode || "Trực tiếp"}
              onValueChange={(value) =>
                updateVisit({ mode: value as Visit["mode"] })
              }
              options={VISIT_MODE_OPTIONS}
            />
            <VisitFormSelect
              id="visit-location"
              label="Địa điểm"
              value={resolveLocationValue(visit.location)}
              onValueChange={(value) => updateVisit({ location: value })}
              options={LOCATION_OPTIONS}
            />
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
              rows={8}
              className={longTextareaClassName}
              placeholder="Mô tả các triệu chứng mệt mỏi, nóng dạ dạ, nhức mỏi xương khớp..."
            />
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <span className="mb-2 block text-[10px] font-bold text-slate-500 uppercase">
              Mạch chẩn
            </span>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div>
                <label className="block text-[10px] font-medium text-slate-600">
                  Mạch tả(Trái)
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
                  Mạch hữu(Phải)
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
                  Thiệt chẩn(Nhìn lưỡi)
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
                  placeholder="e.g. Xơ hóa mạch máu"
                />
              </div>
            </div>
          </div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase">
              Công thức mẫu
            </span>
            <FormulaPickerCombobox
              onSelect={(formula) => {
                const applied = applyFormulaToVisit(formula)
                updateVisit({
                  prescriptionFormula: applied.prescriptionFormula,
                  prescriptionDosage: applied.prescriptionDosage,
                  herbs: applied.herbs,
                })
              }}
            />
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase">
                Kê đơn
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
            <div className="mb-3 flex items-center justify-between gap-2">
              <span className="block text-[10px] font-bold text-slate-500 uppercase">
                Dược liệu
              </span>
              {/* {showPrescriptionTotal && (
                <span className="text-[11px] font-bold text-emerald-800">
                  Tổng: {formatPrice(prescriptionTotal)} đ
                </span>
              )} */}
            </div>

            <div className="mb-3 space-y-2">
              <div>
                <label className="mb-1 block text-[10px] font-medium text-slate-600">
                  Thuốc trong kho
                </label>
                <MedicineCatalogCombobox
                  selectedMedicine={selectedMedicine}
                  onChange={(medicineId) => {
                    if (!medicineId) {
                      setSelectedMedicine(null)
                      setTempHerbQuantity("")
                    }
                  }}
                  onSelectMedicine={(medicine) => {
                    setSelectedMedicine(medicine)
                    if (!tempHerbQuantity) setTempHerbQuantity(1)
                  }}
                />
              </div>

              <div className="grid grid-cols-2 gap-2 md:grid-cols-3 xl:grid-cols-6 xl:items-end">
                <div>
                  <label className="mb-1 block text-[10px] font-medium text-slate-600">
                    Số lượng
                  </label>
                  <input
                    type="number"
                    min={0}
                    step="any"
                    placeholder="0"
                    value={tempHerbQuantity}
                    disabled={!selectedMedicine}
                    onChange={(e) => {
                      const next = e.target.value
                      setTempHerbQuantity(next === "" ? "" : Number(next))
                    }}
                    className="border-slate-250 h-8 w-full rounded-lg border px-2.5 text-xs disabled:bg-slate-50"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-[10px] font-medium text-slate-600">
                    Đơn vị
                  </label>
                  <div className="border-slate-250 flex h-8 items-center rounded-lg border bg-slate-50 px-2.5 text-xs font-medium text-slate-600">
                    {selectedMedicine?.unit ?? "—"}
                  </div>
                </div>

                <VisitFormSelect
                  id="herb-decoction-order"
                  label="Thứ tự sắc"
                  value={tempHerbDecoctionOrder}
                  onValueChange={(value) =>
                    setTempHerbDecoctionOrder(
                      value as typeof tempHerbDecoctionOrder
                    )
                  }
                  options={HERB_DECOCTION_ORDER_OPTIONS}
                  disabled={!selectedMedicine}
                />

                <VisitFormSelect
                  id="herb-decoction-prep"
                  label="Sắc thuốc"
                  value={tempHerbDecoctionPrep}
                  onValueChange={(value) =>
                    setTempHerbDecoctionPrep(
                      value as typeof tempHerbDecoctionPrep
                    )
                  }
                  options={HERB_DECOCTION_PREP_OPTIONS}
                  disabled={!selectedMedicine}
                />

                <div>
                  <label className="mb-1 block text-[10px] font-medium text-slate-600">
                    Thành tiền
                  </label>
                  <div className="flex h-8 items-center rounded-lg border border-emerald-100 bg-emerald-50 px-2.5 text-xs font-bold text-emerald-800">
                    {previewLineTotal > 0
                      ? `${formatPrice(previewLineTotal)} đ`
                      : "—"}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onAddHerb}
                  disabled={!canAddHerb}
                  className="h-8 cursor-pointer rounded-lg bg-primary px-3 text-xs font-bold text-white disabled:cursor-not-allowed disabled:opacity-50 md:col-span-3 xl:col-span-1"
                >
                  Thêm vị
                </button>
              </div>
            </div>

            {selectedMedicine && (
              <p className="mb-3 text-[10px] text-slate-500">
                Đơn giá: {formatPrice(selectedMedicine.unitPrice)} đ/
                {selectedMedicine.unit}
              </p>
            )}

            {herbs.length > 0 ? (
              <div className="overflow-hidden rounded-lg border border-slate-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase">
                    <tr>
                      <th className="px-2.5 py-2">Thuốc</th>
                      <th className="px-2.5 py-2 text-right">SL</th>
                      <th className="hidden px-2.5 py-2 sm:table-cell">
                        Thứ tự sắc
                      </th>
                      <th className="hidden px-2.5 py-2 sm:table-cell">
                        Sắc thuốc
                      </th>
                      <th className="hidden px-2.5 py-2 text-right md:table-cell">
                        Đơn giá
                      </th>
                      <th className="px-2.5 py-2 text-right">Thành tiền</th>
                      <th className="px-2.5 py-2 text-center"> </th>
                    </tr>
                  </thead>
                  <tbody>
                    {herbs.map((herb, index) => {
                      const lineTotal = getHerbLineTotal(herb)

                      return (
                        <tr
                          key={`${herb.medicineId ?? herb.name}-${index}`}
                          className="border-t border-slate-100"
                        >
                          <td className="px-2.5 py-2 font-medium text-slate-800">
                            {herb.name}
                          </td>
                          <td className="px-2.5 py-2 text-right font-mono text-slate-700">
                            {herb.quantity != null && herb.unit
                              ? `${herb.quantity} ${herb.unit}`
                              : herb.weight}
                          </td>
                          <td className="hidden px-2.5 py-2 text-slate-600 sm:table-cell">
                            {herb.decoctionOrder ?? "—"}
                          </td>
                          <td className="hidden px-2.5 py-2 text-slate-600 sm:table-cell">
                            {herb.decoctionPrep ?? "—"}
                          </td>
                          <td className="hidden px-2.5 py-2 text-right text-slate-600 md:table-cell">
                            {herb.unitPrice != null
                              ? `${formatPrice(herb.unitPrice)} đ`
                              : "—"}
                          </td>
                          <td className="px-2.5 py-2 text-right font-semibold text-emerald-800">
                            {lineTotal != null
                              ? `${formatPrice(lineTotal)} đ`
                              : "—"}
                          </td>
                          <td className="px-2.5 py-2 text-center">
                            <button
                              type="button"
                              onClick={() => onRemoveHerb(index)}
                              className="hover:text-red-750 cursor-pointer font-bold text-red-500"
                              aria-label={`Xóa ${herb.name}`}
                            >
                              ×
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                  {showPrescriptionTotal && (
                    <tfoot>
                      <tr className="border-t border-slate-200 bg-emerald-50/60">
                        <td
                          colSpan={5}
                          className="hidden px-2.5 py-2 text-right text-[10px] font-bold text-slate-600 uppercase md:table-cell"
                        >
                          Tổng thanh toán
                        </td>
                        <td
                          colSpan={2}
                          className="px-2.5 py-2 text-right text-[10px] font-bold text-slate-600 uppercase sm:hidden"
                        >
                          Tổng
                        </td>
                        <td className="px-2.5 py-2 text-right text-sm font-bold text-emerald-800">
                          {formatPrice(prescriptionTotal)} đ
                        </td>
                        <td />
                      </tr>
                    </tfoot>
                  )}
                </table>
              </div>
            ) : (
              <p className="text-[10px] text-slate-400 italic">
                Chưa kê vị thuốc nào cho bài thuốc này
              </p>
            )}
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase">
              Chuẩn đoán
            </label>
            <textarea
              value={visit.labResults || ""}
              onChange={(e) => updateVisit({ labResults: e.target.value })}
              rows={3}
              className={longTextareaClassName}
              placeholder="Nhập chuẩn đoán..."
            />
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <span className={cn(fieldLabelClassName, "mb-3")}>
              Chăm sóc tiếp theo
            </span>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div>
                <label className={fieldLabelClassName}>Lịch tái khám</label>
                <DatePickerFieldIso
                  value={followUpPlan.followUpDate}
                  onChange={(isoDate) =>
                    updateFollowUpPlan({ followUpDate: isoDate })
                  }
                  placeholder="Chọn ngày tái khám"
                  className={cn(selectTriggerClassName, "bg-white font-normal")}
                />
              </div>
              <div>
                <VisitFormSelect
                  id="follow-up-reminder"
                  label="Nhắc nhở tự động"
                  value={String(followUpPlan.reminderDaysBefore)}
                  onValueChange={(value) =>
                    updateFollowUpPlan({
                      reminderDaysBefore: Number(value),
                    })
                  }
                  options={reminderSelectOptions}
                />
                {assessmentDateIso && (
                  <p className="mt-1 text-[10px] text-slate-500">
                    Hỏi thăm: {formatIsoDateToVi(assessmentDateIso)}
                  </p>
                )}
              </div>
              <VisitFormSelect
                id="follow-up-treatment-status"
                label="Trạng thái điều trị"
                value={followUpPlan.treatmentStatus}
                onValueChange={(value) =>
                  updateFollowUpPlan({
                    treatmentStatus:
                      value as VisitFollowUpPlan["treatmentStatus"],
                  })
                }
                options={TREATMENT_OPTIONS}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-100 pt-3">
            {visitSubmitError && (
              <p className="mr-auto self-center text-xs text-red-600">
                {visitSubmitError}
              </p>
            )}
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmittingVisit}
              className="cursor-pointer rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={isSubmittingVisit}
              className="hover:bg-emerald-750 cursor-pointer rounded-lg bg-emerald-800 px-5 py-2 text-xs font-bold text-white shadow-sm disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmittingVisit ? "Đang lưu..." : submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

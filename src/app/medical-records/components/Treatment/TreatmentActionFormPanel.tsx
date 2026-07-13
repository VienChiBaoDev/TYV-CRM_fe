import { FormInput } from "@/components/FieldCustom/FormInput"
import {
  FormSelect,
  type FormSelectOption,
} from "@/components/FieldCustom/FormSelect"
import { FormTextarea } from "@/components/FieldCustom/FormTextarea"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import type { TreatmentServiceItem } from "@/app/medical-records/mappers/map-patient-service-to-treatment-item"
import type { TreatmentFormValues } from "@/app/medical-records/schemas/treatment-form"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"
import type { UseFormReturn } from "react-hook-form"
import { useWatch } from "react-hook-form"
import {
  fieldClassName,
  INFO_TABS,
  labelClassName,
} from "./treatment-action.constants"
import { buildSessionSteps } from "./treatment-session-steps"

interface TreatmentActionFormPanelProps {
  form: UseFormReturn<TreatmentFormValues>
  infoTab: string
  detailTreatment: TreatmentServiceItem | undefined
  maxAllowedSession: number
  doctorOptions: FormSelectOption[]
  staffSelectOptions: FormSelectOption[]
  isSubmitting: boolean
  onClose: () => void
  onClearDetail: () => void
  onPickSession: (step: number) => void
  onSave: () => void
  onSaveAndContinue: () => void
}

export default function TreatmentActionFormPanel({
  form,
  infoTab,
  detailTreatment,
  maxAllowedSession,
  doctorOptions,
  staffSelectOptions,
  isSubmitting,
  onClose,
  onClearDetail,
  onPickSession,
  onSave,
  onSaveAndContinue,
}: TreatmentActionFormPanelProps) {
  const currentSession = useWatch({
    control: form.control,
    name: "currentSession",
  })

  return (
    <Form {...form}>
      <form onSubmit={onSave} className="flex flex-col p-5">
        {infoTab === INFO_TABS.INFO ? (
          <div className="flex flex-1 flex-col gap-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <FormSelect
                control={form.control}
                name="doctorId"
                label="Bác sĩ"
                placeholder="eg .bác sĩ"
                options={doctorOptions}
                labelClassName={labelClassName}
                triggerClassName={fieldClassName}
              />
              <FormSelect
                control={form.control}
                name="ptKtvId"
                label="PT/KTV"
                placeholder="eg .pt/ktv"
                options={staffSelectOptions}
                labelClassName={labelClassName}
                triggerClassName={fieldClassName}
              />
              <FormSelect
                control={form.control}
                name="professionalSupport"
                label="Hỗ trợ chuyên môn"
                placeholder="eg .hỗ trợ chuyên môn"
                options={staffSelectOptions}
                labelClassName={labelClassName}
                triggerClassName={fieldClassName}
              />
              <FormInput
                control={form.control}
                name="nextTreatmentDate"
                label="Ngày điều trị kế tiếp"
                inputClassName={cn(fieldClassName, "font-mono")}
                labelClassName={labelClassName}
              />
            </div>

            <FormTextarea
              control={form.control}
              name="nextContent"
              label="Nội dung kế tiếp"
              placeholder="eg .nội dung kế tiếp"
              rows={5}
              labelClassName={labelClassName}
              textareaClassName={fieldClassName}
            />

            <div>
              <button
                type="button"
                className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-1.5 text-xs font-bold text-slate-600 transition-colors hover:bg-slate-100"
              >
                Ghi chú
              </button>
            </div>

            <FormTextarea
              control={form.control}
              name="note"
              label="Ghi chú"
              placeholder="eg .ghi chú"
              rows={5}
              labelClassName={labelClassName}
              textareaClassName={fieldClassName}
            />

            {detailTreatment && (
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <h3 className="text-sm font-bold tracking-wide text-slate-800 uppercase">
                    {detailTreatment.name}
                  </h3>
                  <button
                    type="button"
                    onClick={onClearDetail}
                    className="shrink-0 rounded-full p-0.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                    aria-label="Đóng chi tiết điều trị"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="mb-3 flex flex-wrap items-center gap-1.5">
                  {buildSessionSteps(
                    detailTreatment.totalSessions,
                    currentSession
                  ).map((step, index) =>
                    step === "ellipsis" ? (
                      <span
                        key={`ellipsis-${index}`}
                        className="px-1 text-xs text-slate-400"
                      >
                        ...
                      </span>
                    ) : (
                      <button
                        key={step}
                        type="button"
                        onClick={() => onPickSession(step)}
                        disabled={step > maxAllowedSession}
                        className={cn(
                          step > maxAllowedSession &&
                            "cursor-not-allowed opacity-40",
                          "flex h-7 min-w-7 items-center justify-center rounded-full px-1.5 text-xs font-bold transition-colors",
                          step === currentSession
                            ? "border border-slate-700 bg-white text-slate-800"
                            : step <= detailTreatment.completedSession
                              ? "bg-emerald-600 text-white"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        )}
                      >
                        {step}
                      </button>
                    )
                  )}
                </div>

                <FormTextarea
                  control={form.control}
                  name="treatmentContent"
                  hideLabel
                  placeholder="eg .nội dung điều trị"
                  rows={4}
                  textareaClassName={cn(fieldClassName, "resize-y")}
                />

                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-700">
                  <p>
                    <span className="font-bold">Tư vấn</span>{" "}
                    {detailTreatment.consultant}
                  </p>
                  <p>
                    <span className="font-bold">Ngày</span> |{" "}
                    {detailTreatment.date}
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-1 items-center justify-center text-sm text-slate-400">
            Nội dung tab Khác
          </div>
        )}

        <div className="mt-6 flex justify-end gap-2 border-t border-slate-100 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            className="bg-slate-500 text-white hover:bg-slate-600"
          >
            Đóng
          </Button>
          <Button
            type="button"
            disabled={!detailTreatment || isSubmitting}
            onClick={onSaveAndContinue}
            className="bg-emerald-800 text-white hover:bg-emerald-700"
          >
            Lưu và tiếp tục
          </Button>
          <Button
            type="submit"
            disabled={!detailTreatment || isSubmitting}
            className="bg-emerald-800 text-white hover:bg-emerald-700"
          >
            Lưu
          </Button>
        </div>
      </form>
    </Form>
  )
}

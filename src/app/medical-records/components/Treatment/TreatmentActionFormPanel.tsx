import { FormDate } from "@/components/FieldCustom/FormDate"
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
import type { TreatmentSessionImageApi } from "../../interfaces/patient-treatment-api"
import { TreatmentSessionImageZone } from "./TreatmentSessionImageZone"

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
  sessionImages: TreatmentSessionImageApi[]
  isImageUploading: boolean
  isImageDeleting: boolean
  onImageUpload: (file: File) => void
  onImageDelete: (imageId: string) => void
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
  sessionImages,
  isImageUploading,
  isImageDeleting,
  onImageUpload,
  onImageDelete,
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
              <FormDate
                control={form.control}
                name="nextTreatmentDate"
                label="Ngày điều trị kế tiếp"
                placeholder="Chọn ngày"
                labelClassName={labelClassName}
                className={fieldClassName}
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

                <p className="mb-2 flex flex-wrap gap-3 text-[10px] text-slate-500">
                  <span>
                    <span className="mr-1 inline-block h-2 w-2 rounded-full bg-emerald-600" />
                    Đang chọn
                  </span>
                  <span>
                    <span className="mr-1 inline-block h-2 w-2 rounded-full bg-emerald-100 ring-1 ring-emerald-200" />
                    Đã hoàn thành
                  </span>
                  <span>
                    <span className="mr-1 inline-block h-2 w-2 rounded-full border border-slate-200" />
                    Chưa điều trị
                  </span>
                </p>

                <div className="mb-3 flex flex-wrap items-center gap-1.5">
                  {buildSessionSteps(
                    detailTreatment.totalSessions,
                    currentSession
                  ).map((step, index) => {
                    if (step === "ellipsis") {
                      return (
                        <span
                          key={`ellipsis-${index}`}
                          className="px-1 text-xs text-slate-400"
                        >
                          ...
                        </span>
                      )
                    }

                    const isLocked = step > maxAllowedSession
                    const isCurrent = step === currentSession
                    const isCompleted = step <= detailTreatment.completedSession

                    return (
                      <button
                        key={step}
                        type="button"
                        onClick={() => onPickSession(step)}
                        disabled={isLocked}
                        aria-current={isCurrent ? "step" : undefined}
                        className={cn(
                          "flex h-8 min-w-8 items-center justify-center rounded-full px-2 text-xs font-bold transition-all duration-150",
                          "focus-visible:ring-2 focus-visible:ring-emerald-500/40 focus-visible:outline-none",
                          isLocked
                            ? "cursor-not-allowed border border-slate-100 bg-slate-50 text-slate-300"
                            : "cursor-pointer",
                          !isLocked &&
                            isCurrent &&
                            "border-2 border-emerald-600 bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-600/20",
                          !isLocked &&
                            !isCurrent &&
                            isCompleted &&
                            "border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100",
                          !isLocked &&
                            !isCurrent &&
                            !isCompleted &&
                            "border border-slate-200 bg-white text-slate-600 hover:border-emerald-300 hover:bg-emerald-50/50 hover:text-emerald-700"
                        )}
                      >
                        {step}
                      </button>
                    )
                  })}
                </div>

                <FormTextarea
                  control={form.control}
                  name="treatmentContent"
                  hideLabel
                  placeholder="eg .nội dung điều trị"
                  rows={4}
                  textareaClassName={cn(fieldClassName, "resize-y")}
                />

                <TreatmentSessionImageZone
                  images={sessionImages}
                  canUpload={currentSession <= maxAllowedSession}
                  isUploading={isImageUploading}
                  isDeleting={isImageDeleting}
                  onUpload={onImageUpload}
                  onDelete={onImageDelete}
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
            className="bg-emerald-800 text-white hover:bg-primary"
          >
            Lưu và tiếp tục
          </Button>
          <Button
            type="submit"
            disabled={!detailTreatment || isSubmitting}
            className="bg-emerald-800 text-white hover:bg-primary"
          >
            Lưu
          </Button>
        </div>
      </form>
    </Form>
  )
}

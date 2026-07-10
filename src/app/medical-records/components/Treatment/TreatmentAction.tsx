import { FormInput } from "@/components/FieldCustom/FormInput"
import { FormSelect } from "@/components/FieldCustom/FormSelect"
import { FormTextarea } from "@/components/FieldCustom/FormTextarea"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import {
  isPatientServiceTreatmentInProgress,
  mapPatientServicesToTreatmentItems,
  type TreatmentServiceItem,
} from "@/app/medical-records/mappers/map-patient-service-to-treatment-item"
import { patientServicesQueryOptions } from "@/app/medical-records/queries/patient-service-query"
import {
  treatmentFormDefaultValues,
  treatmentFormSchema,
  type TreatmentFormValues,
} from "@/app/medical-records/schemas/treatment-form"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQuery } from "@tanstack/react-query"
import { Activity, ChevronDown, ClipboardList, Search, X } from "lucide-react"
import { useMemo, useState } from "react"
import { useForm, useWatch } from "react-hook-form"
import { useParams } from "react-router-dom"

interface TreatmentActionProps {
  onClose: () => void
}

const MAIN_TABS = {
  TREATMENT: "treatment",
  TASKS: "tasks",
} as const

const INFO_TABS = {
  INFO: "info",
  OTHER: "other",
} as const

const STATUS_FILTER = {
  IN_PROGRESS: "in-progress",
  COMPLETED: "completed",
} as const

const SCOPE_FILTER = {
  MINE: "mine",
  ALL: "all",
} as const

const SESSION_VISIBLE_RANGE = 2

const EMPTY_SELECT_OPTIONS: { value: string; label: string }[] = [
  { value: "a", label: "a" },
  { value: "b", label: "b" },
  { value: "c", label: "c" },
  { value: "d", label: "d" },
]

const labelClassName = "text-xs font-bold text-slate-700"
const fieldClassName = "text-xs"

function buildSessionSteps(
  total: number,
  active: number
): (number | "ellipsis")[] {
  const steps: (number | "ellipsis")[] = []
  const visible = new Set<number>()

  visible.add(1)
  visible.add(total)

  for (
    let i = Math.max(1, active - SESSION_VISIBLE_RANGE);
    i <= Math.min(total, active + SESSION_VISIBLE_RANGE);
    i++
  ) {
    visible.add(i)
  }

  let prev = 0
  for (let i = 1; i <= total; i++) {
    if (!visible.has(i)) continue
    if (prev > 0 && i - prev > 1) steps.push("ellipsis")
    steps.push(i)
    prev = i
  }

  return steps
}

const filterInputClassName =
  "border-slate-250 w-full rounded-lg border bg-white px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"

export default function TreatmentAction({ onClose }: TreatmentActionProps) {
  const { patientId = "" } = useParams()
  const { data: services = [], isLoading } = useQuery(
    patientServicesQueryOptions(patientId)
  )

  const paidTreatmentItems = useMemo(
    () => mapPatientServicesToTreatmentItems(services),
    [services]
  )

  const [mainTab, setMainTab] = useState<string>(MAIN_TABS.TREATMENT)
  const [infoTab, setInfoTab] = useState<string>(INFO_TABS.INFO)
  const [statusFilter, setStatusFilter] = useState<string>(
    STATUS_FILTER.IN_PROGRESS
  )
  const [scopeFilter, setScopeFilter] = useState<string>(SCOPE_FILTER.ALL)
  const [selectedId, setSelectedId] = useState("")
  const [detailTreatmentId, setDetailTreatmentId] = useState<string | null>(
    null
  )
  const [searchQuery, setSearchQuery] = useState("")
  const [staffFilter, setStaffFilter] = useState("all")

  const form = useForm<TreatmentFormValues>({
    resolver: zodResolver(treatmentFormSchema),
    defaultValues: treatmentFormDefaultValues,
  })

  const currentSession = useWatch({
    control: form.control,
    name: "currentSession",
  })

  const filteredTreatmentItems = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase()

    return paidTreatmentItems.filter((item) => {
      const service = services.find((entry) => entry.id === item.id)
      if (!service) return false
      // mục đích là lọc ra các dịch vụ đang điều trị 
      const matchesStatus =
        statusFilter === STATUS_FILTER.IN_PROGRESS
          ? isPatientServiceTreatmentInProgress(service)
          : !isPatientServiceTreatmentInProgress(service)

      const matchesSearch =
        normalizedQuery.length === 0 ||
        item.name.toLowerCase().includes(normalizedQuery)

      return matchesStatus && matchesSearch
    })
  }, [paidTreatmentItems, searchQuery, services, statusFilter])

  const detailTreatment = paidTreatmentItems.find(
    (item) => item.id === detailTreatmentId
  )

  const handleSelectTreatment = (item: TreatmentServiceItem) => {
    setSelectedId(item.id)
    setDetailTreatmentId(item.id)
    form.setValue("currentSession", item.activeSession)
    form.setValue("treatmentContent", "")
  }

  const onSubmit = async (values: TreatmentFormValues) => {
    void values
    // TODO: integrate with API mutation
  }

  const handleSave = form.handleSubmit(onSubmit)
  const handleSaveAndContinue = form.handleSubmit(async (values) => {
    await onSubmit(values)
    form.reset(treatmentFormDefaultValues)
    setDetailTreatmentId(null)
    setSelectedId("")
  })

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/60 bg-white shadow-xs">
      {/* Header tabs */}
      <div className="flex flex-col gap-4 border-b border-slate-100 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setMainTab(MAIN_TABS.TREATMENT)}
            className={cn(
              "flex items-center gap-2 rounded-xl border px-5 py-2.5 text-sm font-bold transition-colors",
              mainTab === MAIN_TABS.TREATMENT
                ? "border-emerald-600 text-emerald-700"
                : "border-slate-200 text-slate-500 hover:border-slate-300"
            )}
          >
            <ClipboardList className="h-4 w-4" />
            Điều trị
          </button>
          <button
            type="button"
            onClick={() => setMainTab(MAIN_TABS.TASKS)}
            className={cn(
              "flex items-center gap-2 rounded-xl border px-5 py-2.5 text-sm font-bold transition-colors",
              mainTab === MAIN_TABS.TASKS
                ? "border-emerald-600 text-emerald-700"
                : "border-slate-200 text-slate-500 hover:border-slate-300"
            )}
          >
            <Activity className="h-4 w-4" />
            Công việc điều trị
          </button>
        </div>

        <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => setInfoTab(INFO_TABS.INFO)}
            className={cn(
              "rounded-md px-4 py-1.5 text-xs font-bold transition-colors",
              infoTab === INFO_TABS.INFO
                ? "bg-white text-slate-800 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            )}
          >
            Thông tin
          </button>
          <button
            type="button"
            onClick={() => setInfoTab(INFO_TABS.OTHER)}
            className={cn(
              "rounded-md px-4 py-1.5 text-xs font-bold transition-colors",
              infoTab === INFO_TABS.OTHER
                ? "bg-white text-slate-800 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            )}
          >
            Khác
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr]">
        {/* Left sidebar */}
        <div className="space-y-4 border-b border-slate-100 p-5 lg:border-r lg:border-b-0">
          {/* Status radio */}
          <div className="flex gap-5">
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="radio"
                name="status"
                value={STATUS_FILTER.IN_PROGRESS}
                checked={statusFilter === STATUS_FILTER.IN_PROGRESS}
                onChange={() => setStatusFilter(STATUS_FILTER.IN_PROGRESS)}
                className="h-3.5 w-3.5 accent-slate-800"
              />
              <span className="text-xs font-semibold text-slate-700">
                Đang điều trị
              </span>
            </label>
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="radio"
                name="status"
                value={STATUS_FILTER.COMPLETED}
                checked={statusFilter === STATUS_FILTER.COMPLETED}
                onChange={() => setStatusFilter(STATUS_FILTER.COMPLETED)}
                className="h-3.5 w-3.5 accent-slate-800"
              />
              <span className="text-xs font-semibold text-slate-700">
                Điều trị xong
              </span>
            </label>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="eg. tìm kiếm"
              className={cn(filterInputClassName, "pl-9")}
            />
          </div>

          {/* Staff filter + scope toggle */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <select
                value={staffFilter}
                onChange={(e) => setStaffFilter(e.target.value)}
                className={cn(
                  filterInputClassName,
                  "cursor-pointer appearance-none pr-8"
                )}
              >
                <option value="all">Tất cả nhân viên</option>
              </select>
              <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>

            <div className="flex shrink-0 overflow-hidden rounded-lg border border-slate-200">
              <button
                type="button"
                onClick={() => setScopeFilter(SCOPE_FILTER.MINE)}
                className={cn(
                  "px-2.5 py-1.5 text-[11px] font-bold transition-colors",
                  scopeFilter === SCOPE_FILTER.MINE
                    ? "bg-emerald-700 text-white"
                    : "bg-white text-slate-600 hover:bg-slate-50"
                )}
              >
                Của tôi
              </button>
              <button
                type="button"
                onClick={() => setScopeFilter(SCOPE_FILTER.ALL)}
                className={cn(
                  "px-2.5 py-1.5 text-[11px] font-bold transition-colors",
                  scopeFilter === SCOPE_FILTER.ALL
                    ? "bg-emerald-700 text-white"
                    : "bg-white text-slate-600 hover:bg-slate-50"
                )}
              >
                Tất cả
              </button>
            </div>
          </div>

          {/* Treatment list */}
          <div className="space-y-2">
            {isLoading ? (
              <p className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-4 text-center text-xs text-slate-500">
                Đang tải dịch vụ...
              </p>
            ) : filteredTreatmentItems.length === 0 ? (
              <p className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-3 py-4 text-center text-xs text-slate-500">
                {paidTreatmentItems.length === 0
                  ? "Chưa có dịch vụ đã thanh toán để điều trị."
                  : "Không tìm thấy dịch vụ phù hợp."}
              </p>
            ) : (
              filteredTreatmentItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelectTreatment(item)}
                  className={cn(
                    "w-full rounded-lg border p-3 text-left transition-colors",
                    selectedId === item.id
                      ? "border-emerald-200 bg-emerald-50/50"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  )}
                >
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">
                      {item.time}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {item.progress}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-slate-800">{item.name}</p>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Right form */}
        <Form {...form}>
          <form onSubmit={handleSave} className="flex flex-col p-5">
            {infoTab === INFO_TABS.INFO ? (
              <div className="flex flex-1 flex-col gap-4">
                {/* Top row inputs */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  <FormSelect
                    control={form.control}
                    name="doctor"
                    label="Bác sĩ"
                    placeholder="eg .bác sĩ"
                    options={EMPTY_SELECT_OPTIONS}
                    labelClassName={labelClassName}
                    triggerClassName={fieldClassName}
                  />

                  <FormSelect
                    control={form.control}
                    name="ptKtv"
                    label="PT/KTV"
                    placeholder="eg .pt/ktv"
                    options={EMPTY_SELECT_OPTIONS}
                    labelClassName={labelClassName}
                    triggerClassName={fieldClassName}
                  />

                  <FormSelect
                    control={form.control}
                    name="professionalSupport"
                    label="Hỗ trợ chuyên môn"
                    placeholder="eg .hỗ trợ chuyên môn"
                    options={EMPTY_SELECT_OPTIONS}
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
                        onClick={() => setDetailTreatmentId(null)}
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
                            onClick={() =>
                              form.setValue("currentSession", step)
                            }
                            className={cn(
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

            {/* Footer actions */}
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
                disabled={form.formState.isSubmitting}
                onClick={handleSaveAndContinue}
                className="bg-emerald-800 text-white hover:bg-emerald-700"
              >
                Lưu và tiếp tục
              </Button>
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="bg-emerald-800 text-white hover:bg-emerald-700"
              >
                Lưu
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}

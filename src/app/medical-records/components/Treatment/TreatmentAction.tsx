import {
  isPatientServiceTreatmentInProgress,
  mapPatientServicesToTreatmentItems,
  type TreatmentServiceItem,
} from "@/app/medical-records/mappers/map-patient-service-to-treatment-item"
import { mapTreatmentFormToUpsertPayload } from "@/app/medical-records/mappers/map-treatment-session-request"
import { patientServicesQueryOptions } from "@/app/medical-records/queries/patient-service-query"
import { serviceTreatmentSessionsQueryOptions } from "@/app/medical-records/queries/patient-treatment-query"
import {
  treatmentFormDefaultValues,
  treatmentFormSchema,
  type TreatmentFormValues,
} from "@/app/medical-records/schemas/treatment-form"
import { useUpsertTreatmentSessionMutation } from "@/app/medical-records/hooks/use-patient-treatment-mutations"
import { useStaffPickerOptions } from "@/hooks/use-staff-picker-options"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQuery } from "@tanstack/react-query"
import { Activity, ClipboardList } from "lucide-react"
import { useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { useParams } from "react-router-dom"
import TreatmentActionFormPanel from "./TreatmentActionFormPanel"
import TreatmentActionSidebar from "./TreatmentActionSidebar"
import {
  INFO_TABS,
  SCOPE_FILTER,
  STATUS_FILTER,
} from "./treatment-action.constants"

interface TreatmentActionProps {
  onClose: () => void
}

export default function TreatmentAction({ onClose }: TreatmentActionProps) {
  const { patientId = "" } = useParams()
  const { data: services = [], isLoading } = useQuery(
    patientServicesQueryOptions(patientId)
  )

  const paidTreatmentItems = useMemo(
    () => mapPatientServicesToTreatmentItems(services),
    [services]
  )

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

  const selectedServiceId = detailTreatmentId ?? ""
  const { data: sessionData } = useQuery(
    serviceTreatmentSessionsQueryOptions(patientId, selectedServiceId)
  )
  const upsertMutation = useUpsertTreatmentSessionMutation(
    patientId,
    selectedServiceId
  )
  const { doctorOptions, staffOptions } = useStaffPickerOptions()

  const maxAllowedSession =
    sessionData?.service.maxAllowedSession ??
    services.find((s) => s.id === selectedServiceId)?.progress.maxAllowed ??
    0

  const staffSelectOptions = useMemo(
    () =>
      staffOptions.map((staff) => ({
        value: staff.id,
        label: staff.fullName,
      })),
    [staffOptions]
  )

  const form = useForm<TreatmentFormValues>({
    resolver: zodResolver(treatmentFormSchema),
    defaultValues: treatmentFormDefaultValues,
  })

  const filteredTreatmentItems = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase()

    return paidTreatmentItems.filter((item) => {
      const service = services.find((entry) => entry.id === item.id)
      if (!service) return false

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
    const service = services.find((s) => s.id === item.id)
    const nextSession = Math.min(
      item.activeSession,
      service?.progress.maxAllowed ?? item.activeSession
    )
    form.reset({
      ...treatmentFormDefaultValues,
      currentSession: nextSession,
    })
  }

  const handlePickSession = (step: number) => {
    if (step > maxAllowedSession) return
    form.setValue("currentSession", step)
    const existing = sessionData?.sessions.find((s) => s.sessionNumber === step)
    if (existing) {
      form.setValue("doctorId", existing.doctorId ?? "")
      form.setValue("ptKtvId", existing.ptKtvId ?? "")
      form.setValue("professionalSupport", existing.professionalSupport ?? "")
      form.setValue("treatmentContent", existing.treatmentContent)
      form.setValue("note", existing.note ?? "")
      form.setValue("nextContent", existing.nextContent ?? "")
      form.setValue("nextTreatmentDate", existing.nextTreatmentDate ?? "")
    } else {
      form.setValue("treatmentContent", "")
      form.setValue("note", "")
      form.setValue("nextContent", "")
      form.setValue("nextTreatmentDate", "")
    }
  }

  const onSubmit = async (values: TreatmentFormValues) => {
    if (!selectedServiceId) return
    await upsertMutation.mutateAsync(mapTreatmentFormToUpsertPayload(values))
  }

  const handleSave = form.handleSubmit(onSubmit)
  const handleSaveAndContinue = form.handleSubmit(async (values) => {
    await onSubmit(values)
    form.reset(treatmentFormDefaultValues)
    setDetailTreatmentId(null)
    setSelectedId("")
  })

  const handleClearDetail = () => {
    setDetailTreatmentId(null)
    setSelectedId("")
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/60 bg-white shadow-xs">
      <div className="flex flex-col gap-4 border-b border-slate-100 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-3">
          <button
            type="button"
            className="flex items-center gap-2 rounded-xl border border-emerald-600 px-5 py-2.5 text-sm font-bold text-emerald-700"
          >
            <ClipboardList className="h-4 w-4" />
            Điều trị
          </button>
          <button
            type="button"
            disabled
            title="Phase 2"
            className="flex cursor-not-allowed items-center gap-2 rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-bold text-slate-400 opacity-60"
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

      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr]">
        <TreatmentActionSidebar
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          staffFilter={staffFilter}
          onStaffFilterChange={setStaffFilter}
          scopeFilter={scopeFilter}
          onScopeFilterChange={setScopeFilter}
          isLoading={isLoading}
          items={filteredTreatmentItems}
          paidItemsCount={paidTreatmentItems.length}
          selectedId={selectedId}
          onSelectTreatment={handleSelectTreatment}
        />

        <TreatmentActionFormPanel
          form={form}
          infoTab={infoTab}
          detailTreatment={detailTreatment}
          maxAllowedSession={maxAllowedSession}
          doctorOptions={doctorOptions}
          staffSelectOptions={staffSelectOptions}
          isSubmitting={upsertMutation.isPending}
          onClose={onClose}
          onClearDetail={handleClearDetail}
          onPickSession={handlePickSession}
          onSave={handleSave}
          onSaveAndContinue={handleSaveAndContinue}
        />
      </div>
    </div>
  )
}

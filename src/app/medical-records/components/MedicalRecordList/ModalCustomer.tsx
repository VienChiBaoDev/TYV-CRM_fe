import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { toast } from "sonner"

import { DialogCommon } from "@/components/UiCustom/DialogCommon"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { MultiSelect } from "@/components/FieldCustom/MultiSelect"
import { useStaffPickerOptions } from "@/hooks/use-staff-picker-options"
import { validatePatientAssignments } from "@/app/medical-records/components/PatientCreate/patientForm"
import { useUpdatePatientMutation } from "@/app/medical-records/hooks/use-patient-mutations"
import { patientDetailQueryOptions } from "@/app/medical-records/queries/patient-query"
import type { Gender } from "@/app/medical-records/services/patient-api"

interface ModalCustomerProps {
  patientId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSaved?: () => void
}

interface EditForm {
  fullName: string
  gender: Gender
  phone: string
  /** yyyy-mm-dd cho input type=date */
  birthDate: string
  address: string
  source: string
  assignedDoctorIds: string[]
  assignedAssistantIds: string[]
}

/** Cắt phần ISO datetime về yyyy-mm-dd cho ô input ngày. */
function toDateInputValue(iso: string | null): string {
  if (!iso) return ""
  return iso.slice(0, 10)
}

export default function ModalCustomer({
  patientId,
  open,
  onOpenChange,
  onSaved,
}: ModalCustomerProps) {
  const { doctorOptions, assistantOptions } = useStaffPickerOptions(open)
  const [form, setForm] = useState<EditForm | null>(null)
  const updatePatientMutation = useUpdatePatientMutation(patientId ?? "")

  const { data: patient } = useQuery({
    ...patientDetailQueryOptions(patientId ?? ""),
    enabled: open && Boolean(patientId),
  })

  // Prefill form ngay khi dữ liệu về (sync lúc render, tránh setState-in-effect).
  const [syncedFor, setSyncedFor] = useState<string | null>(null)
  if (patient && syncedFor !== patient.id) {
    setSyncedFor(patient.id)
    setForm({
      fullName: patient.fullName,
      gender: patient.gender,
      phone: patient.phone,
      birthDate: toDateInputValue(patient.birthDate),
      address: patient.address ?? "",
      source: patient.source ?? "",
      assignedDoctorIds: (patient.assignedDoctors ?? []).map((s) => s.id),
      assignedAssistantIds: (patient.assignedAssistants ?? []).map((s) => s.id),
    })
  }

  const setField = <K extends keyof EditForm>(key: K, value: EditForm[K]) =>
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev))

  const handleSubmit = async () => {
    if (!patientId || !form) return
    if (!form.fullName.trim()) {
      toast.error("Vui lòng nhập họ và tên")
      return
    }
    if (!form.phone.trim()) {
      toast.error("Vui lòng nhập số điện thoại")
      return
    }
    const assignmentError = validatePatientAssignments(
      form.assignedDoctorIds,
      form.assignedAssistantIds
    )
    if (assignmentError) {
      toast.error(assignmentError)
      return
    }

    try {
      await updatePatientMutation.mutateAsync({
        fullName: form.fullName.trim(),
        gender: form.gender,
        phone: form.phone.trim(),
        birthDate: form.birthDate || undefined,
        address: form.address.trim() || undefined,
        source: form.source.trim() || undefined,
        assignedDoctorIds: form.assignedDoctorIds,
        assignedAssistantIds: form.assignedAssistantIds,
      })
      onOpenChange(false)
      onSaved?.()
    } catch {
      // Lỗi đã được toast trong mutation.
    }
  }

  return (
    <DialogCommon
      open={open}
      onOpenChange={onOpenChange}
      title="Sửa khách hàng"
      onSubmit={handleSubmit}
      loading={updatePatientMutation.isPending}
    >
      {form ? (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Họ và tên</Label>
            <Input
              value={form.fullName}
              onChange={(e) => setField("fullName", e.target.value)}
              placeholder="eg. họ và tên"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Giới tính</Label>
            <Select
              value={form.gender}
              onValueChange={(value) => setField("gender", value as Gender)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MALE">Nam</SelectItem>
                <SelectItem value="FEMALE">Nữ</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Số điện thoại</Label>
            <Input
              value={form.phone}
              onChange={(e) => setField("phone", e.target.value)}
              placeholder="eg. số điện thoại"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Ngày sinh</Label>
            <Input
              type="date"
              value={form.birthDate}
              onChange={(e) => setField("birthDate", e.target.value)}
            />
          </div>
          <div className="col-span-2 space-y-1.5">
            <Label>Địa chỉ</Label>
            <Input
              value={form.address}
              onChange={(e) => setField("address", e.target.value)}
              placeholder="eg. địa chỉ"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Bác sĩ phụ trách</Label>
            <MultiSelect
              options={doctorOptions}
              value={form.assignedDoctorIds}
              onChange={(ids) => setField("assignedDoctorIds", ids)}
              placeholder="Chọn bác sĩ"
              searchPlaceholder="Tìm bác sĩ..."
              emptyMessage="Không có bác sĩ"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Trợ lý phụ trách</Label>
            <MultiSelect
              options={assistantOptions}
              value={form.assignedAssistantIds}
              onChange={(ids) => setField("assignedAssistantIds", ids)}
              placeholder="Chọn trợ lý"
              searchPlaceholder="Tìm trợ lý..."
              emptyMessage="Không có trợ lý"
            />
          </div>
        </div>
      ) : (
        <p className="py-8 text-center text-sm text-slate-400">Đang tải...</p>
      )}
    </DialogCommon>
  )
}

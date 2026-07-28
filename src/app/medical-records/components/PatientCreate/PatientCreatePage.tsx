import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { urlPaths } from "@/constants/urlPaths"
import { toClinicBranchCode } from "@/lib/clinic-branch"
import { useClinicStore } from "@/stores/clinic-store"
import { GeneralInfoTab } from "./GeneralInfoTab"
import { OtherInfoTab } from "./OtherInfoTab"
import { IdentityCardSection } from "./IdentityCardSection"
import { AppointmentForm } from "./AppointmentForm"
import {
  emptyPatientForm,
  type PatientFormState,
  type SetPatientField,
} from "./patientForm"
import {
  defaultAppointmentForm,
  type AppointmentFormState,
  type SetAppointmentField,
} from "./appointmentState"
import { createPatient } from "../../data/patientService"
import { createAppointment } from "../../../appointments/services/appointmentService"
import {
  staffNameById,
  useStaffPickerOptions,
} from "@/hooks/use-staff-picker-options"

/** Chuyển dd-mm-yyyy người dùng nhập sang ISO yyyy-mm-dd, trả undefined nếu không hợp lệ. */
function toIsoDate(input: string): string | undefined {
  const match = input.trim().match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/)
  if (!match) return undefined
  const [, dd, mm, yyyy] = match
  return `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`
}

export default function PatientCreatePage() {
  const navigate = useNavigate()
  const activeBranch = useClinicStore((state) => state.activeBranch)
  const [form, setForm] = useState<PatientFormState>(emptyPatientForm)
  const [submitting, setSubmitting] = useState(false)
  const [createAppt, setCreateAppt] = useState(false)
  const [apptForm, setApptForm] = useState<AppointmentFormState>(
    defaultAppointmentForm
  )
  const { staffOptions } = useStaffPickerOptions(createAppt)

  const setField: SetPatientField = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const setApptField: SetAppointmentField = (key, value) =>
    setApptForm((prev) => ({ ...prev, [key]: value }))

  const handleSave = async () => {
    if (!form.fullName.trim()) {
      toast.error("Vui lòng nhập họ và tên")
      return
    }
    if (!form.phone.trim()) {
      toast.error("Vui lòng nhập số điện thoại")
      return
    }
    if (createAppt && !apptForm.doctorId) {
      toast.error("Vui lòng chọn bác sĩ cho lịch hẹn")
      return
    }

    setSubmitting(true)
    try {
      const branch = toClinicBranchCode(activeBranch)
      const created = await createPatient({
        fullName: form.fullName.trim(),
        gender: form.gender,
        phone: form.phone.trim(),
        birthDate: form.birthDate ? toIsoDate(form.birthDate) : undefined,
        address: form.address.trim() || undefined,
        source: form.source || undefined,
        clinicBranch: branch,
        assignedDoctorIds: form.assignedDoctorIds.length
          ? form.assignedDoctorIds
          : undefined,
        assignedAssistantIds: form.assignedAssistantIds.length
          ? form.assignedAssistantIds
          : undefined,
      })

      if (createAppt) {
        const scheduledAt = new Date(
          `${apptForm.date}T${apptForm.hour || "00"}:${apptForm.minute || "00"}:00`
        )
        if (apptForm.date && !Number.isNaN(scheduledAt.getTime())) {
          const endedAt = new Date(scheduledAt.getTime() + 30 * 60 * 1000)
          await createAppointment({
            patientId: created.id,
            scheduledAt: scheduledAt.toISOString(),
            endedAt: endedAt.toISOString(),
            doctorId: apptForm.doctorId,
            assistantId: apptForm.assistantId || undefined,
            doctorName: staffNameById(staffOptions, apptForm.doctorId),
            assistantName: staffNameById(staffOptions, apptForm.assistantId),
            note: apptForm.note.trim() || undefined,
            clinicBranch: branch,
          })
        }
      }

      toast.success(
        createAppt
          ? `Đã lưu hồ sơ ${created.patientCode} và lịch hẹn`
          : `Đã lưu hồ sơ ${created.patientCode}`
      )
      navigate(urlPaths.medicalRecordList)
    } catch {
      toast.error("Lưu hồ sơ thất bại. Vui lòng thử lại.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="relative flex h-full flex-col bg-slate-50 pb-20">
      {/* Header and Main Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <Tabs defaultValue="general" className="w-full">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-800">
                Hồ sơ khách hàng
              </h2>
              <p className="text-sm text-slate-500">Thông tin cá nhân</p>
            </div>
            <TabsList className="h-auto gap-1 rounded-lg border bg-white p-1 shadow-sm">
              <TabsTrigger
                value="general"
                className="rounded-md border border-transparent px-4 py-1.5 text-slate-600 data-[state=active]:border-gray-200 data-[state=active]:bg-white data-[state=active]:text-emerald-700 data-[state=active]:shadow-sm"
              >
                Thông tin chung
              </TabsTrigger>
              <TabsTrigger
                value="other"
                className="rounded-md border border-transparent px-4 py-1.5 text-slate-600 data-[state=active]:border-gray-200 data-[state=active]:bg-white data-[state=active]:text-emerald-700 data-[state=active]:shadow-sm"
              >
                Khác
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
            <TabsContent
              value="general"
              className="m-0 border-none outline-none"
            >
              <GeneralInfoTab
                form={form}
                setField={setField}
                createAppointment={createAppt}
                onToggleAppointment={setCreateAppt}
              />
            </TabsContent>
            <TabsContent value="other" className="m-0 border-none outline-none">
              <OtherInfoTab />
            </TabsContent>
          </div>
        </Tabs>

        {/* CMND/CC Section (Common for both tabs based on the design, or at least visible below them) */}
        <IdentityCardSection />

        {/* Form lịch hẹn — hiện khi tích "Tạo lịch hẹn" */}
        {createAppt && (
          <AppointmentForm form={apptForm} setField={setApptField} />
        )}

        {/* Footer Checkbox */}
        <div className="mt-6 mb-16 flex items-center gap-2">
          <Checkbox
            className="h-5 w-5 rounded-[4px] border-slate-800 bg-slate-800 text-white data-[state=checked]:bg-slate-800 data-[state=checked]:text-white"
            defaultChecked
          />
          <span className="text-sm font-medium text-slate-700">
            Thỏa thuận khách hàng ...
          </span>
        </div>
      </div>

      {/* Sticky Footer Buttons */}
      <div className="fixed right-0 bottom-0 left-0 z-10 flex justify-end gap-3 border-t border-slate-300 bg-white p-4 shadow-[0_-4px_12px_rgba(0,0,0,0.08)] md:left-64">
        <Button
          onClick={() => navigate(urlPaths.medicalRecordList)}
          disabled={submitting}
          className="h-11 min-w-[110px] border border-slate-800 bg-slate-700 px-6 text-base text-white shadow-sm hover:bg-slate-800"
        >
          Đóng
        </Button>
        <Button
          onClick={handleSave}
          disabled={submitting}
          className="h-11 min-w-[110px] bg-[#00a64c] px-6 text-base text-white shadow-sm hover:bg-[#008f41]"
        >
          {submitting ? "Đang lưu..." : "Lưu"}
        </Button>
      </div>
    </div>
  )
}

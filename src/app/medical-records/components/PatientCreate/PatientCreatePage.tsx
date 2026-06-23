import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { urlPaths } from "@/constants/urlPaths"
import { useClinicStore } from "@/stores/clinic-store"
import { GeneralInfoTab } from "./GeneralInfoTab"
import { OtherInfoTab } from "./OtherInfoTab"
import { IdentityCardSection } from "./IdentityCardSection"
import {
  emptyPatientForm,
  type PatientFormState,
  type SetPatientField,
} from "./patientForm"
import { createPatient } from "../../data/patientService"

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

  const setField: SetPatientField = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const handleSave = async () => {
    if (!form.fullName.trim()) {
      toast.error("Vui lòng nhập họ và tên")
      return
    }
    if (!form.phone.trim()) {
      toast.error("Vui lòng nhập số điện thoại")
      return
    }

    setSubmitting(true)
    try {
      const created = await createPatient({
        fullName: form.fullName.trim(),
        gender: form.gender,
        phone: form.phone.trim(),
        birthDate: form.birthDate ? toIsoDate(form.birthDate) : undefined,
        address: form.address.trim() || undefined,
        source: form.source || undefined,
        clinicBranch:
          activeBranch === "Cầu Giấy" ? "CAU_GIAY" : "HANG_BONG",
      })
      toast.success(`Đã lưu hồ sơ ${created.patientCode}`)
      navigate(urlPaths.medicalRecordList)
    } catch {
      toast.error("Lưu hồ sơ thất bại. Vui lòng thử lại.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col h-full bg-slate-50 relative pb-20">
      {/* Header and Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <Tabs defaultValue="general" className="w-full">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-800">Hồ sơ khách hàng</h2>
              <p className="text-sm text-slate-500">Thông tin cá nhân</p>
            </div>
            <TabsList className="bg-white border rounded-lg h-auto p-1 shadow-sm gap-1">
              <TabsTrigger 
                value="general" 
                className="rounded-md data-[state=active]:bg-white data-[state=active]:text-emerald-700 data-[state=active]:shadow-sm px-4 py-1.5 text-slate-600 border border-transparent data-[state=active]:border-gray-200"
              >
                Thông tin chung
              </TabsTrigger>
              <TabsTrigger 
                value="other" 
                className="rounded-md data-[state=active]:bg-white data-[state=active]:text-emerald-700 data-[state=active]:shadow-sm px-4 py-1.5 text-slate-600 border border-transparent data-[state=active]:border-gray-200"
              >
                Khác
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
            <TabsContent value="general" className="m-0 border-none outline-none">
              <GeneralInfoTab form={form} setField={setField} />
            </TabsContent>
            <TabsContent value="other" className="m-0 border-none outline-none">
              <OtherInfoTab />
            </TabsContent>
          </div>
        </Tabs>

        {/* CMND/CC Section (Common for both tabs based on the design, or at least visible below them) */}
        <IdentityCardSection />

        {/* Footer Checkbox */}
        <div className="flex items-center gap-2 mt-6 mb-16">
          <Checkbox className="bg-slate-800 border-slate-800 text-white rounded-[4px] data-[state=checked]:bg-slate-800 data-[state=checked]:text-white h-5 w-5" defaultChecked />
          <span className="text-sm font-medium text-slate-700">Thỏa thuận khách hàng ...</span>
        </div>
      </div>

      {/* Sticky Footer Buttons */}
      <div className="fixed bottom-0 left-0 right-0 md:left-64 bg-white p-4 flex justify-end gap-3 border-t border-slate-300 shadow-[0_-4px_12px_rgba(0,0,0,0.08)] z-10">
        <Button
          onClick={() => navigate(urlPaths.medicalRecordList)}
          disabled={submitting}
          className="h-11 px-6 text-base bg-slate-700 text-white hover:bg-slate-800 border border-slate-800 shadow-sm min-w-[110px]"
        >
          Đóng
        </Button>
        <Button
          onClick={handleSave}
          disabled={submitting}
          className="h-11 px-6 text-base bg-[#00a64c] text-white hover:bg-[#008f41] shadow-sm min-w-[110px]"
        >
          {submitting ? "Đang lưu..." : "Lưu"}
        </Button>
      </div>
    </div>
  )
}

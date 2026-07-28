import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Radio } from "@/components/ui/radio"
import { Label } from "@/components/ui/label"
import { Camera } from "lucide-react"

import { MultiSelect } from "@/components/FieldCustom/MultiSelect"
import { useStaffPickerOptions } from "@/hooks/use-staff-picker-options"
import type { PatientFormState, SetPatientField } from "./patientForm"

interface GeneralInfoTabProps {
  form: PatientFormState
  setField: SetPatientField
  createAppointment: boolean
  onToggleAppointment: (value: boolean) => void
}

export function GeneralInfoTab({
  form,
  setField,
  createAppointment,
  onToggleAppointment,
}: GeneralInfoTabProps) {
  const { doctorOptions, assistantOptions } = useStaffPickerOptions()

  return (
    <div className="grid grid-cols-4 gap-6 p-6">
      {/* Cột 1: Avatar */}
      <div className="col-span-1 row-span-3 flex flex-col items-center gap-2">
        <div className="relative flex h-32 w-full max-w-[200px] flex-col items-center justify-center overflow-hidden rounded-xl bg-gray-400 text-white">
          <Camera className="mb-2 h-8 w-8" />
          <div className="absolute bottom-0 w-full bg-black/50 py-1 text-center text-xs">
            No file chosen
          </div>
        </div>
        <div className="flex items-center gap-1 text-sm font-medium text-emerald-600">
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-600 text-[10px] text-white">
            i
          </span>
          Hướng dẫn
        </div>
      </div>

      {/* Row 1, Cols 2-4 */}
      <div className="col-span-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700">
            <Radio
              name="gender"
              checked={form.gender === "MALE"}
              onChange={() => setField("gender", "MALE")}
            />
            Nam
          </label>
          <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700">
            <Radio
              name="gender"
              checked={form.gender === "FEMALE"}
              onChange={() => setField("gender", "FEMALE")}
            />
            Nữ
          </label>
          <label className="ml-4 flex cursor-pointer items-center gap-2 text-sm text-gray-700">
            <Checkbox
              checked={createAppointment}
              onChange={(e) => onToggleAppointment(e.target.checked)}
            />
            Tạo lịch hẹn
          </label>
        </div>
        <div className="flex items-center gap-4 text-xs text-gray-600">
          <div className="flex items-center gap-1.5">
            <div className="flex h-4 w-4 items-center justify-center rounded bg-gray-400 text-white">
              ✓
            </div>
            Cho phép chỉnh sửa
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-full bg-red-500" />
            Bắt buộc
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-full bg-green-500" />
            Không chỉnh sửa
          </div>
        </div>
      </div>

      {/* Row 2, Cols 2-4 */}
      <div className="col-span-1 space-y-1.5">
        <Label className="text-xs font-medium text-gray-700">Họ và tên</Label>
        <Input
          placeholder="eg. họ và tên"
          value={form.fullName}
          onChange={(e) => setField("fullName", e.target.value)}
        />
      </div>
      <div className="col-span-1 space-y-1.5">
        <Label className="text-xs font-medium text-gray-700">Ngày sinh</Label>
        <Input
          placeholder="dd-mm-yyyy"
          value={form.birthDate}
          onChange={(e) => setField("birthDate", e.target.value)}
        />
      </div>
      <div className="col-span-1 space-y-1.5">
        <Label className="text-xs font-medium text-gray-700">
          Số điện thoại
        </Label>
        <div className="flex">
          <Select defaultValue="vn">
            <SelectTrigger className="w-[70px] rounded-r-none border-r-0 bg-gray-50 px-2 focus:ring-0 focus:ring-offset-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="vn">🇻🇳</SelectItem>
            </SelectContent>
          </Select>
          <Input
            className="rounded-l-none"
            placeholder=""
            value={form.phone}
            onChange={(e) => setField("phone", e.target.value)}
          />
        </div>
      </div>

      {/* Row 3, Cols 2-4 */}
      <div className="col-span-1 space-y-1.5">
        <Label className="text-xs font-medium text-gray-700">Chi nhánh</Label>
        <Select defaultValue="136">
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="136">Thượng Y Viên 136</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="relative col-span-1 space-y-1.5">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-medium text-gray-700">
            Nhóm khách hàng
          </Label>
          <div className="h-1 w-3 rounded-sm bg-green-500"></div>
        </div>
        <Select>
          <SelectTrigger className="text-gray-400">
            <SelectValue placeholder="nhóm khách hàng" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">nhóm khách hàng</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="col-span-1 space-y-1.5">
        <Label className="text-xs font-medium text-gray-700">Email</Label>
        <Input placeholder="eg. email" />
      </div>

      {/* Row 4 (Col 1 is below Avatar) */}
      <div className="col-span-1 space-y-1.5">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-medium text-gray-700">
            Nguồn khách hàng
          </Label>
          <div className="h-1 w-3 rounded-sm bg-green-500"></div>
        </div>
        <Select
          value={form.source}
          onValueChange={(value) => setField("source", value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Khách Vãng Lai">Khách Vãng Lai</SelectItem>
            <SelectItem value="BN Giới Thiệu">BN Giới Thiệu</SelectItem>
            <SelectItem value="Facebook">Facebook</SelectItem>
            <SelectItem value="Zalo">Zalo</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="col-span-1 space-y-1.5">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-medium text-gray-700">
            Nguồn chi tiết
          </Label>
          <div className="h-1 w-3 rounded-sm bg-green-500"></div>
        </div>
        <Select>
          <SelectTrigger className="text-gray-400">
            <SelectValue placeholder="nguồn chi tiết" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">nguồn chi tiết</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="col-span-1 space-y-1.5">
        <Label className="text-xs font-medium text-gray-700">Quốc tịch</Label>
        <Select defaultValue="vn">
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="vn">Vietnam</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="col-span-1 space-y-1.5">
        <Label className="text-xs font-medium text-gray-700">Nghề nghiệp</Label>
        <Select>
          <SelectTrigger className="text-gray-400">
            <SelectValue placeholder="nghề nghiệp" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">nghề nghiệp</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Row 5 */}
      <div className="col-span-1 space-y-1.5">
        <Label className="text-xs font-medium text-gray-700">Địa chỉ</Label>
        <Input
          placeholder="eg. địa chỉ"
          value={form.address}
          onChange={(e) => setField("address", e.target.value)}
        />
      </div>
      <div className="col-span-1 space-y-1.5">
        <Label className="text-xs font-medium text-gray-700">
          Tỉnh/Thành phố
        </Label>
        <Select>
          <SelectTrigger className="text-gray-400">
            <SelectValue placeholder="eg. tỉnh/thành phố" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">eg. tỉnh/thành phố</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="col-span-1 space-y-1.5">
        <Label className="text-xs font-medium text-gray-700">Phường xã</Label>
        <Input placeholder="eg. phường xã" />
      </div>
      <div className="col-span-1 space-y-1.5">
        <Label className="text-xs font-medium text-gray-700">Khách cũ</Label>
        <div className="flex h-10 items-center gap-2 overflow-hidden rounded-md border bg-gray-100 px-3">
          <Checkbox className="bg-white" />
          <input
            className="w-full bg-transparent text-sm text-gray-500 outline-none placeholder:text-gray-400"
            placeholder="eg. mã khách hàng cũ"
          />
        </div>
      </div>

      {/* Row 6 */}
      <div className="col-span-1 space-y-1.5">
        <Label className="text-xs font-medium text-gray-700">Ngôn ngữ</Label>
        <Select defaultValue="vi">
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="vi">Tiếng Việt</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="col-span-1 space-y-1.5">
        <Label className="text-xs font-medium text-gray-700">
          Chỉnh sửa ngày tạo
        </Label>
        <div className="flex h-10 items-center gap-2 overflow-hidden rounded-md border bg-gray-100 px-3">
          <Checkbox className="bg-white" />
          <input
            className="w-full bg-transparent text-sm text-gray-500 outline-none placeholder:text-gray-400"
            placeholder="eg. ngày tạo"
          />
        </div>
      </div>
      <div className="col-span-2" />

      {/* Row 7: Nhân sự phụ trách */}
      <div className="col-span-2 space-y-1.5">
        <Label className="text-xs font-medium text-gray-700">
          Bác sĩ phụ trách
        </Label>
        <MultiSelect
          options={doctorOptions}
          value={form.assignedDoctorIds}
          onChange={(ids) => setField("assignedDoctorIds", ids)}
          placeholder="Chọn bác sĩ phụ trách"
          searchPlaceholder="Tìm bác sĩ..."
          emptyMessage="Không có bác sĩ"
        />
      </div>
      <div className="col-span-2 space-y-1.5">
        <Label className="text-xs font-medium text-gray-700">
          Trợ lý phụ trách
        </Label>
        <MultiSelect
          options={assistantOptions}
          value={form.assignedAssistantIds}
          onChange={(ids) => setField("assignedAssistantIds", ids)}
          placeholder="Chọn trợ lý phụ trách"
          searchPlaceholder="Tìm trợ lý..."
          emptyMessage="Không có trợ lý"
        />
      </div>

      {/* Row 8 */}
      <div className="col-span-4 space-y-1.5">
        <Label className="text-xs font-medium text-gray-700">Ghi chú</Label>
        <Textarea
          placeholder="eg. ghi chú"
          className="min-h-[100px] resize-none"
        />
      </div>
    </div>
  )
}

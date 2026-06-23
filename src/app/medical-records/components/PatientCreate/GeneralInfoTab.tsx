import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Radio } from "@/components/ui/radio"
import { Label } from "@/components/ui/label"
import { Camera } from "lucide-react"

import type { PatientFormState, SetPatientField } from "./patientForm"

interface GeneralInfoTabProps {
  form: PatientFormState
  setField: SetPatientField
}

export function GeneralInfoTab({ form, setField }: GeneralInfoTabProps) {
  return (
    <div className="grid grid-cols-4 gap-6 p-6">
      {/* Cột 1: Avatar */}
      <div className="col-span-1 row-span-3 flex flex-col items-center gap-2">
        <div className="flex h-32 w-full max-w-[200px] flex-col items-center justify-center rounded-xl bg-gray-400 text-white overflow-hidden relative">
          <Camera className="h-8 w-8 mb-2" />
          <div className="absolute bottom-0 w-full bg-black/50 py-1 text-center text-xs">
            No file chosen
          </div>
        </div>
        <div className="flex items-center gap-1 text-sm text-emerald-600 font-medium">
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-600 text-[10px] text-white">i</span>
          Hướng dẫn
        </div>
      </div>

      {/* Row 1, Cols 2-4 */}
      <div className="col-span-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <Radio
              name="gender"
              checked={form.gender === "MALE"}
              onChange={() => setField("gender", "MALE")}
            />
            Nam
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <Radio
              name="gender"
              checked={form.gender === "FEMALE"}
              onChange={() => setField("gender", "FEMALE")}
            />
            Nữ
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer ml-4">
            <Checkbox />
            Tạo lịch hẹn
          </label>
        </div>
        <div className="flex items-center gap-4 text-xs text-gray-600">
          <div className="flex items-center gap-1.5">
            <div className="flex h-4 w-4 items-center justify-center rounded bg-gray-400 text-white">✓</div>
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
        <Label className="text-gray-700 font-medium text-xs">Họ và tên</Label>
        <Input
          placeholder="eg. họ và tên"
          value={form.fullName}
          onChange={(e) => setField("fullName", e.target.value)}
        />
      </div>
      <div className="col-span-1 space-y-1.5">
        <Label className="text-gray-700 font-medium text-xs">Ngày sinh</Label>
        <Input
          placeholder="dd-mm-yyyy"
          value={form.birthDate}
          onChange={(e) => setField("birthDate", e.target.value)}
        />
      </div>
      <div className="col-span-1 space-y-1.5">
        <Label className="text-gray-700 font-medium text-xs">Số điện thoại</Label>
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
        <Label className="text-gray-700 font-medium text-xs">Chi nhánh</Label>
        <Select defaultValue="136">
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="136">Thượng Y Viên 136</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="col-span-1 space-y-1.5 relative">
        <div className="flex items-center justify-between">
          <Label className="text-gray-700 font-medium text-xs">Nhóm khách hàng</Label>
          <div className="h-1 w-3 bg-green-500 rounded-sm"></div>
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
        <Label className="text-gray-700 font-medium text-xs">Email</Label>
        <Input placeholder="eg. email" />
      </div>

      {/* Row 4 (Col 1 is below Avatar) */}
      <div className="col-span-1 space-y-1.5">
        <div className="flex items-center justify-between">
          <Label className="text-gray-700 font-medium text-xs">Nguồn khách hàng</Label>
          <div className="h-1 w-3 bg-green-500 rounded-sm"></div>
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
          <Label className="text-gray-700 font-medium text-xs">Nguồn chi tiết</Label>
          <div className="h-1 w-3 bg-green-500 rounded-sm"></div>
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
        <Label className="text-gray-700 font-medium text-xs">Quốc tịch</Label>
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
        <Label className="text-gray-700 font-medium text-xs">Nghề nghiệp</Label>
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
        <Label className="text-gray-700 font-medium text-xs">Địa chỉ</Label>
        <Input
          placeholder="eg. địa chỉ"
          value={form.address}
          onChange={(e) => setField("address", e.target.value)}
        />
      </div>
      <div className="col-span-1 space-y-1.5">
        <Label className="text-gray-700 font-medium text-xs">Tỉnh/Thành phố</Label>
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
        <Label className="text-gray-700 font-medium text-xs">Phường xã</Label>
        <Input placeholder="eg. phường xã" />
      </div>
      <div className="col-span-1 space-y-1.5">
        <Label className="text-gray-700 font-medium text-xs">Khách cũ</Label>
        <div className="flex items-center h-10 border rounded-md bg-gray-100 overflow-hidden px-3 gap-2">
          <Checkbox className="bg-white" />
          <input className="bg-transparent outline-none text-sm w-full text-gray-500 placeholder:text-gray-400" placeholder="eg. mã khách hàng cũ" />
        </div>
      </div>

      {/* Row 6 */}
      <div className="col-span-1 space-y-1.5">
        <Label className="text-gray-700 font-medium text-xs">Ngôn ngữ</Label>
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
        <Label className="text-gray-700 font-medium text-xs">Chỉnh sửa ngày tạo</Label>
        <div className="flex items-center h-10 border rounded-md bg-gray-100 overflow-hidden px-3 gap-2">
          <Checkbox className="bg-white" />
          <input className="bg-transparent outline-none text-sm w-full text-gray-500 placeholder:text-gray-400" placeholder="eg. ngày tạo" />
        </div>
      </div>
      <div className="col-span-2" />

      {/* Row 7 */}
      <div className="col-span-4 space-y-1.5">
        <Label className="text-gray-700 font-medium text-xs">Ghi chú</Label>
        <Textarea placeholder="eg. ghi chú" className="min-h-[100px] resize-none" />
      </div>
    </div>
  )
}

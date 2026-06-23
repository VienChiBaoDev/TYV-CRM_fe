import { useNavigate } from "react-router-dom"
import {
  Calendar,
  Stethoscope,
  Activity,
  CreditCard,
  FolderOpen,
  ChevronDown,
  UserPlus,
  Users,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { urlPaths } from "@/constants/urlPaths"
import type { Referrer } from "../../data/referrerService"

interface ListFiltersProps {
  referrers: Referrer[]
  selectedReferrer: string
  onReferrerChange: (value: string) => void
}

export function ListFilters({
  referrers,
  selectedReferrer,
  onReferrerChange,
}: ListFiltersProps) {
  const navigate = useNavigate()

  return (
    <div className="mb-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold text-slate-800">
            Danh sách khách hàng
          </h2>
          <p className="text-xs text-slate-500 mb-4">
            Danh sách khách hàng theo ngày tạo hồ sơ, chốt dịch vụ, điều trị,
            thanh toán hoặc ngày checked in
          </p>
        </div>
        <Button
          onClick={() => navigate(urlPaths.medicalRecordCreate)}
          className="shrink-0 bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          <UserPlus className="h-4 w-4" />
          Tạo mới hồ sơ
        </Button>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {/* Date Range Picker (Mock) */}
        <div className="flex items-center border border-gray-200 rounded-md bg-white text-sm shrink-0">
          <button className="flex items-center gap-1 px-3 py-1.5 border-r border-gray-200 hover:bg-gray-50 text-slate-700">
            Hôm nay <ChevronDown className="h-4 w-4" />
          </button>
          <div className="px-3 py-1.5 text-slate-600 flex items-center gap-2">
            <div className="h-4 w-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">
              i
            </div>
            23-06-2026 to 23-06-2026
          </div>
        </div>

        {/* Bộ lọc người giới thiệu */}
        <div className="flex items-center gap-1.5 shrink-0">
          <Users className="h-4 w-4 text-emerald-600" />
          <Select value={selectedReferrer} onValueChange={onReferrerChange}>
            <SelectTrigger className="w-[200px] bg-white text-sm">
              <SelectValue placeholder="Người giới thiệu" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả người giới thiệu</SelectItem>
              {referrers.map((referrer) => (
                <SelectItem key={referrer.id} value={referrer.id}>
                  {referrer.fullName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Filter Tabs */}
        <button className="flex items-center gap-2 px-4 py-1.5 rounded-md border border-emerald-500 bg-white text-emerald-600 font-medium text-sm shrink-0 hover:bg-emerald-50 transition-colors">
          <Calendar className="h-4 w-4" />
          Lịch hẹn
        </button>
        <button className="flex items-center gap-2 px-4 py-1.5 rounded-md border border-gray-200 bg-white text-slate-600 text-sm shrink-0 hover:bg-gray-50 transition-colors">
          <Stethoscope className="h-4 w-4" />
          Dịch vụ
        </button>
        <button className="flex items-center gap-2 px-4 py-1.5 rounded-md border border-gray-200 bg-white text-slate-600 text-sm shrink-0 hover:bg-gray-50 transition-colors">
          <Activity className="h-4 w-4" />
          Điều trị
        </button>
        <button className="flex items-center gap-2 px-4 py-1.5 rounded-md border border-gray-200 bg-white text-slate-600 text-sm shrink-0 hover:bg-gray-50 transition-colors">
          <CreditCard className="h-4 w-4" />
          Thanh toán
        </button>
        <button className="flex items-center gap-2 px-4 py-1.5 rounded-md border border-gray-200 bg-white text-slate-600 text-sm shrink-0 hover:bg-gray-50 transition-colors">
          <FolderOpen className="h-4 w-4" />
          Hồ sơ
        </button>
      </div>
    </div>
  )
}

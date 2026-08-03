import { Building2, UserPlus } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { urlPaths } from "@/constants/urlPaths"
import { clinicOptionsQueryOptions } from "@/queries/clinic-query"
import { useClinicStore } from "@/stores/clinic-store"

export function ListFilters() {
  const navigate = useNavigate()
  const activeClinicId = useClinicStore((state) => state.activeClinicId)
  const setActiveClinicId = useClinicStore((state) => state.setActiveClinicId)
  const { data: clinicOptions = [] } = useQuery(clinicOptionsQueryOptions())

  return (
    <div className="mb-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold text-slate-800">
            Danh sách khách hàng
          </h2>
          <p className="mb-4 text-xs text-slate-500">
            Danh sách khách hàng theo ngày tạo hồ sơ, chốt dịch vụ, điều trị,
            thanh toán hoặc ngày checked in
          </p>
        </div>
        <Button
          onClick={() => navigate(urlPaths.medicalRecordCreate)}
          className="shrink-0"
        >
          <UserPlus className="h-4 w-4" />
          Tạo mới hồ sơ
        </Button>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <div className="flex shrink-0 items-center gap-1.5">
          <Building2 className="h-4 w-4 text-emerald-600" />
          <Select
            value={activeClinicId ?? ""}
            onValueChange={(value) => setActiveClinicId(value || null)}
          >
            <SelectTrigger className="w-[180px] bg-white text-sm">
              <SelectValue placeholder="Chọn cơ sở" />
            </SelectTrigger>
            <SelectContent>
              {clinicOptions.map((clinic) => (
                <SelectItem key={clinic.id} value={clinic.id}>
                  {clinic.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}

import { useQuery } from "@tanstack/react-query"
import { Building2, FileUp, Search, UserPlus } from "lucide-react"
import { useNavigate } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { useState } from "react"
import { PatientImportDialog } from "./PatientImportDialog"

interface ListFiltersProps {
  search: string
  onSearchChange: (value: string) => void
  onApplySearch: () => void
}

export function ListFilters({
  search,
  onSearchChange,
  onApplySearch,
}: ListFiltersProps) {
  const [importOpen, setImportOpen] = useState(false)
  const navigate = useNavigate()
  const activeClinicId = useClinicStore((state) => state.activeClinicId)
  const setActiveClinicId = useClinicStore((state) => state.setActiveClinicId)
  const { data: clinicOptions = [] } = useQuery(clinicOptionsQueryOptions())

  return (
    <div className="mb-4">
      <div className="flex items-start justify-between gap-4 max-md:mb-2">
        <div>
          <h2 className="text-sm font-semibold text-slate-800">
            Danh sách khách hàng
          </h2>
          <p className="mb-4 text-xs text-slate-500 max-md:hidden">
            Danh sách khách hàng theo ngày tạo hồ sơ, chốt dịch vụ, điều trị,
            thanh toán hoặc ngày checked in
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setImportOpen(true)}>
            <FileUp className="h-4 w-4" />
            Import Excel
          </Button>
          <Button
            onClick={() => navigate(urlPaths.medicalRecordCreate)}
            className="shrink-0"
          >
            <UserPlus className="h-4 w-4" />
            Tạo mới hồ sơ
          </Button>
        </div>
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
        <div className="relative min-w-[220px] flex-1">
          <Search className="absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onApplySearch()}
            placeholder="Tìm theo tên, SĐT, mã khách hàng"
            className="h-8 bg-white pl-8 text-sm"
          />
        </div>
        <Button type="button" size="sm" onClick={onApplySearch}>
          OK
        </Button>
      </div>
      <PatientImportDialog open={importOpen} onOpenChange={setImportOpen} />
    </div>
  )
}

import { Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { SERVICE_UNITS } from "../data/mock-data"
import type { ServiceFilters } from "../types/treatment-service"

interface ServiceFiltersBarProps {
  filters: ServiceFilters
  onFiltersChange: (filters: ServiceFilters) => void
  onApply: () => void
}

const SELECT_CONTENT_PROPS = {
  position: "popper" as const,
  side: "bottom" as const,
  sideOffset: 4,
  className: "z-[200]",
}

export function ServiceFiltersBar({
  filters,
  onFiltersChange,
  onApply,
}: ServiceFiltersBarProps) {
  return (
    <div className="relative z-20 flex flex-wrap items-center gap-2 rounded-lg border-b border-slate-100 bg-white px-4 py-3">
      <div className="relative min-w-[200px] flex-1">
        <Search className="absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input
          value={filters.search}
          onChange={(event) =>
            onFiltersChange({ ...filters, search: event.target.value })
          }
          placeholder="eg. nhập dữ liệu để tìm kiếm"
          className="h-8 bg-white pl-8 text-sm"
        />
      </div>

      <Select
        value={filters.status}
        onValueChange={(value) =>
          onFiltersChange({
            ...filters,
            status: value as ServiceFilters["status"],
          })
        }
      >
        <SelectTrigger className="h-8 w-[180px] bg-white text-sm">
          <SelectValue placeholder="Tình trạng" />
        </SelectTrigger>
        <SelectContent {...SELECT_CONTENT_PROPS}>
          <SelectItem value="active">Đang sử dụng</SelectItem>
          <SelectItem value="all">Tất cả</SelectItem>
          <SelectItem value="inactive">Ngừng hoạt động</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.unit}
        onValueChange={(value) => onFiltersChange({ ...filters, unit: value })}
      >
        <SelectTrigger className="h-8 w-[140px] bg-white text-sm">
          <SelectValue placeholder="Đơn vị" />
        </SelectTrigger>
        <SelectContent {...SELECT_CONTENT_PROPS}>
          {SERVICE_UNITS.map((unit) => (
            <SelectItem key={unit} value={unit}>
              {unit}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.itemType}
        onValueChange={(value) =>
          onFiltersChange({
            ...filters,
            itemType: value as ServiceFilters["itemType"],
          })
        }
      >
        <SelectTrigger className="h-8 w-[120px] bg-white text-sm">
          <SelectValue placeholder="Loại" />
        </SelectTrigger>
        <SelectContent {...SELECT_CONTENT_PROPS}>
          <SelectItem value="all">Loại</SelectItem>
          <SelectItem value="service">Dịch vụ</SelectItem>
          <SelectItem value="product">Sản phẩm</SelectItem>
        </SelectContent>
      </Select>

      <Button
        type="button"
        onClick={onApply}
        className="h-8 bg-slate-800 text-white hover:bg-slate-900"
      >
        Ok
      </Button>
    </div>
  )
}

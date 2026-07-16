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

import { MEDICINE_UNITS } from "../data/medicine-units"
import type { MedicineFilters } from "../types/medicine"

interface MedicineFiltersBarProps {
  filters: MedicineFilters
  onFiltersChange: (filters: MedicineFilters) => void
  onApply: () => void
}

const SELECT_CONTENT_PROPS = {
  position: "popper" as const,
  side: "bottom" as const,
  sideOffset: 4,
  className: "z-[200]",
}

export function MedicineFiltersBar({
  filters,
  onFiltersChange,
  onApply,
}: MedicineFiltersBarProps) {
  return (
    <div className="relative z-20 flex flex-wrap items-center gap-2 rounded-lg border-b border-slate-100 bg-white px-4 py-3">
      <div className="relative min-w-[200px] flex-1">
        <Search className="absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input
          value={filters.search}
          onChange={(event) =>
            onFiltersChange({ ...filters, search: event.target.value })
          }
          placeholder="Tìm theo tên hoặc loại thuốc"
          className="h-8 bg-white pl-8 text-sm"
        />
      </div>

      <Select
        value={filters.unit}
        onValueChange={(value) => onFiltersChange({ ...filters, unit: value })}
      >
        <SelectTrigger className="h-8 w-[140px] bg-white text-sm">
          <SelectValue placeholder="Đơn vị" />
        </SelectTrigger>
        <SelectContent {...SELECT_CONTENT_PROPS}>
          {MEDICINE_UNITS.map((unit) => (
            <SelectItem key={unit} value={unit}>
              {unit}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button type="button" onClick={onApply}>
        OK
      </Button>
    </div>
  )
}

import { Search } from "lucide-react"

import { DatePickerFieldIso } from "@/components/FieldCustom/DatePickerField"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export interface ConsumableUsageFilters {
  search: string
  from: string
  to: string
}

interface ConsumableUsageFiltersBarProps {
  filters: ConsumableUsageFilters
  onFiltersChange: (filters: ConsumableUsageFilters) => void
  onApply: () => void
}

export function ConsumableUsageFiltersBar({
  filters,
  onFiltersChange,
  onApply,
}: ConsumableUsageFiltersBarProps) {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-3">
      <div className="relative min-w-[200px] flex-1">
        <Search className="absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input
          value={filters.search}
          onChange={(event) =>
            onFiltersChange({ ...filters, search: event.target.value })
          }
          placeholder="Tìm khách hàng, vật tư, dịch vụ..."
          className="h-9 bg-white pl-8 text-sm"
          onKeyDown={(event) => {
            if (event.key === "Enter") onApply()
          }}
        />
      </div>

      <DatePickerFieldIso
        value={filters.from}
        onChange={(from) => onFiltersChange({ ...filters, from })}
        placeholder="Từ ngày"
        className="h-9 w-[150px] text-sm"
      />

      <DatePickerFieldIso
        value={filters.to}
        onChange={(to) => onFiltersChange({ ...filters, to })}
        placeholder="Đến ngày"
        className="h-9 w-[150px] text-sm"
        fromDate={filters.from ? parsePickerDate(filters.from) : undefined}
      />

      <Button type="button" onClick={onApply}>
        Tìm
      </Button>
    </div>
  )
}

function parsePickerDate(isoDate: string): Date | undefined {
  const [year, month, day] = isoDate.split("-").map(Number)
  if (!year || !month || !day) return undefined
  return new Date(year, month - 1, day)
}

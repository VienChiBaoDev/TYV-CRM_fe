import type { TreatmentServiceItem } from "@/app/medical-records/mappers/map-patient-service-to-treatment-item"
import { cn } from "@/lib/utils"
import { Search } from "lucide-react"
import { filterInputClassName, STATUS_FILTER } from "./treatment-action.constants"

interface TreatmentActionSidebarProps {
  statusFilter: string
  onStatusFilterChange: (value: string) => void
  searchQuery: string
  onSearchQueryChange: (value: string) => void
  isLoading: boolean
  items: TreatmentServiceItem[]
  paidItemsCount: number
  selectedId: string
  onSelectTreatment: (item: TreatmentServiceItem) => void
}

export default function TreatmentActionSidebar({
  statusFilter,
  onStatusFilterChange,
  searchQuery,
  onSearchQueryChange,
  isLoading,
  items,
  paidItemsCount,
  selectedId,
  onSelectTreatment,
}: TreatmentActionSidebarProps) {
  return (
    <div className="space-y-4 border-b border-slate-100 p-5 lg:border-r lg:border-b-0">
      <div className="flex gap-5">
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="radio"
            name="status"
            value={STATUS_FILTER.IN_PROGRESS}
            checked={statusFilter === STATUS_FILTER.IN_PROGRESS}
            onChange={() => onStatusFilterChange(STATUS_FILTER.IN_PROGRESS)}
            className="h-3.5 w-3.5 accent-slate-800"
          />
          <span className="text-xs font-semibold text-slate-700">
            Đang điều trị
          </span>
        </label>
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="radio"
            name="status"
            value={STATUS_FILTER.COMPLETED}
            checked={statusFilter === STATUS_FILTER.COMPLETED}
            onChange={() => onStatusFilterChange(STATUS_FILTER.COMPLETED)}
            className="h-3.5 w-3.5 accent-slate-800"
          />
          <span className="text-xs font-semibold text-slate-700">
            Điều trị xong
          </span>
        </label>
      </div>

      <div className="relative">
        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)}
          placeholder="eg. tìm kiếm"
          className={cn(filterInputClassName, "pl-9")}
        />
      </div>

      <div className="space-y-2">
        {isLoading ? (
          <p className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-4 text-center text-xs text-slate-500">
            Đang tải dịch vụ...
          </p>
        ) : items.length === 0 ? (
          <p className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-3 py-4 text-center text-xs text-slate-500">
            {paidItemsCount === 0
              ? "Chưa có dịch vụ đã thanh toán để điều trị."
              : "Không tìm thấy dịch vụ phù hợp."}
          </p>
        ) : (
          items.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectTreatment(item)}
              className={cn(
                "w-full rounded-lg border p-3 text-left transition-colors",
                selectedId === item.id
                  ? "border-emerald-200 bg-emerald-50/50"
                  : "border-slate-200 bg-white hover:border-slate-300"
              )}
            >
              <div className="mb-1 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">{item.time}</span>
                <span className="text-[11px] text-slate-400">
                  {item.progress}
                </span>
              </div>
              <p className="text-sm font-bold text-slate-800">{item.name}</p>
            </button>
          ))
        )}
      </div>
    </div>
  )
}

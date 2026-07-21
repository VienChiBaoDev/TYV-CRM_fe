import { Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface FormulaFiltersBarProps {
  search: string
  onSearchChange: (value: string) => void
  onApply: () => void
}

export function FormulaFiltersBar({
  search,
  onSearchChange,
  onApply,
}: FormulaFiltersBarProps) {
  return (
    <div className="relative z-20 flex flex-wrap items-center gap-2 rounded-lg border-b border-slate-100 bg-white px-4 py-3">
      <div className="relative min-w-[200px] flex-1">
        <Search className="absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          onKeyDown={(event) => event.key === "Enter" && onApply()}
          placeholder="Tìm theo tên công thức"
          className="h-8 bg-white pl-8 text-sm"
        />
      </div>
      <Button type="button" onClick={onApply}>
        OK
      </Button>
    </div>
  )
}

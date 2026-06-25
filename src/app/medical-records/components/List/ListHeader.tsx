import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function ListHeader() {
  return (
    <div className="mb-4 flex items-center justify-between">
      <Select defaultValue="136">
        <SelectTrigger className="w-[200px] bg-white">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="136">Thượng Y Viên 136</SelectItem>
        </SelectContent>
      </Select>

      <div className="text-right">
        <div className="text-sm font-semibold text-slate-800">Hôm nay</div>
        <div className="text-xs text-slate-500">23-06-2026</div>
      </div>
    </div>
  )
}

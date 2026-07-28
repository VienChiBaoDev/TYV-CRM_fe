import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function IdentityCardSection() {
  return (
    <div className="mt-4 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-slate-800">CMND/CC</h3>
        <p className="text-xs text-slate-500">Thông tin CMND/CC</p>
      </div>
      <div className="grid grid-cols-3 gap-6">
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-gray-700">CMND/CC</Label>
          <Input placeholder="eg. cmnd/cc" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-gray-700">Ngày cấp</Label>
          <Input placeholder="dd-mm-yyyy" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-gray-700">Nơi cấp</Label>
          <Input placeholder="eg. nơi cấp" />
        </div>
      </div>
    </div>
  )
}

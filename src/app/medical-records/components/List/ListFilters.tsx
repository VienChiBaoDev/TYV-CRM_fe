import { Calendar, Stethoscope, Activity, CreditCard, FolderOpen, ChevronDown } from "lucide-react"

export function ListFilters() {
  return (
    <div className="mb-4">
      <h2 className="text-sm font-semibold text-slate-800">Danh sách khách hàng</h2>
      <p className="text-xs text-slate-500 mb-4">Danh sách khách hàng theo ngày tạo hồ sơ, chốt dịch vụ, điều trị , thanh toán hoặc ngày checked in</p>
      
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {/* Date Range Picker (Mock) */}
        <div className="flex items-center border border-gray-200 rounded-md bg-white text-sm shrink-0">
          <button className="flex items-center gap-1 px-3 py-1.5 border-r border-gray-200 hover:bg-gray-50 text-slate-700">
            Hôm nay <ChevronDown className="h-4 w-4" />
          </button>
          <div className="px-3 py-1.5 text-slate-600 flex items-center gap-2">
            <div className="h-4 w-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">i</div>
            23-06-2026 to 23-06-2026
          </div>
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

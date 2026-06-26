import { Search, Filter } from "lucide-react"

export default function ReferrersPage() {
  return (
    <div className="h-full bg-white flex flex-col p-6">
      {/* Top Header Row */}
      <div className="flex items-center justify-between mb-6">
        {/* Left Actions */}
        <div className="flex items-center gap-4">
          <button className="flex items-center justify-center h-10 w-10 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Search className="h-5 w-5 text-emerald-600" />
          </button>
          <button className="flex items-center justify-center hover:opacity-80 transition-opacity">
            <div className="h-5 w-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold font-serif">i</div>
          </button>
          <button className="flex items-center justify-center hover:opacity-80 transition-opacity">
            <Filter className="h-5 w-5 text-emerald-600 fill-emerald-600" />
          </button>
        </div>

        {/* Right Legend */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center h-6 w-6 rounded bg-emerald-600 text-white text-xs font-bold">0</div>
            <span className="text-xs text-slate-600">Người giới thiệu</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center h-6 w-6 rounded bg-lime-500 text-white text-xs font-bold">0</div>
            <span className="text-xs text-slate-600">Là khách hàng</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center h-6 w-6 rounded bg-orange-500 text-white text-xs font-bold">0</div>
            <span className="text-xs text-slate-600">Là nhân viên</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center h-6 w-6 rounded bg-blue-500 text-white text-xs font-bold">0</div>
            <span className="text-xs text-slate-600">Khác</span>
          </div>
        </div>
      </div>

      {/* Main Empty Content Area */}
      <div className="flex-1"></div>

      {/* Footer */}
      <div className="py-4 text-center">
        <button className="text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors">
          Xem thêm
        </button>
      </div>
    </div>
  )
}

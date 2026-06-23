import { FileText, CalendarCheck, Edit, Receipt } from "lucide-react"

export function SummaryCards() {
  return (
    <div className="grid grid-cols-4 gap-4 mb-6">
      {/* Hồ sơ */}
      <div className="bg-slate-100 rounded-xl p-4 flex justify-between items-start border border-slate-200/50">
        <div>
          <div className="text-sm font-medium text-slate-700">Hồ sơ</div>
          <div className="text-3xl font-bold text-emerald-600 mt-1">0</div>
        </div>
        <FileText className="h-6 w-6 text-emerald-500" />
      </div>

      {/* CheckedIn */}
      <div className="bg-slate-100 rounded-xl p-4 flex justify-between items-start border border-slate-200/50">
        <div>
          <div className="text-sm font-medium text-slate-700">CheckedIn</div>
          <div className="text-3xl font-bold text-emerald-600 mt-1">3</div>
          <div className="text-xs text-slate-500 mt-1">75 % / tổng lịch hẹn <span className="font-semibold">4</span></div>
        </div>
        <CalendarCheck className="h-6 w-6 text-sky-400" />
      </div>

      {/* Doanh số */}
      <div className="bg-slate-100 rounded-xl p-4 flex justify-between items-start border border-slate-200/50">
        <div>
          <div className="text-sm font-medium text-slate-700">Doanh số</div>
          <div className="text-3xl font-bold text-emerald-600 mt-1">600,000</div>
          <div className="text-xs text-slate-500 mt-1">33 % khách mới <span className="font-semibold text-slate-700">200,000</span></div>
        </div>
        <Edit className="h-6 w-6 text-lime-500" />
      </div>

      {/* Doanh thu */}
      <div className="bg-slate-100 rounded-xl p-4 flex justify-between items-start border border-slate-200/50">
        <div>
          <div className="text-sm font-medium text-slate-700">Doanh thu</div>
          <div className="text-3xl font-bold text-emerald-600 mt-1">400,000</div>
          <div className="text-xs text-slate-500 mt-1">0 % khách mới <span className="font-semibold text-slate-700">0</span></div>
        </div>
        <Receipt className="h-6 w-6 text-yellow-500" />
      </div>
    </div>
  )
}

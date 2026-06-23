import { ArrowDown, Filter, Menu, MinusCircle } from "lucide-react"

export function PatientTable() {
  const data = [
    { id: 1, code: "TYV00000056", name: "Nông Quản Phượng", source: "BN Giới Thiệu" },
    { id: 2, code: "NHCG00002278", name: "Lê Nguyễn Phương", source: "Khách hàng cũ Nhân Hòa" },
    { id: 3, code: "TYV00002892", name: "Đặng Hiếu", source: "Facebook Nhân Hòa Y Đạo" },
  ]

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Table Top Controls */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-2 text-sm text-slate-700 font-medium">
          Đã check - in <ArrowDown className="h-4 w-4 text-emerald-600" /> <span className="font-normal text-slate-500">23-06-2026</span>
        </div>
        <div className="flex items-center gap-2">
          <select className="border border-gray-200 rounded-md text-sm px-2 py-1 outline-none text-slate-700 bg-white cursor-pointer">
            <option>Số lượng : 3</option>
          </select>
          <button className="border border-gray-200 p-1.5 rounded-md hover:bg-gray-50 text-slate-600">
            <Menu className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Custom Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-[#f8fbfb] border-b border-gray-200 text-slate-700 font-semibold uppercase text-xs">
            <tr>
              <th className="px-4 py-3 w-16 text-center border-r border-gray-200">#</th>
              <th className="px-4 py-3 border-r border-gray-200">
                <div className="flex items-center gap-2">
                  Khách Hàng <span className="flex flex-col"><span className="text-[8px] leading-[4px]">▲</span><span className="text-[8px] leading-[4px]">▼</span></span>
                </div>
              </th>
              <th className="px-4 py-3 w-12 border-r border-gray-200 text-center">
                <Filter className="h-4 w-4 mx-auto text-slate-400" />
              </th>
              <th className="px-4 py-3">Nguồn</th>
            </tr>
          </thead>
          <tbody>
            {/* The little red minus circle row in the design? It looks like it belongs to the first row or is an action icon. We'll place it next to the number. */}
            {data.map((row) => (
              <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="px-4 py-4 text-center text-slate-500 relative border-r border-gray-200">
                  {row.id === 1 && (
                    <MinusCircle className="h-4 w-4 text-red-500 absolute left-2 top-2" />
                  )}
                  {row.id}
                </td>
                <td className="px-4 py-4 border-r border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gray-200 shrink-0"></div>
                    <div>
                      <div className="text-emerald-600 font-semibold text-xs mb-0.5">{row.code}</div>
                      <div className="text-slate-700 font-medium">{row.name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 border-r border-gray-200"></td>
                <td className="px-4 py-4 text-slate-700">{row.source}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="p-3 text-center border-t border-gray-200">
        <button className="text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors">
          Xem thêm
        </button>
      </div>
    </div>
  )
}

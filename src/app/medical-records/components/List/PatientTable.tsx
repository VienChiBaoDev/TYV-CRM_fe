import { ArrowDown, Filter, Menu } from "lucide-react"
import { useNavigate } from "react-router-dom"

import { urlPaths } from "@/constants/urlPaths"
import type { Patient } from "../../data/patientService"

interface PatientTableProps {
  patients: Patient[]
  loading: boolean
  selectedReferrerName: string | null
}

export function PatientTable({
  patients,
  loading,
  selectedReferrerName,
}: PatientTableProps) {
  const navigate = useNavigate()

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Table Top Controls */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-2 text-sm text-slate-700 font-medium">
          {selectedReferrerName ? (
            <>
              Được giới thiệu bởi{" "}
              <span className="text-emerald-600">{selectedReferrerName}</span>
            </>
          ) : (
            <>
              Khách hàng <ArrowDown className="h-4 w-4 text-emerald-600" />
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="border border-gray-200 rounded-md text-sm px-2 py-1 text-slate-700 bg-white">
            Số lượng : {patients.length}
          </span>
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
              <th className="px-4 py-3 w-16 text-center border-r border-gray-200">
                #
              </th>
              <th className="px-4 py-3 border-r border-gray-200">
                <div className="flex items-center gap-2">
                  Khách Hàng{" "}
                  <span className="flex flex-col">
                    <span className="text-[8px] leading-[4px]">▲</span>
                    <span className="text-[8px] leading-[4px]">▼</span>
                  </span>
                </div>
              </th>
              <th className="px-4 py-3 border-r border-gray-200">
                Số điện thoại
              </th>
              <th className="px-4 py-3 w-12 border-r border-gray-200 text-center">
                <Filter className="h-4 w-4 mx-auto text-slate-400" />
              </th>
              <th className="px-4 py-3 border-r border-gray-200">Nguồn</th>
              <th className="px-4 py-3">Người giới thiệu</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-slate-400">
                  Đang tải...
                </td>
              </tr>
            ) : patients.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-slate-400">
                  Chưa có khách hàng nào
                </td>
              </tr>
            ) : (
              patients.map((row, index) => (
                <tr
                  key={row.id}
                  onClick={() => navigate(urlPaths.medicalRecords(row.id))}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <td className="px-4 py-4 text-center text-slate-500 border-r border-gray-200">
                    {index + 1}
                  </td>
                  <td className="px-4 py-4 border-r border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gray-200 shrink-0 flex items-center justify-center text-xs font-semibold text-slate-500">
                        {row.fullName.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-emerald-600 font-semibold text-xs mb-0.5">
                          {row.patientCode}
                        </div>
                        <div className="text-slate-700 font-medium">
                          {row.fullName}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-slate-700 border-r border-gray-200">
                    {row.phone}
                  </td>
                  <td className="px-4 py-4 border-r border-gray-200"></td>
                  <td className="px-4 py-4 text-slate-700 border-r border-gray-200">
                    {row.source ?? <span className="text-slate-400">—</span>}
                  </td>
                  <td className="px-4 py-4 text-slate-700">
                    {row.referrer?.fullName ?? (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

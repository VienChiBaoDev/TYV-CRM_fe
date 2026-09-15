import { Pencil } from "lucide-react"
import { useNavigate } from "react-router-dom"

import { DataTablePagination } from "@/components/data-table/data-table-pagination"
import { urlPaths } from "@/constants/urlPaths"
import type { Patient } from "../../data/patientService"

interface PatientTableProps {
  patients: Patient[]
  loading: boolean
  rowOffset: number // (page - 1) * limit
  pageIndex: number // page - 1 (0-based)
  pageCount: number
  total: number
  onPageChange: (pageIndex: number) => void
  selectedReferrerName: string | null
  onEditPatient: (patientId: string) => void
}

export function PatientTable({
  patients,
  loading,
  rowOffset,
  pageIndex,
  pageCount,
  total,
  onPageChange,
  selectedReferrerName,
  onEditPatient,
}: PatientTableProps) {
  const navigate = useNavigate()

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      {/* Table Top Controls */}
      <div className="flex items-center justify-between border-b border-gray-200 bg-white p-3">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
          {selectedReferrerName ? (
            <>
              Được giới thiệu bởi{" "}
              <span className="text-emerald-600">{selectedReferrerName}</span>
            </>
          ) : (
            <>Khách hàng</>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-md border border-gray-200 bg-white px-2 py-1 text-sm text-slate-700">
            Số lượng : {total}
          </span>
        </div>
      </div>

      {/* Custom Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gray-200 bg-[#f8fbfb] text-xs font-semibold text-slate-700 uppercase">
            <tr>
              <th className="w-16 border-r border-gray-200 px-4 py-3 text-center">
                #
              </th>
              <th className="border-r border-gray-200 px-4 py-3">
                <div className="flex items-center gap-2">Khách Hàng</div>
              </th>
              <th className="border-r border-gray-200 px-4 py-3">
                Số điện thoại
              </th>

              <th className="border-r border-gray-200 px-4 py-3">Nguồn</th>
              <th className="border-r border-gray-200 px-4 py-3">
                Người giới thiệu
              </th>
              <th className="w-20 px-4 py-3 text-center">Sửa</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-10 text-center text-slate-400"
                >
                  Đang tải...
                </td>
              </tr>
            ) : patients.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-10 text-center text-slate-400"
                >
                  Chưa có khách hàng nào
                </td>
              </tr>
            ) : (
              patients.map((row, index) => (
                <tr
                  key={row.id}
                  onClick={() => navigate(urlPaths.medicalRecords(row.id))}
                  className="cursor-pointer border-b border-gray-100 transition-colors hover:bg-gray-50"
                >
                  <td className="border-r border-gray-200 px-4 py-4 text-center text-slate-500">
                    {rowOffset + index + 1}
                  </td>
                  <td className="border-r border-gray-200 px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-200 text-xs font-semibold text-slate-500">
                        {row.fullName.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="mb-0.5 text-xs font-semibold text-emerald-600">
                          {row.patientCode}
                        </div>
                        <div className="font-medium text-slate-700">
                          {row.fullName}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="border-r border-gray-200 px-4 py-4 text-slate-700">
                    {row.phone}
                  </td>
                  <td className="border-r border-gray-200 px-4 py-4"></td>
                  <td className="border-r border-gray-200 px-4 py-4 text-slate-700">
                    {row.source ?? <span className="text-slate-400">—</span>}
                  </td>
                  <td className="border-r border-gray-200 px-4 py-4 text-slate-700">
                    {row.referrer?.fullName ?? (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-4 text-center">
                    <button
                      type="button"
                      title="Sửa khách hàng"
                      aria-label="Sửa khách hàng"
                      onClick={(event) => {
                        event.stopPropagation()
                        onEditPatient(row.id)
                      }}
                      className="inline-flex items-center justify-center rounded-md p-1.5 text-slate-500 hover:bg-emerald-50 hover:text-emerald-700"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div className="flex justify-end border-t border-gray-200 p-3">
          <DataTablePagination
            pageIndex={pageIndex}
            pageCount={Math.max(pageCount, 1)}
            onPageChange={onPageChange}
          />
        </div>
      </div>
    </div>
  )
}

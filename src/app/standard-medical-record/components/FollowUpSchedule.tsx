import { useEffect, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import type { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/data-table/data-table"
import { useClinicStore } from "@/stores/clinic-store"
import { FOLLOW_UP_SCHEDULE_STATUS } from "@/constants/common"
import { upcomingFollowUpsQueryOptions } from "../queries/follow-up-query"
import type { FollowUpSchedule } from "../interfaces/StandardMedicalRecord"
import { QuickScheduleDialog } from "./QuickScheduleDialog"
import { Link } from "react-router-dom"
import { urlPaths } from "@/constants/urlPaths"
import { formatIsoDateToVi } from "@/app/medical-records/constants/visit-form"
import { DEFAULT_LIMIT } from "@/types/pagination"

const UPCOMING_DAYS_AHEAD = 3

export function FollowUpSchedule() {
  const activeBranch = useClinicStore((s) => s.activeBranch)
  const branch = activeBranch === "Cầu Giấy" ? "CAU_GIAY" : "HANG_BONG"
  const [page, setPage] = useState(1)

  useEffect(() => {
    setPage(1)
  }, [branch])

  const { data, isLoading } = useQuery(
    upcomingFollowUpsQueryOptions({
      branch,
      daysAhead: UPCOMING_DAYS_AHEAD,
      page,
      limit: DEFAULT_LIMIT,
    })
  )

  const rows = data?.data ?? []
  const pageCount = Math.max(data?.meta.totalPages ?? 0, 1)

  const [selectedRow, setSelectedRow] = useState<FollowUpSchedule | null>(null)

  const columns: ColumnDef<FollowUpSchedule>[] = [
    {
      accessorKey: "name",
      header: "Tên bệnh nhân",
      cell: ({ row }) => {
        return (
          <Link to={urlPaths.medicalRecords(row.original.patientId)}>
            {row.original.name}
          </Link>
        )
      },
    },
    {
      accessorKey: "followUpAppointmentDate",
      header: "Hạn tái khám",
      cell: ({ row }) =>
        formatIsoDateToVi(row.original.followUpAppointmentDate),
    },
    { accessorKey: "physicianInCharge", header: "Bác sĩ phụ trách" },
    { accessorKey: "facility", header: "Cơ sở" },
    {
      accessorKey: "status",
      header: "Trạng thái",
      cell: ({ row }) => {
        const status =
          FOLLOW_UP_SCHEDULE_STATUS[
            row.original.status as keyof typeof FOLLOW_UP_SCHEDULE_STATUS
          ]
        return status ? (
          <span className={status.className}>{status.name}</span>
        ) : null
      },
    },
    {
      id: "actions",
      header: "Thao tác",
      cell: ({ row }) => (
        <Button
          size="sm"
          disabled={row.original.status === 1}
          onClick={() => setSelectedRow(row.original)}
          className="bg-emerald-700 text-white hover:bg-emerald-800"
        >
          Đặt nhanh
        </Button>
      ),
    },
  ]

  return (
    <>
      <DataTable
        title={`Bệnh nhân sắp đến hạn tái khám (${UPCOMING_DAYS_AHEAD} ngày tới)`}
        columns={columns}
        data={rows}
        loading={isLoading}
        pageIndex={page - 1}
        pageCount={pageCount}
        onPageChange={(nextPageIndex) => setPage(nextPageIndex + 1)}
      />

      {selectedRow && (
        <QuickScheduleDialog
          open={Boolean(selectedRow)}
          onOpenChange={(open) => !open && setSelectedRow(null)}
          row={selectedRow}
        />
      )}
    </>
  )
}

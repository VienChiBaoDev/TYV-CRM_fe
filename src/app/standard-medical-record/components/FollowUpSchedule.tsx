import { useEffect, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import type { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/data-table/data-table"
import { toClinicBranchCode } from "@/lib/clinic-branch"
import { useClinicStore } from "@/stores/clinic-store"
import { FOLLOW_UP_SCHEDULE_STATUS } from "@/constants/common"
import { upcomingFollowUpsQueryOptions } from "../queries/follow-up-query"
import type { FollowUpSchedule } from "../interfaces/StandardMedicalRecord"
import { QuickScheduleDialog } from "./QuickScheduleDialog"
import { Link } from "react-router-dom"
import { urlPaths } from "@/constants/urlPaths"
import { formatIsoDateToVi } from "@/app/medical-records/constants/visit-form"
import { DEFAULT_LIMIT } from "@/types/pagination"
import { RescheduleFollowUpDialog } from "./RescheduleFollowUpDialog"

export const UPCOMING_DAYS_AHEAD = 7

export function FollowUpSchedule() {
  const activeBranch = useClinicStore((s) => s.activeBranch)
  const branch = toClinicBranchCode(activeBranch)
  const [page, setPage] = useState(1)
  const [selectedRow, setSelectedRow] = useState<FollowUpSchedule | null>(null)
  const [rescheduleRow, setRescheduleRow] = useState<FollowUpSchedule | null>(
    null
  )

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
    {
      accessorKey: "rescheduledFollowUpDate",
      header: "Lịch đổi",
      cell: ({ row }) =>
        row.original.rescheduledFollowUpDate
          ? formatIsoDateToVi(row.original.rescheduledFollowUpDate)
          : "—",
    },
    {
      accessorKey: "rescheduleNote",
      header: "Ghi chú đổi lịch",
      cell: ({ row }) => row.original.rescheduleNote ?? "—",
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
      cell: ({ row }) => {
        const isScheduled = row.original.status === 1

        return (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={isScheduled}
              title={
                isScheduled
                  ? "Đã đặt lịch — hủy lịch hẹn trên lịch trước"
                  : undefined
              }
              onClick={() => setRescheduleRow(row.original)}
            >
              Đổi lịch
            </Button>
            <Button
              size="sm"
              disabled={isScheduled}
              onClick={() => setSelectedRow(row.original)}
            >
              Đặt nhanh
            </Button>
          </div>
        )
      },
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
        classNameTable="shadow-xl"
      />

      {selectedRow && (
        <QuickScheduleDialog
          open={Boolean(selectedRow)}
          onOpenChange={(open) => !open && setSelectedRow(null)}
          row={selectedRow}
        />
      )}

      {rescheduleRow && (
        <RescheduleFollowUpDialog
          open={Boolean(rescheduleRow)}
          onOpenChange={(open) => !open && setRescheduleRow(null)}
          row={rescheduleRow}
        />
      )}
    </>
  )
}

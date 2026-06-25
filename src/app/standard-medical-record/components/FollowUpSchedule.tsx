import { useState } from "react"
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
// import { QuickScheduleDialog } from "./QuickScheduleDialog"

export function FollowUpSchedule() {
  const activeBranch = useClinicStore((s) => s.activeBranch)
  const branch = activeBranch === "Cầu Giấy" ? "CAU_GIAY" : "HANG_BONG"

  const { data = [], isLoading } = useQuery(
    upcomingFollowUpsQueryOptions(branch, 3)
  )

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
      // format ngày vi-VN nếu muốn
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
        title="Bệnh nhân sắp đến hạn tái khám (3 ngày tới)"
        columns={columns}
        data={data}
        loading={isLoading}
        pageIndex={0}
        pageCount={1}
        onPageChange={() => {}}
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

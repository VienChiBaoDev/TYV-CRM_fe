import type { ColumnDef } from "@tanstack/react-table"
import type { FollowUpSchedule } from "../interfaces/StandardMedicalRecord"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/data-table/data-table"
import { standardMedicalRecords } from "../data/data"
import { FOLLOW_UP_SCHEDULE_STATUS } from "@/constants/common"

export function FollowUpSchedule() {
  const columns: ColumnDef<FollowUpSchedule>[] = [
    {
      accessorKey: "name",
      header: "Tên bệnh nhân",
    },
    {
      accessorKey: "followUpAppointmentDate",
      header: "Hạn tái khám",
    },
    {
      accessorKey: "physicianInCharge",
      header: "Bác sĩ phụ trách",
    },
    {
      accessorKey: "facility",
      header: "Cơ sở",
    },
    {
      accessorKey: "status",
      header: "Trạng thái",
      cell: ({ row }) => {
        return (
          <div>
            {FOLLOW_UP_SCHEDULE_STATUS[
              row.original.status as keyof typeof FOLLOW_UP_SCHEDULE_STATUS
            ] && (
              <span
                className={
                  FOLLOW_UP_SCHEDULE_STATUS[
                    row.original
                      .status as keyof typeof FOLLOW_UP_SCHEDULE_STATUS
                  ].className
                }
              >
                {
                  FOLLOW_UP_SCHEDULE_STATUS[
                    row.original
                      .status as keyof typeof FOLLOW_UP_SCHEDULE_STATUS
                  ].name
                }
              </span>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: "actions",
      header: "Thao tác",
      cell: ({ row }) => {
        return (
          <div>
            <Button
              size="icon"
              onClick={() => {
                console.log(row.original)
              }}
              className="w-full bg-emerald-700 text-white hover:bg-emerald-800"
            >
              Đặt nhanh
            </Button>
          </div>
        )
      },
    },
  ]

  return (
    <DataTable
      title="Bệnh nhân sắp đến hạn tái khám (3 ngày tới)"
      columns={columns}
      data={standardMedicalRecords}
      loading={false}
      pageIndex={0}
      pageCount={2}
      onPageChange={() => {}}
    />
  )
}

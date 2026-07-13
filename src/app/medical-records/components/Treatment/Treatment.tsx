import { DataTable } from "@/components/data-table/data-table"
import { Button } from "@/components/ui/button"
import { formatDatetimeVi } from "@/lib/date-vi"
import { useQuery } from "@tanstack/react-query"
import type { ColumnDef } from "@tanstack/react-table"
import { useState } from "react"
import { useParams } from "react-router-dom"
import type { TreatmentHistoryItemApi } from "../../interfaces/patient-treatment-api"
import { treatmentHistoryQueryOptions } from "../../queries/patient-treatment-query"
import TreatmentAction from "./TreatmentAction"

export default function Treatment() {
  const { patientId = "" } = useParams()
  const { data = [], isLoading } = useQuery(
    treatmentHistoryQueryOptions(patientId)
  )

  const columns: ColumnDef<TreatmentHistoryItemApi>[] = [
    { id: "serviceName", header: "Dịch vụ", accessorKey: "serviceName" },
    {
      id: "sessionNumber",
      header: "Buổi",
      cell: ({ row }) => `Buổi ${row.original.sessionNumber}`,
    },
    {
      id: "treatmentContent",
      header: "Nội dung",
      accessorKey: "treatmentContent",
    },
    {
      id: "performedAt",
      header: "Thời gian",
      cell: ({ row }) => formatDatetimeVi(row.original.performedAt),
    },
    {
      id: "status",
      header: "Trạng thái",
      cell: ({ row }) =>
        row.original.status === "COMPLETED" ? "Hoàn thành" : "Đang điều trị",
    },
  ]
  const [treatment, setTreatment] = useState(false)
  return (
    <div>
      {treatment ? (
        <TreatmentAction onClose={() => setTreatment(false)} />
      ) : (
        <DataTable
          title="Danh sách điều trị"
          actions={
            <Button
              className="bg-emerald-800 text-white hover:bg-emerald-700"
              onClick={() => {
                setTreatment(true)
              }}
            >
              Điều trị
            </Button>
          }
          columns={columns}
          data={data}
          loading={isLoading}
          pageIndex={0}
          pageCount={1}
          onPageChange={() => {}}
        />
      )}
    </div>
  )
}

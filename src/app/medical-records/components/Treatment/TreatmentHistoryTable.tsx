import { DataTableEmpty } from "@/components/data-table/data-table-empty"
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatDateVi, toIsoDate } from "@/lib/date-vi"
import { isValid } from "date-fns"
import { useMemo } from "react"
import type { TreatmentHistoryItemApi } from "../../interfaces/patient-treatment-api"

interface TreatmentHistoryTableProps {
  data: TreatmentHistoryItemApi[]
  loading: boolean
  onStartTreatment: () => void
}

function getPerformedDateKey(performedAt: string): string {
  const date = new Date(performedAt)
  if (!isValid(date)) return performedAt
  return toIsoDate(date)
}

/** >0 = rowSpan cho ô ngày; -1 = ô đã gộp vào dòng trên */
function computeDateRowSpans(items: TreatmentHistoryItemApi[]): number[] {
  const spans = new Array<number>(items.length).fill(0)
  let index = 0

  while (index < items.length) {
    const dateKey = getPerformedDateKey(items[index].performedAt)
    let end = index + 1

    while (
      end < items.length &&
      getPerformedDateKey(items[end].performedAt) === dateKey
    ) {
      end++
    }

    spans[index] = end - index
    for (let skip = index + 1; skip < end; skip++) {
      spans[skip] = -1
    }
    index = end
  }

  return spans
}

export function TreatmentHistoryTable({
  data,
  loading,
  onStartTreatment,
}: TreatmentHistoryTableProps) {
  const dateRowSpans = useMemo(() => computeDateRowSpans(data), [data])

  if (loading) {
    return (
      <div className="space-y-4 rounded-md border border-gray-200 bg-white p-6">
        <DataTableSkeleton />
      </div>
    )
  }

  return (
    <div className="space-y-4 rounded-md border border-gray-200 bg-white p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">Danh sách điều trị</h2>
        <Button onClick={onStartTreatment}>Điều trị</Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[120px]">Thời gian</TableHead>
              <TableHead>Dịch vụ</TableHead>
              <TableHead className="w-[80px]">Buổi</TableHead>
              <TableHead>Nội dung</TableHead>
              <TableHead className="w-[120px]">Trạng thái</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data.length === 0 ? (
              <TableRow className="hover:bg-gray-300">
                <TableCell colSpan={5}>
                  <DataTableEmpty />
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, index) => (
                <TableRow key={row.id} className="hover:bg-mist-200">
                  {dateRowSpans[index] > 0 && (
                    <TableCell
                      rowSpan={dateRowSpans[index]}
                      className="align-top font-medium whitespace-nowrap text-slate-700"
                    >
                      {formatDateVi(row.performedAt)}
                    </TableCell>
                  )}
                  <TableCell>{row.serviceName}</TableCell>
                  <TableCell>
                    {row.sessionNumber}/{row.sessionTotal}
                  </TableCell>
                  <TableCell>{row.treatmentContent}</TableCell>
                  <TableCell>
                    {row.status === "COMPLETED"
                      ? "Hoàn thành"
                      : "Đang điều trị"}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

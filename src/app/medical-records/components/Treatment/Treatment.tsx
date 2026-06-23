import { DataTable } from "@/components/data-table/data-table"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Row } from "@tanstack/react-table"
import { EyeIcon, PencilIcon, TrashIcon } from "lucide-react"
import { useState } from "react"
import TreatmentAction from "./TreatmentAction"

export interface Treatment {
  id: string
  name: string
  description: string
  date: string
  time: string
  status: string
}

export default function Treatment() {
  const columns = [
    {
      id: "name",
      header: "Tên điều trị",
      accessorKey: "name",
    },
    {
      id: "description",
      header: "Mô tả",
      accessorKey: "description",
    },
    {
      id: "date",
      header: "Ngày",
      accessorKey: "date",
    },
    {
      id: "time",
      header: "Thời gian",
      accessorKey: "time",
    },
    {
      id: "status",
      header: "Trạng thái",
      accessorKey: "status",
    },
    {
      header: "Hành động",
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      cell: ({ row }: { row: Row<Treatment> }) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>Open</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <EyeIcon />
                Xem chi tiết
              </DropdownMenuItem>
              <DropdownMenuItem>
                <PencilIcon />
                Sửa điều trị
              </DropdownMenuItem>
              <DropdownMenuItem>
                <TrashIcon />
                Xóa điều trị
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]
  const data: Treatment[] = [
    {
      id: "1",
      name: "Điều trị 1",
      description: "Mô tả 1",
      date: "2026-01-01",
      time: "10:00",
      status: "Đang diễn ra",
    },
    {
      id: "2",
      name: "Điều trị 2",
      description: "Mô tả 2",
      date: "2026-01-02",
      time: "10:00",
      status: "Đang diễn ra",
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
          loading={false}
          pageIndex={0}
          pageCount={1}
          onPageChange={() => {}}
        />
      )}
    </div>
  )
}

import { DataTable } from "@/components/data-table/data-table"
import { Button } from "@/components/ui/button"
import { urlPaths } from "@/constants/urlPaths"
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
import { useNavigate } from "react-router-dom"
import ModalCustomer from "./MedicalRecordList/ModalCustomer"
import {
  MODAL_CUSTOMER_MODE,
  type ModalCustomerModeType,
} from "@/constants/common"

const medicalRecords = [
  {
    id: 1,
    patientName: "Nguyễn Văn A",
    visitDate: "2026-01-01",
    visitTime: "10:00",
    visitType: "Lần khám thứ 1",
    visitReason: "Cảm cúm",
  },
  {
    id: 2,
    patientName: "Nguyễn Văn B",
    visitDate: "2026-01-02",
    visitTime: "11:00",
    visitType: "Lần khám thứ 2",
    visitReason: "Cảm cúm",
  },
  {
    id: 3,
    patientName: "Nguyễn Văn C",
    visitDate: "2026-01-03",
    visitTime: "12:00",
    visitType: "Lần khám thứ 3",
    visitReason: "Cảm cúm",
  },
]

export default function MedicalRecordList() {
  const navigate = useNavigate()
  const [records, setRecords] = useState(medicalRecords)
  const [openModalCustomer, setOpenModalCustomer] = useState(false)
  const [modeModalCustomer, setModeModalCustomer] =
    useState<ModalCustomerModeType>(MODAL_CUSTOMER_MODE.ADD)

  const handleDelete = (id: number) => {
    setRecords((prev) => prev.filter((x) => x.id !== id))
  }
  const columns = [
    {
      accessorKey: "patientName",
      header: "Tên bệnh nhân",
    },
    {
      accessorKey: "visitDate",
      header: "Ngày khám",
    },
    {
      accessorKey: "visitTime",
      header: "Giờ khám",
    },
    {
      accessorKey: "visitType",
      header: "Loại khám",
    },
    {
      accessorKey: "visitReason",
      header: "Lý do khám",
    },
    {
      accessorKey: "actions",
      header: "Hành động",
      cell: ({ row }: { row: Row<(typeof medicalRecords)[0]> }) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>Open</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onClick={() =>
                  navigate(
                    `${urlPaths.medicalRecords(row.original.id.toString())}`
                  )
                }
              >
                <EyeIcon />
                Xem chi tiết
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setOpenModalCustomer(true)
                  setModeModalCustomer(MODAL_CUSTOMER_MODE.EDIT)
                }}
              >
                <PencilIcon />
                Sửa thông tin
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDelete(row.original.id)}>
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
  return (
    <div className="h-full bg-[#e1e5e1] p-4">
      <DataTable
        title="Danh sách khách hàng"
        actions={
          <Button
            className="bg-emerald-800 text-white hover:bg-emerald-900"
            onClick={() => {
              setOpenModalCustomer(true)
              setModeModalCustomer(MODAL_CUSTOMER_MODE.ADD)
            }}
          >
            Thêm mới
          </Button>
        }
        columns={columns}
        data={records}
        loading={false}
        pageIndex={0}
        pageCount={2}
        onPageChange={() => {}}
      />
      <ModalCustomer
        open={openModalCustomer}
        onOpenChange={setOpenModalCustomer}
        mode={modeModalCustomer}
      />
    </div>
  )
}

import type { ColumnDef } from "@tanstack/react-table"
import { Pencil, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { formatPrice } from "@/app/treatment-services/utils/format-price"

import type { Medicine } from "../types/medicine"

interface MedicineTableColumnsOptions {
  rowOffset: number
  onEditMedicine: (medicine: Medicine) => void
  onDeleteMedicine: (medicine: Medicine) => void
}

export function createMedicineTableColumns({
  rowOffset,
  onEditMedicine,
  onDeleteMedicine,
}: MedicineTableColumnsOptions): ColumnDef<Medicine>[] {
  return [
    {
      id: "index",
      header: "#",
      cell: ({ row }) => (
        <span className="text-slate-500">{rowOffset + row.index + 1}</span>
      ),
    },
    {
      accessorKey: "name",
      header: "Tên thuốc",
      cell: ({ row }) => (
        <span className="font-medium text-slate-800">{row.original.name}</span>
      ),
    },
    {
      accessorKey: "unit",
      header: "Đơn vị",
    },
    {
      id: "unitPrice",
      header: "Giá / đơn vị",
      cell: ({ row }) => (
        <span className="font-medium text-slate-800">
          {formatPrice(row.original.unitPrice)} đ
        </span>
      ),
    },
    {
      accessorKey: "category",
      header: "Loại thuốc",
      cell: ({ row }) => (
        <span className="text-slate-500">
          {row.original.category?.trim() || "—"}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Xử lý",
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Sửa thuốc"
            onClick={() => onEditMedicine(row.original)}
            className="text-slate-500 hover:text-slate-800"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Xóa thuốc"
            className="text-red-600 hover:text-red-700"
            onClick={() => onDeleteMedicine(row.original)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]
}

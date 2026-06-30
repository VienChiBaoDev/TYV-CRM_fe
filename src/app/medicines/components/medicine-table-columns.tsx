import type { ColumnDef } from "@tanstack/react-table"
import { Pencil } from "lucide-react"

import { Button } from "@/components/ui/button"
import { formatPrice } from "@/app/treatment-services/utils/format-price"

import type { Medicine } from "../types/medicine"

interface MedicineTableColumnsOptions {
  onEditMedicine: (medicine: Medicine) => void
}

export function createMedicineTableColumns({
  onEditMedicine,
}: MedicineTableColumnsOptions): ColumnDef<Medicine>[] {
  return [
    {
      id: "index",
      header: "#",
      cell: ({ row }) => (
        <span className="text-slate-500">{row.index + 1}</span>
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
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() => onEditMedicine(row.original)}
          className="text-slate-500 hover:text-slate-800"
        >
          <Pencil className="h-4 w-4" />
        </Button>
      ),
    },
  ]
}

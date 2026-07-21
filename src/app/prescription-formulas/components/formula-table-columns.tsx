import type { ColumnDef } from "@tanstack/react-table"
import { Eye, Pencil, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { formatDatetimeVi } from "@/lib/date-vi"
import type { PrescriptionFormula } from "../types/prescription-formula"

interface FormulaTableColumnsOptions {
  rowOffset: number
  onView: (formula: PrescriptionFormula) => void
  onEdit: (formula: PrescriptionFormula) => void
  onDelete: (formula: PrescriptionFormula) => void
}

export function createFormulaTableColumns({
  rowOffset,
  onView,
  onEdit,
  onDelete,
}: FormulaTableColumnsOptions): ColumnDef<PrescriptionFormula>[] {
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
      header: "Tên công thức",
      cell: ({ row }) => (
        <span className="font-medium text-slate-800">{row.original.name}</span>
      ),
    },
    {
      id: "dosage",
      header: "Liều lượng",
      cell: ({ row }) => (
        <span className="text-slate-600">{row.original.dosage ?? "—"}</span>
      ),
    },
    {
      id: "herbCount",
      header: "Số vị",
      cell: ({ row }) => (
        <span className="font-mono text-slate-700">
          {row.original.herbs.length}
        </span>
      ),
    },
    {
      id: "updatedAt",
      header: "Cập nhật",
      cell: ({ row }) => (
        <span className="text-slate-500">
          {formatDatetimeVi(row.original.updatedAt)}
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
            aria-label="Xem chi tiết"
            onClick={() => onView(row.original)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Sửa công thức"
            onClick={() => onEdit(row.original)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Xóa công thức"
            className="text-red-600 hover:text-red-700"
            onClick={() => onDelete(row.original)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]
}

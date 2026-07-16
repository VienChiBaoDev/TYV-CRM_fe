import type { ColumnDef } from "@tanstack/react-table"
import { Eye } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import { formatPrice } from "../utils/format-price"
import {
  CATALOG_SERVICE_STATUS,
  type TreatmentService,
} from "../types/treatment-service"

const STATUS_LABELS = {
  [CATALOG_SERVICE_STATUS.ACTIVE]: "Hoạt động",
  [CATALOG_SERVICE_STATUS.INACTIVE]: "Ngừng hoạt động",
} as const

interface ServiceTableColumnsOptions {
  onViewService: (service: TreatmentService) => void
}

export function createServiceTableColumns({
  onViewService,
}: ServiceTableColumnsOptions): ColumnDef<TreatmentService>[] {
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
      header: "Dịch Vụ",
      cell: ({ row }) => (
        <div>
          <p className="font-medium text-blue-600">{row.original.code}</p>
          <p className="text-slate-800">{row.original.name}</p>
        </div>
      ),
    },
    {
      id: "price",
      header: "Đơn Giá",
      cell: ({ row }) => (
        <div className="text-right">
          <p className="text-slate-800">{formatPrice(row.original.price)}</p>
          <p className="text-slate-500">
            {formatPrice(row.original.alternatePrice)}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "unit",
      header: "Đơn Vị",
      cell: ({ row }) => (
        <span className="text-slate-700">{row.original.unit}</span>
      ),
    },
    {
      accessorKey: "status",
      header: "Tình Trạng",
      cell: ({ row }) => (
        <span
          className={cn(
            "text-sm",
            row.original.status === CATALOG_SERVICE_STATUS.ACTIVE
              ? "text-emerald-600"
              : "text-slate-400"
          )}
        >
          {STATUS_LABELS[row.original.status]}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Xử Lý",
      cell: ({ row }) => (
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() => onViewService(row.original)}
          className="text-slate-500 hover:text-slate-800"
        >
          <Eye className="h-4 w-4" />
        </Button>
      ),
    },
  ]
}

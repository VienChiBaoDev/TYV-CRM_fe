import type { ColumnDef } from "@tanstack/react-table"

import { formatDatetimeVi } from "@/lib/date-vi"

import type { ConsumableUsageApi } from "../services/consumable-api"

interface ConsumableUsageTableColumnsOptions {
  rowOffset: number
}

export function createConsumableUsageTableColumns({
  rowOffset,
}: ConsumableUsageTableColumnsOptions): ColumnDef<ConsumableUsageApi>[] {
  return [
    {
      id: "index",
      header: "#",
      cell: ({ row }) => (
        <span className="text-slate-500">{rowOffset + row.index + 1}</span>
      ),
    },
    {
      id: "performedAt",
      header: "Ngày",
      cell: ({ row }) => (
        <span className="text-slate-600">
          {formatDatetimeVi(row.original.performedAt)}
        </span>
      ),
    },
    {
      id: "patient",
      header: "Khách hàng",
      cell: ({ row }) => (
        <div>
          <div className="font-medium text-slate-700">
            {row.original.patientName}
          </div>
          <div className="text-xs text-slate-400">{row.original.patientCode}</div>
        </div>
      ),
    },
    {
      accessorKey: "serviceName",
      header: "Dịch vụ",
    },
    {
      accessorKey: "sessionNumber",
      header: "Buổi",
    },
    {
      id: "consumable",
      header: "Vật tư",
      cell: ({ row }) => row.original.consumableName,
    },
    {
      id: "quantity",
      header: "Số lượng",
      cell: ({ row }) => `${row.original.quantity} ${row.original.unit}`,
    },
    {
      id: "performedBy",
      header: "Người thực hiện",
      cell: ({ row }) => row.original.performedByName ?? "—",
    },
  ]
}

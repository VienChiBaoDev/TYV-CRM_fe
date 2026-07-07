import type { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"

import { formatPrice } from "@/app/treatment-services/utils/format-price"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { PatientService } from "@/app/medical-records/interfaces/patient-service"

interface PatientServiceTableColumnOptions {
  onDelete: (service: PatientService) => void
  onEdit: (service: PatientService) => void
}

export function PersonCell({
  name,
  initials,
}: {
  name: string
  initials: string
}) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-200 text-[10px] font-semibold text-slate-600">
        {initials}
      </div>
      <span className="text-sm text-slate-700">{name}</span>
    </div>
  )
}

function ServiceProgressBar({
  current,
  total,
}: {
  current: number
  total: number
}) {
  const percent = total > 0 ? Math.min(100, (current / total) * 100) : 0

  return (
    <div className="mt-1.5 flex items-center gap-2">
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-emerald-500 transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>
      <span className="shrink-0 text-[11px] font-medium text-slate-500">
        {current}|{total}
      </span>
    </div>
  )
}

function AmountCell({ amount }: { amount: PatientService["amount"] }) {
  const hasBreakdown = amount.listPrice != null || amount.otherDiscount != null

  if (!hasBreakdown) {
    return (
      <div className="space-y-0.5 text-sm">
        <p className="text-slate-500">Thành tiền</p>
        <p className="font-semibold text-slate-800">
          {formatPrice(amount.finalAmount)}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-1 text-sm">
      {amount.listPrice != null && (
        <div>
          <p className="text-slate-500">Giá tiền</p>
          <p className="font-medium text-slate-800">
            {formatPrice(amount.listPrice)}
          </p>
        </div>
      )}
      {amount.otherDiscount != null && (
        <div>
          <p className="text-slate-500">Giảm khác</p>
          <p className="font-medium text-slate-800">
            {formatPrice(amount.otherDiscount.amount)} (
            {amount.otherDiscount.percent}%)
          </p>
        </div>
      )}
      <div>
        <p className="text-slate-500">Thành tiền</p>
        <p className="font-semibold text-slate-800">
          {formatPrice(amount.finalAmount)}
        </p>
      </div>
    </div>
  )
}

export function PatientServiceTableColumns({
  onDelete,
  onEdit,
}: PatientServiceTableColumnOptions): ColumnDef<PatientService>[] {
  return [
    {
      id: "index",
      header: "#",
      cell: ({ row }) => (
        <span className="text-slate-500">{row.index + 1}</span>
      ),
    },
    {
      id: "select",
      header: "Chọn",
      cell: () => <Checkbox aria-label="Chọn dịch vụ" />,
    },
    {
      id: "service",
      header: "Dịch Vụ",
      cell: ({ row }) => (
        <div className="min-w-[180px]">
          <p className="text-xs font-semibold text-emerald-600">
            {row.original.serviceCode}
          </p>
          <p className="mt-0.5 text-sm font-medium text-slate-800">
            {row.original.serviceName}
          </p>
          <ServiceProgressBar
            current={row.original.progress.current}
            total={row.original.progress.total}
          />
        </div>
      ),
    },
    {
      id: "amount",
      header: "Thành Tiền",
      cell: ({ row }) => <AmountCell amount={row.original.amount} />,
    },
    {
      id: "consultant",
      header: "Tư Vấn",
      cell: ({ row }) => (
        <PersonCell
          name={row.original.consultant.name}
          initials={row.original.consultant.initials}
        />
      ),
    },
    {
      id: "note",
      header: "Nội Dung Ghi Chú",
      cell: ({ row }) => (
        <span className="text-sm text-slate-500">
          {row.original.note || "—"}
        </span>
      ),
    },
    {
      id: "finalized",
      header: "Chốt Dịch Vụ",
      cell: ({ row }) => (
        <div>
          <PersonCell
            name={row.original.finalizedBy.name}
            initials={row.original.finalizedBy.initials}
          />
          <p className="mt-1 pl-10 text-[11px] text-slate-500">
            {row.original.finalizedAt}
          </p>
        </div>
      ),
    },
    {
      id: "actions",
      header: "Xử Lý",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="text-slate-500 hover:text-slate-800"
              aria-label="Tùy chọn dịch vụ"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Xem chi tiết</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(row.original)}>
              Sửa dịch vụ
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => onDelete(row.original)}
            >
              Xóa dịch vụ
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]
}

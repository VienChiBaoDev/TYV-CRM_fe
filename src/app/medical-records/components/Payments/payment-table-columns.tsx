import type { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, Plus } from "lucide-react"

import { formatPrice } from "@/app/treatment-services/utils/format-price"
import type { PatientPayment } from "@/app/medical-records/interfaces/patient-payment"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function createPaymentTableColumns(): ColumnDef<PatientPayment>[] {
  return [
    {
      id: "index",
      header: "#",
      cell: ({ row }) => (
        <span className="text-slate-500">{row.index + 1}</span>
      ),
    },
    {
      id: "voucher",
      header: "Mã Phiếu",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-200 text-[10px] font-semibold text-slate-600">
            {row.original.processedBy.initials}
          </div>
          <div>
            <p className="text-sm font-medium text-slate-800">
              {row.original.voucherCode}
            </p>
            <p className="text-[11px] text-slate-500">
              {row.original.voucherDate}
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "paymentMethod",
      header: "Hình Thức Thanh Toán",
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5">
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-600 text-white">
            <Plus className="h-2.5 w-2.5" />
          </span>
          <span className="text-sm text-slate-700">
            {row.original.paymentMethod}
          </span>
        </div>
      ),
    },
    {
      id: "totalAmount",
      header: "Tổng Tiền",
      cell: ({ row }) => (
        <span className="text-sm font-semibold text-slate-800">
          {formatPrice(row.original.totalAmount)}
        </span>
      ),
    },
    {
      id: "details",
      header: "Chi Tiết",
      cell: ({ row }) => (
        <div className="space-y-2">
          {row.original.details.map((detail) => (
            <div key={detail.serviceCode} className="flex items-start gap-1.5">
              <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white">
                <Plus className="h-2.5 w-2.5" />
              </span>
              <div className="min-w-[200px]">
                <p className="text-sm font-semibold text-slate-800">
                  {formatPrice(detail.amount)}
                </p>
                <p className="text-xs font-semibold text-emerald-600">
                  {detail.serviceCode}
                </p>
                <p className="text-sm text-slate-700">{detail.serviceName}</p>
                <p className="text-sm font-medium text-emerald-600">
                  {formatPrice(detail.amount)}
                </p>
              </div>
            </div>
          ))}
        </div>
      ),
    },
    {
      id: "actions",
      header: "Xử Lý",
      cell: () => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="text-slate-500 hover:text-slate-800"
              aria-label="Tùy chọn thanh toán"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Xem chi tiết</DropdownMenuItem>
            <DropdownMenuItem>In phiếu</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">
              Hủy phiếu
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]
}

import type { ColumnDef } from "@tanstack/react-table"
import { Minus, MoreHorizontal, Plus } from "lucide-react"

import type { PatientPayment } from "@/app/medical-records/interfaces/patient-payment"
import {
  formatSignedPrice,
  getPatientPaymentKind,
  isRefundPayment,
} from "@/app/medical-records/utils/patient-payment-kind"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export interface PaymentTableColumnOptions {
  rowOffset?: number
  onViewDetail?: (payment: PatientPayment) => void
  onPrint?: (payment: PatientPayment) => void
}

export function createPaymentTableColumns(
  options: PaymentTableColumnOptions = {}
): ColumnDef<PatientPayment>[] {
  const { rowOffset = 0, onViewDetail, onPrint } = options

  return [
    {
      id: "index",
      header: "#",
      cell: ({ row }) => (
        <span className="text-slate-500">{rowOffset + row.index + 1}</span>
      ),
    },
    {
      id: "voucher",
      header: "Mã Phiếu",
      cell: ({ row }) => {
        const payment = row.original
        const kind = getPatientPaymentKind(payment)
        const isRefund = kind === "refund"

        return (
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-200 text-[10px] font-semibold text-slate-600">
              {payment.processedBy.initials}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-slate-800">
                  {payment.voucherCode}
                </p>
                <span
                  className={cn(
                    "rounded px-1.5 py-0.5 text-[10px] font-semibold",
                    isRefund
                      ? "bg-red-50 text-red-600"
                      : "bg-emerald-50 text-emerald-700"
                  )}
                >
                  {isRefund ? "HT" : "TT"}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                {payment.voucherDate}
              </p>
            </div>
          </div>
        )
      },
    },
    {
      id: "paymentMethod",
      header: "Hình Thức Thanh Toán",
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5">
          {
            <span
              className={cn(
                "flex h-4 w-4 items-center justify-center rounded-full text-white",
                isRefundPayment(row.original) ? "bg-red-500" : "bg-emerald-600"
              )}
            >
              {isRefundPayment(row.original) ? (
                <Minus className="h-2.5 w-2.5" />
              ) : (
                <Plus className="h-2.5 w-2.5" />
              )}
            </span>
          }
          <div className="min-w-0">
            <p className="text-sm text-slate-700">
              {row.original.paymentMethod}
            </p>
            {row.original.bankAccount?.accountNumber ? (
              <p className="font-mono text-[11px] text-slate-500">
                {row.original.bankAccount.accountNumber}
              </p>
            ) : null}
          </div>
        </div>
      ),
    },
    {
      id: "totalAmount",
      header: "Tổng Tiền",
      cell: ({ row }) => {
        const isRefund = isRefundPayment(row.original)
        return (
          <span
            className={cn(
              "text-sm font-semibold",
              isRefund ? "text-red-600" : "text-slate-800"
            )}
          >
            {formatSignedPrice(row.original.totalAmount)}
          </span>
        )
      },
    },
    {
      id: "details",
      header: "Chi Tiết",
      cell: ({ row }) => {
        const isRefund = isRefundPayment(row.original)
        return (
          <div className="space-y-2">
            {row.original.details.map((detail) => (
              <div
                key={`${detail.serviceCode}-${detail.amount}`}
                className="flex items-start gap-1.5"
              >
                <div className="min-w-[200px]">
                  <p
                    className={cn(
                      "text-sm font-semibold",
                      isRefund ? "text-red-600" : "text-slate-800"
                    )}
                  >
                    {formatSignedPrice(detail.amount)}
                  </p>
                  <p
                    className={cn(
                      "text-xs font-semibold",
                      isRefund ? "text-red-500" : "text-emerald-600"
                    )}
                  >
                    {detail.serviceCode}
                  </p>
                  <p className="text-sm text-slate-700">{detail.serviceName}</p>
                </div>
              </div>
            ))}
          </div>
        )
      },
    },
    {
      id: "actions",
      header: "Xử Lý",
      cell: ({ row }) => {
        const payment = row.original
        return (
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
              <DropdownMenuItem onClick={() => onViewDetail?.(payment)}>
                Xem chi tiết
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onPrint?.(payment)}>
                In phiếu
              </DropdownMenuItem>
              {/* <DropdownMenuItem
                className="text-destructive"
                disabled
                title="Sẽ làm ở Phase 4"
              >
                Hủy phiếu
              </DropdownMenuItem> */}
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]
}

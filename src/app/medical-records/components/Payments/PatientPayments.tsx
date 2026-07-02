import { Minus, Plus } from "lucide-react"
import { useMemo } from "react"

import {
  MOCK_PATIENT_PAYMENTS,
  MOCK_PAYMENT_SUMMARY,
} from "@/app/medical-records/data/patient-payments-mock"
import { formatPrice } from "@/app/treatment-services/utils/format-price"
import { DataTable } from "@/components/data-table/data-table"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import { createPaymentTableColumns } from "./payment-table-columns"

const PRIMARY_BTN =
  "bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-semibold"

interface SummaryCardProps {
  label: string
  value: number
  accentClassName: string
}

function SummaryCard({ label, value, accentClassName }: SummaryCardProps) {
  return (
    <div className="flex min-w-[140px] flex-1 items-stretch gap-3 rounded-md border border-gray-200 bg-white px-4 py-3">
      <div className={cn("w-1 shrink-0 rounded-full", accentClassName)} />
      <div>
        <p className="text-sm font-medium text-slate-600">{label}</p>
        <p className="text-xl font-bold text-slate-800">{formatPrice(value)}</p>
      </div>
    </div>
  )
}

interface SplitActionButtonProps {
  label: string
}

function SplitActionButton({ label }: SplitActionButtonProps) {
  return (
    <div className="flex overflow-hidden rounded-md">
      <Button
        type="button"
        size="sm"
        className={cn(PRIMARY_BTN, "rounded-none px-2")}
        aria-label={`Thêm ${label}`}
      >
        <Plus className="h-3.5 w-3.5" />
      </Button>
      <Button
        type="button"
        size="sm"
        className={cn(PRIMARY_BTN, "rounded-none px-2")}
        aria-label={`Giảm ${label}`}
      >
        <Minus className="h-3.5 w-3.5" />
      </Button>
      <Button
        type="button"
        size="sm"
        className={cn(PRIMARY_BTN, "rounded-none")}
      >
        {label}
      </Button>
    </div>
  )
}

// function DropdownActionButton({ label }: { label: string }) {
//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger asChild>
//         <Button type="button" size="sm" className={cn(PRIMARY_BTN, "gap-1")}>
//           {label}
//           <ChevronDown className="h-3.5 w-3.5" />
//         </Button>
//       </DropdownMenuTrigger>
//       <DropdownMenuContent align="end">
//         <DropdownMenuItem>Tùy chọn 1</DropdownMenuItem>
//         <DropdownMenuItem>Tùy chọn 2</DropdownMenuItem>
//       </DropdownMenuContent>
//     </DropdownMenu>
//   )
// }

export default function PatientPayments() {
  const columns = useMemo(() => createPaymentTableColumns(), [])

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-gray-200 bg-white px-4 py-3">
        <div className="flex flex-wrap gap-3">
          <SummaryCard
            label="Dịch Vụ"
            value={MOCK_PAYMENT_SUMMARY.servicesTotal}
            accentClassName="bg-emerald-500"
          />
          <SummaryCard
            label="Sản Phẩm"
            value={MOCK_PAYMENT_SUMMARY.productsTotal}
            accentClassName="bg-yellow-400"
          />
          <SummaryCard
            label="Tiền Cọc"
            value={MOCK_PAYMENT_SUMMARY.depositTotal}
            accentClassName="bg-yellow-400"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <SplitActionButton label="Tiền cọc" />
          <SplitActionButton label="Thanh toán" />
          {/* <DropdownActionButton label="In" /> */}
          {/* <DropdownActionButton label="Xem thêm" /> */}
        </div>
      </div>

      <DataTable
        columns={columns}
        data={MOCK_PATIENT_PAYMENTS}
        loading={false}
        classNameTable="!p-4 !pt-0"
      />
    </div>
  )
}

import { Minus, Plus } from "lucide-react"
import { useMemo, useState } from "react"
import { useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { toast } from "sonner"

import { MOCK_PATIENT_PAYMENTS } from "@/app/medical-records/data/patient-payments-mock"
import { useMedicalRecordContext } from "@/app/medical-records/hooks/use-medical-record-context"
import { mapPatientServicesToUnpaidItems } from "@/app/medical-records/mappers/map-patient-service-to-unpaid-item"
import { patientServicesQueryOptions } from "@/app/medical-records/queries/patient-service-query"
import type { PatientPaymentFormValues } from "@/app/medical-records/schemas/patient-payment-form"
import type { PatientRefundFormValues } from "@/app/medical-records/schemas/patient-refund-form"
import { formatPrice } from "@/app/treatment-services/utils/format-price"
import { DataTable } from "@/components/data-table/data-table"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import { AddPatientPaymentDialog } from "./AddPatientPaymentDialog"
import { RefundPatientPaymentDialog } from "./RefundPatientPaymentDialog"
import { createPaymentTableColumns } from "./payment-table-columns"
import type { PatientService } from "../../interfaces/patient-service"

const PRIMARY_BTN =
  "bg-emerald-600 text-white hover:bg-emerald-700 text-md font-semibold"

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
  onAdd?: () => void
  onSubtract?: () => void
}

function SplitActionButton({
  label,
  onAdd,
  onSubtract,
}: SplitActionButtonProps) {
  return (
    <div className="flex overflow-hidden rounded-md">
      <Button
        type="button"
        size="lg"
        className={cn(PRIMARY_BTN, "rounded-none px-2")}
        aria-label={`Thêm ${label}`}
        onClick={onAdd}
      >
        <Plus className="h-3.5 w-3.5" />
      </Button>
      <Button
        type="button"
        size="lg"
        className={cn(PRIMARY_BTN, "rounded-none px-2")}
        aria-label={`Giảm ${label}`}
        onClick={onSubtract}
      >
        <Minus className="h-3.5 w-3.5" />
      </Button>
      <Button
        type="button"
        size="lg"
        className={cn(PRIMARY_BTN, "rounded-none")}
      >
        {label}
      </Button>
    </div>
  )
}

export default function PatientPayments() {
  const { patientId = "" } = useParams()
  const { activePatient } = useMedicalRecordContext()

  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false)
  const [refundDialogOpen, setRefundDialogOpen] = useState(false)

  const { data: services = [], isLoading: isServicesLoading } = useQuery({
    ...patientServicesQueryOptions(patientId),
    enabled: Boolean(patientId) && paymentDialogOpen,
  })

  const patientName = activePatient.name || ""

  const unpaidItems = useMemo(
    () => mapPatientServicesToUnpaidItems(services, patientName),
    [services, patientName]
  )

  const summary = useMemo(() => {
    const servicesTotal = services.reduce(
      (sum: number, service: PatientService) =>
        sum + service.amount.finalAmount,
      0
    )
    const paidTotal = 0 // ponytail: chờ BE có payment

    return {
      total: servicesTotal,
      paid: paidTotal,
      remaining: servicesTotal - paidTotal,
      deposit: 0,
      products: 0,
      services: servicesTotal,
    }
  }, [services])

  const columns = useMemo(() => createPaymentTableColumns(), [])

  const handleSavePayment = (
    _values: PatientPaymentFormValues,
    selectedItems: { collectAmount: number }[]
  ) => {
    const total = selectedItems.reduce(
      (sum, entry) => sum + entry.collectAmount,
      0
    )
    toast.success(`Đã lưu phiếu thanh toán ${formatPrice(total)} đ`)
    setPaymentDialogOpen(false)
  }

  const handleSaveRefund = (
    _values: PatientRefundFormValues,
    selectedItems: { refundAmount: number }[]
  ) => {
    const total = selectedItems.reduce(
      (sum, entry) => sum + entry.refundAmount,
      0
    )
    toast.success(`Đã lưu phiếu hoàn tiền ${formatPrice(total)} đ`)
    setRefundDialogOpen(false)
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-gray-200 bg-white px-4 py-3">
        <div className="flex flex-wrap gap-3">
          <SummaryCard
            label="Tổng tiền"
            value={summary.total}
            accentClassName="bg-emerald-500"
          />
          <SummaryCard
            label="Thanh toán"
            value={summary.paid}
            accentClassName="bg-blue-400"
          />
          <SummaryCard
            label="Còn lại"
            value={summary.remaining}
            accentClassName="bg-red-400"
          />
          <SummaryCard
            label="Tiền Cọc"
            value={summary.deposit}
            accentClassName="bg-purple-400"
          />
          <SummaryCard
            label="Sản Phẩm"
            value={summary.products}
            accentClassName="bg-orange-400"
          />
          <SummaryCard
            label="Dịch Vụ"
            value={summary.services}
            accentClassName="bg-yellow-400"
          />
        </div>

        <div className="flex flex-col items-start gap-2">
          <SplitActionButton label="Tiền cọc" />
          <SplitActionButton
            label="Thanh toán"
            onAdd={() => setPaymentDialogOpen(true)}
            onSubtract={() => setRefundDialogOpen(true)}
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={MOCK_PATIENT_PAYMENTS}
        loading={false}
        classNameTable="!p-4 !pt-0"
      />

      <AddPatientPaymentDialog
        open={paymentDialogOpen}
        onOpenChange={setPaymentDialogOpen}
        unpaidItems={unpaidItems}
        isLoadingUnpaidItems={isServicesLoading}
        onSave={handleSavePayment}
      />

      <RefundPatientPaymentDialog
        open={refundDialogOpen}
        onOpenChange={setRefundDialogOpen}
        onSave={handleSaveRefund}
      />
    </div>
  )
}

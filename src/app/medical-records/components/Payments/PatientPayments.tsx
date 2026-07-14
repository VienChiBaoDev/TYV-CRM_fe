import { Minus, Plus } from "lucide-react"
import { useMemo, useState } from "react"
import { useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"

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
import { patientPaymentsQueryOptions } from "../../queries/patient-payment-query"
import {
  useCreatePatientPaymentMutation,
  useCreatePatientRefundMutation,
} from "../../hooks/use-patient-payment-mutations"
import type { UnpaidPaymentItem } from "../../interfaces/patient-unpaid-item"
import { Skeleton } from "@/components/ui/skeleton"
import { mapPatientServicesToRefundableItems } from "../../mappers/map-patient-service-to-refundable-item"
import type { RefundablePaymentItem } from "../../interfaces/refundable-payment-item"

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
        className={cn("rounded-none px-2")}
        aria-label={`Thêm ${label}`}
        onClick={onAdd}
      >
        <Plus className="h-3.5 w-3.5" />
      </Button>
      <Button
        type="button"
        size="lg"
        className={cn("rounded-none px-2")}
        aria-label={`Giảm ${label}`}
        onClick={onSubtract}
      >
        <Minus className="h-3.5 w-3.5" />
      </Button>
      <Button type="button" size="lg" className={cn("rounded-none")}>
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
  const { data: paymentsData, isLoading: isPaymentsLoading } = useQuery(
    patientPaymentsQueryOptions(patientId)
  )
  const { data: services = [], isLoading: isServicesLoading } = useQuery({
    ...patientServicesQueryOptions(patientId),
    enabled: Boolean(patientId) && paymentDialogOpen,
  })

  const { data: refundServices = [], isLoading: isRefundServicesLoading } =
    useQuery({
      ...patientServicesQueryOptions(patientId),
      enabled: Boolean(patientId) && refundDialogOpen,
    })
  const createPaymentMutation = useCreatePatientPaymentMutation(patientId)
  const createRefundMutation = useCreatePatientRefundMutation(patientId)
  const patientName = activePatient.name || ""
  const summary = paymentsData?.summary ?? {
    total: 0,
    paid: 0,
    remaining: 0,
    deposit: 0,
    products: 0,
    services: 0,
  }
  const payments = paymentsData?.payments ?? []
  const unpaidItems = useMemo(
    () => mapPatientServicesToUnpaidItems(services, patientName),
    [services, patientName]
  )

  const refundableItems = useMemo(
    () => mapPatientServicesToRefundableItems(refundServices, patientName),
    [refundServices, patientName]
  )
  const columns = useMemo(() => createPaymentTableColumns(), [])
  const handleSavePayment = (
    values: PatientPaymentFormValues,
    selectedItems: { item: UnpaidPaymentItem; collectAmount: number }[]
  ) => {
    createPaymentMutation.mutate(
      { values, selectedItems },
      { onSuccess: () => setPaymentDialogOpen(false) }
    )
  }
  const handleSaveRefund = (
    values: PatientRefundFormValues,
    selectedItems: {
      item: RefundablePaymentItem
      refundAmount: number
      lockService: boolean
    }[]
  ) => {
    createRefundMutation.mutate(
      { values, selectedItems },
      { onSuccess: () => setRefundDialogOpen(false) }
    )
  }

  return (
    <div className="space-y-3">
      {isPaymentsLoading ? (
        <div className="bg-white">
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
      ) : (
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
      )}

      <div className="rounded-md bg-white">
        <DataTable
          columns={columns}
          data={payments}
          loading={isPaymentsLoading}
          classNameTable="!p-4 !pt-0"
        />
      </div>
      <AddPatientPaymentDialog
        open={paymentDialogOpen}
        onOpenChange={setPaymentDialogOpen}
        unpaidItems={unpaidItems}
        isLoadingUnpaidItems={isServicesLoading}
        onSave={handleSavePayment}
        isSubmitting={createPaymentMutation.isPending}
      />
      <RefundPatientPaymentDialog
        open={refundDialogOpen}
        onOpenChange={setRefundDialogOpen}
        refundableItems={refundableItems}
        isLoadingRefundableItems={isRefundServicesLoading}
        onSave={handleSaveRefund}
        isSubmitting={createRefundMutation.isPending}
      />
    </div>
  )
}

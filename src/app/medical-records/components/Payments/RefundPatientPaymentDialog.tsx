import { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { useQuery } from "@tanstack/react-query"
import { zodResolver } from "@hookform/resolvers/zod"
import { ChevronDown, Printer, RotateCcw, Undo2 } from "lucide-react"

import {
  getRefundableAmount,
  type RefundablePaymentItem,
} from "@/app/medical-records/interfaces/refundable-payment-item"
import { PAYMENT_METHOD } from "@/app/medical-records/schemas/patient-payment-form"
import {
  REFUND_REASON,
  patientRefundFormDefaultValues,
  patientRefundFormSchema,
  type PatientRefundFormInput,
  type PatientRefundFormValues,
} from "@/app/medical-records/schemas/patient-refund-form"
import { formatPrice } from "@/app/treatment-services/utils/format-price"
import { FormDatetime } from "@/components/FieldCustom/FormDatetime"
import { FormInput } from "@/components/FieldCustom/FormInput"
import { FormSelect } from "@/components/FieldCustom/FormSelect"
import { FormTextarea } from "@/components/FieldCustom/FormTextarea"
import { FormDialog } from "@/components/UiCustom/FormDialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Form } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { CLINIC_BRANCHES } from "@/constants/clinic-branches"
import { toFormDatetimeValue } from "@/lib/date-vi"
import { cn } from "@/lib/utils"
import { useClinicStore } from "@/stores/clinic-store"
import {
  fetchBankAccountOptions,
  formatBankAccountLabel,
} from "@/services/bankAccountService"

const PRIMARY_BTN = "bg-emerald-600 text-white hover:bg-primary font-semibold"

const PAYMENT_METHOD_OPTIONS = [
  { value: PAYMENT_METHOD.CASH, label: "Tiền mặt" },
  { value: PAYMENT_METHOD.BANK_TRANSFER, label: "Chuyển khoản" },
]

const REFUND_REASON_OPTIONS = [
  {
    value: REFUND_REASON.CANNOT_TREAT,
    label: "Khách không thể làm dịch vụ",
  },
  { value: REFUND_REASON.CHANGE_PLAN, label: "Thay đổi phương án điều trị" },
  { value: REFUND_REASON.OVERPAID, label: "Thu thừa / thanh toán dư" },
  { value: REFUND_REASON.OTHER, label: "Lý do khác" },
]

const BRANCH_OPTIONS = CLINIC_BRANCHES.map((branch) => ({
  value: branch.label,
  label: `${branch.emoji} ${branch.label}`,
}))

interface RefundPatientPaymentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  refundableItems: RefundablePaymentItem[]
  isLoadingRefundableItems?: boolean
  onSave?: (
    values: PatientRefundFormValues,
    selectedItems: {
      item: RefundablePaymentItem
      refundAmount: number
      lockService: boolean
    }[]
  ) => void
  isSubmitting?: boolean
}

interface SelectedRefundItem {
  item: RefundablePaymentItem
  refundAmount: number
  lockService: boolean
}

interface RefundableItemRowProps {
  item: RefundablePaymentItem
  refundAmount: number
  lockService: boolean
  isSelected: boolean
  onToggle: (checked: boolean) => void
  onAmountChange: (amount: number) => void
  onLockChange: (checked: boolean) => void
  onRefundAll: () => void
}

function RefundableItemRow({
  item,
  refundAmount,
  lockService,
  isSelected,
  onToggle,
  onAmountChange,
  onLockChange,
  onRefundAll,
}: RefundableItemRowProps) {
  const maxRefund = getRefundableAmount(item)

  return (
    <div
      className={cn(
        "group rounded-xl border bg-white p-4 transition-all",
        isSelected
          ? "border-emerald-300 bg-emerald-50/40 shadow-sm ring-1 ring-emerald-200"
          : "border-slate-200 hover:border-slate-300 hover:shadow-sm"
      )}
    >
      <div className="flex items-start gap-3">
        <Checkbox
          checked={isSelected}
          disabled={maxRefund === 0}
          onChange={(event) => onToggle(event.target.checked)}
          className="mt-1"
          aria-label={`Chọn ${item.name}`}
        />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className="text-sm font-semibold text-slate-800">
                {item.name}
              </p>
              <p className="mt-0.5 text-xs text-slate-500">
                {item.patientName} · {item.date}
              </p>
            </div>

            <div className="text-right">
              <p className="text-[11px] font-medium tracking-wide text-slate-400 uppercase">
                Có thể hoàn
              </p>
              <p
                className={cn(
                  "text-sm font-bold",
                  maxRefund > 0 ? "text-emerald-600" : "text-slate-400"
                )}
              >
                {formatPrice(maxRefund)}
              </p>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
            <span>
              Đã thanh toán{" "}
              <span className="font-semibold text-emerald-600">
                {formatPrice(item.paidAmount)}
              </span>
              <span> / {formatPrice(item.totalAmount)}</span>
            </span>
            <span>
              Đã điều trị{" "}
              <span className="font-semibold text-amber-600">
                {formatPrice(item.treatedAmount)}
              </span>
            </span>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min={0}
                max={maxRefund}
                disabled={maxRefund === 0}
                value={refundAmount || ""}
                placeholder="0"
                className="h-9 w-28 text-right"
                onChange={(event) =>
                  onAmountChange(
                    Math.min(
                      maxRefund,
                      Math.max(0, Number(event.target.value) || 0)
                    )
                  )
                }
              />
              <Button
                type="button"
                size="sm"
                className={cn(PRIMARY_BTN, "h-9 px-3 text-xs")}
                disabled={maxRefund === 0}
                onClick={onRefundAll}
              >
                Hoàn tiền
              </Button>
            </div>

            <label className="ml-auto flex cursor-pointer items-center gap-2 text-xs text-slate-600">
              <Checkbox
                checked={lockService}
                disabled={!isSelected}
                onChange={(event) => onLockChange(event.target.checked)}
                aria-label={`Khóa dịch vụ ${item.name} sau khi hoàn tiền`}
              />
              Khóa dịch vụ sau hoàn tiền
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}

export function RefundPatientPaymentDialog({
  open,
  onOpenChange,
  onSave,
  isSubmitting = false,
  refundableItems,
  isLoadingRefundableItems = false,
}: RefundPatientPaymentDialogProps) {
  const activeBranch = useClinicStore((state) => state.activeBranch)
  const [selections, setSelections] = useState<
    Record<string, { amount: number; lockService: boolean }>
  >({})

  const form = useForm<
    PatientRefundFormInput,
    unknown,
    PatientRefundFormValues
  >({
    resolver: zodResolver(patientRefundFormSchema),
    defaultValues: patientRefundFormDefaultValues,
  })

  const paymentMethod = form.watch("paymentMethod")
  const isBankTransfer = paymentMethod === PAYMENT_METHOD.BANK_TRANSFER

  const { data: bankAccounts = [] } = useQuery({
    queryKey: ["bank-accounts", "options"],
    queryFn: fetchBankAccountOptions,
  })

  const bankAccountOptions = useMemo(
    () =>
      bankAccounts.map((account) => ({
        value: account.id,
        label: formatBankAccountLabel(account),
      })),
    [bankAccounts]
  )

  const selectedItems = useMemo<SelectedRefundItem[]>(() => {
    return refundableItems
      .filter((item) => (selections[item.id]?.amount ?? 0) > 0)
      .map((item) => ({
        item,
        refundAmount: selections[item.id]?.amount ?? 0,
        lockService: selections[item.id]?.lockService ?? false,
      }))
  }, [selections, refundableItems])

  const totalAmount = useMemo(
    () => selectedItems.reduce((sum, entry) => sum + entry.refundAmount, 0),
    [selectedItems]
  )

  useEffect(() => {
    if (!open) {
      setSelections({})
      return
    }

    form.reset({
      ...patientRefundFormDefaultValues,
      createdAt: toFormDatetimeValue(new Date()),
      branch: activeBranch,
    })
  }, [open, form, activeBranch])

  const handleToggleItem = (item: RefundablePaymentItem, checked: boolean) => {
    const maxRefund = getRefundableAmount(item)
    setSelections((prev) => {
      const next = { ...prev }
      if (checked && maxRefund > 0) {
        next[item.id] = { amount: maxRefund, lockService: true }
      } else {
        delete next[item.id]
      }
      return next
    })
  }

  const handleAmountChange = (itemId: string, amount: number) => {
    setSelections((prev) => {
      const next = { ...prev }
      if (amount > 0) {
        next[itemId] = {
          amount,
          lockService: next[itemId]?.lockService ?? false,
        }
      } else {
        delete next[itemId]
      }
      return next
    })
  }

  const handleLockChange = (itemId: string, lockService: boolean) => {
    setSelections((prev) => {
      const entry = prev[itemId]
      if (!entry) return prev
      return { ...prev, [itemId]: { ...entry, lockService } }
    })
  }

  const handleRefundItem = (item: RefundablePaymentItem) => {
    const maxRefund = getRefundableAmount(item)
    if (maxRefund === 0) return
    setSelections((prev) => ({
      ...prev,
      [item.id]: { amount: maxRefund, lockService: true },
    }))
  }

  const handleRefundAll = () => {
    const next: Record<string, { amount: number; lockService: boolean }> = {}
    for (const item of refundableItems) {
      const maxRefund = getRefundableAmount(item)
      if (maxRefund > 0) {
        next[item.id] = { amount: maxRefund, lockService: true }
      }
    }
    setSelections(next)
  }

  const handleUndo = () => setSelections({})

  const handleSave = form.handleSubmit((values) => {
    onSave?.(values, selectedItems)
  })

  const selectedCount = selectedItems.length

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Hoàn tiền"
      contentClassName="!flex max-h-[90vh] w-[90vw] max-w-[90vw] min-h-0 flex-col gap-0 overflow-hidden p-0 sm:max-w-[96vw] [&_[data-slot=dialog-header]]:shrink-0 [&_[data-slot=dialog-header]]:border-b [&_[data-slot=dialog-header]]:px-6 [&_[data-slot=dialog-header]]:py-4 [&_[data-slot=dialog-footer]]:shrink-0"
      footerClassName="!-mx-0 !-mb-0 !m-0 flex !flex-row items-center justify-between gap-4 rounded-b-xl border-t bg-slate-50 px-6 py-3.5"
      footer={
        <>
          <p className="text-sm text-slate-500">
            Đã chọn{" "}
            <span className="font-semibold text-emerald-600">
              {selectedCount}
            </span>{" "}
            mục
            {totalAmount > 0 ? (
              <>
                {" "}
                · Tổng hoàn{" "}
                <span className="font-semibold text-slate-800">
                  {formatPrice(totalAmount)} đ
                </span>
              </>
            ) : null}
          </p>

          <div className="flex flex-wrap items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
            >
              Đóng
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={selectedCount === 0}
              onClick={handleUndo}
            >
              Cập nhật
            </Button>
            <Button
              type="button"
              size="sm"
              className={PRIMARY_BTN}
              disabled={selectedCount === 0 || isSubmitting}
              onClick={handleSave}
            >
              {isSubmitting ? "Đang xử lý..." : "Lưu"}
            </Button>
            <Button
              type="button"
              size="sm"
              className={cn(PRIMARY_BTN, "gap-1.5")}
              disabled={selectedCount === 0 || isSubmitting}
              onClick={handleSave}
            >
              <Printer className="h-4 w-4" />
              Lưu và in
            </Button>
          </div>
        </>
      }
    >
      <div className="grid min-h-0 flex-1 overflow-hidden lg:grid-cols-[1fr_420px]">
        <div className="flex min-h-0 flex-col overflow-hidden border-b lg:border-r lg:border-b-0">
          <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b bg-slate-50/80 px-5 py-3">
            <div className="flex items-center gap-2">
              <Undo2 className="h-4 w-4 text-emerald-600" />
              <div>
                <h3 className="text-sm font-semibold text-slate-800">
                  Dịch vụ & sản phẩm hoàn tiền
                </h3>
                <p className="text-xs text-slate-500">
                  Chọn mục cần hoàn khi bệnh nhân dừng điều trị
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                size="sm"
                className={cn(PRIMARY_BTN, "h-8")}
                onClick={handleRefundAll}
              >
                Hoàn hết
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 gap-1.5 text-red-600 hover:bg-red-50 hover:text-red-700"
                onClick={handleUndo}
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Hoàn tác
              </Button>
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto">
            <div className="space-y-3 p-5">
              {isLoadingRefundableItems ? (
                <p className="py-12 text-center text-sm text-slate-500">
                  Đang tải danh sách...
                </p>
              ) : refundableItems.length === 0 ? (
                <p className="py-12 text-center text-sm text-slate-500">
                  Không có khoản nào có thể hoàn tiền
                </p>
              ) : (
                refundableItems.map((item) => (
                  <RefundableItemRow
                    key={item.id}
                    item={item}
                    refundAmount={selections[item.id]?.amount ?? 0}
                    lockService={selections[item.id]?.lockService ?? false}
                    isSelected={(selections[item.id]?.amount ?? 0) > 0}
                    onToggle={(checked) => handleToggleItem(item, checked)}
                    onAmountChange={(amount) =>
                      handleAmountChange(item.id, amount)
                    }
                    onLockChange={(checked) =>
                      handleLockChange(item.id, checked)
                    }
                    onRefundAll={() => handleRefundItem(item)}
                  />
                ))
              )}
            </div>
          </div>
        </div>

        <div className="flex min-h-0 flex-col overflow-hidden bg-slate-50/50">
          <div className="flex shrink-0 items-center justify-between border-b px-5 py-3">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-slate-800">
                Chi tiết phiếu
              </h3>
              <Badge className="bg-emerald-600 hover:bg-emerald-600">
                {selectedCount}
              </Badge>
            </div>
            <ChevronDown className="h-4 w-4 text-slate-400" />
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto">
            <div className="p-5">
              <p className="mb-4 text-xs font-semibold tracking-wider text-slate-400 uppercase">
                Thông tin hoàn tiền
              </p>

              <Form {...form}>
                <div className="space-y-3">
                  <FormSelect
                    control={form.control}
                    name="branch"
                    label="Chi nhánh"
                    options={BRANCH_OPTIONS}
                  />

                  <FormSelect
                    control={form.control}
                    name="paymentMethod"
                    label="Hình thức"
                    options={PAYMENT_METHOD_OPTIONS}
                  />

                  <FormSelect
                    control={form.control}
                    name="bankAccountId"
                    label="Tài khoản nhận tiền"
                    placeholder={
                      bankAccountOptions.length === 0
                        ? "Chưa khai báo tài khoản ở mục Cài đặt"
                        : "eg. chọn tài khoản"
                    }
                    options={bankAccountOptions}
                    disabled={!isBankTransfer}
                    required={isBankTransfer}
                  />

                  <FormInput
                    control={form.control}
                    name="bankCode"
                    label="Mã giao dịch"
                    placeholder="eg. mã giao dịch"
                    disabled={!isBankTransfer}
                  />

                  <FormDatetime
                    control={form.control}
                    name="createdAt"
                    label="Ngày tạo"
                  />

                  <FormSelect
                    control={form.control}
                    name="reason"
                    label="Lý do"
                    options={REFUND_REASON_OPTIONS}
                  />

                  <div className="rounded-lg border border-slate-200 bg-white p-3">
                    <p className="text-xs font-medium text-slate-500">
                      Tổng hoàn
                    </p>
                    <p className="text-xl font-bold text-slate-800">
                      {formatPrice(totalAmount)}
                    </p>
                  </div>

                  <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-3">
                    <p className="text-xs font-medium text-emerald-700">
                      Tiền trả khách hàng
                    </p>
                    <p className="text-xl font-bold text-emerald-800">
                      {formatPrice(totalAmount)}
                    </p>
                  </div>

                  <Separator />

                  <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
                    Ghi chú
                  </p>

                  <FormTextarea
                    control={form.control}
                    name="content"
                    label="Nội dung"
                    placeholder="Ghi chú lý do hoàn tiền..."
                    rows={4}
                  />
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </FormDialog>
  )
}

import { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ChevronDown, Printer, RotateCcw, Wallet } from "lucide-react"
import type { UnpaidPaymentItem } from "@/app/medical-records/interfaces/patient-unpaid-item"
import {
  PAYMENT_METHOD,
  patientPaymentFormDefaultValues,
  patientPaymentFormSchema,
  type PatientPaymentFormInput,
  type PatientPaymentFormValues,
} from "@/app/medical-records/schemas/patient-payment-form"
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

const PRIMARY_BTN =
  "bg-emerald-600 text-white hover:bg-emerald-700 font-semibold"

const PAYMENT_METHOD_OPTIONS = [
  { value: PAYMENT_METHOD.CASH, label: "Tiền mặt" },
  { value: PAYMENT_METHOD.BANK_TRANSFER, label: "Chuyển khoản" },
]

const BANK_DETAIL_OPTIONS = [
  { value: "mb", label: "MB Bank - Đặng Hữu Phúc" },
  { value: "vcb", label: "Vietcombank" },
  { value: "tcb", label: "Techcombank" },
  { value: "acb", label: "ACB" },
]

const BRANCH_OPTIONS = CLINIC_BRANCHES.map((branch) => ({
  value: branch.label,
  label: `${branch.emoji} ${branch.label}`,
}))

interface AddPatientPaymentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  unpaidItems: UnpaidPaymentItem[]
  isLoadingUnpaidItems?: boolean
  onSave?: (
    values: PatientPaymentFormValues,
    selectedItems: SelectedItem[]
  ) => void
  isSubmitting?: boolean
}

interface SelectedItem {
  item: UnpaidPaymentItem
  collectAmount: number
}

interface UnpaidItemRowProps {
  item: UnpaidPaymentItem
  collectAmount: number
  isSelected: boolean
  onToggle: (checked: boolean) => void
  onAmountChange: (amount: number) => void
  onCollect: () => void
}

function UnpaidItemRow({
  item,
  collectAmount,
  isSelected,
  onToggle,
  onAmountChange,
  onCollect,
}: UnpaidItemRowProps) {
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
                Chưa thanh toán
              </p>
              <p className="text-sm font-bold text-amber-600">
                {formatPrice(item.unpaidAmount)}
              </p>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min={0}
                max={item.unpaidAmount}
                value={collectAmount || ""}
                placeholder="0"
                className="h-9 w-28 text-right"
                onChange={(event) =>
                  onAmountChange(
                    Math.min(
                      item.unpaidAmount,
                      Math.max(0, Number(event.target.value) || 0)
                    )
                  )
                }
              />
              <Button
                type="button"
                size="sm"
                className={cn(PRIMARY_BTN, "h-9 px-3 text-xs")}
                onClick={onCollect}
              >
                Thu tiền
              </Button>
            </div>

            <div className="ml-auto text-right text-xs text-slate-500">
              <span>Đã thanh toán </span>
              <span className="font-semibold text-emerald-600">
                {formatPrice(item.paidAmount)}
              </span>
              <span> / {formatPrice(item.totalAmount)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function AddPatientPaymentDialog({
  open,
  onOpenChange,
  unpaidItems,
  isLoadingUnpaidItems = false,
  onSave,
  isSubmitting = false,
}: AddPatientPaymentDialogProps) {
  const activeBranch = useClinicStore((state) => state.activeBranch)
  const [selections, setSelections] = useState<Record<string, number>>({})

  const form = useForm<
    PatientPaymentFormInput,
    unknown,
    PatientPaymentFormValues
  >({
    resolver: zodResolver(patientPaymentFormSchema),
    defaultValues: patientPaymentFormDefaultValues,
  })

  const paymentMethod = form.watch("paymentMethod")

  const selectedItems = useMemo<SelectedItem[]>(() => {
    return unpaidItems
      .filter((item) => (selections[item.id] ?? 0) > 0)
      .map((item) => ({
        item,
        collectAmount: selections[item.id] ?? 0,
      }))
  }, [selections, unpaidItems])

  const totalAmount = useMemo(
    () => selectedItems.reduce((sum, entry) => sum + entry.collectAmount, 0),
    [selectedItems]
  )

  useEffect(() => {
    if (!open) {
      setSelections({})
      return
    }

    form.reset({
      ...patientPaymentFormDefaultValues,
      createdAt: toFormDatetimeValue(new Date()),
      branch: activeBranch,
    })
  }, [open, form, activeBranch])

  const handleToggleItem = (item: UnpaidPaymentItem, checked: boolean) => {
    setSelections((prev) => {
      const next = { ...prev }
      if (checked) {
        next[item.id] = item.unpaidAmount
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
        next[itemId] = amount
      } else {
        delete next[itemId]
      }
      return next
    })
  }

  const handleCollectItem = (item: UnpaidPaymentItem) => {
    setSelections((prev) => ({
      ...prev,
      [item.id]: item.unpaidAmount,
    }))
  }

  const handleCollectAll = () => {
    const next: Record<string, number> = {}
    for (const item of unpaidItems) {
      next[item.id] = item.unpaidAmount
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
      title="Thu thanh toán"
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
                · Tổng{" "}
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
        {/* Left — unpaid items */}
        <div className="flex min-h-0 flex-col overflow-hidden border-b lg:border-r lg:border-b-0">
          <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b bg-slate-50/80 px-5 py-3">
            <div className="flex items-center gap-2">
              <Wallet className="h-4 w-4 text-emerald-600" />
              <h3 className="text-sm font-semibold text-slate-800">
                Danh sách chờ thanh toán
              </h3>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                size="sm"
                className={cn(PRIMARY_BTN, "h-8")}
                onClick={handleCollectAll}
              >
                Thu hết
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
              {isLoadingUnpaidItems ? (
                <p className="py-12 text-center text-sm text-slate-500">
                  Đang tải danh sách...
                </p>
              ) : unpaidItems.length === 0 ? (
                <p className="py-12 text-center text-sm text-slate-500">
                  Không có khoản nào chờ thanh toán
                </p>
              ) : (
                unpaidItems.map((item) => (
                  <UnpaidItemRow
                    key={item.id}
                    item={item}
                    collectAmount={selections[item.id] ?? 0}
                    isSelected={(selections[item.id] ?? 0) > 0}
                    onToggle={(checked) => handleToggleItem(item, checked)}
                    onAmountChange={(amount) =>
                      handleAmountChange(item.id, amount)
                    }
                    onCollect={() => handleCollectItem(item)}
                  />
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right — payment slip form */}
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
            <ChevronDown className="h-8 w-4 text-slate-400" />
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto">
            <div className="p-5">
              <p className="mb-4 text-xs font-semibold tracking-wider text-slate-400 uppercase">
                Thông tin thanh toán
              </p>

              <Form {...form}>
                <div className="space-y-3">
                  <FormSelect
                    control={form.control}
                    name="paymentMethod"
                    label="Hình thức"
                    options={PAYMENT_METHOD_OPTIONS}
                  />

                  <FormSelect
                    control={form.control}
                    name="paymentDetail"
                    label="Chi tiết"
                    placeholder="eg. chi tiết"
                    options={BANK_DETAIL_OPTIONS}
                    disabled={paymentMethod !== PAYMENT_METHOD.BANK_TRANSFER}
                  />

                  <FormInput
                    control={form.control}
                    name="bankCode"
                    label="Mã ngân hàng"
                    placeholder="eg. mã ngân hàng"
                    disabled={paymentMethod !== PAYMENT_METHOD.BANK_TRANSFER}
                  />

                  <FormDatetime
                    control={form.control}
                    name="createdAt"
                    label="Ngày tạo"
                  />

                  <div className="rounded-lg border border-slate-200 bg-white p-3">
                    <p className="text-xs font-medium text-slate-500">
                      Tổng tiền
                    </p>
                    <p className="text-xl font-bold text-slate-800">
                      {formatPrice(totalAmount)}
                    </p>
                  </div>

                  <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-3">
                    <p className="text-xs font-medium text-emerald-700">
                      Tiền thu khách hàng
                    </p>
                    <p className="text-xl font-bold text-emerald-800">
                      {formatPrice(totalAmount)}
                    </p>
                  </div>

                  <FormSelect
                    control={form.control}
                    name="branch"
                    label="Chi nhánh"
                    options={BRANCH_OPTIONS}
                  />

                  <Separator />

                  <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
                    Hóa đơn
                  </p>

                  <FormTextarea
                    control={form.control}
                    name="content"
                    label="Nội dung"
                    placeholder="Ghi chú nội dung thanh toán..."
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

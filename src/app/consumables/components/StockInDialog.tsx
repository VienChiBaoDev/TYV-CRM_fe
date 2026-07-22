import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { useForm } from "react-hook-form"

import { FormInput } from "@/components/FieldCustom/FormInput"
import { DialogCommon } from "@/components/UiCustom/DialogCommon"
import { Form } from "@/components/ui/form"

import {
  stockInFormDefaultValues,
  stockInFormSchema,
  type StockInFormInput,
  type StockInFormValues,
} from "../schemas/consumable-form"
import type { ConsumableApi } from "../services/consumable-api"

interface StockInDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  consumable: ConsumableApi | null
  onSave: (values: StockInFormValues) => Promise<boolean>
}

const defaultValues = stockInFormDefaultValues

export function StockInDialog({
  open,
  onOpenChange,
  consumable,
  onSave,
}: StockInDialogProps) {
  const form = useForm<StockInFormInput, unknown, StockInFormValues>({
    resolver: zodResolver(stockInFormSchema),
    defaultValues,
  })

  useEffect(() => {
    if (open) form.reset(defaultValues)
  }, [open, form])

  const handleSave = form.handleSubmit(async (values) => {
    const isSaved = await onSave(values)
    if (isSaved) onOpenChange(false)
  })

  return (
    <DialogCommon
      open={open}
      onOpenChange={onOpenChange}
      title={`Nhập kho — ${consumable?.name ?? ""}`}
      description={
        consumable
          ? `Tồn hiện tại: ${consumable.stockQuantity} ${consumable.unit}`
          : undefined
      }
      onSubmit={handleSave}
      loading={form.formState.isSubmitting}
      submitText="Nhập kho"
      contentClassName="sm:max-w-md"
    >
      <Form {...form}>
        <div className="space-y-4">
          <FormInput
            control={form.control}
            name="quantity"
            label="Số lượng nhập"
            type="number"
          />
          <FormInput
            control={form.control}
            name="note"
            label="Ghi chú"
            placeholder="Tuỳ chọn"
          />
        </div>
      </Form>
    </DialogCommon>
  )
}

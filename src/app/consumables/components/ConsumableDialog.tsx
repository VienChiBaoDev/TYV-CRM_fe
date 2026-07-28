import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { useForm, useWatch } from "react-hook-form"

import { FormInput } from "@/components/FieldCustom/FormInput"
import { DialogCommon } from "@/components/UiCustom/DialogCommon"
import { Form } from "@/components/ui/form"
import { MODAL_MODE, type ModalModeType } from "@/constants/common"

import {
  consumableFormDefaultValues,
  consumableFormSchema,
  type ConsumableFormInput,
  type ConsumableFormValues,
} from "../schemas/consumable-form"
import type { ConsumableApi } from "../services/consumable-api"

interface ConsumableDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: ModalModeType
  consumable: ConsumableApi | null
  onSave: (values: ConsumableFormValues) => Promise<boolean>
}

function mapConsumableToFormValues(
  consumable: ConsumableApi
): ConsumableFormValues {
  return {
    name: consumable.name,
    unit: consumable.unit,
    note: consumable.note ?? "",
    sessionQuotaText: consumable.sessionQuotaText ?? "",
    isActive: consumable.isActive,
  }
}

export function ConsumableDialog({
  open,
  onOpenChange,
  mode,
  consumable,
  onSave,
}: ConsumableDialogProps) {
  const form = useForm<ConsumableFormInput, unknown, ConsumableFormValues>({
    resolver: zodResolver(consumableFormSchema),
    defaultValues: consumableFormDefaultValues,
  })

  const isActive = useWatch({ control: form.control, name: "isActive" })

  useEffect(() => {
    if (!open) return

    if (mode === MODAL_MODE.EDIT && consumable) {
      form.reset(mapConsumableToFormValues(consumable))
      return
    }

    form.reset(consumableFormDefaultValues)
  }, [open, mode, consumable, form])

  const title =
    mode === MODAL_MODE.ADD ? "Thêm vật tư mới" : "Sửa thông tin vật tư"

  const handleSave = form.handleSubmit(async (values) => {
    const isSaved = await onSave(values)
    if (isSaved) onOpenChange(false)
  })

  return (
    <DialogCommon
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      onSubmit={handleSave}
      loading={form.formState.isSubmitting}
      submitText={mode === MODAL_MODE.ADD ? "Thêm mới" : "Lưu"}
      contentClassName="max-h-[90vh] overflow-y-auto sm:max-w-[640px]"
    >
      <Form {...form}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormInput
            control={form.control}
            name="name"
            label="Tên vật tư"
            placeholder="VD: Găng tay"
          />
          <FormInput
            control={form.control}
            name="unit"
            label="Đơn vị"
            placeholder="VD: đôi, cái, hộp"
          />
          <div className="sm:col-span-2">
            <FormInput
              control={form.control}
              name="sessionQuotaText"
              label="Định mức 1 buổi"
              placeholder="VD: 1 đôi/buổi"
            />
          </div>
          <div className="sm:col-span-2">
            <FormInput
              control={form.control}
              name="note"
              label="Ghi chú"
              placeholder="Ghi chú thêm (tuỳ chọn)"
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-700 sm:col-span-2">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(event) =>
                form.setValue("isActive", event.target.checked)
              }
              className="h-4 w-4 accent-emerald-600"
            />
            Đang sử dụng
          </label>
        </div>
      </Form>
    </DialogCommon>
  )
}

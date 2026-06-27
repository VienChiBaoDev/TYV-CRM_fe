import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { DialogCommon } from "@/components/UiCustom/DialogCommon"
import { FormInput } from "@/components/FieldCustom/FormInput"
import { FormSelect } from "@/components/FieldCustom/FormSelect"
import { Form } from "@/components/ui/form"

import { MODAL_MODE, type ModalModeType } from "@/constants/common"
import {
  serviceGroupFormDefaultValues,
  serviceGroupFormSchema,
  type ServiceGroupFormValues,
} from "../schemas/service-group-form"
import { SERVICE_ITEM_TYPE, type ServiceGroup } from "../types/treatment-service"

const ITEM_TYPE_OPTIONS = [
  { value: SERVICE_ITEM_TYPE.SERVICE, label: "Dịch vụ" },
  { value: SERVICE_ITEM_TYPE.PRODUCT, label: "Sản phẩm" },
] as const

interface ServiceGroupDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: ModalModeType
  group: ServiceGroup | null
  onSave: (values: ServiceGroupFormValues) => Promise<boolean>
}

function mapGroupToFormValues(group: ServiceGroup): ServiceGroupFormValues {
  return {
    code: group.code,
    name: group.name,
    itemType: group.itemType,
  }
}

export function ServiceGroupDialog({
  open,
  onOpenChange,
  mode,
  group,
  onSave,
}: ServiceGroupDialogProps) {
  const form = useForm<ServiceGroupFormValues>({
    resolver: zodResolver(serviceGroupFormSchema),
    defaultValues: serviceGroupFormDefaultValues,
  })

  useEffect(() => {
    if (!open) return

    if (mode === MODAL_MODE.EDIT && group) {
      form.reset(mapGroupToFormValues(group))
      return
    }

    form.reset(serviceGroupFormDefaultValues)
  }, [open, mode, group, form])

  const title =
    mode === MODAL_MODE.ADD
      ? "Thêm nhóm dịch vụ"
      : "Sửa nhóm dịch vụ"

  const description =
    mode === MODAL_MODE.ADD
      ? "Tạo nhóm mới để phân loại dịch vụ hoặc sản phẩm."
      : "Cập nhật thông tin nhóm dịch vụ đã chọn."

  const handleSave = form.handleSubmit(async (values) => {
    const isSaved = await onSave(values)
    if (isSaved) {
      onOpenChange(false)
    }
  })

  return (
    <DialogCommon
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
      onSubmit={handleSave}
      loading={form.formState.isSubmitting}
      submitText={mode === MODAL_MODE.ADD ? "Thêm mới" : "Lưu"}
    >
      <Form {...form}>
        <div className="flex flex-col gap-4">
          <FormInput
            control={form.control}
            name="code"
            label="Mã nhóm"
            placeholder="VD: 01"
            required
          />

          <FormInput
            control={form.control}
            name="name"
            label="Tên nhóm"
            placeholder="VD: DV KHÁM THƯỢNG Y VIÊN"
            required
          />

          <FormSelect
            control={form.control}
            name="itemType"
            label="Loại"
            placeholder="Chọn loại"
            options={ITEM_TYPE_OPTIONS}
            required
          />
        </div>
      </Form>
    </DialogCommon>
  )
}

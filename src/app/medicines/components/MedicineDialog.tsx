import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { useForm } from "react-hook-form"

import { ServicePriceField } from "@/app/treatment-services/components/ServicePriceField"
import { FormInput } from "@/components/FieldCustom/FormInput"
import { FormSelect } from "@/components/FieldCustom/FormSelect"
import { DialogCommon } from "@/components/UiCustom/DialogCommon"
import { Form } from "@/components/ui/form"
import { MODAL_MODE, type ModalModeType } from "@/constants/common"

import { MEDICINE_UNIT_FORM_OPTIONS } from "../data/medicine-units"
import {
  medicineFormSchema,
  type MedicineFormInput,
  type MedicineFormValues,
} from "../schemas/medicine-form"
import { type Medicine } from "../types/medicine"
import {
  buildDefaultMedicineFormValues,
  mapMedicineToFormValues,
} from "../utils/medicine-form"

interface MedicineDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: ModalModeType
  medicine: Medicine | null
  onSave: (values: MedicineFormValues) => Promise<boolean>
}

export function MedicineDialog({
  open,
  onOpenChange,
  mode,
  medicine,
  onSave,
}: MedicineDialogProps) {
  const form = useForm<MedicineFormInput, unknown, MedicineFormValues>({
    resolver: zodResolver(medicineFormSchema),
    defaultValues: buildDefaultMedicineFormValues(),
  })

  useEffect(() => {
    if (!open) return

    if (mode === MODAL_MODE.EDIT && medicine) {
      form.reset(mapMedicineToFormValues(medicine))
      return
    }

    form.reset(buildDefaultMedicineFormValues())
  }, [open, mode, medicine, form])

  const title =
    mode === MODAL_MODE.ADD ? "Thêm thuốc mới" : "Sửa thông tin thuốc"

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
            label="Tên thuốc"
            placeholder="VD: Sài hồ"
            className="sm:col-span-2"
            required
          />

          <FormSelect
            control={form.control}
            name="unit"
            label="Đơn vị"
            placeholder="Chọn đơn vị"
            options={MEDICINE_UNIT_FORM_OPTIONS}
            required
          />

          <ServicePriceField
            control={form.control}
            name="unitPrice"
            label="Giá 1 đơn vị"
            required
          />

          <FormInput
            control={form.control}
            name="category"
            label="Loại thuốc"
            placeholder="VD: Thảo dược (có thể để trống)"
            className="sm:col-span-2"
          />
        </div>
      </Form>
    </DialogCommon>
  )
}

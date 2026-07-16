import { useEffect } from "react"
import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { DialogCommon } from "@/components/UiCustom/DialogCommon"
import { FormInput } from "@/components/FieldCustom/FormInput"
import { FormSelect } from "@/components/FieldCustom/FormSelect"
import { Form } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MODAL_MODE, type ModalModeType } from "@/constants/common"

import { SERVICE_UNIT_FORM_OPTIONS } from "../data/mock-data"
import {
  treatmentServiceFormSchema,
  type TreatmentServiceFormInput,
  type TreatmentServiceFormValues,
} from "../schemas/treatment-service-form"
import {
  CATALOG_SERVICE_STATUS,
  SERVICE_ITEM_TYPE,
  type ServiceGroup,
  type TreatmentService,
} from "../types/treatment-service"
import {
  buildDefaultFormValues,
  generateServiceCode,
  mapServiceToFormValues,
} from "../utils/treatment-service-form"
import { ServicePriceField } from "./ServicePriceField"

const ITEM_TYPE_OPTIONS = [
  { value: SERVICE_ITEM_TYPE.SERVICE, label: "Dịch vụ" },
  { value: SERVICE_ITEM_TYPE.PRODUCT, label: "Sản phẩm" },
] as const

const STATUS_OPTIONS = [
  { value: CATALOG_SERVICE_STATUS.ACTIVE, label: "Đang sử dụng" },
  { value: CATALOG_SERVICE_STATUS.INACTIVE, label: "Ngừng hoạt động" },
] as const

interface TreatmentServiceDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: ModalModeType
  service: TreatmentService | null
  services: TreatmentService[]
  serviceGroups: ServiceGroup[]
  defaultGroupId: string | null
  onSave: (values: TreatmentServiceFormValues) => Promise<boolean>
}

export function TreatmentServiceDialog({
  open,
  onOpenChange,
  mode,
  service,
  services,
  serviceGroups,
  defaultGroupId,
  onSave,
}: TreatmentServiceDialogProps) {
  const form = useForm<
    TreatmentServiceFormInput,
    unknown,
    TreatmentServiceFormValues
  >({
    resolver: zodResolver(treatmentServiceFormSchema),
    defaultValues: buildDefaultFormValues(services, defaultGroupId),
  })

  const itemType = useWatch({ control: form.control, name: "itemType" })
  const serviceCode = useWatch({ control: form.control, name: "code" })
  const groupOptions = serviceGroups.map((group) => ({
    value: group.id,
    label: group.name,
  }))

  useEffect(() => {
    if (!open) return

    if (mode === MODAL_MODE.EDIT && service) {
      form.reset(mapServiceToFormValues(service))
      return
    }

    form.reset(buildDefaultFormValues(services, defaultGroupId))
  }, [open, mode, service, services, defaultGroupId, form])

  useEffect(() => {
    if (!open || mode === MODAL_MODE.EDIT) return

    form.setValue(
      "code",
      generateServiceCode(services, itemType ?? SERVICE_ITEM_TYPE.SERVICE),
      {
        shouldDirty: false,
      }
    )
  }, [open, mode, itemType, services, form])

  const title =
    mode === MODAL_MODE.ADD
      ? "Thêm dịch vụ / sản phẩm"
      : "Sửa dịch vụ / sản phẩm"

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
      contentClassName="max-h-[90vh] overflow-y-auto sm:max-w-[960px]"
    >
      <Form {...form}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <div className="space-y-2 sm:col-span-1">
            <Label>Mã dịch vụ/sản phẩm</Label>
            <Input
              value={serviceCode ?? ""}
              // disabled
              // className="bg-muted text-muted-foreground"
            />
          </div>

          <FormInput
            control={form.control}
            name="name"
            label="Tên"
            placeholder="VD: Khám TS Phúc"
            className="sm:col-span-3"
            required
          />

          <FormSelect
            control={form.control}
            name="itemType"
            label="Dịch vụ/sản phẩm"
            options={ITEM_TYPE_OPTIONS}
            required
          />

          <FormSelect
            control={form.control}
            name="unit"
            label="Đơn vị"
            placeholder="Chọn đơn vị"
            options={SERVICE_UNIT_FORM_OPTIONS}
            required
          />

          <FormSelect
            control={form.control}
            name="groupId"
            label="Loại"
            placeholder="Chọn nhóm"
            options={groupOptions}
            required
            className="sm:col-span-2"
          />

          {mode === MODAL_MODE.EDIT ? (
            <FormSelect
              control={form.control}
              name="status"
              label="Tình trạng"
              placeholder="Chọn tình trạng"
              options={STATUS_OPTIONS}
              required
              className="sm:col-span-2"
            />
          ) : null}

          <ServicePriceField
            control={form.control}
            name="minPrice"
            label="Giá nhỏ nhất"
            required
          />

          <ServicePriceField
            control={form.control}
            name="maxPrice"
            label="Giá lớn nhất"
            required
          />

          <ServicePriceField
            control={form.control}
            name="minPriceVat"
            label="Giá nhỏ nhất - VAT"
            showInfo
            required
          />

          <ServicePriceField
            control={form.control}
            name="maxPriceVat"
            label="Giá lớn nhất - VAT"
            showInfo
            required
          />

          <FormInput
            control={form.control}
            name="expiryDays"
            label="Hạn sử dụng (Ngày)"
            type="number"
          />

          <FormInput
            control={form.control}
            name="note"
            label="Ghi chú"
            placeholder="eg. ghi chú"
            className="sm:col-span-2"
          />
        </div>
      </Form>
    </DialogCommon>
  )
}

import { useEffect, useMemo, useRef } from "react"
import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQuery } from "@tanstack/react-query"

import { FormDate } from "@/components/FieldCustom/FormDate"
import { FormInput } from "@/components/FieldCustom/FormInput"
import { FormSelect } from "@/components/FieldCustom/FormSelect"
import { FormTextarea } from "@/components/FieldCustom/FormTextarea"
import { DialogCommon } from "@/components/UiCustom/DialogCommon"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { ServicePriceField } from "@/app/treatment-services/components/ServicePriceField"
import { fetchStaffList } from "@/services/staffService"
import { formatPrice } from "@/app/treatment-services/utils/format-price"
import {
  mapCatalogServiceFromApi,
  mapServiceGroupFromApi,
} from "@/app/treatment-services/mappers/map-service-catalog"
import {
  catalogServicesQueryOptions,
  serviceGroupQueryOptions,
} from "@/app/treatment-services/queries/treatment-service-query"
import type {
  CatalogServiceApi,
  ServiceGroupApi,
} from "@/app/treatment-services/interfaces/treatment-services.interfaces"
import {
  CATALOG_SERVICE_STATUS,
  SERVICE_ITEM_TYPE,
  type ServiceGroup,
  type TreatmentService,
} from "@/app/treatment-services/types/treatment-service"
import type { Staff } from "@/interfaces/auth"
import {
  PATIENT_SERVICE_MODE,
  patientServiceFormDefaultValues,
  patientServiceFormSchema,
  type PatientServiceFormInput,
  type PatientServiceFormValues,
} from "@/app/medical-records/schemas/patient-service-form"
import {
  applyCatalogPricing,
  calculatePatientServiceTotal,
  formatExpiryDateFromDays,
  recalculateFromVatPercent,
} from "@/app/medical-records/utils/patient-service-pricing"
import { ServiceCatalogCombobox } from "./ServiceCatalogCombobox"

interface AddPatientServiceDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (values: PatientServiceFormValues, service: TreatmentService) => void
}

export function AddPatientServiceDialog({
  open,
  onOpenChange,
  onSave,
}: AddPatientServiceDialogProps) {
  const form = useForm<
    PatientServiceFormInput,
    unknown,
    PatientServiceFormValues
  >({
    resolver: zodResolver(patientServiceFormSchema),
    defaultValues: patientServiceFormDefaultValues,
  })

  const serviceMode = useWatch({ control: form.control, name: "serviceMode" })
  const groupId = useWatch({ control: form.control, name: "groupId" })
  const serviceId = useWatch({ control: form.control, name: "serviceId" })
  const unitPrice = useWatch({ control: form.control, name: "unitPrice" }) ?? 0
  const vatPercent =
    useWatch({ control: form.control, name: "vatPercent" }) ?? 0
  const quantity = useWatch({ control: form.control, name: "quantity" }) ?? 1
  const discount = useWatch({ control: form.control, name: "discount" }) ?? 0
  const unitPriceAfterVat =
    useWatch({ control: form.control, name: "unitPriceAfterVat" }) ?? 0
  const vatAmount = useWatch({ control: form.control, name: "vatAmount" }) ?? 0
  const previousGroupIdRef = useRef<string | null>(null)

  const { data: groupsApi = [] as ServiceGroupApi[] } = useQuery({
    ...serviceGroupQueryOptions(),
    enabled: open,
  })

  const {
    data: servicesApi = [] as CatalogServiceApi[],
    isLoading: isServicesLoading,
  } = useQuery({
    ...catalogServicesQueryOptions({
      groupId: groupId || undefined,
      status: CATALOG_SERVICE_STATUS.ACTIVE,
      itemType:
        serviceMode === PATIENT_SERVICE_MODE.COMBO
          ? undefined
          : SERVICE_ITEM_TYPE.SERVICE,
    }),
    enabled: open && !!groupId && serviceMode === PATIENT_SERVICE_MODE.SERVICE,
  })

  const { data: staffList = [] as Staff[] } = useQuery({
    queryKey: ["staff"],
    queryFn: fetchStaffList,
    enabled: open,
  })

  const serviceGroups = useMemo<ServiceGroup[]>(
    () =>
      groupsApi
        .map(mapServiceGroupFromApi)
        .filter((group: ServiceGroup) =>
          serviceMode === PATIENT_SERVICE_MODE.SERVICE
            ? group.itemType === SERVICE_ITEM_TYPE.SERVICE
            : true
        ),
    [groupsApi, serviceMode]
  )

  const services = useMemo<TreatmentService[]>(
    () => servicesApi.map(mapCatalogServiceFromApi),
    [servicesApi]
  )

  const staffOptions = useMemo(
    () =>
      staffList
        .filter((staff: Staff) => staff.isActive)
        .map((staff: Staff) => ({
          value: staff.id,
          label: staff.fullName,
        })),
    [staffList]
  )

  const groupOptions = useMemo(
    () =>
      serviceGroups.map((group) => ({
        value: group.id,
        label: group.name,
      })),
    [serviceGroups]
  )

  const totalAmount = useMemo(
    () =>
      calculatePatientServiceTotal({
        unitPriceAfterVat: Number(unitPriceAfterVat),
        quantity: Number(quantity),
        discount: Number(discount),
      }),
    [unitPriceAfterVat, quantity, discount]
  )

  useEffect(() => {
    if (!open) {
      previousGroupIdRef.current = null
      return
    }
    form.reset(patientServiceFormDefaultValues)
  }, [open, form])

  useEffect(() => {
    const {
      vatAmount: nextVatAmount,
      unitPriceAfterVat: nextUnitPriceAfterVat,
    } = recalculateFromVatPercent(Number(unitPrice), Number(vatPercent))

    form.setValue("vatAmount", nextVatAmount, { shouldDirty: true })
    form.setValue("unitPriceAfterVat", nextUnitPriceAfterVat, {
      shouldDirty: true,
    })
  }, [unitPrice, vatPercent, form])

  useEffect(() => {
    if (!open) return

    if (
      previousGroupIdRef.current !== null &&
      previousGroupIdRef.current !== groupId
    ) {
      form.setValue("serviceId", "")
      form.setValue("unitPrice", 0)
      form.setValue("vatPercent", 0)
      form.setValue("vatAmount", 0)
      form.setValue("unitPriceAfterVat", 0)
      form.setValue("treatmentCount", 0)
      form.setValue("expiryDate", "")
      form.setValue("note", "")
    }

    previousGroupIdRef.current = groupId ?? ""
  }, [groupId, open, form])

  const handleServiceSelect = (service: TreatmentService) => {
    const pricing = applyCatalogPricing(service)

    form.setValue("unitPrice", pricing.unitPrice, { shouldDirty: true })
    form.setValue("vatPercent", pricing.vatPercent, { shouldDirty: true })
    form.setValue("vatAmount", pricing.vatAmount, { shouldDirty: true })
    form.setValue("unitPriceAfterVat", pricing.unitPriceAfterVat, {
      shouldDirty: true,
    })
    form.setValue("treatmentCount", pricing.treatmentCount, {
      shouldDirty: true,
    })
    form.setValue("expiryDate", formatExpiryDateFromDays(pricing.expiryDays), {
      shouldDirty: true,
    })
    if (pricing.note) {
      form.setValue("note", pricing.note, { shouldDirty: true })
    }
  }

  const handleSave = form.handleSubmit((values) => {
    if (values.serviceMode === PATIENT_SERVICE_MODE.COMBO) return

    const service = services.find((item) => item.id === values.serviceId)
    if (!service) return

    onSave(values, service)
    onOpenChange(false)
  })

  const isServiceMode = serviceMode === PATIENT_SERVICE_MODE.SERVICE

  return (
    <DialogCommon
      open={open}
      onOpenChange={onOpenChange}
      title="Thêm mới dịch vụ"
      onSubmit={handleSave}
      loading={form.formState.isSubmitting}
      submitText="Thêm mới"
      contentClassName="max-h-[90vh] overflow-y-auto sm:max-w-[960px]"
    >
      <Form {...form}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <FormSelect
            control={form.control}
            name="consultantId"
            label="Người tư vấn"
            placeholder="người tư vấn"
            options={staffOptions}
            required
          />

          <FormSelect
            control={form.control}
            name="telesaleId"
            label="Telesale"
            placeholder="telesale"
            options={staffOptions}
          />

          <FormField
            control={form.control}
            name="serviceMode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>&nbsp;</FormLabel>
                <div className="flex rounded-lg border border-slate-200 bg-slate-50 p-1">
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className={cn(
                      "flex-1",
                      field.value === PATIENT_SERVICE_MODE.SERVICE &&
                        "bg-white shadow-sm"
                    )}
                    onClick={() => {
                      field.onChange(PATIENT_SERVICE_MODE.SERVICE)
                      form.setValue("groupId", "")
                      form.setValue("serviceId", "")
                    }}
                  >
                    Dịch vụ
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className={cn(
                      "flex-1",
                      field.value === PATIENT_SERVICE_MODE.COMBO &&
                        "bg-white shadow-sm"
                    )}
                    onClick={() => {
                      field.onChange(PATIENT_SERVICE_MODE.COMBO)
                      form.setValue("groupId", "")
                      form.setValue("serviceId", "")
                    }}
                  >
                    Combo dịch vụ
                  </Button>
                </div>
              </FormItem>
            )}
          />

          <FormSelect
            control={form.control}
            name="groupId"
            label="Nhóm dịch vụ"
            placeholder="eg. nhóm dịch vụ"
            options={groupOptions}
            disabled={!isServiceMode}
            required
          />

          <FormField
            control={form.control}
            name="serviceId"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel>
                  Dịch vụ<span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <ServiceCatalogCombobox
                    services={services}
                    value={field.value}
                    disabled={!isServiceMode || !groupId || isServicesLoading}
                    onChange={(value) => {
                      field.onChange(value)
                      if (!value) {
                        form.setValue("unitPrice", 0)
                        form.setValue("vatPercent", 0)
                        form.setValue("vatAmount", 0)
                        form.setValue("unitPriceAfterVat", 0)
                        form.setValue("treatmentCount", 0)
                        form.setValue("expiryDate", "")
                        form.setValue("note", "")
                      }
                    }}
                    onSelectService={handleServiceSelect}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {!isServiceMode ? (
            <p className="text-sm text-amber-700 sm:col-span-3">
              Combo dịch vụ đang được phát triển. Vui lòng chọn chế độ Dịch vụ.
            </p>
          ) : null}

          <ServicePriceField
            control={form.control}
            name="unitPrice"
            label="Đơn giá"
            disabled={!serviceId}
          />

          <FormField
            control={form.control}
            name="vatPercent"
            render={({ field }) => (
              <FormItem>
                <FormLabel>VAT</FormLabel>
                <div className="flex gap-2">
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      placeholder="eg. phần trăm"
                      disabled={!serviceId}
                      name={field.name}
                      ref={field.ref}
                      onBlur={field.onBlur}
                      value={Number(field.value) || 0}
                      onChange={(event) =>
                        field.onChange(Number(event.target.value) || 0)
                      }
                    />
                  </FormControl>
                  <Input
                    readOnly
                    value={formatPrice(Number(vatAmount))}
                    className="w-28 bg-muted text-muted-foreground"
                  />
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <ServicePriceField
            control={form.control}
            name="unitPriceAfterVat"
            label="Đơn giá - VAT"
            showInfo
            disabled={!serviceId}
          />

          <FormInput
            control={form.control}
            name="quantity"
            label="SL"
            type="number"
            disabled={!serviceId}
          />

          <ServicePriceField
            control={form.control}
            name="discount"
            label="C.Khấu"
            disabled={!serviceId}
          />

          <div className="rounded-lg border border-emerald-100 bg-emerald-50 px-4 py-3">
            <p className="text-xs font-medium text-emerald-700">Thành tiền</p>
            <p className="text-lg font-bold text-emerald-900">
              {formatPrice(totalAmount)} đ
            </p>
            <p className="mt-1 text-[11px] text-emerald-700">
              ({formatPrice(Number(unitPriceAfterVat))} × {Number(quantity)}) −{" "}
              {formatPrice(Number(discount))}
            </p>
          </div>

          <FormInput
            control={form.control}
            name="treatmentCount"
            label="Lần điều trị"
            type="number"
            disabled={!serviceId}
          />

          <FormDate
            control={form.control}
            name="expiryDate"
            label="Hạn sử dụng"
            placeholder="eg. hạn sử dụng"
            disabled={!serviceId}
          />

          <FormTextarea
            control={form.control}
            name="note"
            label="Ghi chú"
            placeholder="eg. ghi chú"
            rows={3}
            disabled={!serviceId}
            className="sm:col-span-3"
          />
        </div>
      </Form>
    </DialogCommon>
  )
}

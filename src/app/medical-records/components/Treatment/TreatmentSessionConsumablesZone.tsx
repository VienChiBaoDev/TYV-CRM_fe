import { ConsumableOptionCombobox } from "@/app/consumables/components/ConsumableOptionCombobox"
import type { ConsumableOptionApi } from "@/app/consumables/services/consumable-api"
import type { TreatmentSessionConsumableApi } from "@/app/medical-records/interfaces/patient-treatment-api"
import type { TreatmentFormInput } from "@/app/medical-records/schemas/treatment-form"
import { Button } from "@/components/ui/button"
import { FormField } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import type { Control, FieldPath, UseFieldArrayReturn } from "react-hook-form"
import { useWatch } from "react-hook-form"

interface TreatmentSessionConsumablesZoneProps {
  control: Control<TreatmentFormInput>
  fieldArray: UseFieldArrayReturn<TreatmentFormInput, "consumables">
  options: ConsumableOptionApi[]
  savedItems: TreatmentSessionConsumableApi[]
  hasConsumables: boolean
}

export function TreatmentSessionConsumablesZone({
  control,
  fieldArray,
  options,
  savedItems,
  hasConsumables,
}: TreatmentSessionConsumablesZoneProps) {
  const { fields, append, remove } = fieldArray
  const draftLines = useWatch({ control, name: "consumables" }) ?? []

  if (hasConsumables) {
    return (
      <div className="mt-3 space-y-2 rounded-xl border border-slate-200 p-3">
        <p className="text-sm font-semibold text-slate-700">Vật tư tiêu hao</p>
        {savedItems.map((item) => (
          <div key={item.id} className="text-sm text-slate-600">
            {item.name} — {item.quantity} {item.unit}
          </div>
        ))}
        <p className="text-xs text-slate-400">Đã ghi nhận, không thể sửa</p>
      </div>
    )
  }

  return (
    <div className="mt-3 min-w-0 space-y-3 rounded-xl border border-slate-200 p-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-semibold text-slate-700">Vật tư tiêu hao</p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="shrink-0"
          onClick={() => append({ consumableId: "", quantity: 1 })}
        >
          + Thêm vật tư
        </Button>
      </div>

      {fields.length === 0 ? (
        <p className="text-xs text-slate-400">Chưa chọn vật tư (tuỳ chọn)</p>
      ) : null}

      {fields.map((field, index) => {
        const consumableIdPath =
          `consumables.${index}.consumableId` as FieldPath<TreatmentFormInput>
        const quantityPath =
          `consumables.${index}.quantity` as FieldPath<TreatmentFormInput>
        const selected = options.find(
          (opt) => opt.id === draftLines[index]?.consumableId
        )

        return (
          <div
            key={field.id}
            className="grid min-w-0 grid-cols-1 gap-2 rounded-lg border border-slate-100 bg-slate-50/50 p-2 sm:grid-cols-[minmax(0,1fr)_5.5rem_auto] sm:items-start"
          >
            <div className="min-w-0 space-y-1">
              <FormField
                control={control}
                name={consumableIdPath}
                render={({ field: consumableField }) => (
                  <ConsumableOptionCombobox
                    options={options}
                    value={
                      typeof consumableField.value === "string"
                        ? consumableField.value
                        : ""
                    }
                    onChange={consumableField.onChange}
                  />
                )}
              />
              {selected?.sessionQuotaText ? (
                <p className="text-xs text-slate-400">
                  Định mức: {selected.sessionQuotaText}
                </p>
              ) : null}
            </div>

            <FormField
              control={control}
              name={quantityPath}
              render={({ field: quantityField }) => (
                <Input
                  type="number"
                  min={0.001}
                  step="any"
                  className="h-9 bg-white"
                  value={
                    typeof quantityField.value === "number"
                      ? quantityField.value
                      : ""
                  }
                  onChange={(event) =>
                    quantityField.onChange(Number(event.target.value))
                  }
                />
              )}
            />

            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-9 shrink-0 self-start sm:self-auto"
              onClick={() => remove(index)}
            >
              Xóa
            </Button>
          </div>
        )
      })}
    </div>
  )
}

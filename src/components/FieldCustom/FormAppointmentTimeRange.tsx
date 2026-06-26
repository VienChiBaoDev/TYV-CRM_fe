import { useController, useFormState, type Control, type FieldPath, type FieldValues } from "react-hook-form"

import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { AppointmentTimeRangeField } from "./AppointmentTimeRangeField"

interface FormAppointmentTimeRangeProps<T extends FieldValues> {
  control: Control<T>
  startName: FieldPath<T>
  endName: FieldPath<T>
  label: string
  datePlaceholder?: string
  className?: string
  labelClassName?: string
  disabled?: boolean
  required?: boolean
  defaultDurationMinutes?: number
  fromDate?: Date
  toDate?: Date
}

export function FormAppointmentTimeRange<T extends FieldValues>({
  control,
  startName,
  endName,
  label,
  datePlaceholder,
  className,
  labelClassName,
  disabled,
  required,
  defaultDurationMinutes,
  fromDate,
  toDate,
}: FormAppointmentTimeRangeProps<T>) {
  const startField = useController({ control, name: startName })
  const endField = useController({ control, name: endName })
  const { errors } = useFormState({ control })
  const endError = errors[endName]?.message as string | undefined

  return (
    <FormField
      control={control}
      name={startName}
      render={() => (
        <FormItem className={className}>
          <FormLabel className={labelClassName}>
            {label}
            {required ? <span className="text-destructive">*</span> : null}
          </FormLabel>
          <AppointmentTimeRangeField
            startValue={startField.field.value}
            endValue={endField.field.value}
            onStartChange={startField.field.onChange}
            onEndChange={endField.field.onChange}
            datePlaceholder={datePlaceholder}
            disabled={disabled}
            defaultDurationMinutes={defaultDurationMinutes}
            fromDate={fromDate}
            toDate={toDate}
          />
          <FormMessage />
          {endError ? (
            <p className="text-sm text-destructive">{endError}</p>
          ) : null}
        </FormItem>
      )}
    />
  )
}

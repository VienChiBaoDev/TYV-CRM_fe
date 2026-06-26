import type { Control, FieldPath, FieldValues } from "react-hook-form"

import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { DatetimePickerField } from "./DatetimePickerField"

interface FormDatetimeProps<T extends FieldValues> {
  control: Control<T>
  name: FieldPath<T>
  label: string
  datePlaceholder?: string
  timePlaceholder?: string
  className?: string
  labelClassName?: string
  disabled?: boolean
  required?: boolean
  fromDate?: Date
  toDate?: Date
}

export function FormDatetime<T extends FieldValues>({
  control,
  name,
  label,
  datePlaceholder = "Chọn ngày",
  timePlaceholder = "Chọn giờ",
  className,
  labelClassName,
  disabled,
  required,
  fromDate,
  toDate,
}: FormDatetimeProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel className={labelClassName}>
            {label}
            {required ? <span className="text-destructive">*</span> : null}
          </FormLabel>
          <DatetimePickerField
            value={field.value}
            onChange={field.onChange}
            datePlaceholder={datePlaceholder}
            timePlaceholder={timePlaceholder}
            disabled={disabled}
            fromDate={fromDate}
            toDate={toDate}
          />
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

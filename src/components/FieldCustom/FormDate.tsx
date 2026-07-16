import type { Control, FieldPath, FieldValues } from "react-hook-form"

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { DatePickerFieldIso } from "./DatePickerField"

interface FormDateProps<T extends FieldValues> {
  control: Control<T>
  name: FieldPath<T>
  label: string
  placeholder?: string
  className?: string
  labelClassName?: string
  disabled?: boolean
  required?: boolean
  fromDate?: Date
  toDate?: Date
}

export function FormDate<T extends FieldValues>({
  control,
  name,
  label,
  placeholder = "Chọn ngày",
  className,
  labelClassName,
  disabled,
  required,
  fromDate,
  toDate,
}: FormDateProps<T>) {
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
          <FormControl>
            <DatePickerFieldIso
              value={field.value}
              onChange={field.onChange}
              placeholder={placeholder}
              disabled={disabled}
              fromDate={fromDate}
              toDate={toDate}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

import type { Control, FieldPath, FieldValues } from "react-hook-form"

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

interface FormTextareaProps<T extends FieldValues> {
  control: Control<T>
  name: FieldPath<T>
  label?: string
  placeholder?: string
  rows?: number
  className?: string
  labelClassName?: string
  textareaClassName?: string
  disabled?: boolean
  hideLabel?: boolean
  required?: boolean
}

export function FormTextarea<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  rows = 4,
  className,
  labelClassName,
  textareaClassName,
  disabled,
  hideLabel = false,
  required,
}: FormTextareaProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          {!hideLabel && label ? (
            <FormLabel className={labelClassName}>
              {label}
              {required ? <span className="text-red-500">*</span> : null}
            </FormLabel>
          ) : null}
          <FormControl>
            <Textarea
              placeholder={placeholder}
              rows={rows}
              disabled={disabled}
              className={cn(
                "resize-none border border-slate-200",
                textareaClassName
              )}
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

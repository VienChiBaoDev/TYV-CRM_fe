import { Info } from "lucide-react"
import type { Control, FieldPath, FieldValues } from "react-hook-form"

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface ServicePriceFieldProps<T extends FieldValues> {
  control: Control<T>
  name: FieldPath<T>
  label: string
  className?: string
  showInfo?: boolean
  required?: boolean
  disabled?: boolean
}

export function ServicePriceField<T extends FieldValues>({
  control,
  name,
  label,
  className,
  showInfo = false,
  required,
  disabled,
}: ServicePriceFieldProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel className="flex items-center gap-1">
            {label}
            {required ? <span className="text-red-500">*</span> : null}
            {showInfo ? (
              <Info
                className="h-3.5 w-3.5 text-blue-500"
                aria-label="Giá đã bao gồm VAT"
              />
            ) : null}
          </FormLabel>
          <FormControl>
            <div className="relative">
              <Input
                type="number"
                min={0}
                disabled={disabled}
                className={cn("pr-12")}
                {...field}
                onChange={(event) =>
                field.onChange(Number(event.target.value) || 0)
              }
              />
              <span className="pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 text-xs text-muted-foreground">
                VND
              </span>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

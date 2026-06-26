import { useState } from "react"
import { CalendarIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import {
  formatDateVi,
  ISO_DATE_FORMAT,
  toIsoDate,
} from "@/lib/date-vi"

interface DatePickerFieldProps {
  value?: Date
  onChange: (date: Date | undefined) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  fromDate?: Date
  toDate?: Date
}

export function DatePickerField({
  value,
  onChange,
  placeholder = "Chọn ngày",
  disabled,
  className,
  fromDate,
  toDate,
}: DatePickerFieldProps) {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground",
            className,
          )}
        >
          <CalendarIcon className="mr-2 size-4" />
          {value ? formatDateVi(value) : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="z-[200] w-auto p-0"
        align="start"
        side="bottom"
      >
        <Calendar
          mode="single"
          selected={value}
          onSelect={(date) => {
            onChange(date)
            setOpen(false)
          }}
          disabled={[
            ...(fromDate ? [{ before: fromDate }] : []),
            ...(toDate ? [{ after: toDate }] : []),
          ]}
          autoFocus
        />
      </PopoverContent>
    </Popover>
  )
}

interface DatePickerFieldIsoProps {
  value?: string
  onChange: (isoDate: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  fromDate?: Date
  toDate?: Date
}

/** DatePicker nhận/trả chuỗi ISO `yyyy-MM-dd` */
export function DatePickerFieldIso({
  value,
  onChange,
  ...props
}: DatePickerFieldIsoProps) {
  const selected = value
    ? (() => {
        const [y, m, d] = value.split("-").map(Number)
        return y && m && d ? new Date(y, m - 1, d) : undefined
      })()
    : undefined

  return (
    <DatePickerField
      {...props}
      value={selected}
      onChange={(date) => onChange(date ? toIsoDate(date) : "")}
    />
  )
}

export { ISO_DATE_FORMAT }

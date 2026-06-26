import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  combineDateAndTime,
  formatDatetimeVi,
  splitFormDatetime,
  toFormDatetimeValue,
} from "@/lib/date-vi"
import { DatePickerField } from "./DatePickerField"

interface DatetimePickerFieldProps {
  value?: string
  onChange: (value: string) => void
  datePlaceholder?: string
  timePlaceholder?: string
  disabled?: boolean
  className?: string
  fromDate?: Date
  toDate?: Date
}

export function DatetimePickerField({
  value,
  onChange,
  datePlaceholder = "Chọn ngày",
  timePlaceholder = "Chọn giờ",
  disabled,
  className,
  fromDate,
  toDate,
}: DatetimePickerFieldProps) {
  const { date, timeValue } = splitFormDatetime(value ?? "")

  const handleDateChange = (nextDate: Date | undefined) => {
    if (!nextDate) {
      onChange("")
      return
    }

    const [hour, minute] = timeValue.split(":").map(Number)
    onChange(
      toFormDatetimeValue(
        combineDateAndTime(nextDate, hour || 9, minute || 0),
      ),
    )
  }

  const handleTimeChange = (nextTime: string) => {
    const baseDate = date ?? new Date()
    const [hour, minute] = nextTime.split(":").map(Number)
    onChange(
      toFormDatetimeValue(combineDateAndTime(baseDate, hour, minute)),
    )
  }

  return (
    <div className={className}>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:items-end">
        <div className="space-y-2">
          <Label className="text-sm font-medium sm:sr-only">Ngày</Label>
          <DatePickerField
            value={date}
            onChange={handleDateChange}
            placeholder={datePlaceholder}
            disabled={disabled}
            fromDate={fromDate}
            toDate={toDate}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium sm:sr-only">Giờ</Label>
          <Input
            type="time"
            step={60}
            value={timeValue}
            onChange={(event) => handleTimeChange(event.target.value)}
            disabled={disabled}
            placeholder={timePlaceholder}
            className="bg-background"
          />
        </div>
      </div>

      {value ? (
        <p className="mt-2 text-xs text-muted-foreground">
          Đã chọn: <span className="font-medium">{formatDatetimeVi(value)}</span>
        </p>
      ) : null}
    </div>
  )
}

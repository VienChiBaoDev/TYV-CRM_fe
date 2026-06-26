import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  addMinutesToFormDatetime,
  combineDateAndTime,
  formatAppointmentTimeRangeVi,
  splitFormDatetime,
  toFormDatetimeValue,
} from "@/lib/date-vi"
import { DatePickerField } from "./DatePickerField"

interface AppointmentTimeRangeFieldProps {
  startValue?: string
  endValue?: string
  onStartChange: (value: string) => void
  onEndChange: (value: string) => void
  datePlaceholder?: string
  disabled?: boolean
  className?: string
  defaultDurationMinutes?: number
  fromDate?: Date
  toDate?: Date
}

export function AppointmentTimeRangeField({
  startValue = "",
  endValue = "",
  onStartChange,
  onEndChange,
  datePlaceholder = "Chọn ngày",
  disabled,
  className,
  defaultDurationMinutes = 30,
  fromDate,
  toDate,
}: AppointmentTimeRangeFieldProps) {
  const { date: startDate, timeValue: startTime } = splitFormDatetime(startValue)
  const { timeValue: endTime } = splitFormDatetime(endValue)

  const handleDateChange = (nextDate: Date | undefined) => {
    if (!nextDate) {
      onStartChange("")
      onEndChange("")
      return
    }

    const [startHour, startMinute] = startTime.split(":").map(Number)
    const [endHour, endMinute] = endTime.split(":").map(Number)

    onStartChange(
      toFormDatetimeValue(
        combineDateAndTime(nextDate, startHour || 9, startMinute || 0),
      ),
    )
    onEndChange(
      toFormDatetimeValue(
        combineDateAndTime(nextDate, endHour || 9, endMinute || 30),
      ),
    )
  }

  const handleStartTimeChange = (nextTime: string) => {
    const baseDate = startDate ?? new Date()
    const [hour, minute] = nextTime.split(":").map(Number)
    const nextStart = toFormDatetimeValue(
      combineDateAndTime(baseDate, hour, minute),
    )
    onStartChange(nextStart)

    const currentEnd = endValue ? new Date(endValue) : null
    const nextStartDate = new Date(nextStart)
    if (!currentEnd || currentEnd <= nextStartDate) {
      onEndChange(addMinutesToFormDatetime(nextStart, defaultDurationMinutes))
    }
  }

  const handleEndTimeChange = (nextTime: string) => {
    const baseDate = startDate ?? new Date()
    const [hour, minute] = nextTime.split(":").map(Number)
    onEndChange(
      toFormDatetimeValue(combineDateAndTime(baseDate, hour, minute)),
    )
  }

  return (
    <div className={className}>
      <div className="space-y-3">
        <div className="space-y-2">
          <Label className="text-sm font-medium">Ngày</Label>
          <DatePickerField
            value={startDate}
            onChange={handleDateChange}
            placeholder={datePlaceholder}
            disabled={disabled}
            fromDate={fromDate}
            toDate={toDate}
          />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Giờ bắt đầu</Label>
            <Input
              type="time"
              step={60}
              value={startTime}
              onChange={(event) => handleStartTimeChange(event.target.value)}
              disabled={disabled}
              className="bg-background"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Giờ kết thúc</Label>
            <Input
              type="time"
              step={60}
              value={endTime}
              onChange={(event) => handleEndTimeChange(event.target.value)}
              disabled={disabled}
              className="bg-background"
            />
          </div>
        </div>
      </div>

      {startValue && endValue ? (
        <p className="mt-2 text-xs text-muted-foreground">
          Đã chọn:{" "}
          <span className="font-medium">
            {formatAppointmentTimeRangeVi(startValue, endValue)}
          </span>
        </p>
      ) : null}
    </div>
  )
}

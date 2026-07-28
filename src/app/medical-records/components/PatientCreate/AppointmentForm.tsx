import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { useStaffPickerOptions } from "@/hooks/use-staff-picker-options"
import type {
  AppointmentFormState,
  SetAppointmentField,
} from "./appointmentState"

interface AppointmentFormProps {
  form: AppointmentFormState
  setField: SetAppointmentField
}

const WEEKDAYS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"]

function pad(n: number): string {
  return String(n).padStart(2, "0")
}

function toIso(year: number, month: number, day: number): string {
  return `${year}-${pad(month + 1)}-${pad(day)}`
}

export function AppointmentForm({ form, setField }: AppointmentFormProps) {
  const { doctorOptions, assistantOptions } = useStaffPickerOptions(true)
  // Tháng đang hiển thị trên lịch, khởi tạo từ ngày đã chọn
  const initial = form.date ? new Date(form.date) : new Date()
  const [viewYear, setViewYear] = useState(initial.getFullYear())
  const [viewMonth, setViewMonth] = useState(initial.getMonth())

  const firstDay = new Date(viewYear, viewMonth, 1)
  // Lùi về thứ Hai đầu tuần (0=CN -> 6, 1=T2 -> 0)
  const leadingBlanks = (firstDay.getDay() + 6) % 7
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()

  const cells: (number | null)[] = [
    ...Array(leadingBlanks).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]
  while (cells.length % 7 !== 0) cells.push(null)

  const goPrev = () => {
    if (viewMonth === 0) {
      setViewMonth(11)
      setViewYear((y) => y - 1)
    } else {
      setViewMonth((m) => m - 1)
    }
  }
  const goNext = () => {
    if (viewMonth === 11) {
      setViewMonth(0)
      setViewYear((y) => y + 1)
    } else {
      setViewMonth((m) => m + 1)
    }
  }

  const clampTime = (value: string, max: number): string => {
    const digits = value.replace(/\D/g, "").slice(0, 2)
    if (digits === "") return ""
    const num = Math.min(Number(digits), max)
    return pad(num)
  }

  return (
    <div className="mt-4 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-slate-800">Lịch hẹn</h3>
        <p className="text-xs text-slate-500">Thông tin lịch hẹn</p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Cột lịch */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-700">
                Tháng {viewMonth + 1}
              </span>
              <span className="text-sm font-semibold text-slate-700">
                {viewYear}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={goPrev}
                className="rounded p-1 text-slate-600 hover:bg-gray-100"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={goNext}
                className="rounded p-1 text-slate-600 hover:bg-gray-100"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="mb-1 grid grid-cols-7 gap-1 text-center text-xs font-semibold text-slate-500">
            {WEEKDAYS.map((d) => (
              <div key={d} className="py-1">
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-sm">
            {cells.map((day, idx) => {
              if (day === null) return <div key={idx} />
              const iso = toIso(viewYear, viewMonth, day)
              const isSelected = iso === form.date
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setField("date", iso)}
                  className={cn(
                    "mx-auto h-9 w-9 rounded-full transition-colors",
                    isSelected
                      ? "bg-emerald-600 font-semibold text-white"
                      : "text-slate-700 hover:bg-emerald-50"
                  )}
                >
                  {day}
                </button>
              )
            })}
          </div>

          {/* Giờ : phút */}
          <div className="mt-4 flex items-center justify-center gap-3 border-t border-gray-100 pt-4">
            <Input
              className="w-16 text-center text-lg font-semibold"
              value={form.hour}
              onChange={(e) => setField("hour", clampTime(e.target.value, 23))}
              placeholder="HH"
            />
            <span className="text-lg font-semibold text-slate-400">:</span>
            <Input
              className="w-16 text-center text-lg font-semibold"
              value={form.minute}
              onChange={(e) =>
                setField("minute", clampTime(e.target.value, 59))
              }
              placeholder="MM"
            />
          </div>
        </div>

        {/* Cột thông tin */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-gray-700">
                Bác sĩ <span className="text-red-500">*</span>
              </Label>
              <Select
                value={form.doctorId || undefined}
                onValueChange={(value) => setField("doctorId", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Chọn bác sĩ" />
                </SelectTrigger>
                <SelectContent>
                  {doctorOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-gray-700">
                Trợ lý
              </Label>
              <Select
                value={form.assistantId || undefined}
                onValueChange={(value) => setField("assistantId", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Chọn trợ lý (tuỳ chọn)" />
                </SelectTrigger>
                <SelectContent>
                  {assistantOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-gray-700">Tư vấn</Label>
            <Input
              placeholder="tư vấn"
              value={form.consultant}
              onChange={(e) => setField("consultant", e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-gray-700">
              Dịch vụ quan tâm
            </Label>
            <Input
              placeholder="dịch vụ quan tâm"
              value={form.service}
              onChange={(e) => setField("service", e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-gray-700">
              Nội dung
            </Label>
            <Textarea
              placeholder="eg. nội dung"
              className="min-h-[90px] resize-none"
              value={form.note}
              onChange={(e) => setField("note", e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

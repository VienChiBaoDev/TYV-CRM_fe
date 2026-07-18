import { getDoctorColor } from "../utils/doctor-colors"

interface DoctorColorLegendItem {
  name: string
  count: number
}

interface DoctorColorLegendProps {
  doctors: DoctorColorLegendItem[]
}

export function DoctorColorLegend({ doctors }: DoctorColorLegendProps) {
  if (doctors.length === 0) return null

  return (
    <div className="flex shrink-0 flex-wrap items-center gap-x-4 gap-y-1.5 rounded-md border border-border bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
      <span className="font-medium text-foreground">Màu theo bác sĩ:</span>
      {doctors.map(({ name, count }) => {
        const color = getDoctorColor(name)
        return (
          <span key={name} className="inline-flex items-center gap-1.5">
            <span
              className={`size-2.5 shrink-0 rounded-full ${color.dot}`}
              aria-hidden
            />
            <span>
              {name}{" "}
              <span className="tabular-nums text-muted-foreground">
                ({count} ca)
              </span>
            </span>
          </span>
        )
      })}
    </div>
  )
}

import * as React from "react"
import { format } from "date-fns"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker, getDefaultClassNames } from "react-day-picker"

import { cn } from "@/lib/utils"
import { viLocale, VI_WEEK_STARTS_ON } from "@/lib/date-vi"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  formatters,
  components,
  ...props
}: CalendarProps) {
  const defaultClassNames = React.useMemo(() => getDefaultClassNames(), [])

  return (
    <DayPicker
      locale={viLocale}
      weekStartsOn={VI_WEEK_STARTS_ON}
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        ...defaultClassNames,
        ...classNames,
      }}
      formatters={{
        formatCaption: (date) =>
          format(date, "LLLL yyyy", { locale: viLocale }),
        ...formatters,
      }}
      components={{
        Chevron: ({ className: chevronClassName, orientation, ...chevronProps }) => {
          const Icon = orientation === "left" ? ChevronLeft : ChevronRight
          return (
            <Icon
              className={cn("size-4", chevronClassName)}
              {...chevronProps}
            />
          )
        },
        ...components,
      }}
      {...props}
    />
  )
}

export { Calendar }

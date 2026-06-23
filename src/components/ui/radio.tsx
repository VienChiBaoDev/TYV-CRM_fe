import * as React from "react"
import { cn } from "@/lib/utils"

export interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        type="radio"
        ref={ref}
        className={cn(
          "peer h-4 w-4 shrink-0 rounded-full border border-emerald-300 text-emerald-600 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 accent-emerald-600",
          className
        )}
        {...props}
      />
    )
  }
)
Radio.displayName = "Radio"

export { Radio }

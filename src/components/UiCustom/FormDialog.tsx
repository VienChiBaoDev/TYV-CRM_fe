import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

interface FormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  children: React.ReactNode
  footer?: React.ReactNode
  contentClassName?: string
  footerClassName?: string
  showCloseButton?: boolean
}

export function FormDialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  contentClassName,
  footerClassName,
  showCloseButton = true,
}: FormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn("sm:max-w-[560px] overflow-visible", contentClassName)}
        showCloseButton={showCloseButton}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description ? (
            <DialogDescription>{description}</DialogDescription>
          ) : null}
        </DialogHeader>

        {children}

        {footer ? (
          <DialogFooter className={footerClassName}>{footer}</DialogFooter>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}

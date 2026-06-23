import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"

interface AppDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void

  title: string
  description?: string

  children: React.ReactNode

  submitText?: string
  cancelText?: string

  onSubmit?: () => void
  loading?: boolean

  hideFooter?: boolean
}

export function DialogCommon({
  open,
  onOpenChange,
  title,
  description,
  children,
  submitText = "Lưu",
  cancelText = "Hủy",
  onSubmit,
  loading,
  hideFooter,
}: AppDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>

          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        {children}

        {!hideFooter && (
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              {cancelText}
            </Button>

            <Button onClick={onSubmit} disabled={loading}>
              {loading ? "Đang xử lý..." : submitText}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}

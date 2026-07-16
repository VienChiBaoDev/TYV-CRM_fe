import { Button } from "@/components/ui/button"
import { FormDialog } from "./FormDialog"

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
  contentClassName?: string
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
  contentClassName,
}: AppDialogProps) {
  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
      contentClassName={contentClassName}
      footer={
        hideFooter ? undefined : (
          <>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              {cancelText}
            </Button>
            <Button onClick={onSubmit} disabled={loading}>
              {loading ? "Đang xử lý..." : submitText}
            </Button>
          </>
        )
      }
    >
      {children}
    </FormDialog>
  )
}

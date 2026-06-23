import { DialogCommon } from "./DialogCommon"

interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void

  title?: string
  message: string

  onConfirm: () => void
  loading?: boolean
}

export function ConfirmDialog({
  open,
  onOpenChange,
  message,
  onConfirm,
  loading,
  title = "Xác nhận",
}: ConfirmDialogProps) {
  return (
    <DialogCommon
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      onSubmit={onConfirm}
      submitText="Xác nhận"
      loading={loading}
    >
      <p>{message}</p>
    </DialogCommon>
  )
}

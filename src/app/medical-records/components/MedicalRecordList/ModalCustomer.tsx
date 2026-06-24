import { FormInput } from "@/components/FieldCustom/FormInput"
import { DialogCommon } from "@/components/UiCustom/DialogCommon"
import { Form } from "@/components/ui/form"
import type { ModalCustomerModeType } from "@/constants/common"
import { useForm } from "react-hook-form"

export default function ModalCustomer({
  mode,
  open,
  onOpenChange,
}: {
  mode: ModalCustomerModeType
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const title = mode === "add" ? "Thêm khách hàng" : "Sửa khách hàng"
  const form = useForm()

  return (
    <div>
      <DialogCommon
        open={open}
        onOpenChange={onOpenChange}
        title={title}
        children={
          <Form {...form}>
            <FormInput
              control={form.control}
              name="name"
              label="Tên khách hàng"
            />
          </Form>
        }
      />
    </div>
  )
}

import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { isAxiosError } from "axios"
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  createBankAccount,
  deleteBankAccount,
  fetchBankAccounts,
  updateBankAccount,
  type BankAccount,
  type BankAccountPayload,
} from "@/services/bankAccountService"

const bankAccountKeys = { all: ["bank-accounts"] as const }

function getErrorMessage(err: unknown, fallback: string): string {
  if (isAxiosError(err)) {
    const message = err.response?.data?.message
    if (Array.isArray(message)) return message[0]
    if (typeof message === "string") return message
  }
  return fallback
}

export default function BankAccountsSettings() {
  const queryClient = useQueryClient()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<BankAccount | null>(null)

  const { data: accounts = [], isLoading } = useQuery({
    queryKey: bankAccountKeys.all,
    queryFn: fetchBankAccounts,
  })

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: bankAccountKeys.all })

  const deleteMutation = useMutation({
    mutationFn: deleteBankAccount,
    onSuccess: () => {
      toast.success("Đã xóa tài khoản ngân hàng")
      invalidate()
    },
    onError: (err) => toast.error(getErrorMessage(err, "Xóa thất bại")),
  })

  const toggleMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      updateBankAccount(id, { isActive }),
    onSuccess: () => invalidate(),
    onError: (err) => toast.error(getErrorMessage(err, "Cập nhật thất bại")),
  })

  function handleDelete(account: BankAccount) {
    const message =
      `Xóa tài khoản "${account.bankName} - ${account.accountHolder}"?\n\n` +
      "Nếu tài khoản đã phát sinh phiếu thu, hệ thống sẽ chuyển sang trạng thái " +
      "ngừng dùng thay vì xóa, để giữ nguyên lịch sử thanh toán."
    if (window.confirm(message)) deleteMutation.mutate(account.id)
  }

  return (
    <div>
      <div className="mb-4 flex items-start justify-between">
        <p className="hidden max-w-xl text-sm text-slate-500 md:block">
          Danh sách tài khoản dùng khi khách chuyển khoản. Nhân viên sẽ chọn
          đúng tài khoản đã nhận tiền lúc lập phiếu thu, và thông tin này được
          lưu lại trong lịch sử thanh toán.
        </p>
        <Button
          onClick={() => {
            setEditing(null)
            setDialogOpen(true)
          }}
          className="shrink-0 bg-primary hover:bg-primary/80"
        >
          <Plus className="h-4 w-4" /> Thêm tài khoản
        </Button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gray-200 bg-[#f8fbfb] text-xs font-semibold text-slate-700 uppercase">
            <tr>
              <th className="px-4 py-3">Ngân hàng</th>
              <th className="px-4 py-3">Chủ tài khoản</th>
              <th className="px-4 py-3">Số tài khoản</th>
              <th className="px-4 py-3">Ghi chú</th>
              <th className="px-4 py-3">Trạng thái</th>
              <th className="px-4 py-3 text-right">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-10 text-center text-slate-400"
                >
                  Đang tải...
                </td>
              </tr>
            ) : accounts.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-10 text-center text-slate-400"
                >
                  Chưa có tài khoản ngân hàng nào
                </td>
              </tr>
            ) : (
              accounts.map((account) => (
                <tr
                  key={account.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="px-4 py-3 font-medium text-slate-700">
                    {account.bankName}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {account.accountHolder}
                  </td>
                  <td className="px-4 py-3 font-mono text-slate-600">
                    {account.accountNumber}
                  </td>
                  <td className="px-4 py-3 text-slate-500">
                    {account.note || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() =>
                        toggleMutation.mutate({
                          id: account.id,
                          isActive: !account.isActive,
                        })
                      }
                      title="Bấm để đổi trạng thái"
                      className={
                        account.isActive
                          ? "rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 hover:bg-emerald-100"
                          : "rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500 hover:bg-gray-200"
                      }
                    >
                      {account.isActive ? "Đang dùng" : "Ngừng dùng"}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setEditing(account)
                          setDialogOpen(true)
                        }}
                        title="Sửa"
                        className="rounded-md p-1.5 text-slate-500 hover:bg-emerald-50 hover:text-emerald-700"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(account)}
                        title="Xóa"
                        className="rounded-md p-1.5 text-slate-500 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <BankAccountFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        editing={editing}
        onSaved={() => {
          setDialogOpen(false)
          invalidate()
        }}
      />
    </div>
  )
}

interface FormState {
  bankName: string
  accountHolder: string
  accountNumber: string
  note: string
  isActive: boolean
}

function buildInitialForm(editing: BankAccount | null): FormState {
  return {
    bankName: editing?.bankName ?? "",
    accountHolder: editing?.accountHolder ?? "",
    accountNumber: editing?.accountNumber ?? "",
    note: editing?.note ?? "",
    isActive: editing?.isActive ?? true,
  }
}

function BankAccountFormDialog({
  open,
  onOpenChange,
  editing,
  onSaved,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  editing: BankAccount | null
  onSaved: () => void
}) {
  const isEdit = Boolean(editing)
  const [form, setForm] = useState<FormState>(() => buildInitialForm(editing))
  // Đồng bộ lại form mỗi khi mở dialog cho bản ghi khác nhau.
  const [syncedId, setSyncedId] = useState<string | null>(editing?.id ?? null)
  if (open && syncedId !== (editing?.id ?? null)) {
    setSyncedId(editing?.id ?? null)
    setForm(buildInitialForm(editing))
  }

  const mutation = useMutation({
    mutationFn: async () => {
      const payload: BankAccountPayload = {
        bankName: form.bankName.trim(),
        accountHolder: form.accountHolder.trim(),
        accountNumber: form.accountNumber.trim(),
        note: form.note.trim(),
        isActive: form.isActive,
      }
      return isEdit && editing
        ? updateBankAccount(editing.id, payload)
        : createBankAccount(payload)
    },
    onSuccess: () => {
      toast.success(isEdit ? "Đã cập nhật tài khoản" : "Đã thêm tài khoản")
      onSaved()
    },
    onError: (err) => toast.error(getErrorMessage(err, "Lưu thất bại")),
  })

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    mutation.mutate()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Sửa tài khoản ngân hàng" : "Thêm tài khoản ngân hàng"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="bankName">Ngân hàng</Label>
            <Input
              id="bankName"
              value={form.bankName}
              onChange={(e) => setForm({ ...form, bankName: e.target.value })}
              placeholder="eg. MB Bank"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="accountHolder">Chủ tài khoản</Label>
            <Input
              id="accountHolder"
              value={form.accountHolder}
              onChange={(e) =>
                setForm({ ...form, accountHolder: e.target.value })
              }
              placeholder="eg. Đặng Hữu Phúc"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="accountNumber">Số tài khoản</Label>
            <Input
              id="accountNumber"
              value={form.accountNumber}
              onChange={(e) =>
                setForm({ ...form, accountNumber: e.target.value })
              }
              placeholder="eg. 0123456789"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="note">Ghi chú</Label>
            <Input
              id="note"
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              placeholder="eg. Tài khoản chính chi nhánh Hàng Bông"
            />
          </div>

          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
              className="h-4 w-4 accent-emerald-600"
            />
            Đang sử dụng (hiện trong ô chọn khi thu tiền)
          </label>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="bg-primary hover:bg-primary/80"
            >
              {mutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Lưu"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

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
  createClinic,
  deleteClinic,
  fetchClinics,
  updateClinic,
  type Clinic,
  type ClinicPayload,
} from "@/services/clinicService"

const clinicKeys = { all: ["clinics"] as const }

function getErrorMessage(err: unknown, fallback: string): string {
  if (isAxiosError(err)) {
    const message = err.response?.data?.message
    if (Array.isArray(message)) return message[0]
    if (typeof message === "string") return message
  }
  return fallback
}

export default function ClinicsSettings() {
  const queryClient = useQueryClient()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Clinic | null>(null)

  const { data: clinics = [], isLoading } = useQuery({
    queryKey: clinicKeys.all,
    queryFn: fetchClinics,
  })

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: clinicKeys.all })

  const deleteMutation = useMutation({
    mutationFn: deleteClinic,
    onSuccess: () => {
      toast.success("Đã xóa cơ sở")
      invalidate()
    },
    onError: (err) => toast.error(getErrorMessage(err, "Xóa thất bại")),
  })

  const toggleMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      updateClinic(id, { isActive }),
    onSuccess: () => invalidate(),
    onError: (err) => toast.error(getErrorMessage(err, "Cập nhật thất bại")),
  })

  function handleDelete(clinic: Clinic) {
    if (
      window.confirm(
        `Xóa cơ sở "${clinic.name}" (${clinic.code})?\n\n` +
          "Nếu cơ sở đã gắn dữ liệu (khách hàng, lịch hẹn, nhân sự…), " +
          "hệ thống sẽ chuyển sang trạng thái ngừng dùng thay vì xóa."
      )
    ) {
      deleteMutation.mutate(clinic.id)
    }
  }

  return (
    <div>
      <div className="mb-4 flex items-start justify-between">
        <p className="hidden max-w-xl text-sm text-slate-500 md:block">
          Danh sách cơ sở / chi nhánh phòng khám. Thêm các cơ sở tại đây trước,
          rồi gắn nhân sự và dữ liệu nghiệp vụ theo cơ sở ở các bước sau.
        </p>
        <Button
          onClick={() => {
            setEditing(null)
            setDialogOpen(true)
          }}
          className="shrink-0 bg-primary hover:bg-primary/80"
        >
          <Plus className="h-4 w-4" /> Thêm cơ sở
        </Button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gray-200 bg-[#f8fbfb] text-xs font-semibold text-slate-700 uppercase">
            <tr>
              <th className="px-4 py-3">Mã</th>
              <th className="px-4 py-3">Tên cơ sở</th>
              <th className="px-4 py-3">Địa chỉ</th>
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
            ) : clinics.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-10 text-center text-slate-400"
                >
                  Chưa có cơ sở nào — hãy thêm Hàng Bông, Cầu Giấy…
                </td>
              </tr>
            ) : (
              clinics.map((clinic) => (
                <tr
                  key={clinic.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="px-4 py-3 font-mono text-xs font-semibold text-slate-700">
                    {clinic.code}
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-700">
                    {clinic.name}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {clinic.address || "—"}
                  </td>
                  <td className="px-4 py-3 text-slate-500">
                    {clinic.note || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() =>
                        toggleMutation.mutate({
                          id: clinic.id,
                          isActive: !clinic.isActive,
                        })
                      }
                      title="Bấm để đổi trạng thái"
                      className={
                        clinic.isActive
                          ? "rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 hover:bg-emerald-100"
                          : "rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500 hover:bg-gray-200"
                      }
                    >
                      {clinic.isActive ? "Đang dùng" : "Ngừng dùng"}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setEditing(clinic)
                          setDialogOpen(true)
                        }}
                        title="Sửa"
                        className="rounded-md p-1.5 text-slate-500 hover:bg-emerald-50 hover:text-emerald-700"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(clinic)}
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

      <ClinicFormDialog
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
  code: string
  name: string
  address: string
  note: string
  isActive: boolean
}

function buildInitialForm(editing: Clinic | null): FormState {
  return {
    code: editing?.code ?? "",
    name: editing?.name ?? "",
    address: editing?.address ?? "",
    note: editing?.note ?? "",
    isActive: editing?.isActive ?? true,
  }
}

function ClinicFormDialog({
  open,
  onOpenChange,
  editing,
  onSaved,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  editing: Clinic | null
  onSaved: () => void
}) {
  const isEdit = Boolean(editing)
  const [form, setForm] = useState<FormState>(() => buildInitialForm(editing))
  const [syncedId, setSyncedId] = useState<string | null>(editing?.id ?? null)
  if (open && syncedId !== (editing?.id ?? null)) {
    setSyncedId(editing?.id ?? null)
    setForm(buildInitialForm(editing))
  }

  const mutation = useMutation({
    mutationFn: async () => {
      const payload: ClinicPayload = {
        code: form.code.trim().toUpperCase(),
        name: form.name.trim(),
        address: form.address.trim(),
        note: form.note.trim(),
        isActive: form.isActive,
      }
      return isEdit && editing
        ? updateClinic(editing.id, payload)
        : createClinic(payload)
    },
    onSuccess: () => {
      toast.success(isEdit ? "Đã cập nhật cơ sở" : "Đã thêm cơ sở")
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
          <DialogTitle>{isEdit ? "Sửa cơ sở" : "Thêm cơ sở"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="clinicCode">Mã cơ sở</Label>
            <Input
              id="clinicCode"
              value={form.code}
              onChange={(e) =>
                setForm({ ...form, code: e.target.value.toUpperCase() })
              }
              placeholder="eg. HANG_BONG"
              required
              className="font-mono uppercase"
            />
            <p className="text-xs text-slate-400">
              Chỉ chữ in hoa, số và dấu gạch dưới. Dùng làm mã ổn định khi gắn
              dữ liệu sau này.
            </p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="clinicName">Tên cơ sở</Label>
            <Input
              id="clinicName"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="eg. Hàng Bông"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="clinicAddress">Địa chỉ</Label>
            <Input
              id="clinicAddress"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              placeholder="eg. 123 Hàng Bông, Hoàn Kiếm"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="clinicNote">Ghi chú</Label>
            <Input
              id="clinicNote"
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              placeholder="eg. Cơ sở chính"
            />
          </div>

          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
              className="h-4 w-4 accent-emerald-600"
            />
            Đang sử dụng (hiện trong ô chọn trên hệ thống)
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

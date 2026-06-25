import { useState } from "react"
import { Navigate } from "react-router-dom"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { isAxiosError } from "axios"
import { Loader2, Pencil, Plus, Trash2, UserCog } from "lucide-react"
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { urlPaths } from "@/constants/urlPaths"
import {
  CLINIC_BRANCH_LABEL,
  ROLE_LABEL,
  type ClinicBranchValue,
  type CreateStaffPayload,
  type Staff,
  type StaffRole,
  type UpdateStaffPayload,
} from "@/interfaces/auth"
import {
  createStaff,
  deleteStaff,
  fetchStaffList,
  updateStaff,
} from "@/services/staffService"
import { useAuthStore } from "@/stores/auth-store"

const ROLES: StaffRole[] = ["ADMIN", "DOCTOR", "ASSISTANT", "STAFF"]
const BRANCHES: ClinicBranchValue[] = ["HANG_BONG", "CAU_GIAY"]
const NO_BRANCH = "NONE"

const staffKeys = { all: ["staff"] as const }

function getErrorMessage(err: unknown, fallback: string): string {
  if (isAxiosError(err)) {
    const message = err.response?.data?.message
    if (Array.isArray(message)) return message[0]
    if (typeof message === "string") return message
  }
  return fallback
}

export default function SettingsPage() {
  const currentUser = useAuthStore((state) => state.user)
  const queryClient = useQueryClient()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Staff | null>(null)

  const { data: staffList = [], isLoading } = useQuery({
    queryKey: staffKeys.all,
    queryFn: fetchStaffList,
  })

  const deleteMutation = useMutation({
    mutationFn: deleteStaff,
    onSuccess: () => {
      toast.success("Đã xóa tài khoản")
      queryClient.invalidateQueries({ queryKey: staffKeys.all })
    },
    onError: (err) => toast.error(getErrorMessage(err, "Xóa thất bại")),
  })

  // Chặn truy cập trực tiếp bằng URL với tài khoản không phải admin.
  if (currentUser && currentUser.role !== "ADMIN") {
    return <Navigate to={urlPaths.medicalRecordList} replace />
  }

  function openCreate() {
    setEditing(null)
    setDialogOpen(true)
  }

  function openEdit(staff: Staff) {
    setEditing(staff)
    setDialogOpen(true)
  }

  function handleDelete(staff: Staff) {
    if (window.confirm(`Xóa tài khoản "${staff.fullName}" (${staff.email})?`)) {
      deleteMutation.mutate(staff.id)
    }
  }

  return (
    <div className="flex h-full flex-col bg-white p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <UserCog className="h-6 w-6 text-emerald-600" />
          <div>
            <h1 className="text-lg font-bold text-slate-800">
              Quản lý tài khoản
            </h1>
            <p className="text-sm text-slate-500">
              Thêm, sửa, xóa tài khoản nhân sự và phân quyền.
            </p>
          </div>
        </div>
        <Button
          onClick={openCreate}
          className="bg-emerald-700 hover:bg-emerald-800"
        >
          <Plus className="h-4 w-4" /> Thêm tài khoản
        </Button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gray-200 bg-[#f8fbfb] text-xs font-semibold uppercase text-slate-700">
            <tr>
              <th className="px-4 py-3">Họ tên</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Vai trò</th>
              <th className="px-4 py-3">Chi nhánh</th>
              <th className="px-4 py-3">Trạng thái</th>
              <th className="px-4 py-3 text-right">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-slate-400">
                  Đang tải...
                </td>
              </tr>
            ) : staffList.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-slate-400">
                  Chưa có tài khoản nào
                </td>
              </tr>
            ) : (
              staffList.map((staff) => (
                <tr
                  key={staff.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="px-4 py-3 font-medium text-slate-700">
                    {staff.fullName}
                    {staff.id === currentUser?.id ? (
                      <span className="ml-2 text-[10px] text-emerald-600">
                        (Bạn)
                      </span>
                    ) : null}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{staff.email}</td>
                  <td className="px-4 py-3 text-slate-600">
                    {ROLE_LABEL[staff.role]}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {staff.clinicBranch
                      ? CLINIC_BRANCH_LABEL[staff.clinicBranch]
                      : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        staff.isActive
                          ? "rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700"
                          : "rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500"
                      }
                    >
                      {staff.isActive ? "Hoạt động" : "Đã khóa"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEdit(staff)}
                        title="Sửa"
                        className="rounded-md p-1.5 text-slate-500 hover:bg-emerald-50 hover:text-emerald-700"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(staff)}
                        disabled={staff.id === currentUser?.id}
                        title={
                          staff.id === currentUser?.id
                            ? "Không thể xóa chính bạn"
                            : "Xóa"
                        }
                        className="rounded-md p-1.5 text-slate-500 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
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

      <StaffFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        editing={editing}
        onSaved={() => {
          setDialogOpen(false)
          queryClient.invalidateQueries({ queryKey: staffKeys.all })
        }}
      />
    </div>
  )
}

interface FormState {
  fullName: string
  email: string
  password: string
  role: StaffRole
  clinicBranch: string
  isActive: boolean
}

function buildInitialForm(editing: Staff | null): FormState {
  return {
    fullName: editing?.fullName ?? "",
    email: editing?.email ?? "",
    password: "",
    role: editing?.role ?? "STAFF",
    clinicBranch: editing?.clinicBranch ?? NO_BRANCH,
    isActive: editing?.isActive ?? true,
  }
}

function StaffFormDialog({
  open,
  onOpenChange,
  editing,
  onSaved,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  editing: Staff | null
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
      const branch =
        form.clinicBranch === NO_BRANCH
          ? null
          : (form.clinicBranch as ClinicBranchValue)

      if (isEdit && editing) {
        const payload: UpdateStaffPayload = {
          fullName: form.fullName,
          email: form.email,
          role: form.role,
          clinicBranch: branch,
          isActive: form.isActive,
        }
        if (form.password.trim()) payload.password = form.password
        return updateStaff(editing.id, payload)
      }

      const payload: CreateStaffPayload = {
        fullName: form.fullName,
        email: form.email,
        password: form.password,
        role: form.role,
        clinicBranch: branch,
        isActive: form.isActive,
      }
      return createStaff(payload)
    },
    onSuccess: () => {
      toast.success(isEdit ? "Đã cập nhật tài khoản" : "Đã tạo tài khoản")
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
            {isEdit ? "Sửa tài khoản" : "Thêm tài khoản"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="fullName">Họ tên</Label>
            <Input
              id="fullName"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password">
              Mật khẩu{" "}
              {isEdit ? (
                <span className="text-xs font-normal text-slate-400">
                  (để trống nếu không đổi)
                </span>
              ) : null}
            </Label>
            <Input
              id="password"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required={!isEdit}
              placeholder={isEdit ? "••••••" : ""}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Vai trò</Label>
              <Select
                value={form.role}
                onValueChange={(value) =>
                  setForm({ ...form, role: value as StaffRole })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ROLES.map((role) => (
                    <SelectItem key={role} value={role}>
                      {ROLE_LABEL[role]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Chi nhánh</Label>
              <Select
                value={form.clinicBranch}
                onValueChange={(value) =>
                  setForm({ ...form, clinicBranch: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NO_BRANCH}>Không</SelectItem>
                  {BRANCHES.map((branch) => (
                    <SelectItem key={branch} value={branch}>
                      {CLINIC_BRANCH_LABEL[branch]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
              className="h-4 w-4 accent-emerald-600"
            />
            Kích hoạt tài khoản
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
              className="bg-emerald-700 hover:bg-emerald-800"
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

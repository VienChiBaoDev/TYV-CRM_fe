import { useEffect, useRef } from "react"
import { RotateCcw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
  ALL_PERMISSION_CODES,
  PERMISSION_GROUPS,
  getRoleDefaultPermissions,
  type PermissionCode,
} from "@/constants/permissions"
import { ROLE_LABEL, type StaffRole } from "@/interfaces/auth"
import { cn } from "@/lib/utils"

interface StaffPermissionsFieldProps {
  role: StaffRole
  value: PermissionCode[]
  onChange: (codes: PermissionCode[]) => void
  className?: string
}

function GroupCheckbox({
  allChecked,
  someChecked,
  disabled,
  onToggle,
  "aria-label": ariaLabel,
}: {
  allChecked: boolean
  someChecked: boolean
  disabled: boolean
  onToggle: (checked: boolean) => void
  "aria-label": string
}) {
  const ref = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = someChecked && !allChecked
  }, [someChecked, allChecked])

  return (
    <Checkbox
      ref={ref}
      checked={allChecked}
      disabled={disabled}
      aria-label={ariaLabel}
      onChange={(event) => onToggle(event.target.checked)}
    />
  )
}

export function StaffPermissionsField({
  role,
  value,
  onChange,
  className,
}: StaffPermissionsFieldProps) {
  const isAdmin = role === "ADMIN"
  const selected = new Set(isAdmin ? ALL_PERMISSION_CODES : value)
  const selectedCount = selected.size
  const totalCount = ALL_PERMISSION_CODES.length

  function toggle(code: PermissionCode, checked: boolean) {
    if (isAdmin) return
    if (checked) {
      onChange([...new Set([...value, code])])
      return
    }
    onChange(value.filter((item) => item !== code))
  }

  function toggleGroup(codes: PermissionCode[], checked: boolean) {
    if (isAdmin) return
    if (checked) {
      onChange([...new Set([...value, ...codes])])
      return
    }
    const remove = new Set(codes)
    onChange(value.filter((item) => !remove.has(item)))
  }

  function resetToRoleDefaults() {
    onChange(getRoleDefaultPermissions(role))
  }

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <Label>Quyền truy cập</Label>
          <p className="mt-0.5 text-xs text-slate-500">
            {isAdmin
              ? "Quản trị viên luôn có toàn quyền — không chỉnh từng mục."
              : `Đã chọn ${selectedCount}/${totalCount}. Đổi vai trò có thể hỏi áp quyền mặc định.`}
          </p>
        </div>
        {!isAdmin ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 text-xs"
            onClick={resetToRoleDefaults}
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset theo {ROLE_LABEL[role]}
          </Button>
        ) : null}
      </div>

      <div
        className={cn(
          "max-h-64 space-y-3 overflow-y-auto rounded-md border border-gray-200 p-3",
          isAdmin && "bg-slate-50/80"
        )}
      >
        {PERMISSION_GROUPS.map((group) => {
          const groupCodes = group.items.map((item) => item.code)
          const checkedCount = groupCodes.filter((code) =>
            selected.has(code)
          ).length
          const allChecked = checkedCount === groupCodes.length
          const someChecked = checkedCount > 0 && !allChecked

          return (
            <div key={group.id} className="space-y-2">
              <label className="flex items-center gap-2 border-b border-gray-100 pb-1.5">
                <GroupCheckbox
                  allChecked={allChecked}
                  someChecked={someChecked}
                  disabled={isAdmin}
                  aria-label={`Chọn cả nhóm ${group.label}`}
                  onToggle={(checked) => toggleGroup(groupCodes, checked)}
                />
                <span className="text-xs font-semibold tracking-wide text-slate-700 uppercase">
                  {group.label}
                </span>
                <span className="text-[10px] text-slate-400">
                  {checkedCount}/{groupCodes.length}
                </span>
              </label>

              <div className="grid gap-1.5 sm:grid-cols-2">
                {group.items.map((item) => (
                  <label
                    key={item.code}
                    className={cn(
                      "flex items-start gap-2 rounded-md px-1.5 py-1 text-sm text-slate-700",
                      !isAdmin && "hover:bg-emerald-50/60",
                      isAdmin && "opacity-80"
                    )}
                  >
                    <Checkbox
                      className="mt-0.5"
                      checked={selected.has(item.code)}
                      disabled={isAdmin}
                      onChange={(event) =>
                        toggle(item.code, event.target.checked)
                      }
                    />
                    <span className="leading-snug">{item.label}</span>
                  </label>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

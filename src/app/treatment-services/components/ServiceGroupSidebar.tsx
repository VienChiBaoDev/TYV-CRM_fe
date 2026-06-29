import { Pencil, Plus } from "lucide-react"

import { PageHeader } from "@/components/UiCustom/PageHeader"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

import { SERVICE_ITEM_TYPE, type ServiceGroup } from "../types/treatment-service"

interface ServiceGroupSidebarProps {
  groups: ServiceGroup[]
  selectedGroupId: string | null
  showServices: boolean
  showProducts: boolean
  loading?: boolean
  onSelectGroup: (groupId: string) => void
  onShowServicesChange: (checked: boolean) => void
  onShowProductsChange: (checked: boolean) => void
  onAddGroup: () => void
  onEditGroup: (group: ServiceGroup) => void
}

function isGroupVisible(
  group: ServiceGroup,
  showServices: boolean,
  showProducts: boolean
): boolean {
  if (group.itemType === SERVICE_ITEM_TYPE.SERVICE) return showServices
  return showProducts
}

export function ServiceGroupSidebar({
  groups,
  selectedGroupId,
  showServices,
  showProducts,
  loading = false,
  onSelectGroup,
  onShowServicesChange,
  onShowProductsChange,
  onAddGroup,
  onEditGroup,
}: ServiceGroupSidebarProps) {
  const visibleGroups = groups.filter((group) =>
    isGroupVisible(group, showServices, showProducts)
  )

  const totalItems = visibleGroups.reduce(
    (sum, group) => sum + group.serviceCount,
    0
  )

  return (
    <aside className="flex w-full shrink-0 flex-col border-r border-slate-200 bg-white md:w-72 lg:w-80">
      <div className="border-b border-slate-100 p-4">
        <PageHeader
          title="Nhóm dịch vụ"
          description="Tất cả nhóm dịch vụ"
        />

        <Button
          type="button"
          onClick={onAddGroup}
          className="mt-3 w-full bg-emerald-600 text-white hover:bg-emerald-700"
        >
          <Plus className="h-4 w-4" />
          Thêm mới
        </Button>

        <div className="mt-4 flex items-center gap-4">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
            <Checkbox
              checked={showServices}
              onChange={(event) => onShowServicesChange(event.target.checked)}
            />
            Dịch vụ
          </label>
          <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
            <Checkbox
              checked={showProducts}
              onChange={(event) => onShowProductsChange(event.target.checked)}
            />
            Sản phẩm
          </label>
        </div>

        <p className="mt-3 text-xs text-muted-foreground">
          {totalItems} dịch vụ / sản phẩm
        </p>
      </div>

      <ScrollArea className="flex-1">
        <ul className="p-2">
          {loading && visibleGroups.length === 0 ? (
            <li className="px-3 py-2 text-sm text-muted-foreground">
              Đang tải...
            </li>
          ) : null}
          {!loading && visibleGroups.length === 0 ? (
            <li className="px-3 py-2 text-sm text-muted-foreground">
              Chưa có nhóm dịch vụ
            </li>
          ) : null}
          {visibleGroups.map((group) => {
            const isSelected = group.id === selectedGroupId

            return (
              <li key={group.id}>
                <div
                  className={cn(
                    "group flex items-center gap-1 rounded-md transition-colors",
                    isSelected ? "bg-slate-100" : "hover:bg-slate-50"
                  )}
                >
                  <button
                    type="button"
                    onClick={() => onSelectGroup(group.id)}
                    className={cn(
                      "min-w-0 flex-1 px-3 py-2.5 text-left text-sm",
                      isSelected ? "font-medium text-slate-900" : "text-slate-700"
                    )}
                  >
                    <span className="text-slate-500">{group.code}</span>{" "}
                    {group.name}{" "}
                    <span className="text-slate-400">
                      ({group.serviceCount} dịch vụ)
                    </span>
                  </button>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => onEditGroup(group)}
                    className="mr-1 shrink-0 text-slate-400 opacity-0 transition-opacity group-hover:opacity-100 hover:text-slate-700"
                    aria-label={`Sửa nhóm ${group.name}`}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </li>
            )
          })}
        </ul>
      </ScrollArea>
    </aside>
  )
}

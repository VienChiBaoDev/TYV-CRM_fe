import { useQuery } from "@tanstack/react-query"
import { Package, Pencil, Plus, Warehouse } from "lucide-react"
import { useMemo, useState } from "react"

import { ConsumableDialog } from "@/app/consumables/components/ConsumableDialog"
import { StockInDialog } from "@/app/consumables/components/StockInDialog"
import {
  useCreateConsumableMutation,
  useStockInConsumableMutation,
  useUpdateConsumableMutation,
} from "@/app/consumables/hooks/use-consumable-mutations"
import {
  consumableListQueryOptions,
  consumableUsageQueryOptions,
} from "@/app/consumables/queries/consumable-query"
import type { ConsumableFormValues } from "@/app/consumables/schemas/consumable-form"
import type {
  ConsumableApi,
  ConsumableUsageApi,
} from "@/app/consumables/services/consumable-api"
import { PageHeader } from "@/components/UiCustom/PageHeader"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MODAL_MODE, type ModalModeType } from "@/constants/common"
import { formatDatetimeVi } from "@/lib/date-vi"

export function ConsumablesPage() {
  const [search, setSearch] = useState("")
  const [appliedSearch, setAppliedSearch] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogMode, setDialogMode] = useState<ModalModeType>(MODAL_MODE.ADD)
  const [editing, setEditing] = useState<ConsumableApi | null>(null)
  const [stockInTarget, setStockInTarget] = useState<ConsumableApi | null>(
    null
  )

  const listFilters = useMemo(() => ({ search: appliedSearch }), [appliedSearch])

  const { data: consumables = [], isLoading } = useQuery(
    consumableListQueryOptions(listFilters)
  )
  const { data: usageRows = [], isLoading: isUsageLoading } = useQuery(
    consumableUsageQueryOptions()
  )

  const createMutation = useCreateConsumableMutation()
  const updateMutation = useUpdateConsumableMutation()
  const stockInMutation = useStockInConsumableMutation()

  const openAddDialog = () => {
    setDialogMode(MODAL_MODE.ADD)
    setEditing(null)
    setDialogOpen(true)
  }

  const openEditDialog = (consumable: ConsumableApi) => {
    setDialogMode(MODAL_MODE.EDIT)
    setEditing(consumable)
    setDialogOpen(true)
  }

  const handleSave = async (values: ConsumableFormValues): Promise<boolean> => {
    try {
      if (dialogMode === MODAL_MODE.ADD) {
        await createMutation.mutateAsync(values)
        return true
      }
      if (!editing) return false
      await updateMutation.mutateAsync({ id: editing.id, payload: values })
      return true
    } catch {
      return false
    }
  }

  const handleStockIn = async (
    values: { quantity: number; note?: string }
  ): Promise<boolean> => {
    if (!stockInTarget) return false
    try {
      await stockInMutation.mutateAsync({ id: stockInTarget.id, payload: values })
      return true
    } catch {
      return false
    }
  }

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-[#e8ece9]">
      <section className="flex min-h-0 min-w-0 flex-1 flex-col p-4">
        <PageHeader
          title="Vật tư tiêu hao"
          description="Quản lý danh mục vật tư, tồn kho và theo dõi tiêu hao khi điều trị"
        />

        <Tabs defaultValue="catalog" className="mt-4 flex min-h-0 flex-1 flex-col">
          <TabsList className="mb-4 w-fit">
            <TabsTrigger value="catalog" className="gap-1.5">
              <Package className="h-4 w-4" />
              Danh mục
            </TabsTrigger>
            <TabsTrigger value="usage" className="gap-1.5">
              <Warehouse className="h-4 w-4" />
              Lịch sử tiêu hao
            </TabsTrigger>
          </TabsList>

          <TabsContent value="catalog" className="min-h-0 flex-1">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <Input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Tìm theo tên, ghi chú..."
                  className="w-64 bg-white"
                  onKeyDown={(event) => {
                    if (event.key === "Enter") setAppliedSearch(search.trim())
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setAppliedSearch(search.trim())}
                >
                  Tìm
                </Button>
              </div>
              <Button type="button" onClick={openAddDialog}>
                <Plus className="h-4 w-4" />
                Thêm vật tư
              </Button>
            </div>

            <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-gray-200 bg-[#f8fbfb] text-xs font-semibold text-slate-700 uppercase">
                  <tr>
                    <th className="px-4 py-3">Tên vật tư</th>
                    <th className="px-4 py-3">Đơn vị</th>
                    <th className="px-4 py-3">Tồn kho</th>
                    <th className="px-4 py-3">Định mức 1 buổi</th>
                    <th className="px-4 py-3">Ghi chú</th>
                    <th className="px-4 py-3">Trạng thái</th>
                    <th className="px-4 py-3 text-right">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-4 py-10 text-center text-slate-400"
                      >
                        Đang tải...
                      </td>
                    </tr>
                  ) : consumables.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-4 py-10 text-center text-slate-400"
                      >
                        Chưa có vật tư nào
                      </td>
                    </tr>
                  ) : (
                    consumables.map((row) => (
                      <tr
                        key={row.id}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="px-4 py-3 font-medium text-slate-700">
                          {row.name}
                        </td>
                        <td className="px-4 py-3 text-slate-600">{row.unit}</td>
                        <td className="px-4 py-3 text-slate-600">
                          {row.stockQuantity}
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          {row.sessionQuotaText || "—"}
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          {row.note || "—"}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={
                              row.isActive
                                ? "rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700"
                                : "rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500"
                            }
                          >
                            {row.isActive ? "Đang dùng" : "Ngừng dùng"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => setStockInTarget(row)}
                              title="Nhập kho"
                              className="rounded-md px-2 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-50"
                            >
                              Nhập kho
                            </button>
                            <button
                              type="button"
                              onClick={() => openEditDialog(row)}
                              title="Sửa"
                              className="rounded-md p-1.5 text-slate-500 hover:bg-emerald-50 hover:text-emerald-700"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="usage" className="min-h-0 flex-1">
            <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-gray-200 bg-[#f8fbfb] text-xs font-semibold text-slate-700 uppercase">
                  <tr>
                    <th className="px-4 py-3">Ngày</th>
                    <th className="px-4 py-3">Khách hàng</th>
                    <th className="px-4 py-3">Dịch vụ</th>
                    <th className="px-4 py-3">Buổi</th>
                    <th className="px-4 py-3">Vật tư</th>
                    <th className="px-4 py-3">Số lượng</th>
                    <th className="px-4 py-3">Người thực hiện</th>
                  </tr>
                </thead>
                <tbody>
                  {isUsageLoading ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-4 py-10 text-center text-slate-400"
                      >
                        Đang tải...
                      </td>
                    </tr>
                  ) : usageRows.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-4 py-10 text-center text-slate-400"
                      >
                        Chưa có dữ liệu tiêu hao
                      </td>
                    </tr>
                  ) : (
                    usageRows.map((row: ConsumableUsageApi) => (
                      <tr
                        key={row.id}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="px-4 py-3 text-slate-600">
                          {formatDatetimeVi(row.performedAt)}
                        </td>
                        <td className="px-4 py-3 text-slate-700">
                          <div className="font-medium">{row.patientName}</div>
                          <div className="text-xs text-slate-400">
                            {row.patientCode}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          {row.serviceName}
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          {row.sessionNumber}
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          {row.consumableName}
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          {row.quantity} {row.unit}
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          {row.performedByName ?? "—"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>
      </section>

      <ConsumableDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        mode={dialogMode}
        consumable={editing}
        onSave={handleSave}
      />

      <StockInDialog
        open={Boolean(stockInTarget)}
        onOpenChange={(open) => {
          if (!open) setStockInTarget(null)
        }}
        consumable={stockInTarget}
        onSave={handleStockIn}
      />
    </div>
  )
}

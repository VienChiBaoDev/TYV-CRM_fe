import { useQuery } from "@tanstack/react-query"
import { Package, Pencil, Plus, Warehouse } from "lucide-react"
import { useMemo, useState } from "react"

import { ConsumableDialog } from "@/app/consumables/components/ConsumableDialog"
import { StockInDialog } from "@/app/consumables/components/StockInDialog"
import {
  ConsumableUsageFiltersBar,
  type ConsumableUsageFilters,
} from "@/app/consumables/components/ConsumableUsageFiltersBar"
import { createConsumableUsageTableColumns } from "@/app/consumables/components/consumable-usage-table-columns"
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
import type { ConsumableApi } from "@/app/consumables/services/consumable-api"
import { DataTable } from "@/components/data-table/data-table"
import { PageHeader } from "@/components/UiCustom/PageHeader"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MODAL_MODE, type ModalModeType } from "@/constants/common"
import {
  isoDateToApiDatetime,
  isoDateToApiDatetimeEndOfDay,
} from "@/lib/date-vi"
import { DEFAULT_LIMIT } from "@/types/pagination"
import type { FetchConsumableUsageParams } from "@/app/consumables/services/consumable-api"

const DEFAULT_USAGE_FILTERS: ConsumableUsageFilters = {
  search: "",
  from: "",
  to: "",
}

function buildUsageApiFilters(
  filters: ConsumableUsageFilters,
  page: number,
  limit: number
): FetchConsumableUsageParams {
  const params: FetchConsumableUsageParams = { page, limit }

  const search = filters.search.trim()
  if (search) params.search = search
  if (filters.from) params.from = isoDateToApiDatetime(filters.from)
  if (filters.to) params.to = isoDateToApiDatetimeEndOfDay(filters.to)

  return params
}

export function ConsumablesPage() {
  const [search, setSearch] = useState("")
  const [appliedSearch, setAppliedSearch] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogMode, setDialogMode] = useState<ModalModeType>(MODAL_MODE.ADD)
  const [editing, setEditing] = useState<ConsumableApi | null>(null)
  const [stockInTarget, setStockInTarget] = useState<ConsumableApi | null>(
    null
  )
  const [usagePage, setUsagePage] = useState(1)
  const [usageDraftFilters, setUsageDraftFilters] =
    useState<ConsumableUsageFilters>(DEFAULT_USAGE_FILTERS)
  const [usageAppliedFilters, setUsageAppliedFilters] =
    useState<ConsumableUsageFilters>(DEFAULT_USAGE_FILTERS)

  const listFilters = useMemo(() => ({ search: appliedSearch }), [appliedSearch])
  const usageFilters = useMemo(
    () => buildUsageApiFilters(usageAppliedFilters, usagePage, DEFAULT_LIMIT),
    [usageAppliedFilters, usagePage]
  )

  const { data: consumables = [], isLoading } = useQuery(
    consumableListQueryOptions(listFilters)
  )
  const { data: usageData, isLoading: isUsageLoading } = useQuery(
    consumableUsageQueryOptions(usageFilters)
  )

  const usageRows = usageData?.data ?? []
  const usageMeta = usageData?.meta
  const usageRowOffset = (usagePage - 1) * DEFAULT_LIMIT

  const usageColumns = useMemo(
    () => createConsumableUsageTableColumns({ rowOffset: usageRowOffset }),
    [usageRowOffset]
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

  const handleApplyUsageFilters = () => {
    setUsageAppliedFilters(usageDraftFilters)
    setUsagePage(1)
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
            <ConsumableUsageFiltersBar
              filters={usageDraftFilters}
              onFiltersChange={setUsageDraftFilters}
              onApply={handleApplyUsageFilters}
            />
            <div className="min-h-0 flex-1 overflow-auto">
              <DataTable
                columns={usageColumns}
                data={usageRows}
                loading={isUsageLoading}
                classNameTable="border-0 p-0 shadow-none"
                pageIndex={usagePage - 1}
                pageCount={Math.max(usageMeta?.totalPages ?? 0, 1)}
                onPageChange={(nextPageIndex) => setUsagePage(nextPageIndex + 1)}
              />
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

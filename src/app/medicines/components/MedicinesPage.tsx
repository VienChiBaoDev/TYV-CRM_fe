import { useQuery } from "@tanstack/react-query"
import { FileUp, Plus } from "lucide-react"
import { useMemo, useState } from "react"

import { PageHeader } from "@/components/UiCustom/PageHeader"
import { DataTable } from "@/components/data-table/data-table"
import { Button } from "@/components/ui/button"
import { MODAL_MODE, type ModalModeType } from "@/constants/common"
import { DEFAULT_LIMIT } from "@/types/pagination"

import {
  useCreateMedicineMutation,
  useDeleteMedicineMutation,
  useUpdateMedicineMutation,
} from "../hooks/use-medicine-mutations"
import { medicineListQueryOptions } from "../queries/medicine-query"
import type { MedicineFormValues } from "../schemas/medicine-form"
import type {
  FetchMedicinesParams,
  Medicine,
  MedicineFilters,
} from "../types/medicine"
import { MedicineDialog } from "./MedicineDialog"
import { MedicineFiltersBar } from "./MedicineFiltersBar"
import { createMedicineTableColumns } from "./medicine-table-columns"
import { MedicineImportDialog } from "./MedicineImportDialog"
import { ConfirmDialog } from "@/components/UiCustom/DialogConfirm"

const DEFAULT_FILTERS: MedicineFilters = {
  search: "",
  unit: "Tất cả đơn vị",
}

function buildApiFilters(
  filters: MedicineFilters,
  page: number,
  limit: number
): FetchMedicinesParams {
  const params: FetchMedicinesParams = { page, limit }

  const search = filters.search?.trim()
  if (search) params.search = search

  if (filters.unit && filters.unit !== "Tất cả đơn vị") {
    params.unit = filters.unit
  }

  return params
}

export function MedicinesPage() {
  const [page, setPage] = useState(1)
  const [draftFilters, setDraftFilters] =
    useState<MedicineFilters>(DEFAULT_FILTERS)
  const [appliedFilters, setAppliedFilters] =
    useState<MedicineFilters>(DEFAULT_FILTERS)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogMode, setDialogMode] = useState<ModalModeType>(MODAL_MODE.ADD)
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null)
  const [importOpen, setImportOpen] = useState(false)
  const [medicineToDelete, setMedicineToDelete] = useState<Medicine | null>(
    null
  )

  const apiFilters = useMemo(
    () => buildApiFilters(appliedFilters, page, DEFAULT_LIMIT),
    [appliedFilters, page]
  )

  const { data, isLoading } = useQuery(medicineListQueryOptions(apiFilters))

  const medicines = data?.data ?? []
  const meta = data?.meta

  const createMutation = useCreateMedicineMutation()
  const updateMutation = useUpdateMedicineMutation()
  const deleteMutation = useDeleteMedicineMutation()

  const rowOffset = (page - 1) * DEFAULT_LIMIT

  const columns = useMemo(
    () =>
      createMedicineTableColumns({
        rowOffset,
        onEditMedicine: (medicine) => {
          setDialogMode(MODAL_MODE.EDIT)
          setEditingMedicine(medicine)
          setDialogOpen(true)
        },
        onDeleteMedicine: setMedicineToDelete,
      }),
    [rowOffset]
  )

  const openAddDialog = () => {
    setDialogMode(MODAL_MODE.ADD)
    setEditingMedicine(null)
    setDialogOpen(true)
  }

  const handleSave = async (values: MedicineFormValues): Promise<boolean> => {
    try {
      if (dialogMode === MODAL_MODE.ADD) {
        await createMutation.mutateAsync(values)
        setPage(1)
        return true
      }

      if (!editingMedicine) return false

      await updateMutation.mutateAsync({
        id: editingMedicine.id,
        payload: values,
      })
      return true
    } catch {
      return false
    }
  }

  const handleApplyFilters = () => {
    setAppliedFilters(draftFilters)
    setPage(1)
  }

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-[#e8ece9]">
      <section className="flex min-h-0 min-w-0 flex-1 flex-col p-4">
        <PageHeader
          title="Quản lý kho thuốc"
          description="Danh sách thuốc dùng khi kê đơn trong lượt khám"
          actions={
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setImportOpen(true)}
              >
                <FileUp className="h-4 w-4" />
                Import Excel
              </Button>
              <Button type="button" onClick={openAddDialog}>
                <Plus className="h-4 w-4" />
                Thêm thuốc
              </Button>
            </div>
          }
        />

        <MedicineFiltersBar
          filters={draftFilters}
          onFiltersChange={setDraftFilters}
          onApply={handleApplyFilters}
        />

        <div className="mt-4 min-h-0 flex-1 overflow-auto">
          <DataTable
            columns={columns}
            data={medicines}
            loading={isLoading}
            classNameTable="border-0 p-0 shadow-none"
            pageIndex={page - 1}
            pageCount={Math.max(meta?.totalPages ?? 0, 1)}
            onPageChange={(nextPageIndex) => setPage(nextPageIndex + 1)}
          />
        </div>
      </section>

      <MedicineDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        mode={dialogMode}
        medicine={editingMedicine}
        onSave={handleSave}
      />

      <MedicineImportDialog open={importOpen} onOpenChange={setImportOpen} />

      <ConfirmDialog
        open={medicineToDelete != null}
        onOpenChange={(open) => {
          if (!open) setMedicineToDelete(null)
        }}
        title="Xóa thuốc"
        message={
          medicineToDelete
            ? `Bạn có chắc muốn xóa "${medicineToDelete.name}"? Đơn thuốc cũ vẫn giữ nguyên, chỉ gỡ liên kết danh mục.`
            : ""
        }
        onConfirm={() => {
          if (!medicineToDelete) return
          deleteMutation.mutate(medicineToDelete.id, {
            onSuccess: () => setMedicineToDelete(null),
          })
        }}
        loading={deleteMutation.isPending}
      />
    </div>
  )
}

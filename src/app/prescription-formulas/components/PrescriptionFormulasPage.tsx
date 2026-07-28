import { useQuery } from "@tanstack/react-query"
import { Plus } from "lucide-react"
import { useMemo, useState } from "react"

import { PageHeader } from "@/components/UiCustom/PageHeader"
import { ConfirmDialog } from "@/components/UiCustom/DialogConfirm"
import { DataTable } from "@/components/data-table/data-table"
import { Button } from "@/components/ui/button"
import { MODAL_MODE, type ModalModeType } from "@/constants/common"
import { DEFAULT_LIMIT } from "@/types/pagination"
import { useDeletePrescriptionFormulaMutation } from "../hooks/use-prescription-formula-mutations"
import { prescriptionFormulaListQueryOptions } from "../queries/prescription-formula-query"
import type { PrescriptionFormula } from "../types/prescription-formula"
import { FormulaDetailDialog } from "./FormulaDetailDialog"
import { FormulaFiltersBar } from "./FormulaFiltersBar"
import { FormulaFormDialog } from "./FormulaFormDialog"
import { createFormulaTableColumns } from "./formula-table-columns"

export function PrescriptionFormulasPage() {
  const [page, setPage] = useState(1)
  const [draftSearch, setDraftSearch] = useState("")
  const [appliedSearch, setAppliedSearch] = useState("")

  const [formOpen, setFormOpen] = useState(false)
  const [formMode, setFormMode] = useState<ModalModeType>(MODAL_MODE.ADD)
  const [editingFormula, setEditingFormula] =
    useState<PrescriptionFormula | null>(null)

  const [detailOpen, setDetailOpen] = useState(false)
  const [viewingFormula, setViewingFormula] =
    useState<PrescriptionFormula | null>(null)
  const [formulaToDelete, setFormulaToDelete] =
    useState<PrescriptionFormula | null>(null)

  const { data: allFormulas = [], isLoading } = useQuery(
    prescriptionFormulaListQueryOptions()
  )
  const deleteMutation = useDeletePrescriptionFormulaMutation()

  const filtered = useMemo(() => {
    const keyword = appliedSearch.trim().toLowerCase()
    if (!keyword) return allFormulas
    return allFormulas.filter((formula) =>
      formula.name.toLowerCase().includes(keyword)
    )
  }, [allFormulas, appliedSearch])

  const totalPages = Math.max(1, Math.ceil(filtered.length / DEFAULT_LIMIT))
  const safePage = Math.min(page, totalPages)
  const rowOffset = (safePage - 1) * DEFAULT_LIMIT
  const pageData = filtered.slice(rowOffset, rowOffset + DEFAULT_LIMIT)

  const columns = useMemo(
    () =>
      createFormulaTableColumns({
        rowOffset,
        onView: (formula) => {
          setViewingFormula(formula)
          setDetailOpen(true)
        },
        onEdit: (formula) => {
          setFormMode(MODAL_MODE.EDIT)
          setEditingFormula(formula)
          setFormOpen(true)
        },
        onDelete: (formula) => setFormulaToDelete(formula),
      }),
    [rowOffset]
  )

  const handleConfirmDelete = () => {
    if (!formulaToDelete) return

    deleteMutation.mutate(formulaToDelete.id, {
      onSuccess: () => setFormulaToDelete(null),
    })
  }

  const openAddDialog = () => {
    setFormMode(MODAL_MODE.ADD)
    setEditingFormula(null)
    setFormOpen(true)
  }

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-[#e8ece9]">
      <section className="flex min-h-0 min-w-0 flex-1 flex-col p-4">
        <PageHeader
          title="Công thức đơn thuốc"
          description="Quản lý công thức cá nhân — dùng lại khi kê đơn cho bệnh nhân"
          actions={
            <Button type="button" onClick={openAddDialog}>
              <Plus className="h-4 w-4" />
              Thêm công thức
            </Button>
          }
        />

        <FormulaFiltersBar
          search={draftSearch}
          onSearchChange={setDraftSearch}
          onApply={() => {
            setAppliedSearch(draftSearch)
            setPage(1)
          }}
        />

        <div className="mt-4 min-h-0 flex-1 overflow-auto">
          <DataTable
            columns={columns}
            data={pageData}
            loading={isLoading}
            classNameTable="border-0 p-0 shadow-none"
            pageIndex={safePage - 1}
            pageCount={totalPages}
            onPageChange={(nextPageIndex) => setPage(nextPageIndex + 1)}
          />
        </div>
      </section>

      <FormulaDetailDialog
        open={detailOpen}
        onOpenChange={setDetailOpen}
        formula={viewingFormula}
      />

      <FormulaFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        mode={formMode}
        formula={editingFormula}
      />

      <ConfirmDialog
        open={formulaToDelete != null}
        onOpenChange={(open) => {
          if (!open) setFormulaToDelete(null)
        }}
        title="Xóa công thức"
        message={
          formulaToDelete
            ? `Bạn có chắc muốn xóa công thức "${formulaToDelete.name}"? Hành động này không thể hoàn tác.`
            : ""
        }
        onConfirm={handleConfirmDelete}
        loading={deleteMutation.isPending}
      />
    </div>
  )
}

import { useEffect, useState } from "react"

import { MedicineCatalogCombobox } from "@/app/medical-records/components/MedicineCatalogCombobox"
import {
  HERB_DECOCTION_ORDER_OPTIONS,
  HERB_DECOCTION_PREP_OPTIONS,
  type HerbDecoctionOrder,
  type HerbDecoctionPrep,
} from "@/app/medical-records/constants/herb-decoction"
import { FormDialog } from "@/components/UiCustom/FormDialog"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { MODAL_MODE, type ModalModeType } from "@/constants/common"
import { mapVisitHerbsToCreatePayload } from "../mappers/map-prescription-formula"
import { useFormulaHerbDraft } from "../hooks/use-formula-herb-draft"
import {
  useCreatePrescriptionFormulaMutation,
  useUpdatePrescriptionFormulaMutation,
} from "../hooks/use-prescription-formula-mutations"
import type { PrescriptionFormula } from "../types/prescription-formula"
import { mapFormulaHerbsToHerbs } from "../utils/map-formula-herbs"

interface FormulaFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: ModalModeType
  formula: PrescriptionFormula | null
}

const fieldLabelClassName =
  "block text-[11px] font-bold text-slate-500 uppercase"

interface HerbSelectFieldProps {
  id: string
  label: string
  value: string
  onValueChange: (value: string) => void
  options: readonly { value: string; label: string }[]
  disabled?: boolean
}

function HerbSelectField({
  id,
  label,
  value,
  onValueChange,
  options,
  disabled,
}: HerbSelectFieldProps) {
  return (
    <div>
      <label htmlFor={id} className={fieldLabelClassName}>
        {label}
      </label>
      <Select value={value} onValueChange={onValueChange} disabled={disabled}>
        <SelectTrigger id={id} className="mt-1 h-8 w-full text-xs shadow-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent position="popper" sideOffset={4}>
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              className="text-xs"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export function FormulaFormDialog({
  open,
  onOpenChange,
  mode,
  formula,
}: FormulaFormDialogProps) {
  const [name, setName] = useState("")
  const [dosage, setDosage] = useState("")
  const draft = useFormulaHerbDraft()
  const createMutation = useCreatePrescriptionFormulaMutation()
  const updateMutation = useUpdatePrescriptionFormulaMutation()

  useEffect(() => {
    if (!open) return

    if (mode === MODAL_MODE.EDIT && formula) {
      setName(formula.name)
      setDosage(formula.dosage ?? "")
      draft.resetAll(mapFormulaHerbsToHerbs(formula.herbs))
      return
    }

    setName("")
    setDosage("")
    draft.resetAll([])
  }, [open, mode, formula?.id])

  const isPending = createMutation.isPending || updateMutation.isPending
  const canSave = name.trim().length > 0 && draft.herbs.length > 0

  const handleSubmit = () => {
    if (!canSave) return

    const payload = {
      name: name.trim(),
      dosage: dosage.trim() || undefined,
      herbs: mapVisitHerbsToCreatePayload(draft.herbs),
    }

    if (mode === MODAL_MODE.ADD) {
      createMutation.mutate(payload, {
        onSuccess: () => onOpenChange(false),
      })
      return
    }

    if (!formula) return

    updateMutation.mutate(
      { id: formula.id, payload },
      { onSuccess: () => onOpenChange(false) }
    )
  }

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title={mode === MODAL_MODE.ADD ? "Thêm công thức" : "Sửa công thức"}
      description="Công thức lưu theo tài khoản của bạn. Giá thuốc không được lưu."
      contentClassName="max-h-[90vh] overflow-y-auto sm:max-w-[800px]"
      footer={
        <>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Hủy
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={!canSave || isPending}
          >
            {isPending ? "Đang lưu..." : "Lưu"}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className={fieldLabelClassName}>Tên công thức</label>
            <input
              className="border-slate-250 mt-1 h-9 w-full rounded-lg border px-3 text-sm"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="VD: TIỂU SÀI HỒ GIA GIẢM"
            />
          </div>
          <div>
            <label className={fieldLabelClassName}>Liều lượng mẫu</label>
            <input
              className="border-slate-250 mt-1 h-9 w-full rounded-lg border px-3 text-sm"
              value={dosage}
              onChange={(e) => setDosage(e.target.value)}
              placeholder="VD: 7 THÁNG x 14 TÚI 150ML"
            />
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 p-3">
          <span className="mb-3 block text-[10px] font-bold text-slate-500 uppercase">
            Dược liệu
          </span>

          <div className="mb-3 space-y-2">
            <div>
              <label className="mb-1 block text-[10px] font-medium text-slate-600">
                Thuốc trong kho
              </label>
              <MedicineCatalogCombobox
                selectedMedicine={draft.selectedMedicine}
                onChange={(medicineId) => {
                  if (!medicineId) {
                    draft.setSelectedMedicine(null)
                    draft.setTempQuantity("")
                  }
                }}
                onSelectMedicine={(medicine) => {
                  draft.setSelectedMedicine(medicine)
                  if (!draft.tempQuantity) draft.setTempQuantity(1)
                }}
              />
            </div>

            <div className="grid grid-cols-2 gap-2 md:grid-cols-4 xl:items-end">
              <div>
                <label className="mb-1 block text-[10px] font-medium text-slate-600">
                  Số lượng
                </label>
                <input
                  type="number"
                  min={0}
                  step="any"
                  placeholder="0"
                  value={draft.tempQuantity}
                  disabled={!draft.selectedMedicine}
                  onChange={(e) => {
                    const next = e.target.value
                    draft.setTempQuantity(next === "" ? "" : Number(next))
                  }}
                  className="border-slate-250 h-8 w-full rounded-lg border px-2.5 text-xs disabled:bg-slate-50"
                />
              </div>

              <div>
                <label className="mb-1 block text-[10px] font-medium text-slate-600">
                  Đơn vị
                </label>
                <div className="border-slate-250 flex h-8 items-center rounded-lg border bg-slate-50 px-2.5 text-xs font-medium text-slate-600">
                  {draft.selectedMedicine?.unit ?? "—"}
                </div>
              </div>

              <HerbSelectField
                id="formula-herb-decoction-order"
                label="Thứ tự sắc"
                value={draft.decoctionOrder}
                onValueChange={(value) =>
                  draft.setDecoctionOrder(value as HerbDecoctionOrder)
                }
                options={HERB_DECOCTION_ORDER_OPTIONS}
                disabled={!draft.selectedMedicine}
              />

              <HerbSelectField
                id="formula-herb-decoction-prep"
                label="Sắc thuốc"
                value={draft.decoctionPrep}
                onValueChange={(value) =>
                  draft.setDecoctionPrep(value as HerbDecoctionPrep)
                }
                options={HERB_DECOCTION_PREP_OPTIONS}
                disabled={!draft.selectedMedicine}
              />
            </div>

            <Button
              type="button"
              size="sm"
              onClick={draft.addHerb}
              disabled={!draft.canAdd}
              className="mt-2"
            >
              Thêm vị
            </Button>
          </div>

          {draft.herbs.length > 0 ? (
            <div className="overflow-hidden rounded-lg border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase">
                  <tr>
                    <th className="px-2.5 py-2">Thuốc</th>
                    <th className="px-2.5 py-2 text-right">SL</th>
                    <th className="hidden px-2.5 py-2 sm:table-cell">
                      Thứ tự sắc
                    </th>
                    <th className="hidden px-2.5 py-2 sm:table-cell">
                      Sắc thuốc
                    </th>
                    <th className="px-2.5 py-2 text-center"> </th>
                  </tr>
                </thead>
                <tbody>
                  {draft.herbs.map((herb, index) => (
                    <tr
                      key={`${herb.medicineId ?? herb.name}-${index}`}
                      className="border-t border-slate-100"
                    >
                      <td className="px-2.5 py-2 font-medium text-slate-800">
                        {herb.name}
                      </td>
                      <td className="px-2.5 py-2 text-right font-mono text-slate-700">
                        {herb.quantity != null && herb.unit
                          ? `${herb.quantity} ${herb.unit}`
                          : herb.weight}
                      </td>
                      <td className="hidden px-2.5 py-2 text-slate-600 sm:table-cell">
                        {herb.decoctionOrder ?? "—"}
                      </td>
                      <td className="hidden px-2.5 py-2 text-slate-600 sm:table-cell">
                        {herb.decoctionPrep ?? "—"}
                      </td>
                      <td className="px-2.5 py-2 text-center">
                        <button
                          type="button"
                          onClick={() => draft.removeHerb(index)}
                          className="cursor-pointer font-bold text-red-500 hover:text-red-700"
                          aria-label={`Xóa ${herb.name}`}
                        >
                          ×
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-[10px] text-slate-400 italic">
              Chưa có vị thuốc nào trong công thức
            </p>
          )}
        </div>
      </div>
    </FormDialog>
  )
}

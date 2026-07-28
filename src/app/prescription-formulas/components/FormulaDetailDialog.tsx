import { FormDialog } from "@/components/UiCustom/FormDialog"
import { HerbPrescriptionTable } from "@/app/medical-records/components/HerbPrescriptionTable"
import { mapFormulaHerbsToHerbs } from "../utils/map-formula-herbs"
import type { PrescriptionFormula } from "../types/prescription-formula"

interface FormulaDetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  formula: PrescriptionFormula | null
}

export function FormulaDetailDialog({
  open,
  onOpenChange,
  formula,
}: FormulaDetailDialogProps) {
  if (!formula) return null

  const herbs = mapFormulaHerbsToHerbs(formula.herbs)

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title={formula.name}
      description={formula.dosage ?? "Chưa có liều lượng mẫu"}
      contentClassName="max-h-[85vh] overflow-y-auto sm:max-w-[720px]"
    >
      <HerbPrescriptionTable herbs={herbs} compact />
    </FormDialog>
  )
}

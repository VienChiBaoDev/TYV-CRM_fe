import { useEffect, useState } from "react"
import { FormDialog } from "@/components/UiCustom/FormDialog"
import { Button } from "@/components/ui/button"
import type { Visit } from "@/app/medical-records/interfaces/types"
import { mapVisitHerbsToCreatePayload } from "../mappers/map-prescription-formula"
import { useCreatePrescriptionFormulaMutation } from "../hooks/use-prescription-formula-mutations"

interface SaveFormulaDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  visit: Visit
}

export function SaveFormulaDialog({
  open,
  onOpenChange,
  visit,
}: SaveFormulaDialogProps) {
  const [name, setName] = useState(visit.prescriptionFormula)
  const [dosage, setDosage] = useState(visit.prescriptionDosage)
  const createMutation = useCreatePrescriptionFormulaMutation()

  useEffect(() => {
    if (!open) return
    setTimeout(() => {
      setName(visit.prescriptionFormula)
      setDosage(visit.prescriptionDosage)
    }, 0)
  }, [open, visit.prescriptionFormula, visit.prescriptionDosage])

  const herbs = visit.herbs ?? []
  const canSave = name.trim().length > 0 && herbs.length > 0

  const handleSubmit = () => {
    if (!canSave) return

    createMutation.mutate(
      {
        name: name.trim(),
        dosage: dosage.trim() || undefined,
        herbs: mapVisitHerbsToCreatePayload(herbs),
      },
      {
        onSuccess: () => onOpenChange(false),
      }
    )
  }

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Lưu công thức"
      description="Công thức sẽ được lưu vào tài khoản của bạn để dùng lại khi kê đơn."
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
            disabled={!canSave || createMutation.isPending}
          >
            {createMutation.isPending ? "Đang lưu..." : "Lưu"}
          </Button>
        </>
      }
    >
      <div className="space-y-3">
        <div>
          <label className="mb-1 block text-xs font-bold text-slate-600 uppercase">
            Tên công thức
          </label>
          <input
            className="border-slate-250 h-9 w-full rounded-lg border px-3 text-sm"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="VD: TIỂU SÀI HỒ GIA GIẢM"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-bold text-slate-600 uppercase">
            Liều lượng mẫu (tuỳ chọn)
          </label>
          <input
            className="border-slate-250 h-9 w-full rounded-lg border px-3 text-sm"
            value={dosage}
            onChange={(e) => setDosage(e.target.value)}
            placeholder="VD: 7 THÁNG x 14 TÚI 150ML"
          />
        </div>

        <p className="text-xs text-slate-500">
          Sẽ lưu <strong>{herbs.length}</strong> vị thuốc (không lưu giá).
        </p>

        {herbs.length === 0 && (
          <p className="text-xs text-red-600">
            Lần khám này chưa có thuốc — không thể lưu công thức.
          </p>
        )}
      </div>
    </FormDialog>
  )
}

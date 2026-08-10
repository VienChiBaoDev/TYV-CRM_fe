import { FileUp } from "lucide-react"
import React, { useRef, useState } from "react"

import { DialogCommon } from "@/components/UiCustom/DialogCommon"
import { Button } from "@/components/ui/button"
import { useImportMedicinesMutation } from "../hooks/use-medicine-mutations"
import type { MedicineImportParseResult } from "../types/medicine-import"
import {
  downloadMedicineImportTemplate,
  parseMedicineExcel,
} from "../utils/parse-medicine-excel"

interface MedicineImportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MedicineImportDialog({
  open,
  onOpenChange,
}: MedicineImportDialogProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [parseResult, setParseResult] =
    useState<MedicineImportParseResult | null>(null)
  const importMutation = useImportMedicinesMutation()

  const reset = () => {
    setParseResult(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) reset()
    onOpenChange(nextOpen)
  }

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const result = await parseMedicineExcel(file)
      setParseResult(result)
    } catch (error) {
      setParseResult({
        validRows: [],
        errors: [
          {
            row: 0,
            message:
              error instanceof Error ? error.message : "Không đọc được file",
          },
        ],
      })
    }
  }

  const handleImport = async () => {
    if (!parseResult || parseResult.validRows.length === 0) return

    const result = await importMutation.mutateAsync(
      parseResult.validRows.map(({ name, unit, unitPrice, category }) => ({
        name,
        unit,
        unitPrice,
        category,
      }))
    )

    if (result.errors.length === 0) {
      handleOpenChange(false)
    } else {
      setParseResult((prev) =>
        prev
          ? {
              ...prev,
              errors: [...prev.errors, ...result.errors],
            }
          : prev
      )
    }
  }

  const validCount = parseResult?.validRows.length ?? 0
  const errorCount = parseResult?.errors.length ?? 0

  return (
    <DialogCommon
      open={open}
      onOpenChange={handleOpenChange}
      title="Import thuốc từ Excel"
      submitText="Import"
      onSubmit={handleImport}
      loading={importMutation.isPending}
      contentClassName="max-h-[90vh] overflow-y-auto sm:max-w-[720px]"
    >
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={downloadMedicineImportTemplate}
          >
            Tải file mẫu
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
          >
            <FileUp className="h-4 w-4" />
            Chọn file Excel
          </Button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        <p className="text-sm text-slate-500">
          Cột bắt buộc: <strong>Tên thuốc</strong>, <strong>Đơn vị</strong>,{" "}
          <strong>Giá / đơn vị</strong>. Loại thuốc có thể để trống.
        </p>

        {parseResult ? (
          <div className="space-y-3 rounded-lg border border-gray-200 bg-white p-3 text-sm">
            <p>
              Hợp lệ: <strong>{validCount}</strong> dòng — Lỗi:{" "}
              <strong>{errorCount}</strong> dòng
            </p>

            {validCount > 0 ? (
              <div className="max-h-40 overflow-auto rounded border">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-2 py-1">#</th>
                      <th className="px-2 py-1">Tên thuốc</th>
                      <th className="px-2 py-1">Đơn vị</th>
                      <th className="px-2 py-1">Giá</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parseResult.validRows.slice(0, 10).map((row) => (
                      <tr key={row.rowNumber} className="border-t">
                        <td className="px-2 py-1">{row.rowNumber}</td>
                        <td className="px-2 py-1">{row.name}</td>
                        <td className="px-2 py-1">{row.unit}</td>
                        <td className="px-2 py-1">{row.unitPrice}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {validCount > 10 ? (
                  <p className="px-2 py-1 text-xs text-slate-400">
                    ... và {validCount - 10} dòng khác
                  </p>
                ) : null}
              </div>
            ) : null}

            {errorCount > 0 ? (
              <ul className="max-h-32 list-disc space-y-1 overflow-auto pl-5 text-red-600">
                {parseResult.errors.map((error) => (
                  <li key={`${error.row}-${error.message}`}>
                    Dòng {error.row || "?"}: {error.message}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        ) : null}
      </div>
    </DialogCommon>
  )
}

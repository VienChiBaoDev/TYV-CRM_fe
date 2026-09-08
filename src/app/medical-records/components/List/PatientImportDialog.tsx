import { FileUp } from "lucide-react"
import React, { useRef, useState } from "react"

import { DialogCommon } from "@/components/UiCustom/DialogCommon"
import { Button } from "@/components/ui/button"
import { useImportPatientsMutation } from "../../hooks/use-patient-mutations"
import type { PatientImportParseResult } from "../../interfaces/patient-import"
import {
  downloadPatientImportTemplate,
  parsePatientExcel,
} from "../../utils/parse-patient-excel"

interface PatientImportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PatientImportDialog({
  open,
  onOpenChange,
}: PatientImportDialogProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [parseResult, setParseResult] =
    useState<PatientImportParseResult | null>(null)
  const [batchProgress, setBatchProgress] = useState<{
    current: number
    total: number
  } | null>(null)

  const importMutation = useImportPatientsMutation()

  const reset = () => {
    setParseResult(null)
    setBatchProgress(null)
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
      const result = await parsePatientExcel(file)
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

    const items = parseResult.validRows.map(
      ({
        fullName,
        phone,
        gender,
        clinicCode,
        address,
        birthDate,
        createdAt,
      }) => ({
        fullName,
        phone,
        gender,
        clinicCode,
        address,
        birthDate,
        createdAt,
      })
    )

    setBatchProgress(null)

    try {
      const result = await importMutation.mutateAsync({
        items,
        onProgress: ({ currentBatch, totalBatches }) => {
          setBatchProgress({ current: currentBatch, total: totalBatches })
        },
      })

      const allErrors = [...parseResult.errors, ...result.errors]

      if (allErrors.length === 0) {
        handleOpenChange(false)
      } else {
        setParseResult((prev) => (prev ? { ...prev, errors: allErrors } : prev))
      }
    } finally {
      setBatchProgress(null)
    }
  }

  const validCount = parseResult?.validRows.length ?? 0
  const errorCount = parseResult?.errors.length ?? 0

  return (
    <DialogCommon
      open={open}
      onOpenChange={handleOpenChange}
      title="Import khách hàng từ Excel"
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
            onClick={downloadPatientImportTemplate}
          >
            Tải file mẫu
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={importMutation.isPending}
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
          Cột bắt buộc: <strong>Khách hàng</strong>, <strong>Điện thoại</strong>
          , <strong>Giới tính</strong>, <strong>Chi nhánh</strong>. Ngày sinh có
          thể để trống.
        </p>

        {importMutation.isPending && batchProgress ? (
          <p className="text-sm font-medium text-emerald-700">
            Đang import batch {batchProgress.current}/{batchProgress.total}...
          </p>
        ) : null}

        {parseResult ? (
          <div className="space-y-3 rounded-lg border border-gray-200 bg-white p-3 text-sm">
            <p>
              Hợp lệ: <strong>{validCount}</strong> dòng — Lỗi parse:{" "}
              <strong>{errorCount}</strong> dòng
            </p>

            {validCount > 0 ? (
              <div className="max-h-40 overflow-auto rounded border">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-2 py-1">#</th>
                      <th className="px-2 py-1">Khách hàng</th>
                      <th className="px-2 py-1">SĐT</th>
                      <th className="px-2 py-1">Giới tính</th>
                      <th className="px-2 py-1">Chi nhánh</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parseResult.validRows.slice(0, 10).map((row) => (
                      <tr key={row.rowNumber} className="border-t">
                        <td className="px-2 py-1">{row.rowNumber}</td>
                        <td className="px-2 py-1">{row.fullName}</td>
                        <td className="px-2 py-1">{row.phone}</td>
                        <td className="px-2 py-1">{row.gender}</td>
                        <td className="px-2 py-1">{row.clinicCode}</td>
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

import * as XLSX from "xlsx"
import { MEDICINE_UNIT_FORM_OPTIONS } from "../data/medicine-units"
import type { MedicineImportParseResult } from "../types/medicine-import"

interface ParsedColumns {
  name?: string
  unit?: string
  unitPrice?: string | number
  category?: string
}

const VALID_UNITS = new Set<string>(
  MEDICINE_UNIT_FORM_OPTIONS.map((option) => option.value)
)

export const HEADER_ALIASES: Record<string, keyof ParsedColumns> = {
  "tên thuốc": "name",
  "ten thuoc": "name",
  name: "name",
  "đơn vị": "unit",
  "don vi": "unit",
  unit: "unit",
  "giá / đơn vị": "unitPrice",
  "gia / don vi": "unitPrice",
  "giá 1 đơn vị": "unitPrice",
  unit_price: "unitPrice",
  "loại thuốc": "category",
  "loai thuoc": "category",
  category: "category",
}

function normalizeHeader(value: unknown): string {
  return String(value ?? "")
    .trim()
    .toLowerCase()
}

function parseUnitPrice(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value
  const raw = String(value ?? "")
    .trim()
    .replace(/[^\d.,-]/g, "")
    .replace(/\./g, "")
    .replace(",", ".")
  const parsed = Number(raw)
  return Number.isFinite(parsed) ? parsed : null
}

export function parseMedicineExcel(
  file: File
): Promise<MedicineImportParseResult> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (event) => {
      try {
        const buffer = event.target?.result
        if (!(buffer instanceof ArrayBuffer)) {
          reject(new Error("Không đọc được file"))
          return
        }

        const workbook = XLSX.read(buffer, { type: "array" })
        const sheet = workbook.Sheets[workbook.SheetNames[0]]
        const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
          defval: "",
        })

        const validRows: MedicineImportParseResult["validRows"] = []
        const errors: MedicineImportParseResult["errors"] = []

        // Dùng để lặp qua từng dòng của file Excel
        rows.forEach((row, index) => {
          const rowNumber = index + 2 // dòng 1 là header
          const mapped: ParsedColumns = {}

          // Map headers to columns
          Object.entries(row).forEach(([header, value]) => {
            // Map header to columns key
            const key = HEADER_ALIASES[normalizeHeader(header)]
            // Map value to columns key
            if (key) {
              mapped[key] = value as never
            }
          })

          const name = String(mapped.name ?? "").trim()
          const unit = String(mapped.unit ?? "").trim()
          const unitPrice = parseUnitPrice(mapped.unitPrice)
          const category = String(mapped.category ?? "").trim()

          if (!name && !unit && unitPrice == null && !category) return

          if (!name && !unit && unitPrice == null && !category) return
          if (!name) {
            errors.push({ row: rowNumber, message: "Thiếu tên thuốc" })
            return
          }
          if (!unit) {
            errors.push({ row: rowNumber, message: "Thiếu đơn vị" })
            return
          }
          if (!VALID_UNITS.has(unit)) {
            errors.push({
              row: rowNumber,
              message: `Đơn vị không hợp lệ: "${unit}"`,
            })
            return
          }
          if (unitPrice == null || unitPrice < 0) {
            errors.push({ row: rowNumber, message: "Giá không hợp lệ" })
            return
          }
          // Thêm dòng vào danh sách hợp lệ
          validRows.push({
            rowNumber,
            name,
            unit,
            unitPrice,
            category: category || undefined,
          })
        })
        // Trả về kết quả phân tích
        resolve({ validRows, errors })
      } catch {
        reject(new Error("File Excel không hợp lệ"))
      }
    }
    // Xử lý lỗi khi đọc file
    reader.onerror = () => reject(new Error("Không đọc được file"))
    // Đọc file sao lại đặt ở cuối cùng để tránh lỗi khi đọc file
    // vì khi đọc file sẽ gọi đến onload
    // nếu đọc file thành công thì onload sẽ được gọi
    // nếu đọc file thất bại thì onerror sẽ được gọi
    reader.readAsArrayBuffer(file)
  })
}

export function downloadMedicineImportTemplate(): void {
  const worksheet = XLSX.utils.aoa_to_sheet([
    ["Tên thuốc", "Đơn vị", "Giá / đơn vị", "Loại thuốc"],
    ["Sài hồ", "g", 500, "Thảo dược"],
    ["Đương quy", "g", 1200, ""],
  ])
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, "Thuoc")
  XLSX.writeFile(workbook, "mau-import-thuoc.xlsx")
}

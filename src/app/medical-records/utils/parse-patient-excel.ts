import type { Gender } from "@/app/medical-records/services/patient-api"
import * as XLSX from "xlsx"
import type { PatientImportParseResult } from "../interfaces/patient-import"

interface ParsedColumns {
  fullName?: string
  phone?: string
  gender?: string
  clinicCode?: string
  address?: string
  birthDate?: unknown
  createdAt?: unknown
}

const HEADER_ALIASES: Record<string, keyof ParsedColumns> = {
  "khách hàng": "fullName",
  "khach hang": "fullName",
  "họ và tên": "fullName",
  "ho va ten": "fullName",
  "điện thoại": "phone",
  "dien thoai": "phone",
  "số điện thoại": "phone",
  "so dien thoai": "phone",
  "giới tính": "gender",
  "gioi tinh": "gender",
  "chi nhánh": "clinicCode",
  "chi nhanh": "clinicCode",
  "địa chỉ": "address",
  "dia chi": "address",
  "ngày sinh": "birthDate",
  "ngay sinh": "birthDate",
  "ngày tạo": "createdAt",
  "ngay tao": "createdAt",
  "ngày tạo hồ sơ": "createdAt",
  "ngay tao ho so": "createdAt",
}

function normalizeHeader(value: unknown): string {
  return String(value ?? "")
    .trim()
    .toLowerCase()
}

function parseGender(value: unknown): Gender | null {
  const raw = String(value ?? "")
    .trim()
    .toLowerCase()
  if (raw === "nam" || raw === "male" || raw === "m") return "MALE"
  if (raw === "nữ" || raw === "nu" || raw === "female" || raw === "f")
    return "FEMALE"
  return null
}

function parseExcelDateToIso(value: unknown): string | undefined {
  if (value === null || value === undefined || value === "") return undefined

  if (typeof value === "number" && Number.isFinite(value)) {
    const parsed = XLSX.SSF.parse_date_code(value)
    if (!parsed) return undefined
    const mm = String(parsed.m).padStart(2, "0")
    const dd = String(parsed.d).padStart(2, "0")
    return `${parsed.y}-${mm}-${dd}`
  }

  const text = String(value).trim()
  const slash = text.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
  if (slash) {
    const [, dd, mm, yyyy] = slash
    return `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`
  }

  const dash = text.match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/)
  if (dash) {
    const [, dd, mm, yyyy] = dash
    return `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`
  }

  const iso = text.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (iso) return iso[0]

  return undefined
}

function normalizePhone(value: unknown): string {
  return String(value ?? "")
    .trim()
    .replace(/\s+/g, "")
}

export function parsePatientExcel(
  file: File
): Promise<PatientImportParseResult> {
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

        const validRows: PatientImportParseResult["validRows"] = []
        const errors: PatientImportParseResult["errors"] = []

        rows.forEach((row, index) => {
          const rowNumber = index + 2
          const mapped: ParsedColumns = {}

          Object.entries(row).forEach(([header, value]) => {
            const key = HEADER_ALIASES[normalizeHeader(header)]
            if (key) mapped[key] = value as never
          })

          const fullName = String(mapped.fullName ?? "").trim()
          const phone = normalizePhone(mapped.phone)
          const gender = parseGender(mapped.gender)
          const clinicCode = String(mapped.clinicCode ?? "").trim()
          const address = String(mapped.address ?? "").trim()
          const birthDate = parseExcelDateToIso(mapped.birthDate)
          const createdAt = parseExcelDateToIso(mapped.createdAt)

          if (!fullName && !phone && !clinicCode) return

          if (!fullName) {
            errors.push({ row: rowNumber, message: "Thiếu tên khách hàng" })
            return
          }
          if (!phone) {
            errors.push({ row: rowNumber, message: "Thiếu số điện thoại" })
            return
          }
          if (!gender) {
            errors.push({
              row: rowNumber,
              message: "Giới tính không hợp lệ (Nam/Nữ)",
            })
            return
          }
          if (!clinicCode) {
            errors.push({ row: rowNumber, message: "Thiếu chi nhánh" })
            return
          }
          if (mapped.birthDate && !birthDate) {
            errors.push({ row: rowNumber, message: "Ngày sinh không hợp lệ" })
            return
          }
          if (mapped.createdAt && !createdAt) {
            errors.push({
              row: rowNumber,
              message: "Ngày tạo hồ sơ không hợp lệ",
            })
            return
          }

          validRows.push({
            rowNumber,
            fullName,
            phone,
            gender,
            clinicCode,
            address: address || undefined,
            birthDate,
            createdAt,
          })
        })

        resolve({ validRows, errors })
      } catch {
        reject(new Error("File Excel không hợp lệ"))
      }
    }

    reader.onerror = () => reject(new Error("Không đọc được file"))
    reader.readAsArrayBuffer(file)
  })
}

export function downloadPatientImportTemplate(): void {
  const worksheet = XLSX.utils.aoa_to_sheet([
    [
      "Khách hàng",
      "Ngày sinh",
      "Điện thoại",
      "Địa chỉ",
      "Chi nhánh",
      "Giới tính",
      "Ngày tạo hồ sơ",
    ],
    [
      "Nguyễn Văn An",
      "15/03/1990",
      "0901234567",
      "12 Hàng Bông, HN",
      "NHAN_HOA",
      "Nam",
      "20/11/2023",
    ],
  ])
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, "KhachHang")
  XLSX.writeFile(workbook, "mau-import-khach-hang.xlsx")
}

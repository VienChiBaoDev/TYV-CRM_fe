import type { TreatmentService } from "@/app/treatment-services/types/treatment-service"

export function getHighestCatalogPrice(service: TreatmentService): number {
  return Math.max(service.price, service.alternatePrice)
}

export function applyCatalogPricing(service: TreatmentService) {
  const unitPrice = getHighestCatalogPrice(service)
  const unitPriceAfterVat =
    service.maxPriceVat != null && service.maxPriceVat > 0
      ? service.maxPriceVat
      : unitPrice
  const vatAmount = Math.max(0, unitPriceAfterVat - unitPrice)
  const vatPercent =
    unitPrice > 0 ? Math.round((vatAmount / unitPrice) * 10000) / 100 : 0

  return {
    unitPrice,
    vatPercent,
    vatAmount,
    unitPriceAfterVat,
    treatmentCount: service.treatmentCount ?? 0,
    expiryDays: service.expiryDays,
    note: service.note ?? "",
  }
}

export function recalculateFromVatPercent(
  unitPrice: number,
  vatPercent: number
): { vatAmount: number; unitPriceAfterVat: number } {
  const vatAmount = Math.round((unitPrice * vatPercent) / 100)
  return {
    vatAmount,
    unitPriceAfterVat: unitPrice + vatAmount,
  }
}

export function calculatePatientServiceTotal(params: {
  unitPriceAfterVat: number
  quantity: number
  discount: number
}): number {
  const subtotal = params.unitPriceAfterVat * params.quantity
  return Math.max(0, subtotal - params.discount)
}

export function formatExpiryDateFromDays(expiryDays?: number): string {
  if (!expiryDays || expiryDays <= 0) return ""

  const date = new Date()
  date.setDate(date.getDate() + expiryDays)
  return date.toISOString().slice(0, 10)
}

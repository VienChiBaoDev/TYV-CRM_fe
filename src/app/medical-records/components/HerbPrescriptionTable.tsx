import type { Herb } from "@/app/medical-records/interfaces/types"
import {
  getHerbLineTotal,
  getPrescriptionHerbsTotal,
  hasPricedHerbs,
} from "@/app/medical-records/utils/herb-pricing"
import { formatPrice } from "@/app/treatment-services/utils/format-price"
import { cn } from "@/lib/utils"

interface HerbPrescriptionTableProps {
  herbs: Herb[]
  emptyMessage?: string
  className?: string
  compact?: boolean
}

export function HerbPrescriptionTable({
  herbs,
  emptyMessage = "Chưa có chỉ định bốc thuốc.",
  className,
  compact = false,
}: HerbPrescriptionTableProps) {
  if (herbs.length === 0) {
    return (
      <p className={cn("text-[11px] text-slate-400 italic", className)}>
        {emptyMessage}
      </p>
    )
  }

  const showPricing = hasPricedHerbs(herbs)
  const prescriptionTotal = getPrescriptionHerbsTotal(herbs)

  if (!showPricing) {
    return (
      <div
        className={cn(
          "grid grid-cols-2 gap-3 sm:grid-cols-3",
          compact && "gap-2 sm:grid-cols-4",
          className
        )}
      >
        {herbs.map((herb, index) => (
          <div
            key={`${herb.name}-${index}`}
            className="border-amber-201/40 shadow-3xs flex items-center justify-between rounded-lg border bg-white p-2"
          >
            <span className="text-slate-755 font-semibold">{herb.name}</span>
            <span className="rounded bg-emerald-50 px-1.5 py-0.5 font-mono text-[10px] font-bold text-emerald-700">
              {herb.weight}
            </span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className={cn("overflow-hidden rounded-lg border border-slate-200", className)}>
      <table className="w-full text-left text-xs">
        <thead className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase">
          <tr>
            <th className="px-2.5 py-2">Thuốc</th>
            <th className="px-2.5 py-2 text-right">SL</th>
            {!compact && (
              <th className="hidden px-2.5 py-2 text-right sm:table-cell">
                Đơn giá
              </th>
            )}
            <th className="px-2.5 py-2 text-right">Thành tiền</th>
          </tr>
        </thead>
        <tbody>
          {herbs.map((herb, index) => {
            const lineTotal = getHerbLineTotal(herb)

            return (
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
                {!compact && (
                  <td className="hidden px-2.5 py-2 text-right text-slate-600 sm:table-cell">
                    {herb.unitPrice != null
                      ? `${formatPrice(herb.unitPrice)} đ`
                      : "—"}
                  </td>
                )}
                <td className="px-2.5 py-2 text-right font-semibold text-emerald-800">
                  {lineTotal != null ? `${formatPrice(lineTotal)} đ` : "—"}
                </td>
              </tr>
            )
          })}
        </tbody>
        <tfoot>
          <tr className="border-t border-slate-200 bg-emerald-50/60">
            <td
              colSpan={compact ? 2 : 3}
              className="px-2.5 py-2 text-right text-[10px] font-bold text-slate-600 uppercase"
            >
              Tổng thanh toán
            </td>
            <td className="px-2.5 py-2 text-right text-sm font-bold text-emerald-800">
              {formatPrice(prescriptionTotal)} đ
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}

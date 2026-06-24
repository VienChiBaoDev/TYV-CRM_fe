import { Edit, Heart, Activity, Info, Leaf, Eye } from "lucide-react"
import { useMemo } from "react"
import { useMedicalRecordContext } from "@/app/medical-records/hooks/use-medical-record-context"
import { ClinicalImageZone } from "@/app/medical-records/components/ClinicalImageZone"
import type { ClinicalImage } from "@/app/medical-records/interfaces/types"
import { CLINICAL_IMAGE_CATEGORY_LABELS } from "@/app/medical-records/constants/clinical-image"
import type { ClinicalImageCategory } from "@/app/medical-records/constants/clinical-image"

const CLINICAL_IMAGE_SECTIONS: ClinicalImageCategory[] = [
  "DIAGNOSIS",
  "LAB_RESULT",
  "OTHER",
]

function createEmptyClinicalImagesByCategory(): Record<
  ClinicalImageCategory,
  ClinicalImage[]
> {
  return {
    DIAGNOSIS: [],
    LAB_RESULT: [],
    OTHER: [],
  }
}

export default function VisitDetails() {
  const {
    activeVisit,
    openEditVisitModal,
    handleClinicalImageUpload,
    handleClinicalImageDelete,
    isClinicalImageBusy,
    clinicalImageError,
  } = useMedicalRecordContext()

  const imagesByCategory = useMemo(() => {
    const grouped = createEmptyClinicalImagesByCategory()

    for (const image of activeVisit?.clinicalImages ?? []) {
      grouped[image.category].push(image)
    }

    return grouped
  }, [activeVisit?.id, activeVisit?.clinicalImages])

  if (!activeVisit) return null

  return (
    <section className="relative" id="current-visit-details">
      <div className="relative overflow-hidden rounded-2xl border border-slate-200/60 bg-white p-6 pl-6 shadow-xs lg:p-8 lg:pl-10">
        <div
          className={`absolute top-0 bottom-0 left-0 w-1.5 ${
            activeVisit.status === "Cần TD"
              ? "bg-amber-500"
              : activeVisit.status === "Online"
                ? "bg-blue-600"
                : "bg-emerald-700"
          }`}
        ></div>

        <div className="mb-5 flex flex-col justify-between gap-4 border-b border-slate-100 pb-5 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-display text-slate-850 text-lg font-bold tracking-tight">
                Lần khám {activeVisit.visitNumber} – {activeVisit.title}
              </h4>
              <span className="font-mono text-xs font-semibold text-slate-500">
                ({activeVisit.date})
              </span>
            </div>

            <p className="mt-1 text-xs text-slate-500">
              <span className="font-bold text-slate-600">
                {activeVisit.doctor}
              </span>{" "}
              · Giao thức:{" "}
              <span className="font-semibold text-emerald-800">
                {activeVisit.mode}
              </span>{" "}
              · Địa điểm chẩn trị:{" "}
              <span className="font-medium">{activeVisit.location}</span>
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <span
              className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                activeVisit.status === "Kế hoạch"
                  ? "bg-slate-100 text-slate-600"
                  : "bg-emerald-55 border border-emerald-100/60 text-emerald-700"
              }`}
            >
              {activeVisit.status === "Kế hoạch"
                ? "Chưa kiểm tra"
                : "● Hoàn tất"}
            </span>

            <button
              id="edit-active-visit-btn"
              onClick={openEditVisitModal}
              className="border-slate-250 inline-flex cursor-pointer items-center gap-1 rounded-lg border p-1 px-3 text-xs font-bold text-slate-700 transition-all hover:bg-slate-50"
            >
              <Edit className="text-slate-550 h-3.5 w-3.5" />
              Sửa
            </button>
          </div>
        </div>

        {activeVisit.bloodPressure !== "--" && (
          <div
            className="mb-6 flex flex-wrap items-center gap-4"
            id="vitals-badges"
          >
            <div className="flex items-center gap-3 rounded-xl border border-slate-200/60 bg-slate-50 px-4 py-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-50 text-red-500">
                <Heart className="h-4 w-4 fill-current" />
              </div>
              <div>
                <p className="font-mono text-base leading-tight font-bold tracking-tight text-slate-800">
                  {activeVisit.bloodPressure}
                </p>
                <p className="text-[9px] font-bold tracking-wider text-slate-400">
                  HA (MMHG)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-slate-200/60 bg-slate-50 px-4 py-2">
              <div className="flex h-8 w-8 animate-pulse items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                <Activity className="h-4 w-4" />
              </div>
              <div>
                <p className="font-mono text-base leading-tight font-bold tracking-tight text-slate-800">
                  {activeVisit.pulse}
                </p>
                <p className="text-[9px] font-bold tracking-wider text-slate-400">
                  MẠCH/PHÚT
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-7">
            <div id="symptoms-block" className="space-y-2">
              <h5 className="flex items-center gap-1.5 text-[11px] font-extrabold tracking-wider text-[#1b5e3a] uppercase">
                <Info className="h-3.5 w-3.5" /> Triệu chứng & bệnh sử
              </h5>
              <div className="rounded-xl border border-slate-200/50 bg-slate-50 p-4 font-sans text-xs leading-relaxed text-slate-700 shadow-2xs">
                {activeVisit.symptoms || (
                  <span className="text-slate-405 italic">
                    Chưa điền thông tin triệu chứng lâm sàng.
                  </span>
                )}
              </div>
            </div>

            <div id="pulse-analysis-block" className="space-y-2">
              <h5 className="flex items-center gap-1.5 text-[11px] font-extrabold tracking-wider text-[#1b5e3a] uppercase">
                <Activity className="h-3.5 w-3.5" /> Mạch chẩn (Tứ chẩn)
              </h5>

              <div className="space-y-2.5 rounded-xl border border-slate-200/50 bg-slate-50 p-4 text-xs shadow-2xs">
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                  <div>
                    <span className="block font-bold text-slate-800">M Tả</span>
                    <span className="text-slate-650 text-[11px]">
                      {activeVisit.pulseDiagnosis.ta || "Chưa bắt mạch"}
                    </span>
                  </div>
                  <div>
                    <span className="block font-bold text-slate-800">
                      M Hữu
                    </span>
                    <span className="text-slate-650 text-[11px]">
                      {activeVisit.pulseDiagnosis.huu || "Chưa bắt mạch"}
                    </span>
                  </div>
                  <div>
                    <span className="block font-bold text-slate-800">Bụng</span>
                    <span className="text-slate-650 text-[11px]">
                      {activeVisit.pulseDiagnosis.bung || "Chưa ấn chẩn"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div id="herbs-prescription-block" className="space-y-2">
              <div className="flex items-center justify-between">
                <h5 className="flex items-center gap-1.5 text-[11px] font-extrabold tracking-wider text-[#1b5e3a] uppercase">
                  <Leaf className="h-3.5 w-3.5 text-lime-600" /> Đơn thuốc &
                  thảo dược Đông Y
                </h5>
                {activeVisit.prescriptionDosage && (
                  <span className="rounded border border-emerald-100 bg-emerald-50 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-800">
                    {activeVisit.prescriptionDosage}
                  </span>
                )}
              </div>

              <div className="space-y-4 rounded-xl border border-amber-200/50 bg-amber-50/40 p-4 text-xs shadow-2xs">
                <div className="flex items-center justify-between border-b border-amber-100 pb-2">
                  <span className="text-sm font-extrabold tracking-tight text-amber-900">
                    🫖 {activeVisit.prescriptionFormula}
                  </span>
                  <span className="text-[10px] font-semibold text-amber-700/80 uppercase">
                    Đơn trị liệu
                  </span>
                </div>

                {activeVisit.herbs && activeVisit.herbs.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {activeVisit.herbs.map((herb, idx) => (
                      <div
                        key={idx}
                        className="border-amber-201/40 shadow-3xs flex items-center justify-between rounded-lg border bg-white p-2"
                      >
                        <span className="text-slate-755 font-semibold">
                          {herb.name}
                        </span>
                        <span className="rounded bg-emerald-50 px-1.5 py-0.5 font-mono text-[10px] font-bold text-emerald-700">
                          {herb.weight}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-400 italic">
                    Không có đơn thuốc kê cho lần khám này.
                  </p>
                )}
              </div>
            </div>

            {activeVisit.labResults && (
              <div id="lab-results-block" className="space-y-2">
                <h5 className="flex items-center gap-1.5 text-[11px] font-extrabold tracking-wider text-[#1b5e3a] uppercase">
                  Kết quả Lab
                </h5>
                <div className="rounded-xl border border-slate-200/50 bg-slate-50 p-4 text-xs leading-relaxed text-slate-700 shadow-2xs">
                  {activeVisit.labResults}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6 lg:col-span-5">
            <div id="clinical-pictures" className="space-y-2">
              <h5 className="flex items-center gap-1.5 text-[11px] font-extrabold tracking-wider text-[#1b5e3a] uppercase">
                <Eye className="text-indigo-650 h-3.5 w-3.5" /> Hình ảnh lâm
                sàng
              </h5>

              {clinicalImageError && (
                <p className="text-xs text-red-600">{clinicalImageError}</p>
              )}

              <div className="space-y-3">
                {CLINICAL_IMAGE_SECTIONS.map((category) => (
                  <ClinicalImageZone
                    key={category}
                    category={category}
                    sectionLabel={CLINICAL_IMAGE_CATEGORY_LABELS[category]}
                    images={imagesByCategory[category]}
                    isUploading={isClinicalImageBusy}
                    onUpload={handleClinicalImageUpload}
                    onDelete={handleClinicalImageDelete}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

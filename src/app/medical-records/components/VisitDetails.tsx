import { Edit, Heart, Activity, Info, Leaf, Eye, Trash2 } from "lucide-react"
import { useMedicalRecordContext } from "@/app/medical-records/hooks/use-medical-record-context"

export default function VisitDetails() {
  const {
    activeVisit,
    openEditVisitModal,
    deleteClinicalImage,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    isDragging,
    fileInputRef,
    handleImageUploaded,
    triggerImageUpload,
  } = useMedicalRecordContext()

  if (!activeVisit) return null
  return (
    <section className="relative" id="current-visit-details">
      {/* Visual timeline node anchor icon next to card on large displays */}
      {/* <div className="bg-emerald-850 absolute top-6 left-[-22px] z-10 hidden h-11 w-11 items-center justify-center rounded-full border-4 border-[#f3f6f4] font-bold text-white shadow-md select-none lg:flex">
        {activeVisit.visitNumber}
      </div> */}

      <div className="relative overflow-hidden rounded-2xl border border-slate-200/60 bg-white p-6 pl-6 shadow-xs lg:p-8 lg:pl-10">
        {/* Internal Left visual layout borderline mimicking point theme color */}
        <div
          className={`absolute top-0 bottom-0 left-0 w-1.5 ${
            activeVisit.status === "Cần TD"
              ? "bg-amber-500"
              : activeVisit.status === "Online"
                ? "bg-blue-600"
                : "bg-emerald-700"
          }`}
        ></div>

        {/* Visit header elements */}
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

          {/* Completion statuses */}
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

        {/* High vital card statistics indicator boxes */}
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

        {/* Deep Clinical Detail Content split column layout */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* LEFT CLINICAL SIDE (Symptoms, Diagnosis, Herbs Prescription) */}
          <div className="space-y-6 lg:col-span-7">
            {/* Symptoms Card */}
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

            {/* Pulse examination block (Tứ chẩn) */}
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

            {/* Herbal formulation block */}
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
                {/* Formula Name */}
                <div className="flex items-center justify-between border-b border-amber-100 pb-2">
                  <span className="text-sm font-extrabold tracking-tight text-amber-900">
                    🫖 {activeVisit.prescriptionFormula}
                  </span>
                  <span className="text-[10px] font-semibold text-amber-700/80 uppercase">
                    Đơn trị liệu
                  </span>
                </div>

                {/* Herbs grid elements list */}
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
          </div>

          {/* RIGHT DIAGNOSTIC SIDE (Clinical Pictures & Lab Results) */}
          <div className="space-y-6 lg:col-span-5">
            {/* Interactive Drag & Drop Tongue Image Upload or Showcase list */}
            <div id="clinical-pictures" className="space-y-2">
              <h5 className="flex items-center gap-1.5 text-[11px] font-extrabold tracking-wider text-[#1b5e3a] uppercase">
                <Eye className="text-indigo-650 h-3.5 w-3.5" /> Hình ảnh lâm
                sàng
              </h5>

              <div className="space-y-3 rounded-xl border border-slate-200/60 bg-slate-50 p-4 shadow-2xs">
                <p className="text-[10px] font-semibold text-slate-500">
                  Thiết chẩn (Lưỡi / Mắt / Da dị ứng)
                </p>

                {/* Selected Images Grid display */}
                {activeVisit.clinicalImages &&
                  activeVisit.clinicalImages.length > 0 && (
                    <div className="mb-3 grid grid-cols-2 gap-2">
                      {activeVisit.clinicalImages.map((imageSrc, idx) => (
                        <div
                          key={idx}
                          className="group relative aspect-square overflow-hidden rounded-lg border border-slate-200 bg-slate-100"
                        >
                          <img
                            src={imageSrc}
                            alt={`Thiết chẩn ${idx + 1}`}
                            className="h-full w-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <button
                            onClick={() => deleteClinicalImage(idx)}
                            className="bg-red-650 absolute top-1 right-1 cursor-pointer rounded-full p-1 text-white opacity-0 transition-opacity duration-150 group-hover:opacity-100 hover:bg-red-700"
                            title="Xóa hình"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                {/* Upload Dropzone Box */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={triggerImageUpload}
                  className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-all ${
                    isDragging
                      ? "border-emerald-600 bg-emerald-50/50"
                      : "border-slate-300 hover:border-emerald-500 hover:bg-emerald-50/10"
                  }`}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUploaded}
                    className="hidden"
                    accept="image/*"
                  />

                  {/* Tongue icon design placeholder representation */}
                  <div className="shadow-3xs mb-2 flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-rose-500 transition-transform duration-150 hover:scale-105">
                    👅
                  </div>

                  <p className="text-xs font-semibold text-slate-700">
                    Ảnh thiết chẩn (Lưỡi)
                  </p>
                  <p className="mt-1 text-[10px] text-slate-400">
                    Kéo thả ảnh hoặc click để tải lên
                  </p>
                </div>
              </div>

              <div className="space-y-3 rounded-xl border border-slate-200/60 bg-slate-50 p-4 shadow-2xs">
                <p className="text-[10px] font-semibold text-slate-500">
                  Xét nghiệm / Kết quả
                </p>

                {/* Selected Images Grid display */}
                {activeVisit.clinicalImages &&
                  activeVisit.clinicalImages.length > 0 && (
                    <div className="mb-3 grid grid-cols-2 gap-2">
                      {activeVisit.clinicalImages.map((imageSrc, idx) => (
                        <div
                          key={idx}
                          className="group relative aspect-square overflow-hidden rounded-lg border border-slate-200 bg-slate-100"
                        >
                          <img
                            src={imageSrc}
                            alt={`Thiết chẩn ${idx + 1}`}
                            className="h-full w-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <button
                            onClick={() => deleteClinicalImage(idx)}
                            className="bg-red-650 absolute top-1 right-1 cursor-pointer rounded-full p-1 text-white opacity-0 transition-opacity duration-150 group-hover:opacity-100 hover:bg-red-700"
                            title="Xóa hình"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                {/* Upload Dropzone Box */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={triggerImageUpload}
                  className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-all ${
                    isDragging
                      ? "border-emerald-600 bg-emerald-50/50"
                      : "border-slate-300 hover:border-emerald-500 hover:bg-emerald-50/10"
                  }`}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUploaded}
                    className="hidden"
                    accept="image/*"
                  />

                  {/* Tongue icon design placeholder representation */}
                  <div className="shadow-3xs mb-2 flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-rose-500 transition-transform duration-150 hover:scale-105">
                    🧪
                  </div>

                  <p className="text-xs font-semibold text-slate-700">
                    KQ xét nghiệm / Siêu âm
                  </p>
                  <p className="mt-1 text-[10px] text-slate-400">
                    Kéo thả ảnh hoặc click để tải lên
                  </p>
                </div>
              </div>

              <div className="space-y-3 rounded-xl border border-slate-200/60 bg-slate-50 p-4 shadow-2xs">
                <p className="text-[10px] font-semibold text-slate-500">
                  Ảnh lâm sàn khác
                </p>

                {/* Selected Images Grid display */}
                {activeVisit.clinicalImages &&
                  activeVisit.clinicalImages.length > 0 && (
                    <div className="mb-3 grid grid-cols-2 gap-2">
                      {activeVisit.clinicalImages.map((imageSrc, idx) => (
                        <div
                          key={idx}
                          className="group relative aspect-square overflow-hidden rounded-lg border border-slate-200 bg-slate-100"
                        >
                          <img
                            src={imageSrc}
                            alt={`Thiết chẩn ${idx + 1}`}
                            className="h-full w-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <button
                            onClick={() => deleteClinicalImage(idx)}
                            className="bg-red-650 absolute top-1 right-1 cursor-pointer rounded-full p-1 text-white opacity-0 transition-opacity duration-150 group-hover:opacity-100 hover:bg-red-700"
                            title="Xóa hình"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                {/* Upload Dropzone Box */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={triggerImageUpload}
                  className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-all ${
                    isDragging
                      ? "border-emerald-600 bg-emerald-50/50"
                      : "border-slate-300 hover:border-emerald-500 hover:bg-emerald-50/10"
                  }`}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUploaded}
                    className="hidden"
                    accept="image/*"
                  />

                  {/* Tongue icon design placeholder representation */}
                  <div className="shadow-3xs mb-2 flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-rose-500 transition-transform duration-150 hover:scale-105">
                    🧪
                  </div>

                  <p className="text-xs font-semibold text-slate-700">
                    Thêm ảnh khác
                  </p>
                  <p className="mt-1 text-[10px] text-slate-400">
                    Kéo thả ảnh hoặc click để tải lên
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

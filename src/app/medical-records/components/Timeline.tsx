import { useMedicalRecordContext } from "@/app/medical-records/hooks/use-medical-record-context"

export default function Timeline() {
  const { activePatient, selectedVisitIndex, setSelectedVisitIndex } =
    useMedicalRecordContext()

  const visits = activePatient.visits
  return (
    <section
      className="overflow-x-auto rounded-2xl border border-slate-200/60 bg-white p-6 shadow-xs"
      id="timeline-section"
    >
      <p className="mb-4 pl-1 text-[10px] font-bold tracking-widest text-slate-400 uppercase">
        TIMELINE TIẾN TRÌNH KHÁM
      </p>

      <div className="relative min-w-[640px] px-8 py-4">
        {/* Background path lines */}
        <div
          className="absolute top-[34px] left-[3%]"
          style={{ width: "93%", height: "3px" }}
        >
          <div className="flex h-full w-full rounded-full bg-slate-100">
            {/* Filled segments depending on visit data status */}
            <div
              className="h-full bg-emerald-600"
              style={{ width: "25%" }}
            ></div>
            <div
              className="h-full bg-emerald-600"
              style={{ width: "25%" }}
            ></div>
            <div className="h-full bg-amber-500" style={{ width: "25%" }}></div>
            <div className="h-full bg-slate-200" style={{ width: "25%" }}></div>
          </div>
        </div>

        {/* Progress Checkpoint Circles */}
        <div
          className="relative flex items-start justify-between"
          id="timeline-checkpoints"
        >
          {visits.map((visit, index) => {
            // Color code mapping for checkpoints based on state
            const getTheme = (status: string, idx: number) => {
              const isActive = idx === selectedVisitIndex
              switch (status) {
                case "Khám đầu":
                  return {
                    circBg: "bg-emerald-600 text-white",
                    ring: isActive
                      ? "ring-4 ring-emerald-100 border-emerald-700"
                      : "hover:scale-105",
                    textColor: "text-emerald-700",
                  }
                case "Tái khám":
                  return {
                    circBg: "bg-emerald-600 text-white",
                    ring: isActive
                      ? "ring-4 ring-emerald-100 border-emerald-700"
                      : "hover:scale-105",
                    textColor: "text-emerald-700",
                  }
                case "Online":
                  return {
                    circBg: "bg-blue-600 text-white",
                    ring: isActive
                      ? "ring-4 ring-blue-100 border-blue-700"
                      : "hover:scale-105",
                    textColor: "text-blue-700",
                  }
                case "Cần TD":
                  return {
                    circBg: "bg-yellow-500 text-white",
                    ring: isActive
                      ? "ring-4 ring-yellow-100 border-yellow-600"
                      : "hover:scale-105",
                    textColor: "text-yellow-600",
                  }
                case "Kế hoạch":
                default:
                  return {
                    circBg: "bg-slate-300 text-slate-705",
                    ring: isActive
                      ? "ring-4 ring-slate-100 border-slate-400"
                      : "hover:scale-105",
                    textColor: "text-slate-400",
                  }
              }
            }

            const style = getTheme(visit.status, index)
            const isSelected = index === selectedVisitIndex

            return (
              <button
                key={visit.id}
                onClick={() => setSelectedVisitIndex(index)}
                className="group relative z-10 flex cursor-pointer flex-col items-center transition-all duration-200 focus:outline-none"
                id={`timeline-point-${visit.id}`}
              >
                {/* Circle Badge icon */}
                <div
                  className={`font-display flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-2 border-white text-sm font-bold tracking-tight transition-all ${style.circBg} ${style.ring} shadow-sm`}
                >
                  {visit.visitNumber}
                </div>

                {/* Info details under node */}
                <div className="mt-2 max-w-[100px] text-center">
                  <p className="font-mono text-xs font-bold tracking-tight text-slate-700">
                    {visit.date.substring(0, 5)}
                  </p>
                  <p
                    className={`mt-0.5 text-[10px] leading-tight font-bold transition-colors ${isSelected ? "font-extrabold text-slate-900 underline decoration-emerald-600 decoration-2" : "text-slate-500"}`}
                  >
                    {visit.status === "Cần TD" && (
                      <span className="mr-0.5 font-extrabold text-red-500">
                        ⚠️
                      </span>
                    )}
                    {visit.status === "Khám đầu"
                      ? "Khám đầu"
                      : visit.status === "Tái khám"
                        ? "Tái khám"
                        : visit.status}
                  </p>
                  {isSelected && (
                    <span className="mt-1 inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-emerald-600"></span>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}

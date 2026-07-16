import { Link } from "react-router-dom"
import { FileText, Info } from "lucide-react"

import { urlPaths } from "@/constants/urlPaths"

interface ComingSoonPageProps {
  title: string
}

export function ComingSoonPage({ title }: ComingSoonPageProps) {
  return (
    <div className="mx-auto max-w-2xl space-y-4 p-8 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-emerald-100 bg-emerald-50 text-emerald-600 shadow-inner">
        <Info className="h-8 w-8" />
      </div>
      <h3 className="font-display text-lg font-bold text-slate-800">
        Chức năng {title}
      </h3>
      <p className="font-sans text-sm leading-relaxed text-slate-600">
        Bạn đang trải nghiệm giao diện quản trị phòng khám. Chế độ xem trọng tâm
        chính hiện tại là Hồ Sơ Khám Bệnh Chuyên Sâu thiết kế chuẩn Đông Y. Vui
        lòng nhấn chọn &quot;Hồ sơ khám&quot; trên thanh menu bên trái hoặc nút
        dưới đây để quay lại màn hình chính.
      </p>
      <Link
        to={urlPaths.medicalRecordList}
        className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-emerald-800 px-5 py-2 text-xs font-semibold text-white shadow-md transition-colors hover:bg-primary"
      >
        <FileText className="h-4 w-4" /> Quay lại Hồ sơ khám
      </Link>
    </div>
  )
}

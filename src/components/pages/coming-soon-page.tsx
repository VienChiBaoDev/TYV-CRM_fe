import { Link } from "react-router-dom"
import { BriefcaseMedical, FileText } from "lucide-react"

import { urlPaths } from "@/constants/urlPaths"
import { Button } from "../ui/button"

interface ComingSoonPageProps {
  title: string
}

export function ComingSoonPage({ title }: ComingSoonPageProps) {
  return (
    <div className="mx-2 mt-50 max-w-2xl space-y-4 rounded-2xl border-gray-500 py-8 text-center shadow-2xl md:mx-auto md:border md:px-18">
      <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-emerald-100 bg-emerald-50 text-emerald-600 shadow-inner">
        <BriefcaseMedical className="h-18 w-18" />
      </div>
      <h3 className="font-display text-2xl font-bold text-primary">
        Chức năng {title}
      </h3>
      <h4 className="font-display text-lg font-semibold text-slate-600 italic">
        Chức năng chưa được phát triển
      </h4>
      <p className="font-sans text-sm leading-relaxed text-slate-600">
        Bạn đang trải nghiệm giao diện quản trị phòng khám. Chế độ xem trọng tâm
        chính hiện tại là Hồ Sơ Khám Bệnh Chuyên Sâu thiết kế chuẩn Đông Y. Vui
        lòng nhấn chọn &quot;Hồ sơ khám&quot; trên thanh menu bên trái hoặc nút
        dưới đây để quay lại màn hình chính.
      </p>
      <Button>
        <Link
          to={urlPaths.medicalRecordList}
          className="flex items-center gap-2"
        >
          <FileText className="h-4 w-4" /> Quay lại Hồ sơ khám
        </Link>
      </Button>
    </div>
  )
}

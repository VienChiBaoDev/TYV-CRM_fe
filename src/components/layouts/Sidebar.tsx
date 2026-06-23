import { NavLink } from "react-router-dom"
import {
  LayoutDashboard,
  Calendar,
  Users,
  FileText,
  Briefcase,
  TrendingUp,
  DollarSign,
  Leaf,
} from "lucide-react"

import { urlPaths } from "@/constants/urlPaths"
import { useClinicStore } from "@/stores/clinic-store"
import { cn } from "@/lib/utils"

interface NavItem {
  to: string
  label: string
  icon: React.ReactNode
  isHighlighted?: boolean
}

const OPERATION_NAV_ITEMS: NavItem[] = [
  {
    to: urlPaths.dashboard,
    label: "Dashboard",
    icon: <LayoutDashboard className="h-4.5 w-4.5" />,
  },
  {
    to: urlPaths.appointments,
    label: "Lịch hẹn",
    icon: <Calendar className="h-4.5 w-4.5" />,
  },
  {
    to: urlPaths.patients,
    label: "Bệnh nhân",
    icon: <Users className="h-4.5 w-4.5" />,
  },
  {
    to: urlPaths.medicalRecordList,
    label: "Hồ sơ bệnh án",
    icon: <FileText className="h-4.5 w-4.5" />,
  },
  {
    to: urlPaths.standardMedicalRecords,
    label: "Bệnh án chuẩn",
    icon: <Briefcase className="h-4.5 w-4.5" />,
  },
]

const KPI_NAV_ITEMS: NavItem[] = [
  {
    to: urlPaths.revenueKpi,
    label: "Doanh thu & KPI",
    icon: <TrendingUp className="h-4.5 w-4.5" />,
  },
  {
    to: urlPaths.commissionPayroll,
    label: "Hoa hồng & Lương",
    icon: <DollarSign className="h-4.5 w-4.5" />,
  },
]

const SALES_NAV_ITEMS: NavItem[] = [
  {
    to: urlPaths.herbsProducts,
    label: "Dược liệu & Sản phẩm",
    icon: <Leaf className="h-4.5 w-4.5" />,
  },
]

function NavGroup({ title, items }: { title: string; items: NavItem[] }) {
  return (
    <div>
      <p className="mb-2 px-4 text-[10px] font-bold tracking-wider text-emerald-400 uppercase">
        {title}
      </p>
      <div className="space-y-1">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                "group flex items-center gap-3 rounded-lg px-4 py-2 text-sm transition-all",
                isActive || window.location.pathname.startsWith(item.to)
                  ? "border-l-4 border-l-lime-400 bg-emerald-700 text-white"
                  : "text-emerald-300 hover:bg-emerald-900/40"
              )
            }
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </div>
    </div>
  )
}

export function Sidebar() {
  const activeBranch = useClinicStore((state) => state.activeBranch)
  const setActiveBranch = useClinicStore((state) => state.setActiveBranch)
  return (
    <aside
      className="sticky top-0 flex h-screen w-full shrink-0 flex-col justify-between bg-emerald-950 text-white shadow-lg md:w-64"
      id="app-sidebar"
    >
      <div>
        <div className="border-b border-emerald-900/40 p-6">
          <div className="flex items-center gap-3">
            <span className="font-display text-2xl font-semibold tracking-wide text-lime-400">
              §
            </span>
            <div>
              <h1 className="font-display text-lg font-bold tracking-tight text-white">
                Thượng Y Viên
              </h1>
              <p className="mb-0 text-[10px] font-medium tracking-widest text-emerald-300 uppercase">
                Nhân • Tâm • Trí
              </p>
            </div>
          </div>
        </div>

        <div className="p-4">
          <div className="flex gap-1 rounded-full border border-emerald-800/40 bg-emerald-950/60 p-1">
            <button
              id="branch-hang-bong"
              type="button"
              onClick={() => setActiveBranch("Hàng Bông")}
              className={cn(
                "flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-full py-1.5 text-xs font-semibold transition-all duration-300",
                activeBranch === "Hàng Bông"
                  ? "bg-emerald-700 text-white shadow-sm ring-1 ring-emerald-600"
                  : "text-emerald-300 hover:text-white"
              )}
            >
              <span>🌸</span> Hàng Bông
            </button>
            <button
              id="branch-cau-giay"
              type="button"
              onClick={() => setActiveBranch("Cầu Giấy")}
              className={cn(
                "flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-full py-1.5 text-xs font-semibold transition-all duration-300",
                activeBranch === "Cầu Giấy"
                  ? "bg-emerald-700 text-white shadow-sm ring-1 ring-emerald-600"
                  : "text-emerald-300 hover:text-white"
              )}
            >
              <span>🌿</span> Cầu Giấy
            </button>
          </div>
        </div>

        <nav className="space-y-6 px-3 py-2" id="nav-groups">
          <NavGroup title="VẬN HÀNH" items={OPERATION_NAV_ITEMS} />
          <NavGroup title="NHÂN SỰ & KPI" items={KPI_NAV_ITEMS} />
          <NavGroup title="BÁN HÀNG" items={SALES_NAV_ITEMS} />
        </nav>
      </div>

      <div className="text-emerald-250 border-t border-emerald-900/40 bg-emerald-950/40 p-4 text-[11px]">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-white">Phòng khám BS Hưng</p>
            <p className="text-emerald-400">Vai trò: Quản trị viên</p>
          </div>
          <span className="rounded border border-emerald-800/50 bg-emerald-900 px-2 py-0.5 font-mono text-[9px] text-lime-400">
            Hệ Thống
          </span>
        </div>
      </div>
    </aside>
  )
}

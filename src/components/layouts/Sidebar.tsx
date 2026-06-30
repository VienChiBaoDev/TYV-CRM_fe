import { useCallback, useEffect, useRef, useState } from "react"
import { NavLink, useLocation, useNavigate } from "react-router-dom"
import {
  LayoutDashboard,
  Calendar,
  Users,
  Briefcase,
  TrendingUp,
  DollarSign,
  Leaf,
  ChevronDown,
  ChevronRight,
  ChevronsDown,
  Stethoscope,
  LogOut,
  Settings,
} from "lucide-react"

import { CLINIC_BRANCHES } from "@/constants/clinic-branches"
import { urlPaths } from "@/constants/urlPaths"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getBranchEmoji } from "@/lib/clinic-branch"
import { ROLE_LABEL } from "@/interfaces/auth"
import { useAuthStore } from "@/stores/auth-store"
import { cn } from "@/lib/utils"
import { useClinicStore, type ClinicBranch } from "@/stores/clinic-store"

interface NavItem {
  to?: string
  label: string
  icon: React.ReactNode
  isHighlighted?: boolean
  children?: { label: string; to: string }[]
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
    to: urlPaths.medicalRecordList,
    label: "Khách hàng",
    icon: <Users className="h-4.5 w-4.5" />,
  },
  {
    to: urlPaths.standardMedicalRecords,
    label: "Bệnh án chuẩn",
    icon: <Briefcase className="h-4.5 w-4.5" />,
  },
  {
    to: urlPaths.treatmentServices,
    label: "Dịch vụ điều trị",
    icon: <Stethoscope className="h-4.5 w-4.5" />,
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

const ADMIN_NAV_ITEMS: NavItem[] = [
  {
    to: urlPaths.settings,
    label: "Cài đặt",
    icon: <Settings className="h-4.5 w-4.5" />,
  },
]

function CollapsibleNavItem({ item }: { item: NavItem }) {
  const location = useLocation()

  const activeChildTo = item.children?.reduce((prev, curr) => {
    if (location.pathname.startsWith(curr.to) && curr.to.length > prev.length) {
      return curr.to
    }
    return prev
  }, "")

  const isActive = activeChildTo !== ""
  const [isOpen, setIsOpen] = useState(isActive || false)

  return (
    <div className="flex flex-col">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "group flex items-center justify-between gap-3 rounded-lg px-4 py-2 text-sm transition-all",
          isActive
            ? "bg-emerald-900/40 text-emerald-100"
            : "text-emerald-300 hover:bg-emerald-900/40"
        )}
      >
        <div className="flex items-center gap-3">
          {item.icon}
          {item.label}
        </div>
        {isOpen ? (
          <ChevronDown className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
      </button>
      {isOpen && (
        <div className="mt-1 ml-9 flex flex-col space-y-1 border-l border-emerald-800/50 pl-2">
          {item.children?.map((child) => {
            const isChildActive = child.to === activeChildTo
            return (
              <NavLink
                key={child.to}
                to={child.to}
                className={cn(
                  "rounded-md px-3 py-1.5 text-xs transition-all",
                  isChildActive
                    ? "bg-emerald-700/50 font-medium text-white"
                    : "text-emerald-400 hover:bg-emerald-900/30 hover:text-emerald-200"
                )}
              >
                {child.label}
              </NavLink>
            )
          })}
        </div>
      )}
    </div>
  )
}

function NavGroup({ title, items }: { title: string; items: NavItem[] }) {
  const location = useLocation()
  return (
    <div>
      <p className="mb-2 px-4 text-[10px] font-bold tracking-wider text-emerald-400 uppercase">
        {title}
      </p>
      <div className="space-y-1">
        {items.map((item) => {
          if (item.children) {
            return <CollapsibleNavItem key={item.label} item={item} />
          }
          return (
            <NavLink
              key={item.label}
              to={item.to!}
              className={({ isActive }) =>
                cn(
                  "group flex items-center gap-3 rounded-lg px-4 py-2 text-sm transition-all",
                  isActive || (item.to && location.pathname.startsWith(item.to))
                    ? "border-l-4 border-l-lime-400 bg-emerald-700 text-white"
                    : "text-emerald-300 hover:bg-emerald-900/40"
                )
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          )
        })}
      </div>
    </div>
  )
}

interface ScrollFadeState {
  top: boolean
  bottom: boolean
}

function SidebarNavScroll({ isAdmin }: { isAdmin: boolean }) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [fade, setFade] = useState<ScrollFadeState>({
    top: false,
    bottom: false,
  })

  const updateScrollFade = useCallback(() => {
    const scrollEl = scrollRef.current
    if (!scrollEl) return

    const hasOverflow = scrollEl.scrollHeight > scrollEl.clientHeight
    const isAtTop = scrollEl.scrollTop <= 1
    const isAtBottom =
      scrollEl.scrollTop + scrollEl.clientHeight >= scrollEl.scrollHeight - 1

    setFade({
      top: hasOverflow && !isAtTop,
      bottom: hasOverflow && !isAtBottom,
    })
  }, [])

  useEffect(() => {
    const scrollEl = scrollRef.current
    if (!scrollEl) return

    updateScrollFade()

    const resizeObserver = new ResizeObserver(updateScrollFade)
    resizeObserver.observe(scrollEl)

    const nav = scrollEl.firstElementChild
    if (nav) {
      resizeObserver.observe(nav)
    }

    return () => resizeObserver.disconnect()
  }, [isAdmin, updateScrollFade])

  return (
    <div className="relative min-h-0 overflow-hidden">
      <div
        ref={scrollRef}
        onScroll={updateScrollFade}
        className="scrollbar-hide h-full overflow-y-auto overscroll-contain"
      >
        <nav className="space-y-6 px-3 py-2 pt-4 pb-3" id="nav-groups">
          <NavGroup title="VẬN HÀNH" items={OPERATION_NAV_ITEMS} />
          <NavGroup title="NHÂN SỰ & KPI" items={KPI_NAV_ITEMS} />
          <NavGroup title="BÁN HÀNG" items={SALES_NAV_ITEMS} />
          {isAdmin ? (
            <NavGroup title="QUẢN TRỊ" items={ADMIN_NAV_ITEMS} />
          ) : null}
        </nav>
      </div>

      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0 z-10 h-10 bg-linear-to-b from-emerald-950 via-emerald-950/70 to-transparent transition-opacity duration-300",
          fade.top ? "opacity-100" : "opacity-0"
        )}
      />

      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-x-0 bottom-0 z-10 transition-opacity duration-300",
          fade.bottom ? "opacity-100" : "opacity-0"
        )}
      >
        <div className="h-14 bg-linear-to-t from-emerald-950 via-emerald-950/80 to-transparent" />
        <ChevronsDown className="absolute bottom-1.5 left-1/2 h-4 w-4 -translate-x-1/2 text-lime-400/80" />
      </div>
    </div>
  )
}

export function Sidebar() {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const activeBranch = useClinicStore((state) => state.activeBranch)
  const setActiveBranch = useClinicStore((state) => state.setActiveBranch)
  const isAdmin = user?.role === "ADMIN"

  // Khóa chọn cơ sở khi không phải là ADMIN
  // const canSwitchBranch = isAdmin || !user?.clinicBranch

  function handleLogout() {
    logout()
    navigate(urlPaths.login, { replace: true })
  }

  return (
    <aside
      className="sticky top-0 grid h-screen w-full shrink-0 grid-rows-[auto_1fr_auto] overflow-hidden bg-emerald-950 text-white shadow-lg md:w-64"
      id="app-sidebar"
    >
      <div>
        <div className="border-b border-emerald-900/40 p-6">
          <div className="flex items-center gap-3">
            <img
              src="../public/Logo.jpg"
              alt="Thượng Y Viên"
              className="h-20 w-20 rounded-xl object-cover"
            />
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
          <div className="space-y-1.5">
            <p className="px-1 text-[10px] font-bold tracking-wider text-emerald-400 uppercase">
              Cơ sở
            </p>
            {/* {canSwitchBranch ? ( */}
            <Select
              value={activeBranch}
              onValueChange={(value) => setActiveBranch(value as ClinicBranch)}
            >
              <SelectTrigger
                id="branch-select"
                className="w-full border-emerald-800/40 bg-emerald-950/60 text-emerald-100 shadow-none hover:border-emerald-700/60 hover:bg-emerald-900/40 focus-visible:ring-emerald-600/30 data-[state=open]:border-emerald-600 data-[state=open]:ring-emerald-600/30 [&_svg]:text-white"
              >
                <SelectValue placeholder="Chọn cơ sở">
                  <span className="flex items-center gap-1.5">
                    <span>{getBranchEmoji(activeBranch)}</span>
                    {activeBranch}
                  </span>
                </SelectValue>
              </SelectTrigger>
              <SelectContent
                position="popper"
                sideOffset={4}
                className="border-emerald-800/40 bg-emerald-950 text-emerald-100"
              >
                {CLINIC_BRANCHES.map((branch) => (
                  <SelectItem
                    key={branch.code}
                    value={branch.label}
                    className="text-emerald-100 focus:bg-emerald-900/60 focus:text-white data-[state=checked]:bg-emerald-800/50 data-[state=checked]:text-white"
                  >
                    <span>{branch.emoji}</span>
                    {branch.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {/* ) : ( */}
            {/* <div
                id="branch-select"
                className="flex w-full items-center gap-1.5 rounded-md border border-emerald-800/40 bg-emerald-950/60 px-3 py-2 text-sm text-emerald-100"
              >
                <span>{getBranchEmoji(activeBranch)}</span>
                  {activeBranch}
              </div> */}
            {/* ) */}
            {/* )} */}
          </div>
        </div>
      </div>

      <SidebarNavScroll isAdmin={isAdmin} />

      <div className="text-emerald-250 border-t border-emerald-900/40 bg-emerald-950/40 p-4 text-[11px]">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate font-semibold text-white">
              {user?.fullName ?? "Khách"}
            </p>
            <p className="text-emerald-400">
              Vai trò: {user ? ROLE_LABEL[user.role] : "—"}
            </p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            title="Đăng xuất"
            className="flex shrink-0 items-center gap-1 rounded border border-emerald-800/50 bg-emerald-900 px-2 py-1 text-[10px] font-medium text-lime-400 transition-colors hover:bg-emerald-800"
          >
            <LogOut className="h-3.5 w-3.5" />
            Đăng xuất
          </button>
        </div>
      </div>
    </aside>
  )
}

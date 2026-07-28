import { useState } from "react"
import { Menu } from "lucide-react"
import { Outlet } from "react-router-dom"

import { Sidebar } from "@/components/layouts/Sidebar"
import { Toaster } from "@/components/ui/sonner"
import { cn } from "@/lib/utils"

export default function MainLayout() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true)

  function openNav() {
    setMobileNavOpen(true)
    setDesktopSidebarOpen(true)
  }

  return (
    <div
      className="flex h-screen flex-col overflow-hidden bg-background font-sans text-slate-800 antialiased md:flex-row"
      id="clinic-dashboard"
    >
      {desktopSidebarOpen ? (
        <Sidebar onCollapse={() => setDesktopSidebarOpen(false)} />
      ) : null}

      {mobileNavOpen ? (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/50"
            aria-label="Đóng menu"
            onClick={() => setMobileNavOpen(false)}
          />
          <div className="relative z-10 h-full w-72 max-w-[85vw] shadow-2xl">
            <Sidebar
              variant="drawer"
              onClose={() => setMobileNavOpen(false)}
            />
          </div>
        </div>
      ) : null}

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <header
          className={cn(
            "flex shrink-0 items-center gap-3 border-b border-slate-200 bg-white px-4 py-3",
            desktopSidebarOpen && "md:hidden"
          )}
        >
          <button
            type="button"
            onClick={openNav}
            aria-label="Mở menu"
            className="rounded-lg p-1.5 text-slate-700 hover:bg-slate-100"
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="font-display text-sm font-bold text-slate-800">
            Thượng Y Viên
          </span>
        </header>

        <main className="flex min-h-0 flex-1 flex-col overflow-y-auto">
          <Outlet />
        </main>
      </div>

      <Toaster richColors position="top-right" />
    </div>
  )
}

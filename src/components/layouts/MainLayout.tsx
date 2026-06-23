import { Outlet } from "react-router-dom"

import { Sidebar } from "@/components/layouts/Sidebar"
import { Toaster } from "@/components/ui/sonner"

export default function MainLayout() {
  return (
    <div
      className="flex min-h-screen flex-col bg-[#f3f6f4] font-sans text-slate-800 antialiased md:flex-row"
      id="clinic-dashboard"
    >
      <Sidebar />
      <main className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        <Outlet />
      </main>
      <Toaster richColors position="top-right" />
    </div>
  )
}

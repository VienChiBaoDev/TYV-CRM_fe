import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { GeneralInfoTab } from "./GeneralInfoTab"
import { OtherInfoTab } from "./OtherInfoTab"
import { IdentityCardSection } from "./IdentityCardSection"

export default function PatientCreatePage() {
  return (
    <div className="flex flex-col h-full bg-slate-50 relative pb-20">
      {/* Header and Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <Tabs defaultValue="general" className="w-full">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-800">Hồ sơ khách hàng</h2>
              <p className="text-sm text-slate-500">Thông tin cá nhân</p>
            </div>
            <TabsList className="bg-white border rounded-lg h-auto p-1 shadow-sm gap-1">
              <TabsTrigger 
                value="general" 
                className="rounded-md data-[state=active]:bg-white data-[state=active]:text-emerald-700 data-[state=active]:shadow-sm px-4 py-1.5 text-slate-600 border border-transparent data-[state=active]:border-gray-200"
              >
                Thông tin chung
              </TabsTrigger>
              <TabsTrigger 
                value="other" 
                className="rounded-md data-[state=active]:bg-white data-[state=active]:text-emerald-700 data-[state=active]:shadow-sm px-4 py-1.5 text-slate-600 border border-transparent data-[state=active]:border-gray-200"
              >
                Khác
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
            <TabsContent value="general" className="m-0 border-none outline-none">
              <GeneralInfoTab />
            </TabsContent>
            <TabsContent value="other" className="m-0 border-none outline-none">
              <OtherInfoTab />
            </TabsContent>
          </div>
        </Tabs>

        {/* CMND/CC Section (Common for both tabs based on the design, or at least visible below them) */}
        <IdentityCardSection />

        {/* Footer Checkbox */}
        <div className="flex items-center gap-2 mt-6 mb-16">
          <Checkbox className="bg-slate-800 border-slate-800 text-white rounded-[4px] data-[state=checked]:bg-slate-800 data-[state=checked]:text-white h-5 w-5" defaultChecked />
          <span className="text-sm font-medium text-slate-700">Thỏa thuận khách hàng ...</span>
        </div>
      </div>

      {/* Sticky Footer Buttons */}
      <div className="fixed bottom-0 left-0 right-0 md:left-64 bg-slate-50/80 backdrop-blur-sm p-4 flex justify-end gap-3 border-t border-slate-200 z-10">
        <Button variant="outline" className="bg-[#8b9bb4] text-white hover:bg-[#7988a0] hover:text-white border-0 min-w-[80px]">
          Đóng
        </Button>
        <Button className="bg-[#00a64c] text-white hover:bg-[#008f41] min-w-[80px]">
          Lưu
        </Button>
      </div>
    </div>
  )
}

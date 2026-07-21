import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MEDICAL_RECORD_TABS } from "@/app/medical-records/constants/tab-values"
import { useMedicalRecordContext } from "@/app/medical-records/hooks/use-medical-record-context"
import ClinicHeader from "@/app/medical-records/components/ClinicHeader"
import PatientProfile from "@/app/medical-records/components/PatientProfile"
import Timeline from "@/app/medical-records/components/Timeline"
import VisitDetails from "@/app/medical-records/components/VisitDetails"
import { VisitFormModal } from "@/app/medical-records/components/VisitFormModal"
import PatientPayments from "./Payments/PatientPayments"
import PatientServices from "./Services/PatientServices"
import Treatment from "./Treatment/Treatment"
import MedicalCaseForm from "./MedicalCase/MedicalCaseForm"

export function MedicalRecordPage() {
  const { activeTab, setActiveTab, visitModalMode } = useMedicalRecordContext()

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <ClinicHeader />

      <div className="min-h-0 flex-1 space-y-2 overflow-y-auto p-3 sm:p-4 lg:p-6">
        <PatientProfile />

        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as typeof activeTab)}
        >
          <TabsList className="h-auto w-full justify-start overflow-x-auto">
            <TabsTrigger value={MEDICAL_RECORD_TABS.VISITS}>
              Lần khám
            </TabsTrigger>
            <TabsTrigger value={MEDICAL_RECORD_TABS.SERVICES}>
              Dịch vụ
            </TabsTrigger>
            <TabsTrigger value={MEDICAL_RECORD_TABS.PAYMENTS}>
              Thanh toán
            </TabsTrigger>
            <TabsTrigger value={MEDICAL_RECORD_TABS.TREATMENT}>
              Điều trị
            </TabsTrigger>
            <TabsTrigger value={MEDICAL_RECORD_TABS.MEDICAL_CASE}>
              Bệnh án
            </TabsTrigger>
          </TabsList>

          <TabsContent value={MEDICAL_RECORD_TABS.VISITS}>
            <div className="space-y-2">
              <Timeline />
              <VisitDetails />
            </div>
          </TabsContent>

          <TabsContent value={MEDICAL_RECORD_TABS.SERVICES}>
            <PatientServices />
          </TabsContent>

          <TabsContent value={MEDICAL_RECORD_TABS.PAYMENTS}>
            <PatientPayments />
          </TabsContent>

          <TabsContent value={MEDICAL_RECORD_TABS.TREATMENT}>
            <Treatment />
          </TabsContent>

          <TabsContent value={MEDICAL_RECORD_TABS.MEDICAL_CASE}>
            <MedicalCaseForm />
          </TabsContent>
        </Tabs>
      </div>

      {visitModalMode && <VisitFormModal />}
    </div>
  )
}

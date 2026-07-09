import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MEDICAL_RECORD_TABS } from "@/app/medical-records/constants/tab-values"
import { useMedicalRecordContext } from "@/app/medical-records/hooks/use-medical-record-context"
import ClinicHeader from "@/app/medical-records/components/ClinicHeader"
import PatientProfile from "@/app/medical-records/components/PatientProfile"
import Timeline from "@/app/medical-records/components/Timeline"
import VisitDetails from "@/app/medical-records/components/VisitDetails"
import { VisitFormModal } from "@/app/medical-records/components/VisitFormModal"
import ExportBAModal from "@/app/medical-records/components/ExportBAModal"
import PatientPayments from "./Payments/PatientPayments"
import PatientServices from "./Services/PatientServices"
import Treatment from "./Treatment/Treatment"
import MedicalCaseForm from "./MedicalCase/MedicalCaseForm"

export function MedicalRecordPage() {
  const {
    activeTab,
    setActiveTab,
    activePatient,
    activeVisit,
    visitModalMode,
    showExportModal,
    setShowExportModal,
    activeBranch,
  } = useMedicalRecordContext()

  return (
    <>
      <ClinicHeader />

      <div className="flex-1 space-y-2 p-4 lg:p-6">
        <PatientProfile />

        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as typeof activeTab)}
        >
          <TabsList className="bg-green-200">
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
      <ExportBAModal
        showExportModal={showExportModal}
        setShowExportModal={setShowExportModal}
        activeBranch={activeBranch}
        activePatient={activePatient}
        activeVisit={activeVisit}
      />
    </>
  )
}

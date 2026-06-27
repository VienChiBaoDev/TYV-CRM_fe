import { createBrowserRouter, Navigate } from "react-router-dom"

import MainLayout from "@/components/layouts/MainLayout"
import { ComingSoonPage } from "@/components/pages/coming-soon-page"
import { urlPaths } from "@/constants/urlPaths"
import MedicalRecords from "@/app/medical-records/components/MedicalRecords"
import { StandardMedicalRecord } from "@/app/standard-medical-record/components/StandardMedicalRecord"
import MedicalRecordList from "@/app/medical-records/components/MedicalRecordList"
import PatientCreatePage from "@/app/medical-records/components/PatientCreate/PatientCreatePage"
import ReferrersPage from "@/app/medical-records/components/Referrers/ReferrersPage"
import { AppointmentsPage } from "@/app/appointments/components/AppointmentsPage"
import { TreatmentServices } from "@/app/treatment-services/components/TreatmentServices"

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Navigate to={urlPaths.medicalRecordList} replace />,
      },
      {
        path: urlPaths.referrers,
        element: <ReferrersPage />,
      },
      {
        path: urlPaths.medicalRecordCreate,
        element: <PatientCreatePage />,
      },
      {
        path: urlPaths.medicalRecords(),
        element: <MedicalRecords />,
      },
      {
        path: urlPaths.medicalRecordList,
        element: <MedicalRecordList />,
      },
      {
        path: urlPaths.dashboard,
        element: <ComingSoonPage title="Dashboard" />,
      },
      {
        path: urlPaths.appointments,
        element: <AppointmentsPage />,
      },
      {
        path: urlPaths.patients,
        element: <MedicalRecords />,
      },
      {
        path: urlPaths.standardMedicalRecords,
        element: <StandardMedicalRecord />,
      },
      {
        path: urlPaths.treatmentServices,
        element: <TreatmentServices />,
      },
      {
        path: urlPaths.revenueKpi,
        element: <ComingSoonPage title="Doanh Thu & KPI" />,
      },
      {
        path: urlPaths.commissionPayroll,
        element: <ComingSoonPage title="Hoa Hồng & Lương" />,
      },
      {
        path: urlPaths.herbsProducts,
        element: <ComingSoonPage title="Dược Liệu & Sản Phẩm" />,
      },
    ],
  },
])

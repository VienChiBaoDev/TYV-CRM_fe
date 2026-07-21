import { createBrowserRouter, Navigate } from "react-router-dom"

import MainLayout from "@/components/layouts/MainLayout"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { ComingSoonPage } from "@/components/pages/coming-soon-page"
import { urlPaths } from "@/constants/urlPaths"
import LoginPage from "@/app/auth/LoginPage"
import SettingsPage from "@/app/settings/SettingsPage"
import MedicalRecords from "@/app/medical-records/components/MedicalRecords"
import { StandardMedicalRecord } from "@/app/standard-medical-record/components/StandardMedicalRecord"
import MedicalRecordList from "@/app/medical-records/components/MedicalRecordList"
import PatientCreatePage from "@/app/medical-records/components/PatientCreate/PatientCreatePage"
import ReferrersPage from "@/app/medical-records/components/Referrers/ReferrersPage"
import { AppointmentsPage } from "@/app/appointments/components/AppointmentsPage"
import { StaffSchedulesPage } from "@/app/staff-schedule/components/StaffSchedulesPage"
import { TreatmentServices } from "@/app/treatment-services/components/TreatmentServices"
import { MedicinesPage } from "@/app/medicines/components/MedicinesPage"
import { PrescriptionFormulasPage } from "@/app/prescription-formulas/components/PrescriptionFormulasPage"
export const router = createBrowserRouter([
  {
    path: urlPaths.login,
    element: <LoginPage />,
  },
  {
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
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
        path: urlPaths.settings,
        element: <SettingsPage />,
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
        path: urlPaths.staffSchedules,
        element: <StaffSchedulesPage />,
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
        element: <MedicinesPage />,
      },
      {
        path: urlPaths.prescriptionFormulas,
        element: <PrescriptionFormulasPage />,
      },
    ],
  },
])

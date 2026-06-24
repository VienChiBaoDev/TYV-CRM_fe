import { useState, useRef, useMemo, useEffect } from "react"
import { useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import type {
  Patient,
  Visit,
  Herb,
} from "@/app/medical-records/interfaces/types"
import { useClinicStore } from "@/stores/clinic-store"
import {
  MEDICAL_RECORD_TABS,
  type MedicalRecordTab,
} from "@/app/medical-records/constants/tab-values"
import {
  getDefaultVisitForm,
  getDefaultFollowUpPlan,
  formatIsoDateToVi,
  type VisitFormMode,
} from "@/app/medical-records/constants/visit-form"
import { patientMedicalRecordQueryOptions } from "@/app/medical-records/queries/patient-medical-record-query"

const EMPTY_PATIENT: Patient = {
  id: "",
  patientCode: "",
  name: "",
  gender: "Nam",
  age: 0,
  job: "",
  phone: "",
  address: "",
  tags: [],
  dietRestrictions: [],
  metricVisitsCount: 0,
  metricTreatmentDays: 0,
  metricNextExamination: "—",
  avatarInitials: "",
  visits: [],
}

export function useMedicalRecords() {
  const { patientId } = useParams()
  const activeBranch = useClinicStore((state) => state.activeBranch)

  const {
    data: fetchedPatient,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery(patientMedicalRecordQueryOptions(patientId ?? ""))

  const [localPatient, setLocalPatient] = useState<Patient | null>(null)
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [activeTab, setActiveTab] = useState<MedicalRecordTab>(
    MEDICAL_RECORD_TABS.VISITS
  )
  const [visitModalMode, setVisitModalMode] = useState<VisitFormMode | null>(
    null
  )
  const [visitForm, setVisitForm] =
    useState<Partial<Visit>>(getDefaultVisitForm)
  const [showExportModal, setShowExportModal] = useState(false)
  const [selectedVisitIndex, setSelectedVisitIndex] = useState(0)
  const [tempHerbName, setTempHerbName] = useState("")
  const [tempHerbWeight, setTempHerbWeight] = useState("")
  const [isDragging, setIsDragging] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!fetchedPatient) return
    setLocalPatient(null)
    setSelectedVisitIndex(
      Math.max(0, fetchedPatient.visits.length - 1)
    )
  }, [fetchedPatient])

  const activePatient = localPatient ?? fetchedPatient ?? EMPTY_PATIENT

  const activeVisit = useMemo(() => {
    if (!activePatient?.visits?.length) return null
    const idx =
      selectedVisitIndex >= activePatient.visits.length
        ? activePatient.visits.length - 1
        : selectedVisitIndex
    return activePatient.visits[idx >= 0 ? idx : 0]
  }, [activePatient, selectedVisitIndex])

  const filteredPatients = useMemo(() => {
    if (!activePatient.id) return []
    if (!searchQuery) return [activePatient]
    const query = searchQuery.toLowerCase()
    return [activePatient].filter(
      (p) =>
        p.name.toLowerCase().includes(query) || p.phone.includes(searchQuery)
    )
  }, [activePatient, searchQuery])

  const updatePatient = (updater: (patient: Patient) => Patient) => {
    setLocalPatient((prev) => updater(prev ?? activePatient))
  }

  const updateActiveVisitImages = (updater: (images: string[]) => string[]) => {
    if (!activeVisit) return
    updatePatient((p) => ({
      ...p,
      visits: p.visits.map((v) => {
        if (v.id !== activeVisit.id) return v
        return {
          ...v,
          clinicalImages: updater(v.clinicalImages || []),
        }
      }),
    }))
  }

  const addImageFromFile = (file: File) => {
    if (!activeVisit) return
    const reader = new FileReader()
    reader.onload = (event) => {
      const base64String = event.target?.result as string
      updateActiveVisitImages((images) => [...images, base64String])
    }
    reader.readAsDataURL(file)
  }

  const triggerImageUpload = () => fileInputRef.current?.click()

  const handleImageUploaded = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) addImageFromFile(file)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => setIsDragging(false)

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) addImageFromFile(file)
  }

  const deleteClinicalImage = (indexToDelete: number) => {
    updateActiveVisitImages((images) =>
      images.filter((_, i) => i !== indexToDelete)
    )
  }

  const openAddVisitModal = () => {
    setVisitForm(getDefaultVisitForm())
    setVisitModalMode("add")
  }

  const openEditVisitModal = () => {
    if (!activeVisit) return
    setVisitForm({
      ...activeVisit,
      followUpPlan: {
        ...getDefaultFollowUpPlan(),
        ...activeVisit.followUpPlan,
      },
    })
    setVisitModalMode("edit")
  }

  const closeVisitModal = () => {
    setVisitModalMode(null)
    setTempHerbName("")
    setTempHerbWeight("")
  }

  const handleVisitSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (visitModalMode === "add") {
      const newVisitNumber = activePatient.visits.length + 1
      const followUpPlan = visitForm.followUpPlan?.followUpDate
        ? visitForm.followUpPlan
        : undefined

      const createdVisit: Visit = {
        id: crypto.randomUUID(),
        visitNumber: newVisitNumber,
        title: visitForm.title || "Tái khám định kỳ",
        date: visitForm.date || new Date().toLocaleDateString("vi-VN"),
        doctor: visitForm.doctor || "BS Phi Hưng",
        mode: (visitForm.mode as Visit["mode"]) || "Trực tiếp",
        location: visitForm.location || "Hàng Bông",
        bloodPressure: visitForm.bloodPressure || "120/80",
        pulse: visitForm.pulse || "75",
        status: (visitForm.status as Visit["status"]) || "Tái khám",
        symptoms: visitForm.symptoms || "",
        pulseDiagnosis: {
          ta: visitForm.pulseDiagnosis?.ta || "",
          huu: visitForm.pulseDiagnosis?.huu || "",
          bung: visitForm.pulseDiagnosis?.bung || "",
        },
        prescriptionFormula: visitForm.prescriptionFormula || "Chưa kê đơn",
        prescriptionDosage: visitForm.prescriptionDosage || "",
        herbs: visitForm.herbs || [],
        clinicalImages: visitForm.clinicalImages || [],
        labResults: visitForm.labResults || "",
        followUpPlan,
      }

      updatePatient((p) => {
        const updatedVisits = [...p.visits, createdVisit]
        return {
          ...p,
          metricVisitsCount: updatedVisits.length,
          metricTreatmentDays: p.metricTreatmentDays + 10,
          metricNextExamination: followUpPlan?.followUpDate
            ? formatIsoDateToVi(followUpPlan.followUpDate)
            : p.metricNextExamination,
          visits: updatedVisits,
        }
      })

      setSelectedVisitIndex(activePatient.visits.length)
      closeVisitModal()
      return
    }

    if (visitModalMode === "edit") {
      const followUpPlan = visitForm.followUpPlan?.followUpDate
        ? visitForm.followUpPlan
        : undefined

      updatePatient((p) => ({
        ...p,
        metricNextExamination: followUpPlan?.followUpDate
          ? formatIsoDateToVi(followUpPlan.followUpDate)
          : p.metricNextExamination,
        visits: p.visits.map((v) =>
          v.id === visitForm.id
            ? ({ ...visitForm, followUpPlan } as Visit)
            : v
        ),
      }))
      closeVisitModal()
    }
  }

  const addHerbToVisit = () => {
    if (!tempHerbName || !tempHerbWeight) return
    const herb: Herb = { name: tempHerbName, weight: tempHerbWeight }
    setVisitForm((prev) => ({
      ...prev,
      herbs: [...(prev.herbs || []), herb],
    }))
    setTempHerbName("")
    setTempHerbWeight("")
  }

  const removeHerbFromVisit = (index: number) => {
    setVisitForm((prev) => ({
      ...prev,
      herbs: (prev.herbs || []).filter((_, i) => i !== index),
    }))
  }

  const openTreatmentTab = () => setActiveTab(MEDICAL_RECORD_TABS.TREATMENT)

  return {
    activeBranch,
    searchQuery,
    setSearchQuery,
    filteredPatients,
    activePatient,
    setActivePatientId: () => undefined,
    selectedVisitIndex,
    setSelectedVisitIndex,
    activeVisit,
    activeTab,
    setActiveTab,
    openTreatmentTab,
    visitModalMode,
    visitForm,
    setVisitForm,
    openAddVisitModal,
    openEditVisitModal,
    closeVisitModal,
    handleVisitSubmit,
    tempHerbName,
    setTempHerbName,
    tempHerbWeight,
    setTempHerbWeight,
    addHerbToVisit,
    removeHerbFromVisit,
    showExportModal,
    setShowExportModal,
    fileInputRef,
    triggerImageUpload,
    handleImageUploaded,
    isDragging,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    deleteClinicalImage,
    isLoading,
    isError,
    error,
    refetch,
    patientId,
  }
}

export type MedicalRecordContextValue = ReturnType<typeof useMedicalRecords>

import { useState, useRef, useMemo, useEffect } from "react"
import { useParams } from "react-router-dom"
import { initialPatients } from "@/app/medical-records/data/data"
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

export function useMedicalRecords() {
  const { patientId } = useParams()
  const activeBranch = useClinicStore((state) => state.activeBranch)

  const [patients, setPatients] = useState<Patient[]>(initialPatients)
  const [activePatientId, setActivePatientId] = useState<string>("P001")
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
  const [selectedVisitIndex, setSelectedVisitIndex] = useState(3)
  const [tempHerbName, setTempHerbName] = useState("")
  const [tempHerbWeight, setTempHerbWeight] = useState("")
  const [isDragging, setIsDragging] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const activePatient = useMemo(() => {
    return patients.find((pat) => pat.id === activePatientId) || patients[0]
  }, [patients, activePatientId])

  const activeVisit = useMemo(() => {
    if (!activePatient?.visits?.length) return null
    const idx =
      selectedVisitIndex >= activePatient.visits.length
        ? activePatient.visits.length - 1
        : selectedVisitIndex
    return activePatient.visits[idx >= 0 ? idx : 0]
  }, [activePatient, selectedVisitIndex])

  const filteredPatients = useMemo(() => {
    if (!searchQuery) return patients
    return patients.filter(
      (p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.phone.includes(searchQuery)
    )
  }, [patients, searchQuery])

  useEffect(() => {
    if (patientId) setActivePatientId(patientId)
  }, [patientId])

  useEffect(() => {
    if (activeBranch === "Hàng Bông") {
      setActivePatientId("P001")
      setSelectedVisitIndex(3)
      return
    }
    setActivePatientId("P002")
    setSelectedVisitIndex(1)
  }, [activeBranch])

  const updateActiveVisitImages = (updater: (images: string[]) => string[]) => {
    if (!activeVisit) return
    setPatients((prev) =>
      prev.map((p) => {
        if (p.id !== activePatient.id) return p
        return {
          ...p,
          visits: p.visits.map((v) => {
            if (v.id !== activeVisit.id) return v
            return {
              ...v,
              clinicalImages: updater(v.clinicalImages || []),
            }
          }),
        }
      })
    )
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
      const newId = activePatient.visits.length + 1
      const followUpPlan = visitForm.followUpPlan?.followUpDate
        ? visitForm.followUpPlan
        : undefined

      const createdVisit: Visit = {
        id: newId,
        visitNumber: newId,
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

      setPatients((prev) =>
        prev.map((p) => {
          if (p.id !== activePatient.id) return p
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
      )

      setSelectedVisitIndex(activePatient.visits.length)
      closeVisitModal()
      return
    }

    if (visitModalMode === "edit") {
      const followUpPlan = visitForm.followUpPlan?.followUpDate
        ? visitForm.followUpPlan
        : undefined

      setPatients((prev) =>
        prev.map((p) => {
          if (p.id !== activePatient.id) return p
          return {
            ...p,
            metricNextExamination: followUpPlan?.followUpDate
              ? formatIsoDateToVi(followUpPlan.followUpDate)
              : p.metricNextExamination,
            visits: p.visits.map((v) =>
              v.id === visitForm.id
                ? ({ ...visitForm, followUpPlan } as Visit)
                : v
            ),
          }
        })
      )
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
    setActivePatientId,
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
  }
}

export type MedicalRecordContextValue = ReturnType<typeof useMedicalRecords>

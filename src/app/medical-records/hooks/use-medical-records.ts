import { useState, useRef, useMemo, useEffect } from "react"
import { useParams } from "react-router-dom"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
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
  type VisitFormMode,
} from "@/app/medical-records/constants/visit-form"
import {
  medicalRecordKeys,
  patientMedicalRecordQueryOptions,
} from "@/app/medical-records/queries/patient-medical-record-query"
import {
  createMedicalVisit,
  updateMedicalVisit,
} from "@/app/medical-records/services/medical-record-service"
import {
  getApiErrorMessage,
  mapVisitFormToCreatePayload,
  mapVisitFormToUpdatePayload,
} from "@/app/medical-records/mappers/map-visit-request"

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

type VisitSelectionIntent =
  | { kind: "last" }
  | { kind: "id"; id: string }

export function useMedicalRecords() {
  const { patientId } = useParams()
  const queryClient = useQueryClient()
  const activeBranch = useClinicStore((state) => state.activeBranch)

  const {
    data: fetchedPatient,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery(patientMedicalRecordQueryOptions(patientId ?? ""))

  const [localPatient, setLocalPatient] = useState<Patient | null>(null)
  const [selectVisitAfterRefetch, setSelectVisitAfterRefetch] =
    useState<VisitSelectionIntent | null>(null)
  const loadedPatientIdRef = useRef<string | null>(null)
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
    loadedPatientIdRef.current = null
    setSelectedVisitIndex(0)
    setSelectVisitAfterRefetch(null)
    setLocalPatient(null)
  }, [patientId])

  useEffect(() => {
    if (!fetchedPatient || fetchedPatient.id !== patientId) return

    if (selectVisitAfterRefetch) {
      if (selectVisitAfterRefetch.kind === "last") {
        setSelectedVisitIndex(
          Math.max(0, fetchedPatient.visits.length - 1)
        )
      } else {
        const idx = fetchedPatient.visits.findIndex(
          (visit: Visit) => visit.id === selectVisitAfterRefetch.id
        )
        if (idx >= 0) setSelectedVisitIndex(idx)
      }
      setSelectVisitAfterRefetch(null)
      setLocalPatient(null)
      return
    }

    if (loadedPatientIdRef.current !== fetchedPatient.id) {
      loadedPatientIdRef.current = fetchedPatient.id
      setSelectedVisitIndex(
        Math.max(0, fetchedPatient.visits.length - 1)
      )
      setLocalPatient(null)
    }
  }, [fetchedPatient, patientId, selectVisitAfterRefetch])

  const visitMutation = useMutation({
    mutationFn: async ({
      mode,
      visit,
    }: {
      mode: VisitFormMode
      visit: Partial<Visit>
    }) => {
      if (!patientId) {
        throw new Error("Thiếu mã bệnh nhân trên URL.")
      }

      if (mode === "add") {
        const payload = mapVisitFormToCreatePayload(visit)
        return createMedicalVisit(patientId, payload)
      }

      if (!visit.id) {
        throw new Error("Thiếu mã lần khám.")
      }

      const payload = mapVisitFormToUpdatePayload(visit)
      return updateMedicalVisit(patientId, visit.id, payload)
    },
    onSuccess: async (visitResponse, variables) => {
      await queryClient.invalidateQueries({
        queryKey: medicalRecordKeys.detail(patientId ?? ""),
      })

      setSelectVisitAfterRefetch(
        variables.mode === "add"
          ? { kind: "last" }
          : { kind: "id", id: visitResponse.id }
      )
      closeVisitModal()
    },
  })

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
    visitMutation.reset()
    setVisitForm(getDefaultVisitForm())
    setVisitModalMode("add")
  }

  const openEditVisitModal = () => {
    if (!activeVisit) return
    visitMutation.reset()
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

  const handleVisitSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!visitModalMode) return

    try {
      await visitMutation.mutateAsync({
        mode: visitModalMode,
        visit: visitForm,
      })
    } catch {
      // Error surfaced via visitMutation.error
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

  const visitSubmitError = visitMutation.error
    ? getApiErrorMessage(visitMutation.error)
    : null

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
    isSubmittingVisit: visitMutation.isPending,
    visitSubmitError,
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

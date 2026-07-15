import { useState, useRef, useMemo, useEffect } from "react"
import { useParams } from "react-router-dom"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type {
  Patient,
  Visit,
  Herb,
} from "@/app/medical-records/interfaces/types"
import type { ClinicalImageCategory } from "@/app/medical-records/constants/clinical-image"
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
import { followUpKeys } from "@/app/standard-medical-record/queries/follow-up-query"
import {
  createMedicalVisit,
  deleteClinicalImage,
  updateMedicalVisit,
  uploadClinicalImage,
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

type VisitSelectionIntent = { kind: "last" } | { kind: "id"; id: string }

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
  const [clinicalImageError, setClinicalImageError] = useState<string | null>(
    null
  )

  useEffect(() => {
    loadedPatientIdRef.current = null
    /* eslint-disable react-hooks/set-state-in-effect */
    setSelectedVisitIndex(0)
    setSelectVisitAfterRefetch(null)
  }, [patientId])

  useEffect(() => {
    if (!fetchedPatient || fetchedPatient.id !== patientId) return

    if (selectVisitAfterRefetch) {
      if (selectVisitAfterRefetch.kind === "last") {
        setSelectedVisitIndex(Math.max(0, fetchedPatient.visits.length - 1))
      } else {
        const idx = fetchedPatient.visits.findIndex(
          (visit: Visit) => visit.id === selectVisitAfterRefetch.id
        )
        if (idx >= 0) setSelectedVisitIndex(idx)
      }
      setSelectVisitAfterRefetch(null)
      return
    }

    if (loadedPatientIdRef.current !== fetchedPatient.id) {
      loadedPatientIdRef.current = fetchedPatient.id
      setSelectedVisitIndex(Math.max(0, fetchedPatient.visits.length - 1))
    }
  }, [fetchedPatient, patientId, selectVisitAfterRefetch])

  const activePatient = fetchedPatient ?? EMPTY_PATIENT

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
      await queryClient.invalidateQueries({
        queryKey: followUpKeys.all,
      })

      setSelectVisitAfterRefetch(
        variables.mode === "add"
          ? { kind: "last" }
          : { kind: "id", id: visitResponse.id }
      )
      closeVisitModal()
    },
  })

  const uploadImageMutation = useMutation({
    mutationFn: async ({
      file,
      category,
    }: {
      file: File
      category: ClinicalImageCategory
    }) => {
      if (!patientId || !activeVisit?.id) {
        throw new Error("Không xác định được lần khám để tải ảnh.")
      }

      return uploadClinicalImage(patientId, activeVisit.id, file, category)
    },
    onSuccess: async (uploadedImage) => {
      setClinicalImageError(null)

      if (patientId && activeVisit?.id) {
        queryClient.setQueryData<Patient>(
          medicalRecordKeys.detail(patientId),
          (current) => {
            if (!current) return current

            return {
              ...current,
              visits: current.visits.map((visit) => {
                if (visit.id !== activeVisit.id) return visit

                const clinicalImages = [...(visit.clinicalImages ?? [])]
                const exists = clinicalImages.some(
                  (image) => image.id === uploadedImage.id
                )
                if (exists) return visit

                clinicalImages.push({
                  id: uploadedImage.id,
                  imageUrl: uploadedImage.imageUrl,
                  category: uploadedImage.category,
                  sortOrder: uploadedImage.sortOrder,
                })

                return { ...visit, clinicalImages }
              }),
            }
          }
        )
      }

      await queryClient.refetchQueries({
        queryKey: medicalRecordKeys.detail(patientId ?? ""),
      })
    },
    onError: (mutationError) => {
      setClinicalImageError(getApiErrorMessage(mutationError))
    },
  })

  const deleteImageMutation = useMutation({
    mutationFn: async (imageId: string) => {
      if (!patientId || !activeVisit?.id) {
        throw new Error("Không xác định được lần khám để xóa ảnh.")
      }

      await deleteClinicalImage(patientId, activeVisit.id, imageId)
    },
    onSuccess: async (_result, imageId) => {
      setClinicalImageError(null)

      if (patientId && activeVisit?.id) {
        queryClient.setQueryData<Patient>(
          medicalRecordKeys.detail(patientId),
          (current) => {
            if (!current) return current

            return {
              ...current,
              visits: current.visits.map((visit) => {
                if (visit.id !== activeVisit.id) return visit

                return {
                  ...visit,
                  clinicalImages: (visit.clinicalImages ?? []).filter(
                    (image) => image.id !== imageId
                  ),
                }
              }),
            }
          }
        )
      }

      await queryClient.refetchQueries({
        queryKey: medicalRecordKeys.detail(patientId ?? ""),
      })
    },
    onError: (mutationError) => {
      setClinicalImageError(getApiErrorMessage(mutationError))
    },
  })

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

  const handleClinicalImageUpload = (
    file: File,
    category: ClinicalImageCategory
  ) => {
    uploadImageMutation.mutate({ file, category })
  }

  const handleClinicalImageDelete = (imageId: string) => {
    deleteImageMutation.mutate(imageId)
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

  const isClinicalImageBusy =
    uploadImageMutation.isPending || deleteImageMutation.isPending

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
    handleClinicalImageUpload,
    handleClinicalImageDelete,
    isClinicalImageBusy,
    clinicalImageError,
    tempHerbName,
    setTempHerbName,
    tempHerbWeight,
    setTempHerbWeight,
    addHerbToVisit,
    removeHerbFromVisit,
    showExportModal,
    setShowExportModal,
    isLoading,
    isError,
    error,
    refetch,
    patientId,
  }
}

export type MedicalRecordContextValue = ReturnType<typeof useMedicalRecords>

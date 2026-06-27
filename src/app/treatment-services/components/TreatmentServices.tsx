import { useMemo, useState } from "react"
import { toast } from "sonner"

import { MODAL_MODE, type ModalModeType } from "@/constants/common"

import {
  MOCK_SERVICE_GROUPS,
  MOCK_TREATMENT_SERVICES,
} from "../data/mock-data"
import type { ServiceGroupFormValues } from "../schemas/service-group-form"
import type { TreatmentServiceFormValues } from "../schemas/treatment-service-form"
import type {
  ServiceFilters,
  ServiceGroup,
  TreatmentService,
} from "../types/treatment-service"
import {
  mapFormValuesToService,
} from "../utils/treatment-service-form"
import { ServiceGroupDialog } from "./ServiceGroupDialog"
import { ServiceGroupSidebar } from "./ServiceGroupSidebar"
import { ServiceListPanel } from "./ServiceListPanel"
import { TreatmentServiceDialog } from "./TreatmentServiceDialog"

const DEFAULT_FILTERS: ServiceFilters = {
  search: "",
  status: "active",
  unit: "Tất cả đơn vị",
  itemType: "all",
}

function filterServices(
  services: TreatmentService[],
  groupId: string | null,
  filters: ServiceFilters
): TreatmentService[] {
  return services.filter((service) => {
    if (groupId && service.groupId !== groupId) return false

    if (filters.status !== "all" && service.status !== filters.status) {
      return false
    }

    if (
      filters.unit !== "Tất cả đơn vị" &&
      service.unit !== filters.unit
    ) {
      return false
    }

    if (filters.itemType !== "all" && service.itemType !== filters.itemType) {
      return false
    }

    if (filters.search.trim()) {
      const query = filters.search.trim().toLowerCase()
      const haystack = `${service.code} ${service.name}`.toLowerCase()
      if (!haystack.includes(query)) return false
    }

    return true
  })
}

function createGroupId(): string {
  return `grp-${crypto.randomUUID()}`
}

function createServiceId(): string {
  return `svc-${crypto.randomUUID()}`
}

function countServicesByGroup(
  services: TreatmentService[],
  groupId: string
): number {
  return services.filter((service) => service.groupId === groupId).length
}

function syncGroupCounts(
  groups: ServiceGroup[],
  services: TreatmentService[]
): ServiceGroup[] {
  return groups.map((group) => ({
    ...group,
    serviceCount: countServicesByGroup(services, group.id),
  }))
}

export function TreatmentServices() {
  const [serviceGroups, setServiceGroups] = useState<ServiceGroup[]>(
    () => syncGroupCounts([...MOCK_SERVICE_GROUPS], MOCK_TREATMENT_SERVICES)
  )
  const [services, setServices] = useState<TreatmentService[]>(
    () => [...MOCK_TREATMENT_SERVICES]
  )
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(
    MOCK_SERVICE_GROUPS[0]?.id ?? null
  )
  const [showServices, setShowServices] = useState(true)
  const [showProducts, setShowProducts] = useState(true)
  const [draftFilters, setDraftFilters] = useState<ServiceFilters>(DEFAULT_FILTERS)
  const [appliedFilters, setAppliedFilters] =
    useState<ServiceFilters>(DEFAULT_FILTERS)
  const [groupDialogOpen, setGroupDialogOpen] = useState(false)
  const [groupDialogMode, setGroupDialogMode] = useState<ModalModeType>(
    MODAL_MODE.ADD
  )
  const [editingGroup, setEditingGroup] = useState<ServiceGroup | null>(null)
  const [serviceDialogOpen, setServiceDialogOpen] = useState(false)
  const [serviceDialogMode, setServiceDialogMode] = useState<ModalModeType>(
    MODAL_MODE.ADD
  )
  const [editingService, setEditingService] = useState<TreatmentService | null>(
    null
  )

  const selectedGroup = serviceGroups.find(
    (group) => group.id === selectedGroupId
  )

  const filteredServices = useMemo(
    () => filterServices(services, selectedGroupId, appliedFilters),
    [services, selectedGroupId, appliedFilters]
  )

  const openAddGroupDialog = () => {
    setGroupDialogMode(MODAL_MODE.ADD)
    setEditingGroup(null)
    setGroupDialogOpen(true)
  }

  const openEditGroupDialog = (group: ServiceGroup) => {
    setGroupDialogMode(MODAL_MODE.EDIT)
    setEditingGroup(group)
    setGroupDialogOpen(true)
  }

  const openAddServiceDialog = () => {
    setServiceDialogMode(MODAL_MODE.ADD)
    setEditingService(null)
    setServiceDialogOpen(true)
  }

  const openEditServiceDialog = (service: TreatmentService) => {
    setServiceDialogMode(MODAL_MODE.EDIT)
    setEditingService(service)
    setServiceDialogOpen(true)
  }

  const handleSaveGroup = async (
    values: ServiceGroupFormValues
  ): Promise<boolean> => {
    const normalizedCode = values.code.trim()
    const duplicateCode = serviceGroups.some(
      (group) =>
        group.code.toLowerCase() === normalizedCode.toLowerCase() &&
        group.id !== editingGroup?.id
    )

    if (duplicateCode) {
      toast.error("Mã nhóm đã tồn tại, vui lòng chọn mã khác.")
      return false
    }

    if (groupDialogMode === MODAL_MODE.ADD) {
      const newGroup: ServiceGroup = {
        id: createGroupId(),
        code: normalizedCode,
        name: values.name.trim(),
        itemType: values.itemType,
        serviceCount: 0,
      }

      setServiceGroups((prev) => [...prev, newGroup])
      setSelectedGroupId(newGroup.id)
      toast.success("Đã thêm nhóm dịch vụ mới.")
      return true
    }

    if (!editingGroup) return false

    setServiceGroups((prev) =>
      prev.map((group) =>
        group.id === editingGroup.id
          ? {
              ...group,
              code: normalizedCode,
              name: values.name.trim(),
              itemType: values.itemType,
            }
          : group
      )
    )
    toast.success("Đã cập nhật nhóm dịch vụ.")
    return true
  }

  const handleSaveService = async (
    values: TreatmentServiceFormValues
  ): Promise<boolean> => {
    const duplicateCode = services.some(
      (service) =>
        service.code.toLowerCase() === values.code.toLowerCase() &&
        service.id !== editingService?.id
    )

    if (duplicateCode) {
      toast.error("Mã dịch vụ/sản phẩm đã tồn tại.")
      return false
    }

    if (serviceDialogMode === MODAL_MODE.ADD) {
      const newService: TreatmentService = {
        id: createServiceId(),
        ...mapFormValuesToService(values),
      }

      const nextServices = [...services, newService]
      setServices(nextServices)
      setServiceGroups(syncGroupCounts(serviceGroups, nextServices))
      toast.success("Đã thêm dịch vụ mới.")
      return true
    }

    if (!editingService) return false

    const nextServices = services.map((service) =>
      service.id === editingService.id
        ? {
            id: editingService.id,
            ...mapFormValuesToService(values, editingService),
          }
        : service
    )
    setServices(nextServices)
    setServiceGroups(syncGroupCounts(serviceGroups, nextServices))
    toast.success("Đã cập nhật dịch vụ.")
    return true
  }

  const handleSelectGroup = (groupId: string) => {
    setSelectedGroupId(groupId)
  }

  const handleApplyFilters = () => {
    setAppliedFilters(draftFilters)
  }

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-[#e8ece9] md:flex-row">
      <ServiceGroupSidebar
        groups={serviceGroups}
        selectedGroupId={selectedGroupId}
        showServices={showServices}
        showProducts={showProducts}
        onSelectGroup={handleSelectGroup}
        onShowServicesChange={setShowServices}
        onShowProductsChange={setShowProducts}
        onAddGroup={openAddGroupDialog}
        onEditGroup={openEditGroupDialog}
      />

      <ServiceListPanel
        services={filteredServices}
        filters={draftFilters}
        selectedGroupName={selectedGroup?.name ?? null}
        onFiltersChange={setDraftFilters}
        onApplyFilters={handleApplyFilters}
        onAddService={openAddServiceDialog}
        onViewService={openEditServiceDialog}
      />

      <ServiceGroupDialog
        open={groupDialogOpen}
        onOpenChange={setGroupDialogOpen}
        mode={groupDialogMode}
        group={editingGroup}
        onSave={handleSaveGroup}
      />

      <TreatmentServiceDialog
        open={serviceDialogOpen}
        onOpenChange={setServiceDialogOpen}
        mode={serviceDialogMode}
        service={editingService}
        services={services}
        serviceGroups={serviceGroups}
        defaultGroupId={selectedGroupId}
        onSave={handleSaveService}
      />
    </div>
  )
}

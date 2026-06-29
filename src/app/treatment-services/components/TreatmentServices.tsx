import { useMemo, useState } from "react"
import { useQuery } from "@tanstack/react-query"

import { MODAL_MODE, type ModalModeType } from "@/constants/common"

import {
  useCreateCatalogServiceMutation,
  useCreateServiceGroupMutation,
  useUpdateCatalogServiceMutation,
  useUpdateServiceGroupMutation,
} from "../hooks/use-treatment-service-mutations"
import type { FetchCatalogServicesParams } from "../interfaces/treatment-services.interfaces"
import {
  mapCatalogServiceFromApi,
  mapFormValuesToApiPayload,
  mapServiceGroupFromApi,
} from "../mappers/map-service-catalog"
import {
  catalogServicesQueryOptions,
  serviceGroupQueryOptions,
} from "../queries/treatment-service-query"
import type { ServiceGroupFormValues } from "../schemas/service-group-form"
import type { TreatmentServiceFormValues } from "../schemas/treatment-service-form"
import type {
  ServiceFilters,
  ServiceGroup,
  TreatmentService,
} from "../types/treatment-service"
import { ServiceGroupDialog } from "./ServiceGroupDialog"
import { ServiceGroupSidebar } from "./ServiceGroupSidebar"
import { ServiceListPanel } from "./ServiceListPanel"
import { TreatmentServiceDialog } from "./TreatmentServiceDialog"

const DEFAULT_FILTERS: ServiceFilters = {
  search: "",
  status: "ACTIVE",
  unit: "Tất cả đơn vị",
  itemType: "all",
}

function buildApiFilters(
  selectedGroupId: string | null,
  filters: ServiceFilters
): FetchCatalogServicesParams {
  const params: FetchCatalogServicesParams = {}

  if (selectedGroupId) {
    params.groupId = selectedGroupId
  }

  const search = filters.search.trim()
  if (search) {
    params.search = search
  }

  if (filters.status !== "all") {
    params.status = filters.status
  }

  if (filters.unit !== "Tất cả đơn vị") {
    params.unit = filters.unit
  }

  if (filters.itemType !== "all") {
    params.itemType = filters.itemType
  }

  return params
}

export function TreatmentServices() {
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null)
  const [showServices, setShowServices] = useState(true)
  const [showProducts, setShowProducts] = useState(true)
  const [draftFilters, setDraftFilters] =
    useState<ServiceFilters>(DEFAULT_FILTERS)
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

  const { data: groupsApi = [], isLoading: isGroupsLoading } = useQuery(
    serviceGroupQueryOptions()
  )
  // map service groups from api to service groups
  const serviceGroups = useMemo(
    () => groupsApi.map(mapServiceGroupFromApi),
    [groupsApi]
  )
  // Get active group id
  const activeGroupId = selectedGroupId ?? serviceGroups[0]?.id ?? null
  // Build api filters
  const apiFilters = useMemo(
    () => buildApiFilters(activeGroupId, appliedFilters),
    [activeGroupId, appliedFilters]
  )

  const { data: servicesApi = [], isLoading: isServicesLoading } = useQuery(
    catalogServicesQueryOptions(apiFilters)
  )
  // Map services from api to services
  const services = useMemo(
    () => servicesApi.map(mapCatalogServiceFromApi),
    [servicesApi]
  )

  const { data: allServicesApi = [] } = useQuery({
    ...catalogServicesQueryOptions({}),
    enabled: serviceDialogOpen,
  })
  // Map all services from api to services
  const allServices = useMemo(
    () => allServicesApi.map(mapCatalogServiceFromApi),
    [allServicesApi]
  )

  const createGroupMutation = useCreateServiceGroupMutation()
  const updateGroupMutation = useUpdateServiceGroupMutation()
  const createServiceMutation = useCreateCatalogServiceMutation()
  const updateServiceMutation = useUpdateCatalogServiceMutation()

  // Get selected group
  const selectedGroup = serviceGroups.find(
    (group: ServiceGroup) => group.id === activeGroupId
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
    const payload = {
      code: values.code.trim(),
      name: values.name.trim(),
      itemType: values.itemType,
    }

    try {
      if (groupDialogMode === MODAL_MODE.ADD) {
        const created = await createGroupMutation.mutateAsync(payload)
        setSelectedGroupId(created.id)
        return true
      }

      if (!editingGroup) return false

      await updateGroupMutation.mutateAsync({
        id: editingGroup.id,
        payload,
      })
      return true
    } catch {
      return false
    }
  }

  const handleSaveService = async (
    values: TreatmentServiceFormValues
  ): Promise<boolean> => {
    try {
      if (serviceDialogMode === MODAL_MODE.ADD) {
        await createServiceMutation.mutateAsync(
          mapFormValuesToApiPayload(values)
        )
        return true
      }

      if (!editingService) return false

      await updateServiceMutation.mutateAsync({
        id: editingService.id,
        payload: mapFormValuesToApiPayload(values),
      })
      return true
    } catch {
      return false
    }
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
        selectedGroupId={activeGroupId}
        showServices={showServices}
        showProducts={showProducts}
        loading={isGroupsLoading}
        onSelectGroup={handleSelectGroup}
        onShowServicesChange={setShowServices}
        onShowProductsChange={setShowProducts}
        onAddGroup={openAddGroupDialog}
        onEditGroup={openEditGroupDialog}
      />

      <ServiceListPanel
        services={services}
        filters={draftFilters}
        selectedGroupName={selectedGroup?.name ?? null}
        loading={isGroupsLoading || isServicesLoading}
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
        services={allServices.length > 0 ? allServices : services}
        serviceGroups={serviceGroups}
        defaultGroupId={activeGroupId}
        onSave={handleSaveService}
      />
    </div>
  )
}

import { useMemo } from "react"
import { Plus } from "lucide-react"

import { DataTable } from "@/components/data-table/data-table"
import { PageHeader } from "@/components/UiCustom/PageHeader"
import { Button } from "@/components/ui/button"

import { ServiceFiltersBar } from "./ServiceFiltersBar"
import { createServiceTableColumns } from "./service-table-columns"
import type {
  ServiceFilters,
  TreatmentService,
} from "../types/treatment-service"

interface ServiceListPanelProps {
  services: TreatmentService[]
  filters: ServiceFilters
  selectedGroupName: string | null
  loading?: boolean
  onFiltersChange: (filters: ServiceFilters) => void
  onApplyFilters: () => void
  onAddService: () => void
  onViewService: (service: TreatmentService) => void
}

export function ServiceListPanel({
  services,
  filters,
  selectedGroupName,
  loading = false,
  onFiltersChange,
  onApplyFilters,
  onAddService,
  onViewService,
}: ServiceListPanelProps) {
  const columns = useMemo(
    () => createServiceTableColumns({ onViewService }),
    [onViewService]
  )

  const headerActions = (
    <Button type="button" onClick={onAddService}>
      <Plus className="h-4 w-4" />
      Thêm mới
    </Button>
  )

  return (
    <section className="flex min-h-0 min-w-0 flex-1 flex-col p-4">
      <PageHeader
        title="Dịch vụ"
        description={selectedGroupName ?? "Tất cả dịch vụ"}
        actions={headerActions}
      />

      <ServiceFiltersBar
        filters={filters}
        onFiltersChange={onFiltersChange}
        onApply={onApplyFilters}
      />

      <div className="mt-4 min-h-0 flex-1 overflow-auto">
        <DataTable
          columns={columns}
          data={services}
          loading={loading}
          classNameTable="border-0 p-0 shadow-none"
        />
      </div>
    </section>
  )
}

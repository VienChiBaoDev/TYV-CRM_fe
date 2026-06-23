import type { ColumnDef } from "@tanstack/react-table"

export interface DataTableProps<TData, TValue> {
  title?: string
  actions?: React.ReactNode
  classNameTable?: string
  columns: ColumnDef<TData, TValue>[]
  data: TData[]

  loading?: boolean

  pageIndex?: number
  pageSize?: number
  pageCount?: number

  onPageChange?: (page: number) => void
}

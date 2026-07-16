"use client"

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table"

import type { DataTableProps } from "./types"
import { DataTablePagination } from "./data-table-pagination"
import { DataTableEmpty } from "./data-table-empty"
import { DataTableSkeleton } from "./data-table-skeleton"

export function DataTable<TData, TValue>({
  title,
  actions,
  classNameTable,
  columns,
  data,
  loading,
  pageIndex = 0,
  pageCount = 1,
  onPageChange,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount,
  })

  if (loading) {
    return <DataTableSkeleton />
  }

  return (
    <div
      className={`space-y-4 rounded-md border border-gray-200 bg-white p-6 ${classNameTable}`}
    >
      <div className="flex items-center justify-between">
        {title && (
          <div>
            <h2 className="text-lg font-bold">{title}</h2>
          </div>
        )}
        {actions && actions}
      </div>
      <div className={`rounded-md border`}>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-muted/50">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="hover:bg-mist-200">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className="hover:bg-gray-300">
                <TableCell colSpan={columns.length}>
                  <DataTableEmpty />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {onPageChange && (
        <DataTablePagination
          pageIndex={pageIndex}
          pageCount={pageCount}
          onPageChange={onPageChange}
        />
      )}
    </div>
  )
}

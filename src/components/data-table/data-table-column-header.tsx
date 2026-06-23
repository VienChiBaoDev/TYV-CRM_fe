"use client"

import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { ColumnDef } from "@tanstack/react-table"

interface Props<TData, TValue> {
  title: string
  column: ColumnDef<TData, TValue>
}

export function DataTableColumnHeader<TData, TValue>({
  title,
  column,
}: Props<TData, TValue>) {
  return (
    <Button
      variant="ghost"
      onClick={() =>
        (
          column as ColumnDef<TData, TValue> & {
            toggleSorting: (isSorted: boolean) => void
          }
        ).toggleSorting(
          (
            column as ColumnDef<TData, TValue> & {
              getIsSorted: () => "asc" | "desc" | false
            }
          ).getIsSorted() === "asc"
        )
      }
    >
      {title}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  )
}

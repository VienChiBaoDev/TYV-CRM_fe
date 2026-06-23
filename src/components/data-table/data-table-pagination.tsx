"use client"

import { Button } from "@/components/ui/button"

interface Props {
  pageIndex: number
  pageCount: number
  onPageChange: (page: number) => void
}

export function DataTablePagination({
  pageIndex,
  pageCount,
  onPageChange,
}: Props) {
  return (
    <div className="flex justify-end gap-2">
      <Button
        variant="outline"
        disabled={pageIndex === 0}
        onClick={() => onPageChange(pageIndex - 1)}
      >
        Previous
      </Button>

      <span className="flex items-center">
        {pageIndex + 1} / {pageCount}
      </span>

      <Button
        variant="outline"
        disabled={pageIndex + 1 >= pageCount}
        onClick={() => onPageChange(pageIndex + 1)}
      >
        Next
      </Button>
    </div>
  )
}

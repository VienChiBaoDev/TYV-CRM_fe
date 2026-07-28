import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Check, ChevronsUpDown, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { prescriptionFormulaListQueryOptions } from "../queries/prescription-formula-query"
import type { PrescriptionFormula } from "../types/prescription-formula"

interface FormulaPickerComboboxProps {
  disabled?: boolean
  loading?: boolean
  onSelect: (formula: PrescriptionFormula) => void
}

export function FormulaPickerCombobox({
  disabled,
  loading,
  onSelect,
}: FormulaPickerComboboxProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")

  const { data: formulas = [], isFetching } = useQuery(
    prescriptionFormulaListQueryOptions()
  )

  const keyword = search.trim().toLowerCase()
  const filtered = keyword
    ? formulas.filter((f) => f.name.toLowerCase().includes(keyword))
    : formulas

  const handleSelect = (formula: PrescriptionFormula) => {
    onSelect(formula)
    setOpen(false)
    setSearch("")
  }

  return (
    <Popover modal open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled || loading}
          className="h-8 justify-between text-xs"
        >
          {loading ? (
            <>
              <Loader2 className="mr-1 size-3.5 animate-spin" />
              Đang áp dụng...
            </>
          ) : (
            "Chọn công thức đã lưu"
          )}
          {!loading && <ChevronsUpDown className="ml-2 size-3.5 opacity-50" />}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[320px] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Tìm công thức..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandEmpty>
              {isFetching ? "Đang tải..." : "Chưa có công thức nào"}
            </CommandEmpty>
            <CommandGroup>
              {filtered.map((formula) => (
                <CommandItem
                  key={formula.id}
                  value={formula.id}
                  onSelect={() => handleSelect(formula)}
                >
                  <Check className="mr-2 size-4 opacity-0" />
                  <div className="min-w-0">
                    <p className="truncate font-medium">{formula.name}</p>
                    <p className="truncate text-[10px] text-slate-500">
                      {formula.herbs.length} vị
                      {formula.dosage ? ` · ${formula.dosage}` : ""}
                    </p>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

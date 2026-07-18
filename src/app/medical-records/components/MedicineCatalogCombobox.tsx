import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Check, ChevronsUpDown, Loader2, X } from "lucide-react"

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
import { medicineListQueryOptions } from "@/app/medicines/queries/medicine-query"
import { formatPrice } from "@/app/treatment-services/utils/format-price"
import type { Medicine } from "@/app/medicines/types/medicine"
import { useDebounce } from "@/hooks/useDebounce"
import { cn } from "@/lib/utils"

const MEDICINE_SEARCH_LIMIT = 20
const MEDICINE_SEARCH_DEBOUNCE_MS = 300

interface MedicineCatalogComboboxProps {
  selectedMedicine: Medicine | null
  disabled?: boolean
  placeholder?: string
  onChange: (medicineId: string) => void
  onSelectMedicine?: (medicine: Medicine) => void
}

export function MedicineCatalogCombobox({
  selectedMedicine,
  disabled,
  placeholder = "Gõ tên thuốc để tìm...",
  onChange,
  onSelectMedicine,
}: MedicineCatalogComboboxProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const debouncedSearch = useDebounce(search, MEDICINE_SEARCH_DEBOUNCE_MS)
  const searchKeyword = debouncedSearch.trim()

  const { data, isFetching } = useQuery({
    ...medicineListQueryOptions({
      page: 1,
      limit: MEDICINE_SEARCH_LIMIT,
      search: searchKeyword || undefined,
    }),
    enabled: open && searchKeyword.length > 0,
  })

  const medicines = data?.data ?? []

  const handleSelect = (medicine: Medicine) => {
    onChange(medicine.id)
    onSelectMedicine?.(medicine)
    setOpen(false)
    setSearch("")
  }

  const handleClear = () => {
    onChange("")
    setSearch("")
  }

  const listEmptyMessage = !searchKeyword
    ? "Gõ tên thuốc để tìm trong kho"
    : isFetching
      ? "Đang tìm..."
      : "Không tìm thấy thuốc"

  return (
    <Popover modal open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            "h-8 w-full justify-between font-normal text-xs",
            !selectedMedicine && "text-muted-foreground"
          )}
        >
          <span className="truncate">
            {selectedMedicine
              ? `${selectedMedicine.name} · ${formatPrice(selectedMedicine.unitPrice)} đ/${selectedMedicine.unit}`
              : placeholder}
          </span>
          <span className="ml-2 flex shrink-0 items-center gap-1">
            {selectedMedicine ? (
              <span
                role="button"
                tabIndex={0}
                aria-label="Xóa thuốc đã chọn"
                className="rounded-full p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                onClick={(event) => {
                  event.stopPropagation()
                  handleClear()
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault()
                    event.stopPropagation()
                    handleClear()
                  }
                }}
              >
                <X className="size-3.5" />
              </span>
            ) : null}
            <ChevronsUpDown className="size-3.5 opacity-50" />
          </span>
        </Button>
      </PopoverTrigger>
        <PopoverContent
          className="z-200 w-(--radix-popover-trigger-width) p-0"
          align="start"
          onOpenAutoFocus={(event) => event.preventDefault()}
          onCloseAutoFocus={(event) => event.preventDefault()}
        >
          <Command shouldFilter={false}>
            <CommandInput
              placeholder={placeholder}
              value={search}
              onValueChange={setSearch}
              autoFocus
            />
            <CommandList>
              {isFetching && searchKeyword ? (
                <div className="flex items-center justify-center gap-2 py-6 text-xs text-muted-foreground">
                  <Loader2 className="size-4 animate-spin" />
                  Đang tìm...
                </div>
              ) : medicines.length === 0 ? (
                <CommandEmpty>{listEmptyMessage}</CommandEmpty>
              ) : (
                <CommandGroup>
                  {medicines.map((medicine) => (
                    <CommandItem
                      key={medicine.id}
                      value={medicine.id}
                      onSelect={() => handleSelect(medicine)}
                    >
                      <Check
                        className={cn(
                          "mr-2 size-4",
                          selectedMedicine?.id === medicine.id
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                        <span className="truncate font-medium">
                          {medicine.name}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          {formatPrice(medicine.unitPrice)} đ/{medicine.unit}
                          {medicine.category ? ` · ${medicine.category}` : ""}
                        </span>
                      </span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
  )
}

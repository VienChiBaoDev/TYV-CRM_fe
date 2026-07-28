import { useMemo, useState } from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import type { ConsumableOptionApi } from "@/app/consumables/services/consumable-api"
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
import { cn } from "@/lib/utils"

interface ConsumableOptionComboboxProps {
  options: ConsumableOptionApi[]
  value: string
  disabled?: boolean
  placeholder?: string
  onChange: (consumableId: string) => void
}

export function ConsumableOptionCombobox({
  options,
  value,
  disabled,
  placeholder = "Chọn vật tư",
  onChange,
}: ConsumableOptionComboboxProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")

  const selected = useMemo(
    () => options.find((option) => option.id === value) ?? null,
    [options, value]
  )

  const filteredOptions = useMemo(() => {
    const keyword = search.trim().toLowerCase()
    if (!keyword) return options

    return options.filter((option) =>
      option.name.toLowerCase().includes(keyword)
    )
  }, [options, search])

  const handleSelect = (option: ConsumableOptionApi) => {
    onChange(option.id)
    setOpen(false)
    setSearch("")
  }

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
            "h-9 w-full min-w-0 justify-between bg-white font-normal",
            !value && "text-muted-foreground"
          )}
        >
          <span className="truncate">
            {selected
              ? `${selected.name} (còn ${selected.stockQuantity} ${selected.unit})`
              : placeholder}
          </span>
          <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
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
            placeholder="Tìm vật tư..."
            value={search}
            onValueChange={setSearch}
            autoFocus
          />
          <CommandList>
            <CommandEmpty>Không tìm thấy vật tư</CommandEmpty>
            <CommandGroup>
              {filteredOptions.map((option) => (
                <CommandItem
                  key={option.id}
                  value={option.id}
                  onSelect={() => handleSelect(option)}
                >
                  <Check
                    className={cn(
                      "mr-2 size-4",
                      value === option.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className="truncate font-medium">{option.name}</span>
                    <span className="text-[10px] text-muted-foreground">
                      Còn {option.stockQuantity} {option.unit}
                      {option.sessionQuotaText
                        ? ` · ${option.sessionQuotaText}`
                        : ""}
                    </span>
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

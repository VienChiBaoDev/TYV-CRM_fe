import { useMemo, useState } from "react"
import { Check, ChevronsUpDown, Minus } from "lucide-react"

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
import type { TreatmentService } from "@/app/treatment-services/types/treatment-service"

interface ServiceCatalogComboboxProps {
  services: TreatmentService[]
  value: string
  disabled?: boolean
  placeholder?: string
  onChange: (serviceId: string) => void
  onSelectService?: (service: TreatmentService) => void
}

export function ServiceCatalogCombobox({
  services,
  value,
  disabled,
  placeholder = "eg. nhập dữ liệu để tìm kiếm",
  onChange,
  onSelectService,
}: ServiceCatalogComboboxProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")

  const selectedService = useMemo(
    () => services.find((service) => service.id === value) ?? null,
    [services, value]
  )

  const filteredServices = useMemo(() => {
    const keyword = search.trim().toLowerCase()
    if (!keyword) return services

    return services.filter(
      (service) =>
        service.name.toLowerCase().includes(keyword) ||
        service.code.toLowerCase().includes(keyword)
    )
  }, [search, services])

  const handleSelect = (service: TreatmentService) => {
    onChange(service.id)
    onSelectService?.(service)
    setOpen(false)
    setSearch("")
  }

  const handleClear = () => {
    onChange("")
    setSearch("")
  }

  return (
    <div className="flex items-center gap-2">
      <Popover modal open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className={cn(
              "h-9 flex-1 justify-between font-normal",
              !value && "text-muted-foreground"
            )}
          >
            <span className="truncate">
              {selectedService
                ? `${selectedService.code} · ${selectedService.name}`
                : placeholder}
            </span>
            <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="z-[200] w-(--radix-popover-trigger-width) p-0"
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
              <CommandEmpty>Không tìm thấy dịch vụ</CommandEmpty>
              <CommandGroup>
                {filteredServices.map((service) => (
                  <CommandItem
                    key={service.id}
                    value={service.id}
                    onSelect={() => handleSelect(service)}
                  >
                    <Check
                      className={cn(
                        "mr-2 size-4",
                        value === service.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <span className="truncate">
                      {service.code} · {service.name}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        disabled={disabled || !value}
        onClick={handleClear}
        aria-label="Xóa dịch vụ đã chọn"
        className="shrink-0 rounded-full"
      >
        <Minus className="size-4" />
      </Button>
    </div>
  )
}

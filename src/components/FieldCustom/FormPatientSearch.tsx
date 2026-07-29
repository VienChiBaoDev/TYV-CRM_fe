import { useEffect, useState } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import type { Control, FieldPath, FieldValues } from "react-hook-form"

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
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
import {
  getPatientById,
  getPatients,
  type Patient,
} from "@/app/medical-records/data/patientService"

interface FormPatientSearchProps<T extends FieldValues> {
  control: Control<T>
  name: FieldPath<T>
  clinicId?: string
  label?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
}

export function FormPatientSearch<T extends FieldValues>({
  control,
  name,
  clinicId,
  label = "Bệnh nhân",
  placeholder = "Tìm theo tên, SĐT, mã BN...",
  required,
  disabled,
}: FormPatientSearchProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>
            {label}
            {required ? <span className="text-destructive">*</span> : null}
          </FormLabel>
          <PatientSearchCombobox
            clinicId={clinicId}
            value={field.value}
            disabled={disabled}
            placeholder={placeholder}
            onChange={field.onChange}
          />
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

interface PatientSearchComboboxProps {
  clinicId?: string
  value: string
  disabled?: boolean
  placeholder?: string
  onChange: (patientId: string) => void
}

export function PatientSearchCombobox({
  clinicId,
  value,
  disabled,
  placeholder = "Chọn bệnh nhân...",
  onChange,
}: PatientSearchComboboxProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [results, setResults] = useState<Patient[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)

  useEffect(() => {
    if (!value) {
      setSelectedPatient(null)
      return
    }

    if (selectedPatient?.id === value) return

    getPatientById(value)
      .then(setSelectedPatient)
      .catch(() => setSelectedPatient(null))
  }, [clinicId, value, selectedPatient?.id])

  useEffect(() => {
    if (!search.trim()) {
      setResults([])
      return
    }

    const timer = window.setTimeout(() => {
      setLoading(true)
      getPatients({ clinicId, search: search.trim() })
        .then(setResults)
        .catch(() => setResults([]))
        .finally(() => setLoading(false))
    }, 300)

    return () => window.clearTimeout(timer)
  }, [clinicId, search])

  const handleSelect = (patient: Patient) => {
    setSelectedPatient(patient)
    onChange(patient.id)
    setOpen(false)
    setSearch("")
    setResults([])
  }

  return (
    <Popover modal open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className={cn(
              "w-full justify-between font-normal",
              !value && "text-muted-foreground",
            )}
          >
            {selectedPatient
              ? `${selectedPatient.fullName} · ${selectedPatient.patientCode}`
              : placeholder}
            <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
          </Button>
        </FormControl>
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
            <CommandEmpty>
              {loading ? "Đang tìm..." : "Không tìm thấy bệnh nhân"}
            </CommandEmpty>
            <CommandGroup>
              {results.map((patient) => (
                <CommandItem
                  key={patient.id}
                  value={patient.id}
                  onSelect={() => handleSelect(patient)}
                >
                  <Check
                    className={cn(
                      "mr-2 size-4",
                      value === patient.id ? "opacity-100" : "opacity-0",
                    )}
                  />
                  <div className="flex flex-col">
                    <span className="font-medium">{patient.fullName}</span>
                    <span className="text-xs text-muted-foreground">
                      {patient.patientCode} · {patient.phone}
                    </span>
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

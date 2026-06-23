import { DataTable } from "@/components/data-table/data-table"
import { Button } from "@/components/ui/button"
import type { ColumnDef } from "@tanstack/react-table"
import { clinicalAssessmentScales } from "../data/data"
import type { ClinicalAssessmentScale } from "../interfaces/StandardMedicalRecord"
import { CLINICAL_ASSESSMENT_SCALE_RESULT } from "@/constants/common"
import { DialogCommon } from "@/components/UiCustom/DialogCommon"
import { useCallback, useState } from "react"
import { FormInput } from "@/components/FieldCustom/FormInput"
import { Form } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  clinicalAssessmentScaleFormDefaultValues,
  clinicalAssessmentScaleFormSchema,
  type ClinicalAssessmentScaleFormValues,
} from "../schemas/clinical-assessment-scale-form"
import { FormSelect } from "@/components/FieldCustom/FormSelect"

export function ClinicalAssessmentScale() {
  const [open, setOpen] = useState(false)
  const form = useForm<ClinicalAssessmentScaleFormValues>({
    resolver: zodResolver(clinicalAssessmentScaleFormSchema),
    defaultValues: clinicalAssessmentScaleFormDefaultValues,
  })

  const handleOpenDialog = useCallback(
    (row: ClinicalAssessmentScale) => {
      form.reset({
        name: row.name,
        appointmentDate: row.appointmentDate,
        physicianInCharge: row.physicianInCharge,
        result: row.result?.toString() ?? "",
        note: row.note ?? "",
      })
      setOpen(true)
    },
    [form]
  )

  const onSubmit = (data: ClinicalAssessmentScaleFormValues) => {
    console.log(data)
    setOpen(false)
  }

  const handleSave = form.handleSubmit(onSubmit)

  const columns: ColumnDef<ClinicalAssessmentScale>[] = [
    {
      accessorKey: "name",
      header: "Tên bệnh nhân",
    },
    {
      accessorKey: "appointmentDate",
      header: "Hạn tái khám",
    },
    {
      accessorKey: "physicianInCharge",
      header: "Bác sĩ phụ trách",
    },
    {
      accessorKey: "result",
      header: "Kết quả",
      cell: ({ row }) => {
        return (
          <div>
            {CLINICAL_ASSESSMENT_SCALE_RESULT[
              row.original
                .result as keyof typeof CLINICAL_ASSESSMENT_SCALE_RESULT
            ] && (
              <span
                className={
                  CLINICAL_ASSESSMENT_SCALE_RESULT[
                    row.original
                      .result as keyof typeof CLINICAL_ASSESSMENT_SCALE_RESULT
                  ].className
                }
              >
                {
                  CLINICAL_ASSESSMENT_SCALE_RESULT[
                    row.original
                      .result as keyof typeof CLINICAL_ASSESSMENT_SCALE_RESULT
                  ].name
                }
              </span>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: "note",
      header: "Ghi chú",
      cell: ({ row }) => {
        return <div>{row.original.note}</div>
      },
    },
    {
      accessorKey: "actions",
      header: "Thao tác",
      cell: ({ row }) => {
        return (
          <div>
            {(Number(row.original.result) === 5 ||
              row.original.result === null) && (
              <Button
                size="icon"
                onClick={() => handleOpenDialog(row.original)}
                className="w-full bg-yellow-700 text-white hover:bg-emerald-800"
              >
                Hỏi thăm
              </Button>
            )}
          </div>
        )
      },
    },
  ]

  return (
    <>
      <DataTable
        title="Đánh giá lâm sàng gần nhất (Hỏi thăm)"
        classNameTable="mt-4"
        columns={columns}
        data={clinicalAssessmentScales}
        loading={false}
        pageIndex={0}
        pageCount={2}
        onPageChange={() => {}}
      />
      <DialogCommon
        open={open}
        onOpenChange={setOpen}
        title="Đánh giá lâm sàng gần nhất (Hỏi thăm)"
        onSubmit={handleSave}
        loading={form.formState.isSubmitting}
        submitText="Lưu"
        cancelText="Hủy"
      >
        <Form {...form}>
          <div className="flex flex-col gap-4">
            <FormSelect
              control={form.control}
              name="result"
              label="Kết quả"
              required
              options={Object.values(CLINICAL_ASSESSMENT_SCALE_RESULT).map(
                (item) => ({
                  label: item.name,
                  value: item.value.toString(),
                })
              )}
            />
            <FormInput control={form.control} name="note" label="Ghi chú" />
          </div>
        </Form>
      </DialogCommon>
    </>
  )
}

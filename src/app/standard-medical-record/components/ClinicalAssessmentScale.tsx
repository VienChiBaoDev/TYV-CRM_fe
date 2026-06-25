import { DataTable } from "@/components/data-table/data-table"

import { Button } from "@/components/ui/button"

import type { ColumnDef } from "@tanstack/react-table"

import type { ClinicalAssessmentScale } from "../interfaces/StandardMedicalRecord"

import { CLINICAL_ASSESSMENT_SCALE_RESULT } from "@/constants/common"

import { DialogCommon } from "@/components/UiCustom/DialogCommon"

import { useCallback, useEffect, useState } from "react"

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

import { pendingAssessmentsQueryOptions } from "../queries/follow-up-query"

import { useClinicStore } from "@/stores/clinic-store"

import { useQuery } from "@tanstack/react-query"

import { useSubmitAssessmentMutation } from "../hooks/use-follow-up-mutations"

import { mapFeResultToApi } from "../mappers/map-follow-up-response"

import { Link } from "react-router-dom"

import { urlPaths } from "@/constants/urlPaths"

import { formatIsoDateToVi } from "@/app/medical-records/constants/visit-form"

import { DEFAULT_LIMIT } from "@/types/pagination"

export function ClinicalAssessmentScale() {
  const [open, setOpen] = useState(false)

  const activeBranch = useClinicStore((s) => s.activeBranch)

  const [activeRowId, setActiveRowId] = useState<string | null>(null)

  const branch = activeBranch === "Cầu Giấy" ? "CAU_GIAY" : "HANG_BONG"

  const [page, setPage] = useState(1)

  useEffect(() => {
    setPage(1)
  }, [branch])

  const form = useForm<ClinicalAssessmentScaleFormValues>({
    resolver: zodResolver(clinicalAssessmentScaleFormSchema),

    defaultValues: clinicalAssessmentScaleFormDefaultValues,
  })

  const { data, isLoading } = useQuery(
    pendingAssessmentsQueryOptions({ branch, page, limit: DEFAULT_LIMIT })
  )

  const rows = data?.data ?? []

  const pageCount = Math.max(data?.meta.totalPages ?? 0, 1)

  const assessmentMutation = useSubmitAssessmentMutation()

  const handleOpenDialog = useCallback(
    (row: ClinicalAssessmentScale) => {
      setActiveRowId(row.id)

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

  const onSubmit = async (data: ClinicalAssessmentScaleFormValues) => {
    if (!activeRowId) return

    await assessmentMutation.mutateAsync({
      followUpId: activeRowId,

      payload: {
        assessmentResult: mapFeResultToApi(data.result),

        assessmentNote: data.note,
      },
    })

    setOpen(false)
  }

  const handleSave = form.handleSubmit(onSubmit)

  const columns: ColumnDef<ClinicalAssessmentScale>[] = [
    {
      accessorKey: "name",

      header: "Tên bệnh nhân",

      cell: ({ row }) => {
        return (
          <Link to={urlPaths.medicalRecords(row.original.patientId)}>
            {row.original.name}
          </Link>
        )
      },
    },

    {
      accessorKey: "followUpDate",

      header: "Hạn tái khám",

      cell: ({ row }) => formatIsoDateToVi(row.original.followUpDate),
    },

    {
      accessorKey: "appointmentDate",

      header: "Ngày hỏi thăm",

      cell: ({ row }) => formatIsoDateToVi(row.original.appointmentDate),
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
            {row.original.result === null && (
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
        data={rows}
        loading={isLoading}
        pageIndex={page - 1}
        pageCount={pageCount}
        onPageChange={(nextPageIndex) => setPage(nextPageIndex + 1)}
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

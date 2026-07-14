import { useRef, useState } from "react"
import { ImagePlus, Trash2 } from "lucide-react"
import Lightbox from "yet-another-react-lightbox"
import Zoom from "yet-another-react-lightbox/plugins/zoom"
import "yet-another-react-lightbox/styles.css"
import type { TreatmentSessionImageApi } from "@/app/medical-records/interfaces/patient-treatment-api"
import { cn } from "@/lib/utils"

interface TreatmentSessionImageZoneProps {
  images: TreatmentSessionImageApi[]
  canUpload: boolean
  isUploading: boolean
  isDeleting: boolean
  onUpload: (file: File) => void
  onDelete: (imageId: string) => void
}

export function TreatmentSessionImageZone({
  images,
  canUpload,
  isUploading,
  isDeleting,
  onUpload,
  onDelete,
}: TreatmentSessionImageZoneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(0)
  const isBusy = isUploading || isDeleting

  const handleFile = (file: File | undefined) => {
    if (!file || !canUpload || isBusy) return
    onUpload(file)
  }

  return (
    <div className="mt-3 space-y-3 rounded-lg border border-slate-200 bg-slate-50/50 p-3">
      <p className="text-xs font-bold text-slate-700">Ảnh điều trị</p>

      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {images.map((image) => (
            <div
              key={image.id}
              className="group relative aspect-square overflow-hidden rounded-lg border border-slate-200 bg-white"
            >
              <button
                type="button"
                className="h-full w-full cursor-pointer"
                onClick={() => {
                  setIndex(images.findIndex((item) => item.id === image.id))
                  setOpen(true)
                }}
                aria-label="Xem ảnh"
              >
                <img
                  src={image.imageUrl}
                  alt="Ảnh điều trị"
                  className="h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </button>
              <button
                type="button"
                onClick={() => onDelete(image.id)}
                disabled={isBusy}
                className="absolute top-1 right-1 cursor-pointer rounded-full bg-red-600 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-700 disabled:cursor-not-allowed"
                aria-label="Xóa ảnh"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div
        onDragOver={(e) => {
          e.preventDefault()
          if (canUpload && !isBusy) setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setIsDragging(false)
          handleFile(e.dataTransfer.files?.[0])
        }}
        onClick={() => canUpload && !isBusy && fileInputRef.current?.click()}
        className={cn(
          "flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-4 transition-all",
          !canUpload || isBusy
            ? "cursor-not-allowed border-slate-200 bg-slate-100 opacity-60"
            : "cursor-pointer",
          canUpload &&
            !isBusy &&
            (isDragging
              ? "border-emerald-500 bg-emerald-50/50"
              : "border-slate-300 hover:border-emerald-400 hover:bg-emerald-50/30")
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          disabled={!canUpload || isBusy}
          onChange={(e) => {
            handleFile(e.target.files?.[0])
            e.target.value = ""
          }}
        />

        <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500">
          <ImagePlus className="h-4 w-4" />
        </div>
        <p className="text-xs font-semibold text-slate-700">
          {isUploading ? "Đang tải lên..." : "Tải ảnh điều trị"}
        </p>
        <p className="mt-1 text-[10px] text-slate-400">
          Kéo thả hoặc click · Tối đa 10MB
        </p>
      </div>

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        index={index}
        slides={images.map((image) => ({ src: image.imageUrl }))}
        plugins={[Zoom]}
      />
    </div>
  )
}

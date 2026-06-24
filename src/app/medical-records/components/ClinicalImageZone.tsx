import { useRef, useState } from "react"
import { Trash2 } from "lucide-react"
import type { ClinicalImage } from "@/app/medical-records/interfaces/types"
import type { ClinicalImageCategory } from "@/app/medical-records/constants/clinical-image"
import { CLINICAL_IMAGE_ZONE_CONFIG } from "@/app/medical-records/constants/clinical-image"
import Lightbox from "yet-another-react-lightbox"
import "yet-another-react-lightbox/styles.css"
import Zoom from "yet-another-react-lightbox/plugins/zoom"
interface ClinicalImageZoneProps {
  category: ClinicalImageCategory
  sectionLabel: string
  images: ClinicalImage[]
  isUploading: boolean
  onUpload: (file: File, category: ClinicalImageCategory) => void
  onDelete: (imageId: string) => void
}

export function ClinicalImageZone({
  category,
  sectionLabel,
  images,
  isUploading,
  onUpload,
  onDelete,
}: ClinicalImageZoneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const zone = CLINICAL_IMAGE_ZONE_CONFIG[category]
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(0)

  const handleFile = (file: File | undefined) => {
    if (!file || isUploading) return
    onUpload(file, category)
  }

  return (
    <div className="space-y-3 rounded-xl border border-slate-200/60 bg-slate-50 p-4 shadow-2xs">
      <p className="text-[10px] font-semibold text-slate-500">{sectionLabel}</p>

      {images.length > 0 && (
        <div className="mb-3 grid grid-cols-2 gap-2">
          {images.map((image) => (
            <div
              key={image.id}
              className="group relative aspect-square overflow-hidden rounded-lg border border-slate-200 bg-slate-100"
            >
              <img
                src={image.imageUrl}
                alt={zone.uploadTitle}
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
                onClick={() => {
                  setIndex(images.findIndex((img) => img.id === image.id))
                  setOpen(true)
                }}
              />
              <button
                type="button"
                onClick={() => onDelete(image.id)}
                disabled={isUploading}
                className="bg-red-650 absolute top-1 right-1 cursor-pointer rounded-full p-1 text-white opacity-0 transition-opacity duration-150 group-hover:opacity-100 hover:bg-red-700 disabled:cursor-not-allowed"
                title="Xóa hình"
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
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setIsDragging(false)
          handleFile(e.dataTransfer.files?.[0])
        }}
        onClick={() => !isUploading && fileInputRef.current?.click()}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-all ${
          isUploading
            ? "cursor-not-allowed border-slate-200 bg-slate-100 opacity-60"
            : isDragging
              ? "border-emerald-600 bg-emerald-50/50"
              : "border-slate-300 hover:border-emerald-500 hover:bg-emerald-50/10"
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => {
            handleFile(e.target.files?.[0])
            e.target.value = ""
          }}
          className="hidden"
          accept="image/*"
          disabled={isUploading}
        />

        <div className="shadow-3xs mb-2 flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-xl transition-transform duration-150 hover:scale-105">
          {zone.icon}
        </div>

        <p className="text-xs font-semibold text-slate-700">
          {isUploading ? "Đang tải lên..." : zone.uploadTitle}
        </p>
        <p className="mt-1 text-[10px] text-slate-400">{zone.uploadHint}</p>
      </div>

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        index={index}
        slides={images.map((img) => ({
          src: img.imageUrl,
        }))}
        plugins={[Zoom]}
        zoom={{
          maxZoomPixelRatio: 5,
          zoomInMultiplier: 2,
          doubleTapDelay: 300,
        }}
      />
    </div>
  )
}

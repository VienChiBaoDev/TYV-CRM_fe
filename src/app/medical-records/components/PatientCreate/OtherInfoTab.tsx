import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Info } from "lucide-react"

export function OtherInfoTab() {
  return (
    <div className="grid grid-cols-4 gap-6 p-6">
      {/* Row 1 */}
      <div className="col-span-1 space-y-1.5">
        <Label className="text-gray-700 font-medium text-xs">Facebook</Label>
        <div className="flex">
          <div className="flex items-center justify-center bg-gray-100 border border-r-0 rounded-l-md px-3 text-sm text-gray-500">
            Facebook.com/
          </div>
          <Input className="rounded-l-none" />
        </div>
      </div>
      <div className="col-span-1 space-y-1.5">
        <Label className="text-gray-700 font-medium text-xs">Zalo</Label>
        <div className="flex">
          <div className="flex items-center justify-center bg-gray-100 border border-r-0 rounded-l-md px-3 text-sm text-gray-500">
            Zalo.me/
          </div>
          <Input className="rounded-l-none" />
        </div>
      </div>
      <div className="col-span-1 space-y-1.5">
        <Label className="text-gray-700 font-medium text-xs">Viber</Label>
        <div className="flex">
          <div className="flex items-center justify-center bg-gray-100 border border-r-0 rounded-l-md px-3 text-sm text-gray-500">
            Viber.com/
          </div>
          <Input className="rounded-l-none" />
        </div>
      </div>
      <div className="col-span-1 space-y-1.5">
        <Label className="text-gray-700 font-medium text-xs">Instagram</Label>
        <div className="flex">
          <div className="flex items-center justify-center bg-gray-100 border border-r-0 rounded-l-md px-3 text-sm text-gray-500">
            Instagram.com/
          </div>
          <Input className="rounded-l-none" />
        </div>
      </div>

      {/* Row 2 */}
      <div className="col-span-1 space-y-1.5">
        <Label className="text-gray-700 font-medium text-xs">Số điện thoại 2 ( 10 ký tự số )</Label>
        <Input placeholder="eg. số điện thoại" />
      </div>
      <div className="col-span-1 space-y-1.5">
        <Label className="text-gray-700 font-medium text-xs">Bảo hiểm</Label>
        <Input placeholder="eg. bảo hiểm" />
      </div>
      <div className="col-span-1 space-y-1.5">
        <Label className="text-gray-700 font-medium text-xs">Ngày hết hạn</Label>
        <Input placeholder="dd-mm-yyyy" />
      </div>
      <div className="col-span-1 space-y-1.5">
        <Label className="text-gray-700 font-medium text-xs">Hộ chiếu</Label>
        <Input placeholder="eg. hộ chiếu" />
      </div>

      {/* Row 3 */}
      <div className="col-span-1 space-y-1.5">
        <Label className="text-gray-700 font-medium text-xs">Dân tộc</Label>
        <Input placeholder="eg. dân tộc" />
      </div>
      <div className="col-span-1 space-y-1.5">
        <Label className="text-gray-700 font-medium text-xs">Tôn giáo</Label>
        <Select>
          <SelectTrigger className="text-gray-400">
            <SelectValue placeholder="tôn giáo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">tôn giáo</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="col-span-1 space-y-1.5">
        <Label className="text-gray-700 font-medium text-xs">Nhân viên marketing</Label>
        <Select>
          <SelectTrigger className="text-gray-400">
            <SelectValue placeholder="nhân viên marketing" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">nhân viên marketing</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="col-span-1 space-y-1.5">
        <Label className="text-gray-700 font-medium text-xs">Gclid</Label>
        <Input placeholder="eg. gclid" />
      </div>

      {/* Row 4 */}
      <div className="col-span-1 space-y-1.5">
        <div className="flex items-center gap-1">
          <Label className="text-gray-700 font-medium text-xs">ĐVQHNS</Label>
          <Info className="h-3.5 w-3.5 text-green-700 bg-green-100 rounded-full cursor-help" />
        </div>
        <Input placeholder="eg. đvqhns" />
      </div>
      <div className="col-span-3" />

      {/* Row 5 */}
      <div className="col-span-4 space-y-1.5">
        <Label className="text-gray-700 font-medium text-xs">Ghi chú</Label>
        <Textarea placeholder="eg. ghi chú" className="min-h-[100px] resize-none" />
      </div>
    </div>
  )
}

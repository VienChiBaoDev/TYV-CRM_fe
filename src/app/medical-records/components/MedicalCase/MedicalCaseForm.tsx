import { useCallback, useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Save, Printer, RotateCcw, Loader2 } from "lucide-react"
import { useMedicalRecordContext } from "@/app/medical-records/hooks/use-medical-record-context"
import {
  fetchMedicalCase,
  saveMedicalCase,
} from "@/app/medical-records/services/medical-case-service"
import "./medical-case-form.css"

/* ---------- Types ---------- */
interface MedicalCaseData {
  // Header
  soYTe: string
  benhVien: string
  khoa: string
  buong: string
  giuong: string
  soNhapVien: string
  soLuuTru: string
  maSoBenhTat: string

  // Phần I - I. KHOA KHÁM BỆNH
  hoTen: string
  sinhNgay: string
  tuoi: string
  gioiTinh: "Nam" | "Nữ" | ""
  ngheNghiep: string
  danToc: string
  quocTich: string
  soNha: string
  thonPho: string
  xaPhuong: string
  huyenQuan: string
  tinhTP: string
  noiLamViec: string
  doiTuong: string
  soTheBHYT: string
  tenThanNhan: string
  dienThoaiThanNhan: string
  gioKham: string
  phutKham: string
  ngayKham: string
  thangKham: string
  namKham: string
  noiGioiThieu: string
  chanDoanKKB_YHCT: string
  chanDoanKKB_YHHD: string

  // II. CHẨN ĐOÁN (bảng 2 cột)
  chanDoan_YHHD_noiDieuTri: string
  chanDoan_YHHD_raVien_benhChinh: string
  chanDoan_YHHD_raVien_benhKemTheo: string
  chanDoan_YHCT_noiDieuTri: string
  chanDoan_YHCT_benhDanh: string
  chanDoan_YHCT_batCuong: string
  chanDoan_YHCT_tangPhu: string
  chanDoan_YHCT_kinhMach: string
  chanDoan_YHCT_nguyenNhan: string
  chanDoan_YHCT_chanDoanRaVien: string

  // III. KẾT QUẢ ĐIỀU TRỊ
  ketQuaDieuTri: string

  // PHẦN II - BỆNH ÁN
  // A/ Y HỌC HIỆN ĐẠI
  lyDoVaoVien: string
  benhSu: string
  tienSuBanThan: string
  tienSuGiaDinh: string
  khamToanThan: string
  mach: string
  nhietDo: string
  huyetAp: string
  nhipTho: string
  canNang: string
  cacBoPhan: string
  tomTatCLS: string
  chanDoan_benhChinh: string
  chanDoan_benhKemTheo: string
  chanDoan_phanBiet: string

  // B/ Y HỌC CỔ TRUYỀN
  vongChan: string
  vanChan: string
  vanChanDetail: string
  thietChan_xucChan: string
  machTayTrai: string
  machTayPhai: string
  tomTatTuChan: string
  yhct_benhDanh: string
  yhct_batCuong: string
  yhct_tangPhuKinhLac: string
  yhct_nguyenNhan: string

  // C. ĐIỀU TRỊ
  dieuTriYHCT: boolean
  phapDieuTri: string
  phuongThuoc: string
  phuongHuyet: string
  dieuTriYHHD: boolean
  dieuTriKetHop: string
  cheDoDinhDuong: string
  cheDoHoLy: string

  // D. TIÊN LƯỢNG
  tienLuong: string

  // PHẦN III - TỔNG KẾT BỆNH ÁN RA VIỆN
  tk_lyDoVaoVien: string
  tk_quaTrinhBenhLy: string
  tk_ketQuaXetNghiem: string
  tk_chanDoanVaoVien_YHHD: string
  tk_chanDoanVaoVien_YHCT: string
  tk_phuongPhap_YHHD: string
  tk_phuongPhap_YHCT: string
  tk_ketQuaDieuTri: string
  tk_chanDoanRaVien_YHHD: string
  tk_chanDoanRaVien_YHCT: string
  tk_tinhTrangRaVien: string
  tk_thoiGianDieuTri: string
  tk_tuNgay: string
  tk_denNgay: string
  tk_huongDieuTriTiep: string

  // PHIẾU ĐIỀU TRỊ
  phieu_benhVien: string
  phieu_so: string
  phieu_phong: string
  phieu_chanDoan: string
}

const defaultData: MedicalCaseData = {
  soYTe: "",
  benhVien: "",
  khoa: "",
  buong: "",
  giuong: "",
  soNhapVien: "",
  soLuuTru: "",
  maSoBenhTat: "",
  hoTen: "",
  sinhNgay: "",
  tuoi: "",
  gioiTinh: "",
  ngheNghiep: "",
  danToc: "Kinh",
  quocTich: "Việt Nam",
  soNha: "",
  thonPho: "",
  xaPhuong: "",
  huyenQuan: "",
  tinhTP: "",
  noiLamViec: "",
  doiTuong: "",
  soTheBHYT: "",
  tenThanNhan: "",
  dienThoaiThanNhan: "",
  gioKham: "",
  phutKham: "",
  ngayKham: "",
  thangKham: "",
  namKham: "",
  noiGioiThieu: "",
  chanDoanKKB_YHCT: "",
  chanDoanKKB_YHHD: "",

  chanDoan_YHHD_noiDieuTri: "",
  chanDoan_YHHD_raVien_benhChinh: "",
  chanDoan_YHHD_raVien_benhKemTheo: "",
  chanDoan_YHCT_noiDieuTri: "",
  chanDoan_YHCT_benhDanh: "",
  chanDoan_YHCT_batCuong: "",
  chanDoan_YHCT_tangPhu: "",
  chanDoan_YHCT_kinhMach: "",
  chanDoan_YHCT_nguyenNhan: "",
  chanDoan_YHCT_chanDoanRaVien: "",
  ketQuaDieuTri: "",

  lyDoVaoVien: "",
  benhSu: "",
  tienSuBanThan: "",
  tienSuGiaDinh: "",
  khamToanThan: "",
  mach: "",
  nhietDo: "",
  huyetAp: "",
  nhipTho: "",
  canNang: "",
  cacBoPhan: "",
  tomTatCLS: "",
  chanDoan_benhChinh: "",
  chanDoan_benhKemTheo: "",
  chanDoan_phanBiet: "",

  vongChan: "",
  vanChan: "",
  vanChanDetail: "",
  thietChan_xucChan: "",
  machTayTrai: "",
  machTayPhai: "",
  tomTatTuChan: "",
  yhct_benhDanh: "",
  yhct_batCuong: "",
  yhct_tangPhuKinhLac: "",
  yhct_nguyenNhan: "",

  dieuTriYHCT: false,
  phapDieuTri: "",
  phuongThuoc: "",
  phuongHuyet: "",
  dieuTriYHHD: false,
  dieuTriKetHop: "",
  cheDoDinhDuong: "",
  cheDoHoLy: "",
  tienLuong: "",

  tk_lyDoVaoVien: "",
  tk_quaTrinhBenhLy: "",
  tk_ketQuaXetNghiem: "",
  tk_chanDoanVaoVien_YHHD: "",
  tk_chanDoanVaoVien_YHCT: "",
  tk_phuongPhap_YHHD: "",
  tk_phuongPhap_YHCT: "",
  tk_ketQuaDieuTri: "",
  tk_chanDoanRaVien_YHHD: "",
  tk_chanDoanRaVien_YHCT: "",
  tk_tinhTrangRaVien: "",
  tk_thoiGianDieuTri: "",
  tk_tuNgay: "",
  tk_denNgay: "",
  tk_huongDieuTriTiep: "",

  phieu_benhVien: "",
  phieu_so: "",
  phieu_phong: "",
  phieu_chanDoan: "",
}

/* ---------- Helpers ---------- */
function Field({
  value,
  onChange,
  className = "",
  placeholder = "...................",
  style,
}: {
  value: string
  onChange: (v: string) => void
  className?: string
  placeholder?: string
  style?: React.CSSProperties
}) {
  return (
    <input
      type="text"
      className={`mc-field ${className}`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={style}
    />
  )
}

function TextArea({
  value,
  onChange,
  placeholder = "...................",
  rows = 2,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  rows?: number
}) {
  const ref = useRef<HTMLTextAreaElement>(null)

  const handleInput = useCallback(() => {
    const el = ref.current
    if (el) {
      el.style.height = "auto"
      el.style.height = el.scrollHeight + "px"
    }
  }, [])

  // Giãn chiều cao khi nạp dữ liệu đã lưu, tránh bị cắt chữ lúc in
  useEffect(() => {
    handleInput()
  }, [value, handleInput])

  return (
    <textarea
      ref={ref}
      className="mc-textarea"
      value={value}
      onChange={(e) => {
        onChange(e.target.value)
        handleInput()
      }}
      placeholder={placeholder}
      rows={rows}
    />
  )
}

/* ========== MAIN COMPONENT ========== */
export default function MedicalCaseForm() {
  const { activePatient, printRequested, setPrintRequested } =
    useMedicalRecordContext()

  const patientDefaults: Partial<MedicalCaseData> = {
    hoTen: activePatient?.name ?? "",
    tuoi: activePatient?.age?.toString() ?? "",
    gioiTinh: activePatient?.gender ?? "",
    soNha: activePatient?.address ?? "",
  }

  const [data, setData] = useState<MedicalCaseData>(() => ({
    ...defaultData,
    ...patientDefaults,
  }))
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState<{
    type: "success" | "error"
    text: string
  } | null>(null)

  // Load dữ liệu bệnh án đã lưu khi mount
  useEffect(() => {
    const patientId = activePatient?.id
    if (!patientId) return

    let cancelled = false
    setIsLoading(true)

    fetchMedicalCase(patientId)
      .then((response) => {
        if (cancelled) return
        if (response?.formData) {
          setData((prev) => ({
            ...prev,
            ...(response.formData as Partial<MedicalCaseData>),
          }))
        }
      })
      .catch(() => {
        // Nếu chưa có bệnh án thì giữ default, không cần báo lỗi
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [activePatient?.id])

  // Nút "Xuất BA" ở đầu trang chuyển sang tab này rồi bật cờ in
  useEffect(() => {
    if (!printRequested || isLoading) return

    const frame = requestAnimationFrame(() => {
      window.print()
      setPrintRequested(false)
    })

    return () => cancelAnimationFrame(frame)
  }, [printRequested, isLoading, setPrintRequested])

  const set = useCallback(
    <K extends keyof MedicalCaseData>(key: K, value: MedicalCaseData[K]) => {
      setData((prev) => ({ ...prev, [key]: value }))
    },
    []
  )

  const handleSave = async () => {
    const patientId = activePatient?.id
    if (!patientId) {
      setSaveMessage({
        type: "error",
        text: "Không tìm thấy thông tin bệnh nhân.",
      })
      return
    }

    setIsSaving(true)
    setSaveMessage(null)

    try {
      await saveMedicalCase(
        patientId,
        data as unknown as Record<string, unknown>
      )
      setSaveMessage({ type: "success", text: "Đã lưu bệnh án thành công!" })
      setTimeout(() => setSaveMessage(null), 3000)
    } catch {
      setSaveMessage({
        type: "error",
        text: "Lưu bệnh án thất bại. Vui lòng thử lại.",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleReset = () => {
    if (confirm("Bạn có chắc muốn xóa toàn bộ dữ liệu đã nhập?")) {
      setData({
        ...defaultData,
        ...patientDefaults,
      })
    }
  }

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 300,
        }}
      >
        <Loader2 className="h-8 w-8 animate-spin text-emerald-700" />
        <span style={{ marginLeft: 12, color: "#64748b" }}>
          Đang tải bệnh án...
        </span>
      </div>
    )
  }

  return (
    <div
      id="medical-case-print"
      className="mc-print-root"
      style={{ maxHeight: "80vh", overflowY: "auto", padding: "12px 0" }}
    >
      <div className="mc-paper">
        {/* ============ HEADER ============ */}
        <div className="mc-header">
          <div className="mc-header-left">
            <div className="mc-row">
              <label>Sở Y tế:</label>
              <Field
                value={data.soYTe}
                onChange={(v) => set("soYTe", v)}
                className="mc-field-lg"
              />
            </div>
            <div className="mc-row">
              <label>BV:</label>
              <Field
                value={data.benhVien}
                onChange={(v) => set("benhVien", v)}
                className="mc-field-lg"
              />
            </div>
            <div className="mc-row">
              <label>Khoa:</label>
              <Field
                value={data.khoa}
                onChange={(v) => set("khoa", v)}
                className="mc-field-lg"
              />
            </div>
            <div className="mc-row">
              <label>Buồng:</label>
              <Field
                value={data.buong}
                onChange={(v) => set("buong", v)}
                className="mc-field-md"
              />
              <label>Giường:</label>
              <Field
                value={data.giuong}
                onChange={(v) => set("giuong", v)}
                className="mc-field-md"
              />
            </div>
          </div>
          <div className="mc-header-right">
            <div className="mc-row" style={{ justifyContent: "flex-end" }}>
              <label>Số nhập viện:</label>
              <Field
                value={data.soNhapVien}
                onChange={(v) => set("soNhapVien", v)}
                className="mc-field-md"
              />
            </div>
            <div className="mc-row" style={{ justifyContent: "flex-end" }}>
              <label>Số lưu trữ:</label>
              <Field
                value={data.soLuuTru}
                onChange={(v) => set("soLuuTru", v)}
                className="mc-field-md"
              />
            </div>
            <div className="mc-row" style={{ justifyContent: "flex-end" }}>
              <label>Mã số bệnh tật:</label>
              <Field
                value={data.maSoBenhTat}
                onChange={(v) => set("maSoBenhTat", v)}
                className="mc-field-md"
              />
            </div>
          </div>
        </div>

        {/* ============ TITLE ============ */}
        <div className="mc-title">
          <h2>BỆNH ÁN NGOẠI TRÚ</h2>
          <h3>Y HỌC CỔ TRUYỀN</h3>
        </div>

        {/* ======================================================== */}
        {/* PHẦN I: PHẦN CHUNG                                       */}
        {/* ======================================================== */}
        <div className="mc-section-title">PHẦN I: PHẦN CHUNG</div>
        <div className="mc-subsection-title">I. KHOA KHÁM BỆNH</div>

        {/* 1. Họ và tên / 2. Sinh ngày */}
        <div className="mc-row">
          <strong>1.</strong>
          <label>
            Họ và tên <em>(In hoa)</em>:
          </label>
          <Field
            value={data.hoTen}
            onChange={(v) => set("hoTen", v)}
            className="mc-field-lg"
          />
          <strong style={{ marginLeft: 12 }}>2.</strong>
          <label>Sinh ngày:</label>
          <Field
            value={data.sinhNgay}
            onChange={(v) => set("sinhNgay", v)}
            className="mc-field-lg"
          />
          <label>Tuổi</label>
          <Field
            value={data.tuoi}
            onChange={(v) => set("tuoi", v)}
            className="mc-field-sm"
          />
        </div>

        {/* 3. Giới tính / 4. Nghề nghiệp */}
        <div className="mc-row">
          <strong>3.</strong>
          <label>Giới tính</label>
          <span className="mc-checkbox-group">
            <label className="mc-checkbox-item">
              <input
                type="checkbox"
                checked={data.gioiTinh === "Nam"}
                onChange={() =>
                  set("gioiTinh", data.gioiTinh === "Nam" ? "" : "Nam")
                }
              />
              Nam
            </label>
            <label className="mc-checkbox-item">
              <input
                type="checkbox"
                checked={data.gioiTinh === "Nữ"}
                onChange={() =>
                  set("gioiTinh", data.gioiTinh === "Nữ" ? "" : "Nữ")
                }
              />
              Nữ
            </label>
          </span>
          <strong style={{ marginLeft: 20 }}>4.</strong>
          <label>Nghề nghiệp:</label>
          <Field
            value={data.ngheNghiep}
            onChange={(v) => set("ngheNghiep", v)}
            className="mc-field-lg"
          />
        </div>

        {/* 5. Dân tộc / 6. Quốc tịch */}
        <div className="mc-row">
          <strong>5.</strong>
          <label>Dân tộc:</label>
          <Field
            value={data.danToc}
            onChange={(v) => set("danToc", v)}
            className="mc-field-md"
          />
          <strong style={{ marginLeft: 20 }}>6.</strong>
          <label>Quốc tịch:</label>
          <Field
            value={data.quocTich}
            onChange={(v) => set("quocTich", v)}
            className="mc-field-md"
          />
        </div>

        {/* 7. Địa chỉ */}
        <div className="mc-row">
          <strong>7.</strong>
          <label>Địa chỉ: Số nhà:</label>
          <Field
            value={data.soNha}
            onChange={(v) => set("soNha", v)}
            className="mc-field-md"
          />
          <label>Thôn, phố:</label>
          <Field
            value={data.thonPho}
            onChange={(v) => set("thonPho", v)}
            className="mc-field-md"
          />
          <label>Xã, phường:</label>
          <Field
            value={data.xaPhuong}
            onChange={(v) => set("xaPhuong", v)}
            className="mc-field-md"
          />
        </div>
        <div className="mc-row" style={{ paddingLeft: 16 }}>
          <label>Huyện (Q,Tx):</label>
          <Field
            value={data.huyenQuan}
            onChange={(v) => set("huyenQuan", v)}
            className="mc-field-lg"
          />
          <label>Tỉnh, thành phố:</label>
          <Field
            value={data.tinhTP}
            onChange={(v) => set("tinhTP", v)}
            className="mc-field-lg"
          />
        </div>

        {/* 8. Nơi làm việc / 9. Đối tượng */}
        <div className="mc-row">
          <strong>8.</strong>
          <label>Nơi làm việc:</label>
          <Field
            value={data.noiLamViec}
            onChange={(v) => set("noiLamViec", v)}
            className="mc-field-lg"
          />
          <strong style={{ marginLeft: 12 }}>9.</strong>
          <label>Đối tượng:</label>
          <span className="mc-checkbox-group">
            {["BHYT", "Thu phí", "Miễn", "Khác"].map((opt) => (
              <label key={opt} className="mc-checkbox-item">
                <input
                  type="radio"
                  name="doiTuong"
                  checked={data.doiTuong === opt}
                  onChange={() => set("doiTuong", opt)}
                />
                {opt}
              </label>
            ))}
          </span>
        </div>

        {/* 10. Số thẻ BHYT */}
        <div className="mc-row">
          <strong>10.</strong>
          <label>Số thẻ BHYT:</label>
          <Field
            value={data.soTheBHYT}
            onChange={(v) => set("soTheBHYT", v)}
            className="mc-field-lg"
          />
        </div>

        {/* 11. Thân nhân */}
        <div className="mc-row">
          <strong>11.</strong>
          <label>Họ và tên thân nhân của NB khi cần báo tin:</label>
          <Field
            value={data.tenThanNhan}
            onChange={(v) => set("tenThanNhan", v)}
            className="mc-field-lg"
          />
          <label>Điện thoại số:</label>
          <Field
            value={data.dienThoaiThanNhan}
            onChange={(v) => set("dienThoaiThanNhan", v)}
            className="mc-field-md"
          />
        </div>

        {/* 12. Đến khám bệnh lúc */}
        <div className="mc-row">
          <strong>12.</strong>
          <label>Đến khám bệnh lúc:</label>
          <Field
            value={data.gioKham}
            onChange={(v) => set("gioKham", v)}
            className="mc-field-sm"
            placeholder="giờ"
          />
          <label>giờ</label>
          <Field
            value={data.phutKham}
            onChange={(v) => set("phutKham", v)}
            className="mc-field-sm"
            placeholder="phút"
          />
          <label>phút</label>
          <label style={{ marginLeft: 6 }}>ngày</label>
          <Field
            value={data.ngayKham}
            onChange={(v) => set("ngayKham", v)}
            className="mc-field-sm"
          />
          <label>tháng</label>
          <Field
            value={data.thangKham}
            onChange={(v) => set("thangKham", v)}
            className="mc-field-sm"
          />
          <label>năm</label>
          <Field
            value={data.namKham}
            onChange={(v) => set("namKham", v)}
            className="mc-field-sm"
          />
        </div>

        {/* 13. Nơi giới thiệu */}
        <div className="mc-row">
          <strong>13.</strong>
          <label>Nơi giới thiệu:</label>
          <span className="mc-checkbox-group">
            {["1. Cơ quan Y tế", "2. Tự đến", "3. Khác"].map((opt) => (
              <label key={opt} className="mc-checkbox-item">
                <input
                  type="radio"
                  name="noiGioiThieu"
                  checked={data.noiGioiThieu === opt}
                  onChange={() => set("noiGioiThieu", opt)}
                />
                {opt}
              </label>
            ))}
          </span>
        </div>

        {/* 15. Chẩn đoán khoa khám bệnh */}
        <div style={{ marginTop: 6 }}>
          <div className="mc-sub-heading">
            15. Chẩn đoán của khoa khám bệnh:
          </div>
          <div className="mc-indent">
            <div className="mc-row">
              <label>- Theo YHCT:</label>
              <Field
                value={data.chanDoanKKB_YHCT}
                onChange={(v) => set("chanDoanKKB_YHCT", v)}
                className="mc-field-xl"
              />
            </div>
            <div className="mc-row">
              <label>- Theo YHHĐ:</label>
              <Field
                value={data.chanDoanKKB_YHHD}
                onChange={(v) => set("chanDoanKKB_YHHD", v)}
                className="mc-field-xl"
              />
            </div>
          </div>
        </div>

        <div style={{ textAlign: "right", marginTop: 10 }}>
          <strong>THẦY THUỐC KHÁM BỆNH</strong>
          <br />
          <em style={{ fontSize: 12, color: "#64748b" }}>
            (Ký tên, ghi rõ họ tên)
          </em>
        </div>

        {/* ======================================================== */}
        {/* II. CHẨN ĐOÁN - Bảng 2 cột YHHĐ / YHCT                 */}
        {/* ======================================================== */}
        <div className="mc-subsection-title" style={{ marginTop: 16 }}>
          II. CHẨN ĐOÁN:
        </div>
        <table className="mc-diag-table">
          <tbody>
            <tr>
              <td style={{ width: "50%" }}>
                <strong>1 Chẩn đoán theo YHHĐ:</strong>
                <div className="mc-row" style={{ marginTop: 4 }}>
                  <label>1.2 Nơi điều trị:</label>
                  <Field
                    value={data.chanDoan_YHHD_noiDieuTri}
                    onChange={(v) => set("chanDoan_YHHD_noiDieuTri", v)}
                    className="mc-field-xl"
                  />
                </div>
              </td>
              <td style={{ width: "50%" }}>
                <strong>2 CHẨN ĐOÁN THEO YHCT</strong>
                <div className="mc-row" style={{ marginTop: 4 }}>
                  <label>2.2 Nơi điều trị:</label>
                  <Field
                    value={data.chanDoan_YHCT_noiDieuTri}
                    onChange={(v) => set("chanDoan_YHCT_noiDieuTri", v)}
                    className="mc-field-xl"
                  />
                </div>
                <div className="mc-row">
                  <label>
                    <strong>2.2.1 Bệnh danh:</strong>
                  </label>
                  <Field
                    value={data.chanDoan_YHCT_benhDanh}
                    onChange={(v) => set("chanDoan_YHCT_benhDanh", v)}
                    className="mc-field-xl"
                  />
                </div>
                <div className="mc-row">
                  <label>
                    <strong>2.2.2 Bát cương:</strong>
                  </label>
                  <Field
                    value={data.chanDoan_YHCT_batCuong}
                    onChange={(v) => set("chanDoan_YHCT_batCuong", v)}
                    className="mc-field-xl"
                  />
                </div>
                <div className="mc-row">
                  <label>
                    <strong>2.2.3 Tạng phủ:</strong>
                  </label>
                  <Field
                    value={data.chanDoan_YHCT_tangPhu}
                    onChange={(v) => set("chanDoan_YHCT_tangPhu", v)}
                    className="mc-field-xl"
                  />
                </div>
                <div className="mc-row">
                  <label>
                    <strong>2.2.4 Kinh mạch:</strong>
                  </label>
                  <Field
                    value={data.chanDoan_YHCT_kinhMach}
                    onChange={(v) => set("chanDoan_YHCT_kinhMach", v)}
                    className="mc-field-xl"
                  />
                </div>
                <div className="mc-row">
                  <label>
                    <strong>2.2.5 Nguyên nhân:</strong>
                  </label>
                  <Field
                    value={data.chanDoan_YHCT_nguyenNhan}
                    onChange={(v) => set("chanDoan_YHCT_nguyenNhan", v)}
                    className="mc-field-xl"
                  />
                </div>
                <div className="mc-row">
                  <label>
                    <strong>2.2.6 Chẩn đoán ra viện:</strong>
                  </label>
                  <Field
                    value={data.chanDoan_YHCT_chanDoanRaVien}
                    onChange={(v) => set("chanDoan_YHCT_chanDoanRaVien", v)}
                    className="mc-field-xl"
                  />
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <div className="mc-row">
                  <label>1.3 Ra viện:</label>
                </div>
                <div className="mc-row">
                  <label>- Bệnh chính:</label>
                  <Field
                    value={data.chanDoan_YHHD_raVien_benhChinh}
                    onChange={(v) => set("chanDoan_YHHD_raVien_benhChinh", v)}
                    className="mc-field-xl"
                  />
                </div>
                <div className="mc-row">
                  <label>- Bệnh kèm theo:</label>
                  <Field
                    value={data.chanDoan_YHHD_raVien_benhKemTheo}
                    onChange={(v) => set("chanDoan_YHHD_raVien_benhKemTheo", v)}
                    className="mc-field-xl"
                  />
                </div>
              </td>
              <td></td>
            </tr>
          </tbody>
        </table>

        {/* ======================================================== */}
        {/* III. KẾT QUẢ ĐIỀU TRỊ                                   */}
        {/* ======================================================== */}
        <div className="mc-subsection-title">III. KẾT QUẢ ĐIỀU TRỊ:</div>
        <div className="mc-result-row" style={{ paddingLeft: 16 }}>
          {[
            "1. Khỏi",
            "2. Đỡ",
            "3. Nặng hơn",
            "4. Chuyển viện",
            "5. Tử vong",
          ].map((opt) => (
            <label key={opt} className="mc-result-item">
              <input
                type="radio"
                name="ketQuaDieuTri_p1"
                checked={data.ketQuaDieuTri === opt}
                onChange={() => set("ketQuaDieuTri", opt)}
              />
              {opt}
            </label>
          ))}
          <span style={{ marginLeft: 8 }}>
            6. Tiên lượng nặng gia đình xin về
          </span>
        </div>
        <div className="mc-row" style={{ paddingLeft: 32, marginTop: 4 }}>
          <label>Ngày</label>
          <Field value="" onChange={() => {}} className="mc-field-sm" />
          <label>tháng</label>
          <Field value="" onChange={() => {}} className="mc-field-sm" />
          <label>năm</label>
          <Field value="" onChange={() => {}} className="mc-field-sm" />
        </div>

        {/* Signatures */}
        <div className="mc-signatures">
          <div className="mc-signature-box">
            <div className="title">Giám đốc BV</div>
            <div style={{ height: 50 }} />
          </div>
          <div className="mc-signature-box">
            <div className="title">Trưởng phòng KHTH</div>
            <div style={{ height: 50 }} />
          </div>
          <div className="mc-signature-box">
            <div className="title">Trưởng khoa</div>
            <div style={{ height: 50 }} />
          </div>
          <div className="mc-signature-box">
            <div className="title">Thầy thuốc điều trị</div>
            <div style={{ height: 50 }} />
          </div>
        </div>

        <hr className="mc-separator" />

        {/* ======================================================== */}
        {/* PHẦN II: BỆNH ÁN                                        */}
        {/* ======================================================== */}
        <div className="mc-section-title">PHẦN II: BỆNH ÁN</div>

        {/* A/ Y HỌC HIỆN ĐẠI */}
        <div className="mc-subsection-title">A/ Y HỌC HIỆN ĐẠI:</div>

        <div className="mc-sub-heading">I. LÝ DO VÀO VIỆN</div>
        <TextArea
          value={data.lyDoVaoVien}
          onChange={(v) => set("lyDoVaoVien", v)}
        />

        <div className="mc-sub-heading">II. BỆNH SỬ</div>
        <TextArea
          value={data.benhSu}
          onChange={(v) => set("benhSu", v)}
          rows={3}
        />

        <div className="mc-sub-heading">III. TIỀN SỬ:</div>
        <div className="mc-indent">
          <div className="mc-row">
            <label>+ Bản thân:</label>
            <Field
              value={data.tienSuBanThan}
              onChange={(v) => set("tienSuBanThan", v)}
              className="mc-field-xl"
            />
          </div>
          <div className="mc-row">
            <label>+ Gia đình:</label>
            <Field
              value={data.tienSuGiaDinh}
              onChange={(v) => set("tienSuGiaDinh", v)}
              className="mc-field-xl"
            />
          </div>
        </div>

        <div className="mc-sub-heading">IV. KHÁM BỆNH:</div>

        {/* 1. Toàn thân + Vitals box */}
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
          <div style={{ flex: 1 }}>
            <div className="mc-row">
              <label>
                <strong>1. Toàn thân:</strong>
              </label>
              <Field
                value={data.khamToanThan}
                onChange={(v) => set("khamToanThan", v)}
                className="mc-field-xl"
              />
            </div>
            <div className="mc-row" style={{ marginTop: 4 }}>
              <label>
                <strong>2. Các bộ phận:</strong>
              </label>
              <Field
                value={data.cacBoPhan}
                onChange={(v) => set("cacBoPhan", v)}
                className="mc-field-xl"
              />
            </div>
            <TextArea
              value=""
              onChange={() => {}}
              rows={4}
              placeholder=".........................................."
            />
          </div>
          <div className="mc-vitals-box">
            <div className="mc-row">
              <label>Mạch</label>
              <Field
                value={data.mach}
                onChange={(v) => set("mach", v)}
                className="mc-field-sm"
              />
              <span>lần/phút</span>
            </div>
            <div className="mc-row">
              <label>Nhiệt độ</label>
              <Field
                value={data.nhietDo}
                onChange={(v) => set("nhietDo", v)}
                className="mc-field-sm"
              />
              <span>°C</span>
            </div>
            <div className="mc-row">
              <label>Huyết áp</label>
              <Field
                value={data.huyetAp}
                onChange={(v) => set("huyetAp", v)}
                className="mc-field-sm"
              />
              <span>mmHg</span>
            </div>
            <div className="mc-row">
              <label>Nhịp thở</label>
              <Field
                value={data.nhipTho}
                onChange={(v) => set("nhipTho", v)}
                className="mc-field-sm"
              />
              <span>lần/phút</span>
            </div>
            <div className="mc-row">
              <label>Cân nặng:</label>
              <Field
                value={data.canNang}
                onChange={(v) => set("canNang", v)}
                className="mc-field-sm"
              />
              <span>Kg</span>
            </div>
          </div>
        </div>

        {/* 3. Tóm tắt kết quả CLS */}
        <div className="mc-row" style={{ marginTop: 6 }}>
          <label>
            <strong>3. Tóm tắt kết quả cận lâm sàng:</strong>
          </label>
        </div>
        <TextArea
          value={data.tomTatCLS}
          onChange={(v) => set("tomTatCLS", v)}
        />

        {/* 4. Chẩn đoán */}
        <div className="mc-sub-heading">4. CHẨN ĐOÁN:</div>
        <div className="mc-indent">
          <div className="mc-row">
            <label>- Chuẩn đoán bệnh chính:</label>
            <Field
              value={data.chanDoan_benhChinh}
              onChange={(v) => set("chanDoan_benhChinh", v)}
              className="mc-field-xl"
            />
          </div>
          <div className="mc-row">
            <label>- Bệnh kèm theo:</label>
            <Field
              value={data.chanDoan_benhKemTheo}
              onChange={(v) => set("chanDoan_benhKemTheo", v)}
              className="mc-field-xl"
            />
          </div>
          <div className="mc-row">
            <label>- Chẩn đoán phân biệt:</label>
            <Field
              value={data.chanDoan_phanBiet}
              onChange={(v) => set("chanDoan_phanBiet", v)}
              className="mc-field-xl"
            />
          </div>
        </div>

        {/* ======================================================== */}
        {/* B/ Y HỌC CỔ TRUYỀN                                      */}
        {/* ======================================================== */}
        <div className="mc-subsection-title" style={{ marginTop: 12 }}>
          B/ Y HỌC CỔ TRUYỀN:
        </div>

        <div className="mc-sub-heading">I/ Vọng chẩn:</div>
        <div className="mc-indent">
          <div className="mc-row">
            <label>Mô tả:</label>
            <Field
              value={data.vongChan}
              onChange={(v) => set("vongChan", v)}
              className="mc-field-xl"
            />
          </div>
          <TextArea
            value=""
            onChange={() => {}}
            rows={1}
            placeholder=".........................................."
          />
        </div>

        <div className="mc-sub-heading">II/ Văn chẩn:</div>
        <div className="mc-indent">
          <div className="mc-row">
            <label>Mô tả:</label>
            <Field
              value={data.vanChan}
              onChange={(v) => set("vanChan", v)}
              className="mc-field-xl"
            />
          </div>
          <TextArea
            value=""
            onChange={() => {}}
            rows={1}
            placeholder=".........................................."
          />
        </div>

        <div className="mc-sub-heading">III/ Vấn chẩn:</div>
        <div className="mc-indent">
          <TextArea
            value={data.vanChanDetail}
            onChange={(v) => set("vanChanDetail", v)}
            rows={2}
          />
        </div>

        <div className="mc-sub-heading">IV/ Thiết chẩn:</div>
        <div className="mc-indent">
          <div className="mc-sub-heading">1. Xúc chẩn:</div>
          <div className="mc-indent">
            <div className="mc-row">
              <label>Mô tả:</label>
              <Field
                value={data.thietChan_xucChan}
                onChange={(v) => set("thietChan_xucChan", v)}
                className="mc-field-xl"
              />
            </div>
          </div>
          <div className="mc-sub-heading" style={{ marginTop: 4 }}>
            2. Mạch chẩn:
          </div>
          <div className="mc-indent">
            <div className="mc-row">
              <label>+ Mạch tay trái:</label>
              <Field
                value={data.machTayTrai}
                onChange={(v) => set("machTayTrai", v)}
                className="mc-field-xl"
              />
            </div>
            <div className="mc-row">
              <label>+ Mạch tay phải:</label>
              <Field
                value={data.machTayPhai}
                onChange={(v) => set("machTayPhai", v)}
                className="mc-field-xl"
              />
            </div>
          </div>
        </div>

        <div className="mc-sub-heading">V. TÓM TẮT TỨ CHẨN :</div>
        <TextArea
          value={data.tomTatTuChan}
          onChange={(v) => set("tomTatTuChan", v)}
          rows={2}
        />

        <div className="mc-sub-heading">VI. CHẨN ĐOÁN:</div>
        <div className="mc-indent">
          <div className="mc-row">
            <label>- Bệnh danh:</label>
            <Field
              value={data.yhct_benhDanh}
              onChange={(v) => set("yhct_benhDanh", v)}
              className="mc-field-xl"
            />
          </div>
          <div className="mc-row">
            <label>- Bát cương:</label>
            <Field
              value={data.yhct_batCuong}
              onChange={(v) => set("yhct_batCuong", v)}
              className="mc-field-xl"
            />
          </div>
          <div className="mc-row">
            <label>- Tạng phủ - Kinh lạc:</label>
            <Field
              value={data.yhct_tangPhuKinhLac}
              onChange={(v) => set("yhct_tangPhuKinhLac", v)}
              className="mc-field-xl"
            />
          </div>
          <div className="mc-row">
            <label>- Nguyên nhân:</label>
            <Field
              value={data.yhct_nguyenNhan}
              onChange={(v) => set("yhct_nguyenNhan", v)}
              className="mc-field-xl"
            />
          </div>
        </div>

        {/* ======================================================== */}
        {/* C. ĐIỀU TRỊ                                               */}
        {/* ======================================================== */}
        <div className="mc-subsection-title" style={{ marginTop: 12 }}>
          C. ĐIỀU TRỊ:
        </div>

        <div className="mc-row">
          <strong>I. Điều trị đơn thuần YHCT</strong>
          <label className="mc-checkbox-item" style={{ marginLeft: 6 }}>
            <input
              type="checkbox"
              checked={data.dieuTriYHCT}
              onChange={() => set("dieuTriYHCT", !data.dieuTriYHCT)}
            />
          </label>
        </div>
        <div className="mc-indent">
          <div className="mc-row">
            <label>1. Pháp điều trị:</label>
            <Field
              value={data.phapDieuTri}
              onChange={(v) => set("phapDieuTri", v)}
              className="mc-field-xl"
            />
          </div>
          <div className="mc-row">
            <label>2. Phương thuốc:</label>
            <Field
              value={data.phuongThuoc}
              onChange={(v) => set("phuongThuoc", v)}
              className="mc-field-xl"
            />
          </div>
          <div className="mc-row">
            <label>3. Phương huyệt:</label>
            <Field
              value={data.phuongHuyet}
              onChange={(v) => set("phuongHuyet", v)}
              className="mc-field-xl"
            />
          </div>
        </div>

        <div className="mc-row" style={{ marginTop: 6 }}>
          <strong>II. Điều trị kết hợp với YHHĐ</strong>
          <label className="mc-checkbox-item" style={{ marginLeft: 6 }}>
            <input
              type="checkbox"
              checked={data.dieuTriYHHD}
              onChange={() => set("dieuTriYHHD", !data.dieuTriYHHD)}
            />
          </label>
        </div>
        <div className="mc-indent">
          <TextArea
            value={data.dieuTriKetHop}
            onChange={(v) => set("dieuTriKetHop", v)}
            rows={2}
          />
        </div>

        <div className="mc-sub-heading">III. Chế độ dinh dưỡng tại nhà</div>
        <Field
          value={data.cheDoDinhDuong}
          onChange={(v) => set("cheDoDinhDuong", v)}
          className="mc-field-xl"
        />

        <div className="mc-sub-heading">IV. Chế độ hộ lý tại nhà</div>
        <Field
          value={data.cheDoHoLy}
          onChange={(v) => set("cheDoHoLy", v)}
          className="mc-field-xl"
        />

        <div className="mc-sub-heading">D. TIÊN LƯỢNG</div>
        <TextArea
          value={data.tienLuong}
          onChange={(v) => set("tienLuong", v)}
        />

        <div style={{ textAlign: "right", marginTop: 12 }}>
          <span style={{ marginRight: 40 }}>
            ......giờ......ngày......tháng......năm......
          </span>
          <br />
          <strong>Thầy thuốc làm bệnh án</strong>
          <br />
          <em style={{ fontSize: 12, color: "#64748b" }}>
            (Ký, ghi rõ họ tên)
          </em>
        </div>

        <hr className="mc-separator" />

        {/* ======================================================== */}
        {/* PHẦN III: TỔNG KẾT BỆNH ÁN RA VIỆN                     */}
        {/* ======================================================== */}
        <div className="mc-bordered-section">
          <div className="mc-section-title" style={{ marginTop: 0 }}>
            PHẦN III: TỔNG KẾT BỆNH
            <br />
            ÁN RA VIỆN
          </div>

          <div className="mc-row">
            <label>
              <strong>1. Lý do vào viện:</strong>
            </label>
            <Field
              value={data.tk_lyDoVaoVien}
              onChange={(v) => set("tk_lyDoVaoVien", v)}
              className="mc-field-xl"
            />
          </div>

          <div className="mc-row" style={{ marginTop: 4 }}>
            <label>
              <strong>2. Quá trình bệnh lý và diễn biến lâm sàng:</strong>
            </label>
          </div>
          <TextArea
            value={data.tk_quaTrinhBenhLy}
            onChange={(v) => set("tk_quaTrinhBenhLy", v)}
            rows={3}
          />

          <div className="mc-row" style={{ marginTop: 4 }}>
            <label>
              <strong>
                3. Kết quả xét nghiệm cận lâm sàng có giá trị chẩn đoán:
              </strong>
            </label>
          </div>
          <TextArea
            value={data.tk_ketQuaXetNghiem}
            onChange={(v) => set("tk_ketQuaXetNghiem", v)}
            rows={2}
          />

          <div className="mc-row" style={{ marginTop: 4 }}>
            <label>
              <strong>4. Chẩn đoán vào viện:</strong>
            </label>
          </div>
          <div className="mc-indent">
            <div className="mc-row">
              <label>- Theo YHHĐ:</label>
              <Field
                value={data.tk_chanDoanVaoVien_YHHD}
                onChange={(v) => set("tk_chanDoanVaoVien_YHHD", v)}
                className="mc-field-xl"
              />
            </div>
            <div className="mc-row">
              <label>- Theo YHCT:</label>
              <Field
                value={data.tk_chanDoanVaoVien_YHCT}
                onChange={(v) => set("tk_chanDoanVaoVien_YHCT", v)}
                className="mc-field-xl"
              />
            </div>
          </div>

          <div className="mc-row" style={{ marginTop: 4 }}>
            <label>
              <strong>5. Phương pháp điều trị:</strong>
            </label>
          </div>
          <div className="mc-indent">
            <div className="mc-row">
              <label>- Theo YHHĐ:</label>
              <Field
                value={data.tk_phuongPhap_YHHD}
                onChange={(v) => set("tk_phuongPhap_YHHD", v)}
                className="mc-field-xl"
              />
            </div>
            <div className="mc-row">
              <label>- Theo YHCT:</label>
              <Field
                value={data.tk_phuongPhap_YHCT}
                onChange={(v) => set("tk_phuongPhap_YHCT", v)}
                className="mc-field-xl"
              />
            </div>
          </div>

          {/* 6. Kết quả điều trị */}
          <div className="mc-row" style={{ marginTop: 4 }}>
            <label>
              <strong>6. Kết quả điều trị:</strong>
            </label>
            <span className="mc-checkbox-group">
              {[
                "1. Khỏi",
                "2. Đỡ",
                "3. Không đỡ",
                "4. Chuyển viện",
                "5. Tử vong",
              ].map((opt) => (
                <label key={opt} className="mc-result-item">
                  <input
                    type="radio"
                    name="tk_ketQuaDieuTri"
                    checked={data.tk_ketQuaDieuTri === opt}
                    onChange={() => set("tk_ketQuaDieuTri", opt)}
                  />
                  {opt}
                </label>
              ))}
            </span>
          </div>

          {/* 7. Chẩn đoán ra viện */}
          <div className="mc-row" style={{ marginTop: 4 }}>
            <label>
              <strong>7. Chẩn đoán ra viện:</strong>
            </label>
          </div>
          <div className="mc-indent">
            <div className="mc-row">
              <label>- Theo YHHĐ:</label>
              <Field
                value={data.tk_chanDoanRaVien_YHHD}
                onChange={(v) => set("tk_chanDoanRaVien_YHHD", v)}
                className="mc-field-xl"
              />
            </div>
            <div className="mc-row">
              <label>- Theo YHCT:</label>
              <Field
                value={data.tk_chanDoanRaVien_YHCT}
                onChange={(v) => set("tk_chanDoanRaVien_YHCT", v)}
                className="mc-field-xl"
              />
            </div>
          </div>

          {/* 8. Tình trạng người bệnh khi ra viện */}
          <div className="mc-row" style={{ marginTop: 4 }}>
            <label>
              <strong>8. Tình trạng người bệnh khi ra viện:</strong>
            </label>
          </div>
          <TextArea
            value={data.tk_tinhTrangRaVien}
            onChange={(v) => set("tk_tinhTrangRaVien", v)}
            rows={2}
          />

          {/* 9. Thời gian điều trị */}
          <div className="mc-row" style={{ marginTop: 4 }}>
            <label>
              <strong>9. Thời gian điều trị:</strong> Tổng số:
            </label>
            <Field
              value={data.tk_thoiGianDieuTri}
              onChange={(v) => set("tk_thoiGianDieuTri", v)}
              className="mc-field-md"
            />
            <label>ngày; "từ</label>
            <Field
              value={data.tk_tuNgay}
              onChange={(v) => set("tk_tuNgay", v)}
              className="mc-field-lg"
            />
            <label>đến</label>
            <Field
              value={data.tk_denNgay}
              onChange={(v) => set("tk_denNgay", v)}
              className="mc-field-lg"
            />
            <label>"</label>
          </div>

          {/* 10. Hướng điều trị */}
          <div className="mc-row" style={{ marginTop: 4 }}>
            <label>
              <strong>10. Hướng điều trị và các chế độ tiếp:</strong>
            </label>
          </div>
          <TextArea
            value={data.tk_huongDieuTriTiep}
            onChange={(v) => set("tk_huongDieuTriTiep", v)}
            rows={3}
          />
        </div>

        {/* ======================================================== */}
        {/* HỒ SƠ, PHIM, ẢNH + Chữ ký                              */}
        {/* ======================================================== */}
        <div className="mc-doc-signature-layout">
          {/* Bảng hồ sơ bên trái */}
          <div>
            <table className="mc-doc-table" style={{ border: "none" }}>
              <thead>
                <tr>
                  <th colSpan={2}>Hồ sơ, phim, ảnh</th>
                </tr>
                <tr>
                  <th>Loại</th>
                  <th>Số tờ</th>
                </tr>
              </thead>
              <tbody>
                {[
                  "X - quang",
                  "CT Scanner",
                  "Siêu âm",
                  "Xét nghiệm",
                  "Khác",
                  "Toàn bộ hồ sơ",
                ].map((item) => (
                  <tr key={item}>
                    <td>- {item}</td>
                    <td>
                      <input
                        type="text"
                        className="mc-field"
                        style={{ width: "100%", borderBottom: "none" }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Chữ ký bên phải */}
          <div className="mc-doc-signature-right">
            <div className="mc-sig-block">
              <div className="sig-title">Người giao hồ sơ:</div>
              <div style={{ height: 40 }} />
              <div className="sig-name-label">
                Họ tên:{" "}
                <Field value="" onChange={() => {}} className="mc-field-md" />
              </div>
            </div>
            <div className="mc-sig-block">
              <div className="sig-title">Người nhận hồ sơ:</div>
              <div style={{ height: 40 }} />
              <div className="sig-name-label">
                Họ tên:{" "}
                <Field value="" onChange={() => {}} className="mc-field-md" />
              </div>
            </div>
            <div className="mc-sig-block">
              <div className="sig-title">Thầy thuốc điều trị:</div>
              <div style={{ height: 50 }} />
              <div className="sig-name-label">
                Họ tên:{" "}
                <Field value="" onChange={() => {}} className="mc-field-md" />
              </div>
            </div>
          </div>
        </div>

        <hr className="mc-separator" />

        {/* ======================================================== */}
        {/* PHIẾU ĐIỀU TRỊ                                          */}
        {/* ======================================================== */}
        <div style={{ marginBottom: 8 }}>
          <div className="mc-row" style={{ justifyContent: "space-between" }}>
            <span>
              <strong>SỞ Y TẾ</strong>
            </span>
            <span style={{ fontSize: 16, fontWeight: 700 }}>
              PHIẾU ĐIỀU TRỊ
            </span>
            <span>
              Số vào viện:{" "}
              <Field value="" onChange={() => {}} className="mc-field-md" />
            </span>
          </div>
          <div className="mc-row" style={{ marginTop: 2 }}>
            <strong>BỆNH VIỆN</strong>
            <Field
              value={data.phieu_benhVien}
              onChange={(v) => set("phieu_benhVien", v)}
              className="mc-field-lg"
            />
            <span style={{ marginLeft: 12 }}>Số:</span>
            <Field
              value={data.phieu_so}
              onChange={(v) => set("phieu_so", v)}
              className="mc-field-md"
            />
          </div>
          <div className="mc-row" style={{ marginTop: 2 }}>
            <label>Họ tên người bệnh:</label>
            <Field
              value={data.hoTen}
              onChange={(v) => set("hoTen", v)}
              className="mc-field-lg"
            />
            <label style={{ marginLeft: 12 }}>Tuổi:</label>
            <Field
              value={data.tuoi}
              onChange={(v) => set("tuoi", v)}
              className="mc-field-sm"
            />
            <label style={{ marginLeft: 12 }}>Giới:</label>
            <Field
              value={data.gioiTinh}
              onChange={() => {}}
              className="mc-field-sm"
            />
          </div>
          <div className="mc-row" style={{ marginTop: 2 }}>
            <label>Khoa:</label>
            <Field
              value={data.khoa}
              onChange={(v) => set("khoa", v)}
              className="mc-field-md"
            />
            <label style={{ marginLeft: 12 }}>Phòng:</label>
            <Field
              value={data.phieu_phong}
              onChange={(v) => set("phieu_phong", v)}
              className="mc-field-md"
            />
            <label style={{ marginLeft: 12 }}>Chẩn đoán bệnh:</label>
            <Field
              value={data.phieu_chanDoan}
              onChange={(v) => set("phieu_chanDoan", v)}
              className="mc-field-lg"
            />
          </div>
        </div>

        <table className="mc-treatment-table">
          <thead>
            <tr>
              <th rowSpan={2} style={{ width: "14%" }}>
                NGÀY GIỜ
              </th>
              <th rowSpan={2} style={{ width: "28%" }}>
                DIỄN BIẾN BỆNH
              </th>
              <th colSpan={2}>Y LỆNH ĐIỀU TRỊ</th>
            </tr>
            <tr>
              <th style={{ width: "32%" }}>
                THUỐC VÀ PHƯƠNG PHÁP ĐIỀU TRỊ KHÁC
              </th>
              <th style={{ width: "26%" }}>CHẾ ĐỘ DD, CHĂM SÓC</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 10 }).map((_, i) => (
              <tr key={i}>
                <td>
                  <input
                    type="text"
                    className="mc-field"
                    style={{ width: "100%", borderBottom: "none" }}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    className="mc-field"
                    style={{ width: "100%", borderBottom: "none" }}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    className="mc-field"
                    style={{ width: "100%", borderBottom: "none" }}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    className="mc-field"
                    style={{ width: "100%", borderBottom: "none" }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ============ ACTION BAR ============ */}
      <div
        className="mc-action-bar"
        style={{ maxWidth: 860, margin: "0 auto", padding: "12px 0" }}
      >
        <Button
          variant="outline"
          onClick={() => window.print()}
          className="gap-2"
          disabled={isSaving}
        >
          <Printer className="h-4 w-4" />
          In bệnh án
        </Button>
        <Button
          variant="outline"
          onClick={handleReset}
          className="gap-2 text-orange-600 hover:text-orange-700"
          disabled={isSaving}
        >
          <RotateCcw className="h-4 w-4" />
          Đặt lại
        </Button>
        <Button
          onClick={handleSave}
          className="gap-2 bg-emerald-800 text-white hover:bg-primary"
          disabled={isSaving}
        >
          {isSaving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {isSaving ? "Đang lưu..." : "Lưu bệnh án"}
        </Button>
      </div>
      {saveMessage && (
        <div
          style={{
            maxWidth: 860,
            margin: "0 auto",
            padding: "8px 16px",
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 500,
            textAlign: "center",
            backgroundColor:
              saveMessage.type === "success" ? "#ecfdf5" : "#fef2f2",
            color: saveMessage.type === "success" ? "#065f46" : "#991b1b",
            border: `1px solid ${saveMessage.type === "success" ? "#a7f3d0" : "#fecaca"}`,
          }}
        >
          {saveMessage.text}
        </div>
      )}
    </div>
  )
}

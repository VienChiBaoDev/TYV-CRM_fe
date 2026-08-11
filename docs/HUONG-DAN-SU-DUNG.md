# Hướng dẫn sử dụng — Thượng Y Viên CRM

Hệ thống quản trị phòng khám Đông Y: khách hàng, hồ sơ bệnh án, lịch hẹn, điều trị, thanh toán, kho thuốc và danh mục dịch vụ.

---

## Mục lục

1. [Đăng nhập & đăng xuất](#1-đăng-nhập--đăng-xuất)
2. [Giao diện chung](#2-giao-diện-chung)
3. [Khách hàng & hồ sơ bệnh án](#3-khách-hàng--hồ-sơ-bệnh-án)
4. [Lịch hẹn](#4-lịch-hẹn)
5. [Lịch làm việc](#5-lịch-làm-việc)
6. [Bệnh án chuẩn](#6-bệnh-án-chuẩn)
7. [Dịch vụ điều trị](#7-dịch-vụ-điều-trị)
8. [Vật tư tiêu hao](#8-vật-tư-tiêu-hao)
9. [Dược liệu & sản phẩm](#9-dược-liệu--sản-phẩm)
10. [Công thức đơn](#10-công-thức-đơn)
11. [Cài đặt](#11-cài-đặt)
12. [Vai trò & quyền](#12-vai-trò--quyền)
13. [Các mục đang phát triển](#13-các-mục-đang-phát-triển)
14. [Thuật ngữ thường dùng](#14-thuật-ngữ-thường-dùng)

---

## 1. Đăng nhập & đăng xuất

### Đăng nhập

1. Mở trang web → màn hình **Đăng nhập** (logo **Thượng Y Viên**, slogan **Nhân • Tâm • Trí**).
2. Nhập **Email** và **Mật khẩu**.
3. Bấm **Đăng nhập**.
4. Sau khi thành công, hệ thống đưa bạn vào **Danh sách khách hàng**.

> Nếu sai thông tin hoặc hết phiên đăng nhập, bạn sẽ được đưa về trang đăng nhập.

### Đăng xuất

Ở thanh menu bên trái (sidebar), bấm **Đăng xuất** ở cuối danh sách.

---

## 2. Giao diện chung

### Thanh menu bên trái (Sidebar)

Menu chia theo nhóm. Một số mục chỉ hiện khi tài khoản của bạn có quyền tương ứng:

| Nhóm | Mục menu | Ghi chú |
|------|----------|---------|
| **Vận hành** | Dashboard | Đang phát triển |
| | Lịch hẹn | Cần quyền xem lịch hẹn |
| | Lịch làm việc | Cần quyền xem ca làm |
| | Khách hàng | Cần quyền xem khách hàng |
| | Bệnh án chuẩn | Luôn hiện (nếu đã đăng nhập) |
| | Dịch vụ điều trị | Cần quyền xem danh mục |
| | Vật tư tiêu hao | Cần quyền xem vật tư |
| **Nhân sự & KPI** | Doanh thu & KPI | Đang phát triển |
| | Hoa hồng & Lương | Đang phát triển |
| **Bán hàng** | Dược liệu & Sản phẩm | Cần quyền xem thuốc |
| | Công thức đơn | Cần quyền xem công thức |
| **Quản trị** | Cài đặt | Chỉ hiện khi có quyền cài đặt (nhân sự / cơ sở / ngân hàng) |

Cuối sidebar hiển thị **tên người dùng**, dòng **Vai trò:** (Quản trị viên / Bác sĩ / Trợ lý / Nhân viên) và nút **Đăng xuất**.

### Chọn cơ sở (chi nhánh)

Ở sidebar có ô **Cơ sở**:

- Nếu được phép đổi chi nhánh (quản trị viên hoặc được gán nhiều cơ sở): chọn từ danh sách (**Chọn cơ sở**).
- Nếu chỉ có một cơ sở: hiển thị tên cố định.
- Nếu chưa chọn: **Chưa chọn cơ sở**.

> Hầu hết danh sách và lịch theo **cơ sở đang chọn**. Hãy kiểm tra đúng cơ sở trước khi thao tác.

Trang **Danh sách khách hàng** cũng có bộ lọc **Cơ sở** riêng.

---

## 3. Khách hàng & hồ sơ bệnh án

Đây là quy trình làm việc chính hàng ngày.

### 3.1. Danh sách khách hàng

**Menu:** Vận hành → **Khách hàng**

- Tiêu đề: **Danh sách khách hàng**
- Cột: **#**, **Khách Hàng**, **Số điện thoại**, **Nguồn**, **Người giới thiệu**, **Sửa**
- Bấm **Tạo mới hồ sơ** để thêm khách
- Bấm một dòng → mở **hồ sơ bệnh án**
- Bấm biểu tượng **Sửa** → hộp thoại **Sửa khách hàng** (tên, giới tính, SĐT, ngày sinh, địa chỉ, nguồn, bác sĩ / trợ lý phụ trách…)
- Dòng đếm: **Số lượng : N**

### 3.2. Tạo hồ sơ mới

1. Bấm **Tạo mới hồ sơ**.
2. Trang **Hồ sơ khách hàng** — tab **Thông tin chung**:
   - Giới tính **Nam** / **Nữ**, **Họ và tên**, **Ngày sinh**, **Số điện thoại**, địa chỉ
   - **Chi nhánh**, **Nguồn** (ví dụ: Khách Vãng Lai, BN Giới Thiệu, Facebook, Zalo…)
   - **Chọn bác sĩ phụ trách**, **Chọn trợ lý phụ trách**
   - Tùy chọn đánh dấu **Tạo lịch hẹn** để tạo luôn cuộc hẹn
3. Tab **Khác**: thông tin bổ sung (nếu có).
4. Có thể đánh dấu **Thỏa thuận khách hàng**.
5. Bấm **Lưu** (hoặc **Đóng** để hủy).

### 3.3. Hồ sơ bệnh án

Mở từ danh sách khách hàng. Tiêu đề **Hồ sơ bệnh án**.

**Phần đầu trang**

- Thông tin khách, thẻ/kiêng kỵ (nếu có)
- Chỉ số: **Lần khám**, **Ngày đ.trị**, **Tái khám**
- **Đặt lịch** — tạo lịch hẹn cho khách
- **Thêm lần khám** — thêm buổi khám mới
- **Xuất BA** — in / xuất bệnh án

**Các tab:** **Lần khám** | **Dịch vụ** | **Thanh toán** | **Điều trị** | **Bệnh án**

#### Tab Lần khám

- Xem timeline các lần khám với trạng thái: **Khám đầu**, **Tái khám**, **Online**, **Cần TD**, **Kế hoạch**
- Badge hoàn tất: **● Hoàn tất** / **Chưa kiểm tra**
- Bấm **Sửa** để chỉnh lần khám; hoặc **Thêm lần khám** → hộp thoại **Thêm lượt khám mới** → **Lưu phiếu khám**
- Khi sửa: **Cập nhật thông tin lần khám** → **Lưu cập nhật**

Nội dung phiếu khám thường gồm:

- **Tiêu đề lần khám**, **Ngày khám**, **Bác sĩ khám**
- **Hình thức**: **Trực tiếp** / **Online (Khám xa)**; **Địa điểm**
- Sinh hiệu: huyết áp, **Mạch (nhịp tim)**
- **Trạng thái tiến trình**, **Mạch chẩn**, triệu chứng
- **Công thức mẫu**, **Kê đơn**, **Liều lượng uống**, **Thêm vị**
- **Lưu công thức** (lưu lại bộ vị để dùng sau)
- Ảnh: **Thiết chẩn (Lưỡi / Mắt / Da dị ứng)**, **Xét nghiệm / Kết quả**, **Ảnh lâm sàng khác**
- **Lịch tái khám**, **Nhắc nhở tự động**
- **Trạng thái điều trị**: **Đang điều trị** / **Cần theo dõi** / **Kết thúc đợt**

#### Tab Dịch vụ

- Bấm **Thêm mới** để gắn dịch vụ / sản phẩm cho khách
- Cột: **Dịch Vụ**, **Thành Tiền**, **Tư Vấn**, **Nội Dung Ghi Chú**, **Chốt Dịch Vụ**, **Xử Lý**
- Menu xử lý: **Xem chi tiết**, **Sửa dịch vụ**, **Hủy dịch vụ**, **Xóa dịch vụ**
- Dịch vụ đã hủy hiển thị badge **Đã hủy**
- Theo dõi tiến độ buổi điều trị trên từng gói (khi có)

#### Tab Thanh toán

- Tóm tắt: **Tổng tiền**, **Thanh toán**, **Còn lại**, **Tiền Cọc**, **Sản Phẩm**, **Dịch Vụ**, **Hoàn trả**
- Thao tác: **Thanh toán** (thu tiền) hoặc **Hoàn tiền**
- Hình thức: **Tiền mặt** / **Chuyển khoản**
- Bảng phiếu: mã **TT** (thanh toán) / **HT** (hoàn trả), hình thức, tổng tiền, chi tiết

#### Tab Điều trị

- Tiêu đề danh sách: **Danh sách điều trị**
- Bấm **Điều trị** để ghi buổi: chọn dịch vụ, bác sĩ, hỗ trợ chuyên môn, nội dung, vật tư tiêu hao, ảnh điều trị
- Cột: **Thời gian**, **Dịch vụ**, **Buổi**, **Nội dung**, **Trạng thái** (**Hoàn thành** / **Đang điều trị**)
- Bộ lọc thao tác: **Đang điều trị** / **Điều trị xong**
- Nút lưu: **Lưu và tiếp tục** hoặc **Lưu**
- Trường hữu ích: **Ngày điều trị kế tiếp**, **Nội dung kế tiếp**, **Ghi chú**, **Tải ảnh điều trị**

#### Tab Bệnh án

- Form bệnh án chính thức (thông tin YHCT / YHHD, kết quả…)
- **Lưu bệnh án**, **Đặt lại**
- Dùng kèm **Xuất BA** để in

---

## 4. Lịch hẹn

**Menu:** Vận hành → **Lịch hẹn**

### Xem lịch

- Lịch theo **tuần**; điều hướng **Tuần trước** / **Hôm nay** / **Tuần sau**
- Lọc **Bác sĩ** (hoặc **Tất cả bác sĩ**)
- Khung giờ làm việc trên lưới (thường 07:00–18:00)
- Badge số lượng: **N lịch trong tuần**

### Tạo / sửa lịch

1. Bấm **Đặt lịch mới** hoặc bấm ô trống trên lịch.
2. Hộp thoại **Đặt lịch hẹn mới** / **Chi tiết lịch hẹn**:
   - Khách hàng, **Thời gian hẹn**, **Bác sĩ**, **Trợ lý**, **Ghi chú**, **Trạng thái**
3. Bấm **Đặt lịch** hoặc **Cập nhật**.

### Tiếp nhận & hủy

- **Tiếp nhận**: khách đã đến (check-in)
- **Hủy lịch**: hủy cuộc hẹn

### Trạng thái lịch hẹn

| Trạng thái | Ý nghĩa |
|-----------|---------|
| Đã đặt | Mới tạo |
| Xác nhận | Đã xác nhận |
| Đã đến | Đã tiếp nhận |
| Hoàn tất | Xong buổi |
| Không đến | Vắng mặt |
| Đã hủy | Đã hủy |

Từ thẻ lịch hẹn có thể mở nhanh hồ sơ bệnh án của khách.

---

## 5. Lịch làm việc

**Menu:** Vận hành → **Lịch làm việc**

1. Chọn **Nhân viên** (chưa chọn sẽ hiện: **Chọn nhân viên để xem lịch làm việc**).
2. Xem lưới lịch theo tuần.
3. **Thêm ca** → hộp thoại **Thêm ca làm** / **Sửa ca làm**: loại **Ca làm** hoặc **Nghỉ** → **Tạo ca** / **Lưu**.
4. **Nghỉ hôm nay** — đánh dấu nghỉ nhanh trong ngày.
5. Có thể **Xóa ca** khi sửa.

---

## 6. Bệnh án chuẩn

**Menu:** Vận hành → **Bệnh án chuẩn**

### Bệnh nhân sắp đến hạn tái khám (7 ngày tới)

- Danh sách khách cần tái khám trong 7 ngày tới
- **Đặt nhanh** hoặc **Đổi lịch**
- Trạng thái: **Đã đặt lịch** / **Chưa đặt lịch**

### Đánh giá lâm sàng gần nhất (Hỏi thăm)

- Danh sách chờ đánh giá
- Bấm **Hỏi thăm** → chọn kết quả:
  - **Tiến triển tốt**
  - **Bình thường**
  - **Cần hội chẩn**
  - **Hủy lịch**
- Có thể kèm ghi chú

---

## 7. Dịch vụ điều trị

**Menu:** Vận hành → **Dịch vụ điều trị**

Quản lý **danh mục** dịch vụ / sản phẩm dùng khi bán và gắn vào hồ sơ khách.

**Cột nhóm (trái)**

- **Nhóm dịch vụ** — **Thêm mới** / sửa nhóm

**Danh sách dịch vụ**

- Tiêu đề **Dịch vụ** — **Thêm mới**
- Lọc: **Tình trạng**, **Đơn vị**, **Loại** (**Dịch vụ** / **Sản phẩm**)
- Trạng thái: **Hoạt động** / **Ngừng hoạt động** (trong form: **Đang sử dụng** / **Ngừng hoạt động**)
- Hộp thoại: **Thêm/Sửa nhóm dịch vụ**, **Thêm/Sửa dịch vụ / sản phẩm** (kèm giá)

---

## 8. Vật tư tiêu hao

**Menu:** Vận hành → **Vật tư tiêu hao**

### Tab Danh mục

- **Tìm**, **Thêm vật tư**, **Sửa**
- **Nhập kho** để tăng tồn
- Trạng thái: **Đang dùng** / **Ngừng dùng**
- Có thể cấu hình định mức dùng cho 1 buổi điều trị

### Tab Lịch sử tiêu hao

- Xem lịch sử dùng vật tư khi ghi điều trị
- Cột: **Ngày**, **Khách hàng**, **Dịch vụ**, **Buổi**, **Vật tư**, **Số lượng**, **Người thực hiện**
- Lọc / phân trang theo nhu cầu

---

## 9. Dược liệu & sản phẩm

**Menu:** Bán hàng → **Dược liệu & Sản phẩm**

Trang hiển thị tiêu đề **Quản lý kho thuốc**:

- **Tìm**, lọc đơn vị
- **Thêm thuốc** / sửa / **Xóa thuốc**
- **Import Excel** — nhập hàng loạt từ file Excel
- Cột: **Tên thuốc**, **Đơn vị**, **Giá / đơn vị**, **Loại thuốc**, **Xử Lý**

Thuốc trong danh mục được chọn khi **kê đơn** ở lần khám.

---

## 10. Công thức đơn

**Menu:** Bán hàng → **Công thức đơn**

- Tiêu đề: **Công thức đơn thuốc**
- **Thêm công thức** — thêm / xem / sửa / xóa
- Thành phần là các vị dược liệu đã có trong kho thuốc
- Trong lần khám có thể **Lưu công thức** từ đơn đang kê để dùng lại sau

> Công thức dùng để tái sử dụng khi kê đơn; không lưu giá trên công thức.

---

## 11. Cài đặt

**Menu:** Quản trị → **Cài đặt**

Chỉ hiện và vào được khi tài khoản có ít nhất một quyền cài đặt (**nhân sự**, **cơ sở**, hoặc **tài khoản ngân hàng**). Thường dành cho **Quản trị viên**; các vai trò khác mặc định không có quyền này.

Các tab cũng lọc theo quyền cụ thể:

### Tab Tài khoản nhân sự

- **Thêm tài khoản** / **Sửa** / **Xóa**
- Cột: **Họ tên**, **Email**, **Vai trò**, **Quyền**, **Chi nhánh**, **Trạng thái** (**Hoạt động** / **Đã khóa**)
- Gán **vai trò** và chỉnh **quyền** chi tiết theo nhóm
- **Reset theo {vai trò}** — đưa quyền về mặc định của vai trò đó

### Tab Cơ sở

- Thêm / sửa / xóa chi nhánh phòng khám
- Trạng thái: **Đang dùng** / **Ngừng dùng**

### Tab Tài khoản ngân hàng

- Thêm / sửa / xóa tài khoản ngân hàng (dùng khi thanh toán / hoàn tiền chuyển khoản)
- Trạng thái: **Đang dùng** / **Ngừng dùng**

---

## 12. Vai trò & quyền

### Vai trò trên giao diện

| Vai trò | Nhãn sidebar |
|---------|--------------|
| ADMIN | Quản trị viên |
| DOCTOR | Bác sĩ |
| ASSISTANT | Trợ lý |
| STAFF | Nhân viên |

Quyền thực tế do **danh sách quyền** trên tài khoản quyết định (có thể chỉnh trong Cài đặt). Menu chỉ hiện mục bạn được xem.

### Quyền mặc định theo vai trò (tham khảo)

| Vai trò | Thường làm được |
|---------|-----------------|
| **Quản trị viên** | Toàn bộ chức năng + Cài đặt |
| **Bác sĩ / Trợ lý** | Khách hàng, lần khám, lịch hẹn, dịch vụ trên hồ sơ, điều trị, bệnh án chuẩn; xem danh mục / thuốc / công thức / vật tư / lịch làm việc. **Không** mặc định: thu/chi tiền, sửa vật tư kho, cài đặt |
| **Nhân viên** | Khách hàng, lịch hẹn, dịch vụ trên hồ sơ, **thanh toán**, bệnh án chuẩn, vật tư (gồm nhập/ghi nhận liên quan). **Không** mặc định: sửa lần khám / điều trị, sửa danh mục thuốc–công thức–dịch vụ, cài đặt |

> Quản trị viên có thể cấp thêm / thu hẹp quyền từng người trong **Cài đặt → Tài khoản nhân sự**. Nếu không thấy một mục menu, hãy hỏi quản trị viên kiểm tra quyền.

---

## 13. Các mục đang phát triển

Các trang sau hiện là **Coming soon** (chưa dùng được):

| Menu | Nội dung |
|------|----------|
| Dashboard | Chức năng Dashboard |
| Doanh thu & KPI | Doanh Thu & KPI |
| Hoa hồng & Lương | Hoa Hồng & Lương |

Khi mở, hệ thống thông báo đang phát triển và có nút quay lại danh sách khách hàng.

---

## 14. Thuật ngữ thường dùng

| Thuật ngữ | Giải thích |
|-----------|------------|
| Khách hàng / Bệnh nhân | Người đến khám / điều trị |
| Hồ sơ bệnh án | Toàn bộ thông tin khám, dịch vụ, thanh toán, điều trị |
| Cơ sở / Chi nhánh | Phòng khám đang làm việc |
| Lần khám | Một buổi khám / tái khám |
| Lịch hẹn | Cuộc hẹn theo lịch |
| Tiếp nhận | Check-in khi khách đến |
| Người giới thiệu | Người giới thiệu khách |
| Nguồn khách hàng | Nơi khách biết đến phòng khám |
| Dịch vụ / Sản phẩm | Mục trong danh mục bán / điều trị |
| Buổi điều trị | Một session trong gói dịch vụ |
| Đơn thuốc / Dược liệu | Thuốc kê trong lần khám |
| Công thức đơn | Bộ vị thuốc dùng lại |
| Thanh toán / Tiền cọc / Hoàn tiền | Ghi nhận tiền vào / cọc / trả lại |
| TT / HT | Phiếu thanh toán / phiếu hoàn trả |
| Tiền mặt / Chuyển khoản | Hình thức thu–chi |
| Vật tư tiêu hao / Nhập kho | Vật tư dùng trong điều trị / tăng tồn |
| Xuất BA | In / xuất bệnh án |
| Tái khám / Đặt nhanh / Đổi lịch | Lịch khám lại và thao tác trên Bệnh án chuẩn |
| Hỏi thăm | Đánh giá lâm sàng gần nhất |
| Mạch chẩn / Thiết chẩn / YHCT / YHHD | Chẩn đoán Đông y / kết hợp YHHĐ |
| Ca làm / Nghỉ | Lịch làm việc nhân sự |
| Quyền | Phân quyền chi tiết trên tài khoản (ngoài vai trò) |

---

## Quy trình gợi ý hàng ngày

```
Đăng nhập → Chọn đúng Cơ sở
    → Xem Lịch hẹn → Tiếp nhận khách
    → Mở Hồ sơ bệnh án
        → Thêm / sửa Lần khám (kê đơn, lưu công thức nếu cần)
        → Gắn Dịch vụ → Thanh toán (nếu có quyền)
        → Ghi Điều trị + vật tư + ảnh
    → Cập nhật Bệnh án chuẩn (tái khám / Hỏi thăm)
Đăng xuất khi hết ca
```

---

*Tài liệu dành cho người dùng cuối hệ thống Thượng Y Viên CRM. Đã cập nhật theo giao diện và phân quyền hiện tại.*

# Hướng dẫn phát triển — Thượng Y Viên CRM

Tài liệu kỹ thuật cho developer làm việc với hệ thống CRM phòng khám Đông Y.

| Repo | Path | Vai trò |
|------|------|---------|
| Frontend | `TYV-CRM_fe` | Vite + React 19 SPA |
| Backend | `TYV-CRM_be` | NestJS 11 + Prisma + PostgreSQL |

Tài liệu người dùng cuối: [`HUONG-DAN-SU-DUNG.md`](./HUONG-DAN-SU-DUNG.md).

---

## Mục lục

1. [Tổng quan kiến trúc](#1-tổng-quan-kiến-trúc)
2. [Yêu cầu môi trường](#2-yêu-cầu-môi-trường)
3. [Chạy local](#3-chạy-local)
4. [Biến môi trường](#4-biến-môi-trường)
5. [Auth & session (cookie JWT)](#5-auth--session-cookie-jwt)
6. [Phân quyền (permissions)](#6-phân-quyền-permissions)
7. [Backend — NestJS](#7-backend--nestjs)
8. [Frontend — React](#8-frontend--react)
9. [API map FE ↔ BE](#9-api-map-fe--be)
10. [Database (Prisma)](#10-database-prisma)
11. [Clinic scope](#11-clinic-scope)
12. [Quy ước code](#12-quy-ước-code)
13. [Thêm tính năng mới (checklist)](#13-thêm-tính-năng-mới-checklist)
14. [Testing](#14-testing)
15. [Deploy](#15-deploy)
16. [Debug thường gặp](#16-debug-thường-gặp)
17. [Drift cần biết](#17-drift-cần-biết)

---

## 1. Tổng quan kiến trúc

```
┌─────────────────────┐         cookie httpOnly          ┌──────────────────────┐
│  TYV-CRM_fe         │  ────── access_token ──────────► │  TYV-CRM_be          │
│  Vite :5173         │     credentials: include         │  NestJS :3003        │
│  React 19           │ ◄──── JSON { user } ──────────── │  JwtAuthGuard        │
│  TanStack Query     │                                  │  PermissionsGuard    │
│  Zustand            │                                  │  Prisma → Postgres   │
│  permissions catalog│                                  │  StaffPermission     │
└─────────────────────┘                                  │  Supabase Storage    │
                                                         └──────────────────────┘
```

**Luồng nghiệp vụ chính**

```
Patient → MedicalVisit / MedicalCase
       → PatientServiceRecord → PatientTreatmentSession (+ consumables)
       → PatientPayment
Appointment / StaffShift / FollowUp (clinic-scoped)
Catalog: ServiceGroup, CatalogService, Medicine, Formula, Consumable
Admin: Staff (+ permissionCodes), Clinic, BankAccount
```

Không có API prefix (`/api`). CORS `credentials: true`. FE và BE khác origin (dev và Cloud Run).

**Phân quyền:** catalog cố định `permissionCode` (vd. `patients:read`). ADMIN bypass; role khác lưu `StaffPermission` (hoặc seed mặc định theo role). FE ẩn menu; BE enforce bằng `@RequirePermissions`.

---

## 2. Yêu cầu môi trường

| Tool | Gợi ý |
|------|--------|
| Node.js | 20+ (Docker BE dùng `node:20-alpine`) |
| Package manager | `pnpm` hoặc `npm` (cả hai repo có lockfile) |
| PostgreSQL | 16 (local qua `docker-compose` BE) hoặc Supabase |
| Browser | Chromium-based để debug cookie |

---

## 3. Chạy local

### 3.1. Backend (`TYV-CRM_be`)

```bash
cd TYV-CRM_be
docker compose up -d          # Postgres local (tuỳ chọn)
pnpm install                  # postinstall → prisma generate
# Tạo .env (không có .env.example) — xem mục 4
npx prisma migrate dev        # LUÔN migrate, KHÔNG db push trên DB dùng chung
pnpm run seed:staff           # admin/doctor/assistant/staff @tyv.vn / 123456
pnpm run start:dev            # → http://localhost:3003
```

| Script | Lệnh |
|--------|------|
| `start:dev` | `nest start --watch` |
| `build` | `prisma generate && nest build` |
| `start:prod` | `node dist/main` |
| `prisma:migrate` | `prisma migrate dev` |
| `prisma:studio` | Prisma Studio |
| `seed:staff` | Seed nhân sự demo |
| `test` | Jest unit |
| `lint` / `format` | ESLint / Prettier |

### 3.2. Frontend (`TYV-CRM_fe`)

```bash
cd TYV-CRM_fe
pnpm install
# .env.development: VITE_API_URL=http://localhost:3003
pnpm dev                      # → http://localhost:5173
```

| Script | Lệnh |
|--------|------|
| `dev` | `vite` |
| `build` | `tsc -b && vite build` |
| `typecheck` | `tsc --noEmit` |
| `lint` | `eslint .` |
| `format` | `prettier --write "**/*.{ts,tsx}"` |
| `preview` | `vite preview` |

> FE **không** có script `test`.

### 3.3. Tài khoản demo (sau `seed:staff`)

| Email | Password | Role |
|-------|----------|------|
| `admin@tyv.vn` | `123456` | ADMIN |
| `doctor@tyv.vn` | `123456` | DOCTOR |
| `assistant@tyv.vn` | `123456` | ASSISTANT |
| `staff@tyv.vn` | `123456` | STAFF |

---

## 4. Biến môi trường

### Backend

| Key | Bắt buộc | Mô tả |
|-----|----------|--------|
| `DATABASE_URL` | Có | Prisma connection (pooler OK) |
| `DIRECT_URL` | Có | Direct URL cho migrate / transaction |
| `JWT_SECRET` | Có (prod) | Fallback code: `dev-secret-change-me` |
| `JWT_EXPIRES_IN` | Không | Mặc định `7d` |
| `PORT` | Không | Mặc định `3003` (Docker `8080`) |
| `NODE_ENV` | Không | Cookie `secure` / `sameSite` |
| `CORS_ORIGIN` | Prod | Comma-separated; dev mặc định `localhost:5173` + `127.0.0.1:5173` |
| `SUPABASE_URL` | Ảnh lâm sàng | Storage |
| `SUPABASE_SERVICE_ROLE_KEY` | Ảnh lâm sàng | Service role |
| `SUPABASE_CLINICAL_BUCKET` | Không | Mặc định `clinical-images` |

### Frontend

| Key | Mô tả |
|-----|--------|
| `VITE_API_URL` | Base URL axios (`http://localhost:3003`) |

Chỉ biến `VITE_*` được inject vào client. Dùng trong `httpService.ts` và `reset-session.ts`.

---

## 5. Auth & session (cookie JWT)

### 5.1. Cơ chế (nguồn sự thật = code)

| | Chi tiết |
|---|----------|
| Cookie name | `access_token` (`AUTH_COOKIE_NAME`) |
| Cookie flags | `httpOnly: true`; prod: `secure + sameSite=none`; dev: `sameSite=lax` |
| Max age | 7 ngày |
| Login HTTP body | `{ user }` — **không** trả token JSON |
| Token location | **Chỉ cookie** — `JwtAuthGuard` đọc `request.cookies.access_token` |
| FE axios | `withCredentials: true` — **không** gắn `Authorization` |
| Persist FE | Zustand `tyv-auth` chỉ lưu `{ user }` |

**File BE**

- `src/auth/auth-cookie.ts`
- `src/auth/auth.controller.ts` — `POST /auth/login`, `POST /auth/logout`, `GET /auth/me`
- `src/auth/auth.service.ts` — login nội bộ `{ accessToken, user }`; controller chỉ set cookie + trả `user`
- `src/auth/jwt-auth.guard.ts`
- Global: `JwtAuthGuard` → `RolesGuard` (legacy) → `PermissionsGuard`

**File FE**

- `src/services/httpService.ts` — 401 → `resetSession()` → `/login`
- `src/services/authService.ts` — `login`, `logout`, `fetchMe`
- `src/stores/auth-store.ts` — `useAuthStore`
- `src/lib/reset-session.ts`
- `src/components/auth/ProtectedRoute.tsx`
- `src/queries/auth-query.ts` — `authKeys`, `meQueryOptions` (`staleTime` 5 phút)

### 5.2. Luồng login

```
LoginPage
  → POST /auth/login { email, password }  (credentials include)
  → BE set cookie access_token, return { user }  // kèm permissions
  → setAuth(user) + setQueryData(authKeys.me(), user)
  → syncClinicFromUser(user)
  → navigate /medical-record
```

### 5.3. Bảo vệ route & 401

```
ProtectedRoute: GET /auth/me
  success → setUser + syncClinic → MainLayout
  fail    → Navigate /login

Axios 401 → resetSession() → window.location /login
Sidebar logout → await resetSession() → navigate /login
```

`GET /auth/me` reload user (gồm permissions) và **re-issue cookie**.

### 5.4. JWT & AuthUser

**JWT payload signed:** `{ sub, email, role, fullName, permissions }`

**`AuthUser` trả client:**

```ts
{
  id, email, fullName, role,
  clinicIds: string[],
  allClinics: boolean,      // true nếu ADMIN
  permissions: string[]     // PermissionCode[]
}
```

FE type: `src/interfaces/auth.ts` (`AuthUser.permissions`).

---

## 6. Phân quyền (permissions)

### 6.1. Catalog cố định

Cùng bộ code FE + BE (giữ sync thủ công):

| FE | BE |
|----|-----|
| `src/constants/permissions.ts` | `src/auth/permissions.ts` |

**Codes:**

```
patients:read | patients:write | visits:write
appointments:read | appointments:write
services:read | services:write
payments:read | payments:write
treatment:write | followups:write
catalog:read | catalog:write
medicines:read | medicines:write
formulas:read | formulas:write
consumables:read | consumables:write
shifts:read | shifts:write
referrers:write
settings:staff | settings:clinics | settings:banks
```

FE thêm: `PERMISSION_GROUPS` (nhãn UI Settings), `ROLE_DEFAULT_PERMISSIONS`, `getRoleDefaultPermissions`, `ALL_PERMISSION_CODES`.

### 6.2. Lưu trữ & resolve (BE)

- Model Prisma: `StaffPermission` — PK `(staffId, permissionCode)`
- `PermissionsService.getForStaff(staffId, role)`:
  - **ADMIN** → luôn `ALL_PERMISSION_CODES` (không phụ thuộc DB)
  - Role khác → đọc `staff_permissions`; nếu rỗng → seed defaults theo role rồi cache in-process
- Staff create/update nhận `permissionCodes`; list/detail map ra `permissionCodes`

### 6.3. Enforce trên API

| Guard | Decorator | Hiện trạng |
|-------|-----------|------------|
| `JwtAuthGuard` | `@Public()` để bỏ qua | Global — bắt buộc login |
| `RolesGuard` | `@Roles(StaffRole.…)` | Global nhưng **không còn controller nào dùng** — legacy |
| `PermissionsGuard` | `@RequirePermissions(...codes)` | Global — **primary**. Không decorator = pass. ADMIN bypass. Non-admin cần **đủ tất cả** codes trong decorator |

Files: `permissions.decorator.ts`, `permissions.guard.ts`, `permissions.service.ts`.

### 6.4. Defaults theo role

| Role | Mặc định (tóm tắt) |
|------|---------------------|
| ADMIN | All codes |
| DOCTOR / ASSISTANT | Ops R/W (patients, visits, appointments, services, treatment, followups…) + catalog/medicines/formulas/consumables/shifts **read**; **không** payments write, consumables write, settings |
| STAFF | Patients + appointments + services + **payments write** + followups + consumables write + referrers write; **không** visits/treatment write, catalog write, settings |

Chi tiết: `ROLE_DEFAULT_PERMISSIONS` ở cả hai repo.

### 6.5. Enforce trên FE

| Chỗ | Cách |
|-----|------|
| Sidebar | `filterNavItems` → `userHasAnyPermission(user, item.permissions)`. Không khai báo `permissions` = luôn hiện (Dashboard, Bệnh án chuẩn, KPI coming soon) |
| Settings page | Cần bất kỳ `settings:*`; từng tab gate `settings:staff` / `clinics` / `banks`. Không có → redirect danh sách khách hàng |
| Staff form | `StaffPermissionsField` — checklist theo `PERMISSION_GROUPS`; ADMIN khóa full; nút reset defaults |
| Helpers | `src/lib/permissions.ts`: `userHasPermission`, `userHasAnyPermission`, `useCan`, `useCanAny` — **ADMIN luôn true**. `useCan`/`useCanAny` hiện ít/không được dùng ở feature pages |

> Hầu hết nút trong trang vận hành **chưa** gate theo permission từng action — chủ yếu sidebar + Settings + BE API.

---

## 7. Backend — NestJS

### 7.1. Entry (`src/main.ts`)

- `helmet` (CORP `cross-origin`, CSP off), `compression`, `cookie-parser`
- Static `/uploads/`
- `ValidationPipe`: `whitelist`, `transform`, `forbidNonWhitelisted: false`
- `AllExceptionsFilter` → `{ statusCode, message, error }`
- CORS `credentials: true`
- Listen `PORT || 3003`

### 7.2. AppModule

**Imports:** Config, Schedule, Throttler, Cache, Prisma, Supabase, Auth, Patient, MedicalVisit, MedicalCase, PatientFollowUp, ServiceCatalog, Referrer, Appointment, Staff, Medicine, PatientService, PatientPayment, PatientTreatment, StaffShift, PrescriptionFormulaTemplate, BankAccount, Clinic, Consumable

**Global guards:** `JwtAuthGuard`, `RolesGuard`, `PermissionsGuard`

> `ThrottlerModule` có đăng ký nhưng **chưa** gắn `ThrottlerGuard` global.

### 7.3. Cấu trúc module domain

```
src/<domain>/
  <domain>.module.ts
  <domain>.controller.ts
  <domain>.service.ts
  dto/
  mappers/             # optional
  <domain>.rules.ts    # optional + *.spec.ts
```

- Controller mỏng; service chứa logic; `PrismaModule` `@Global()`
- Multi-step: `prisma.$transaction`
- Không trả `passwordHash`
- UUID: `@Param('id', ParseUUIDPipe)`
- Endpoint nhạy cảm: `@RequirePermissions(...)`

### 7.4. Controllers & routes (tóm tắt)

Không global prefix.

| Base | Ghi chú |
|------|---------|
| `GET /` | Public hello |
| `/auth` | login, logout (public), me |
| `/patients` | CRUD + `GET :id/medical-record` |
| `/patients/:patientId/medical-case` | GET, PUT |
| `/patients/:patientId/visits` | CRUD + clinical images |
| `/patients/:patientId/services` | CRUD / cancel |
| `/patients/:patientId/payments` | list, create, refunds |
| `/patients/:patientId/.../treatment-sessions` | sessions + images |
| `/follow-ups` | upcoming, pending-assessment, schedule/assessment/reschedule |
| `/appointments` | CRUD + check-in |
| `/referrers` | CRUD |
| `/catalog-services`, `/service-groups` | danh mục |
| `/medicines` | CRUD + **`POST /medicines/import`** (JSON batch) |
| `/prescription-formula-templates` | CRUD |
| `/staff` | settings:staff; `GET options` mở hơn |
| `/staff-shifts` | shifts permissions |
| `/clinics` | settings:clinics; `GET options` rộng hơn |
| `/bank-accounts` | settings:banks |
| `/consumables` | list/usage/options; write/stock theo permissions |

### 7.5. Medicine import

- **FE** parse Excel bằng `xlsx` → mảng items
- **BE** `POST /medicines/import` nhận `{ items: CreateMedicineDto[] }` (1–1000), tạo từng dòng / skip trùng
- Response dạng `{ created, skipped, errors }`
- DTO: `import-medicines.dto.ts`; logic + unit test: `medicine.service` / `medicine.service.spec.ts`
- `xlsx` trên BE chỉ là devDependency — **không** parse file trên server

### 7.6. Response & pagination

- Success: data trực tiếp
- List phân trang: `{ data, meta }` — `PaginationQueryDto` (page/limit, default 1/20, max 100)
- Storage ảnh lâm sàng: `SupabaseStorageService`

---

## 8. Frontend — React

### 8.1. Stack

| Layer | Lib |
|-------|-----|
| Bundler | Vite 8 |
| UI | React 19, Tailwind 4, shadcn/ui, lucide |
| Router | react-router-dom 6 |
| Server state | TanStack Query 5 |
| Client state | Zustand 5 |
| Forms | RHF + Zod 4 |
| Table | TanStack Table 8 |
| HTTP | axios (`withCredentials`) |
| Excel | `xlsx` (medicines import) |
| Toast | sonner |

Alias: `@/*` → `src/*`.

### 8.2. Cây thư mục

```
src/
  main.tsx, App.tsx, index.css
  router/routes.tsx
  app/<feature>/
  components/     ui/, FieldCustom/, UiCustom/, layouts/, data-table/, auth/
  constants/      apiPaths, urlPaths, permissions, common
  services/       httpService, auth, clinic, staff, bank
  stores/         auth-store, clinic-store
  queries/        auth-query, clinic-query
  lib/            query-client, reset-session, permissions, sync-clinic, utils
  interfaces/
```

**Feature folders:** `appointments/`, `auth/`, `consumables/`, `medical-records/`, `medicines/`, `prescription-formulas/`, `settings/`, `staff-schedule/`, `standard-medical-record/`, `treatment-services/`

### 8.3. Feature module pattern

```
src/app/<feature>/
  components/
  hooks/          use-*-mutations.ts
  queries/        *Keys + *QueryOptions
  schemas/        Zod
  services/       axios — không React
  mappers/        optional
  utils/          optional (vd. parse-medicine-excel.ts)
  types/
```

**Quy tắc**

- Route path chỉ từ `urlPaths`
- API path chỉ từ `API_PATHS`
- Server data → Query; client UI → Zustand
- Mutation: invalidate keys + toast
- Menu mới: khai báo `permissions` trên Sidebar item nếu cần ẩn theo quyền

### 8.4. Routing

Public: `/login`.

Protected (`ProtectedRoute` + `MainLayout`):

| Path | Component |
|------|-----------|
| `/` | redirect → `/medical-record` |
| `/medical-record` | MedicalRecordList |
| `/medical-record/create` | PatientCreatePage |
| `/medical-record/:patientId` | MedicalRecords |
| `/patients` | MedicalRecords (legacy alias) |
| `/appointments` | AppointmentsPage |
| `/staff-schedules` | StaffSchedulesPage |
| `/standard-medical-records` | StandardMedicalRecord |
| `/treatment-services` | TreatmentServices |
| `/consumables` | ConsumablesPage |
| `/herbs-products` | MedicinesPage |
| `/prescription-formulas` | PrescriptionFormulasPage |
| `/settings` | SettingsPage (permission gate) |
| `/dashboard`, `/revenue-kpi`, `/commission-payroll` | ComingSoonPage |
| `/referrers` | stub — **không** có trên Sidebar |

### 8.5. TanStack Query

`src/lib/query-client.ts`: `staleTime: 0`, `gcTime: 5min`, `refetchOnWindowFocus: false`, `retry: 1`; mutations `retry: 0`.

Pattern: `*Keys` factory + `*QueryOptions()` → `queryOptions({ queryKey, queryFn, staleTime?, enabled? })`.

Cross-feature: check-in appointment invalidate `appointmentKeys` + `medicalRecordKeys.detail(patientId)`.

### 8.6. Zustand

| Store | Persist | Mục đích |
|-------|---------|----------|
| `useAuthStore` | `tyv-auth` (`user` gồm permissions) | Session |
| `useClinicStore` | Không | `activeClinicId` |
| `useStore` | — | Demo counter (legacy) |

Clinic: `useActiveClinic()`, `syncClinicFromUser()`, `getUserClinicIds` / `userHasAllClinics`.

### 8.7. Forms

Schema Zod → `zodResolver` → FieldCustom (`FormInput`, `FormSelect`, `FormDate`, `FormPatientSearch`…) → `FormDialog`. Export `*FormSchema`, `*FormInput` / `*FormValues`, defaultValues. `z.coerce.number()` cho số.

### 8.8. Medicines Excel import (FE)

| File | Vai trò |
|------|---------|
| `MedicineImportDialog.tsx` | UI upload / preview |
| `utils/parse-medicine-excel.ts` | `parseMedicineExcel`, `downloadMedicineImportTemplate` (`xlsx`) |
| `types/medicine-import.ts` | Parse + API response types |
| `medicine-api.ts` | `importMedicines` → `POST /medicines/import` |
| `use-medicine-mutations.ts` | `useImportMedicinesMutation` |

Flow: chọn file → parse client → POST JSON `{ items }` → toast kết quả created/skipped/errors.

---

## 9. API map FE ↔ BE

Nguồn FE: `src/constants/apiPaths.ts`. Base: `VITE_API_URL`.

| FE key | HTTP path |
|--------|-----------|
| `AUTH.*` | `/auth/login`, `/auth/logout`, `/auth/me` |
| `patients.*` | `/patients`, `/patients/:id` |
| medical-record / visits / case | `/patients/:id/medical-record`, `.../visits`, `.../medical-case` |
| `patientServices.*` | `/patients/:id/services`… |
| `patientPayments.*` | `/patients/:id/payments`, `.../refunds` |
| `patientTreatment.*` | `.../treatment-sessions`, images |
| `followUps.*` | `/follow-ups/...` |
| `appointments.*` | `/appointments`, `.../check-in` |
| `serviceCatalog.*` | `/service-groups`, `/catalog-services` |
| `medicines.*` | `/medicines`, **`/medicines/import`** |
| `prescriptionFormulaTemplates.*` | `/prescription-formula-templates` |
| `staffShifts.*` | `/staff-shifts` |
| `consumables.*` | `/consumables`, usage, stock-in, stock-adjust |
| `clinics.*` | `/clinics`, `/clinics/options` |

Staff / bank: `src/services/` → `/staff`, `/bank-accounts`.

Thêm endpoint: cập nhật **cùng lúc** controller + `@RequirePermissions` + `API_PATHS` + service FE (+ catalog permission nếu quyền mới).

---

## 10. Database (Prisma)

### 10.1. Schema

`TYV-CRM_be/prisma/schema.prisma` — PostgreSQL, UUID, snake_case `@map`.

### 10.2. Model chính

```
Staff ──< StaffClinic >── Clinic
Staff ──< StaffPermission >   # permissionCode VarChar(64)
Staff ── StaffShift
Patient (clinicId, referrer?, assignedDoctors/Assistants)
  ├── MedicalCase (1:1)
  ├── MedicalVisit → VisitHerb, VisitClinicalImage
  ├── PatientFollowUp
  ├── Appointment
  └── PatientServiceRecord
        ├── PatientTreatmentSession → images, TreatmentSessionConsumable
        └── PatientPayment / lines

Referrer, BankAccount
ServiceGroup → CatalogService
Medicine
PrescriptionFormulaTemplate → PrescriptionFormulaHerb
Consumable
```

**Enum role:** `StaffRole` = `ADMIN | DOCTOR | ASSISTANT | STAFF`  
**Permission:** không phải Prisma enum — string catalog trong code.

### 10.3. Migrate

```bash
npx prisma migrate dev --name <ten_mo_ta>
```

**Không** `prisma db push` trên DB dùng chung. Commit `prisma/migrations/`.

---

## 11. Clinic scope

- Patient / appointment / follow-up / shift gắn `clinicId`
- ADMIN: `allClinics` / unrestricted (`clinic-access.ts`)
- Non-admin: `StaffClinic` + (patient list) filter theo assignment bác sĩ/trợ lý
- FE: hầu hết query nhận `clinicId` từ `useActiveClinic()` / `useClinicStore`
- Đổi cơ sở → query key đổi → refetch

Helpers BE: `assertClinicAccess`, `resolveAllowedClinicIds`, `assertPatientAccess`.

---

## 12. Quy ước code

### Backend (`.cursor/rules/backend.mdc`)

- TS only, no `any`; kebab-case files; Prisma enums / `as const`
- Thin controller / fat service / pure mapper
- DTO class-validator; lỗi user-facing tiếng Việt OK
- Migrate only — never `db push` shared DB
- Endpoint mới: `@RequirePermissions` khi cần hạn chế

> Phần Auth trong rule vẫn có đoạn Bearer cũ — **ưu tiên code cookie + PermissionsGuard** (xem mục 17).

### Frontend (`.cursor/rules/frontend.mdc`)

- Named exports; PascalCase components; kebab-case utils
- Feature dưới `src/app/<feature>/`
- `urlPaths` + `API_PATHS` + `PERMISSIONS`
- English code; Vietnamese labels/toasts

> Rule còn nhắc Bearer/`getAuthToken` — **code hiện tại cookie-only**.

### Chung (ponytail)

- Ít abstraction; fix gốc dùng chung; không dependency thừa

---

## 13. Thêm tính năng mới (checklist)

### Backend

1. Schema (nếu cần) → `migrate dev --name ...` → commit migrations
2. Module: dto → service → controller → `AppModule`
3. `@RequirePermissions(...)` (+ clinic/patient assert nếu cần)
4. Nếu quyền **mới**: thêm code vào `src/auth/permissions.ts` **và** FE `constants/permissions.ts` (+ `PERMISSION_GROUPS` / role defaults)
5. Mapper / unit test cho logic không tầm thường
6. Message lỗi tiếng Việt cho toast FE

### Frontend

1. `apiPaths` (+ `urlPaths` nếu trang mới)
2. `services/` → `queries/` → `hooks/use-*-mutations.ts`
3. `schemas/` nếu form; `components/`
4. `routes.tsx` + Sidebar item (`permissions: [...]` nếu cần ẩn)
5. Settings chỉ khi có `settings:*`
6. `pnpm typecheck` && `pnpm lint`

### Sanity

- Cookie login (Network: `Set-Cookie`, request có `Cookie`)
- User `/me` có `permissions` đúng role
- Non-permission user: menu ẩn + API 403
- Đổi cơ sở → data đúng
- 401 → login sạch

---

## 14. Testing

### Backend

| Item | Status |
|------|--------|
| Unit | `appointment-overlap.rules.spec.ts`, `staff-shift.rules.spec.ts`, `medicine.service.spec.ts` (importMany) |
| E2E | Script `test:e2e` trỏ `test/jest-e2e.json` — **file thiếu**; không có `*.e2e-spec.ts` |
| Helpers `test/helpers/` | Một phần legacy (Bearer / HRM roles) — **không** khớp cookie + StaffRole hiện tại |

```bash
pnpm test
pnpm test:watch
pnpm test:cov
```

### Frontend

Chưa có Vitest/Jest/Playwright. Rely `typecheck` + `lint` + manual QA.

---

## 15. Deploy

### Backend

- `Dockerfile`: multi-stage Node 20 → `PORT=8080`, `node dist/main.js`
- Prod cookie: `secure` + `sameSite=none` → cần HTTPS + `CORS_ORIGIN` đúng FE
- Migrate trong deploy — không `db push`

### Frontend

- `pnpm build` — `VITE_API_URL` bake-in lúc build
- Host static; cookie cross-origin cần CORS credentials + cookie flags prod

### DB / Storage

- Supabase Postgres + bucket ảnh lâm sàng

---

## 16. Debug thường gặp

| Triệu chứng | Cách xử lý |
|-------------|------------|
| Login OK, request sau 401 | `withCredentials` / CORS credentials / `CORS_ORIGIN` |
| Cookie không set cross-origin | Prod thiếu `secure+sameSite=none` hoặc FE không HTTPS |
| Menu thiếu mục | User thiếu permission; check `/me` → `permissions` |
| API 403 dù thấy UI | FE chưa gate nút; BE `@RequirePermissions` — cấp quyền hoặc sửa decorator |
| Settings redirect | Thiếu mọi `settings:*` |
| List trống sau đổi cơ sở | `activeClinicId` / `useActiveClinic` |
| Import thuốc lỗi | FE parse Excel; BE chỉ nhận JSON — xem `errors` trong response |
| Prisma conflict | Ai đó `db push` → đồng bộ lại theo migrations |
| Ảnh lâm sàng fail | Thiếu `SUPABASE_*` |

**DevTools:** Application → Cookies → `access_token`; Network → `Cookie` header; login body chỉ `{ user }` (có `permissions`).

---

## 17. Drift cần biết

Ưu tiên **code**, không phải rule/README cũ:

| Nguồn cũ nói | Code thực tế |
|--------------|--------------|
| Bearer `Authorization` | Cookie `access_token` only |
| Login `{ accessToken, user }` | Cookie + body `{ user }` |
| JWT có `clinicBranch` | `{ sub, email, role, fullName, permissions }` |
| Chỉ `RolesGuard` | `PermissionsGuard` + `@RequirePermissions` là chính; Roles legacy |
| Settings = ADMIN only | Bất kỳ `settings:*`; ADMIN bypass permissions |
| ThrottlerGuard global | Module có, guard chưa gắn |
| FE `getAuthToken` | Không còn token trong store |
| Package “talent management” | Legacy naming |
| `test/helpers` Bearer/HRM | Stale vs cookie + StaffRole |
| BE parse Excel import | FE parse `xlsx` → BE JSON batch |

Khi sửa Cursor rules, cập nhật Auth + Permissions trước.

---

## Phụ lục A — Domain folder map

| Nghiệp vụ UI | FE `src/app/...` | BE `src/...` |
|--------------|------------------|--------------|
| Khách hàng / BA | `medical-records/` | `patient/`, `medical-visit/`, `medical-case/` |
| Lịch hẹn | `appointments/` | `appointment/` |
| Lịch làm việc | `staff-schedule/` | `staff-shift/` |
| Bệnh án chuẩn | `standard-medical-record/` | `patient-follow-up/` |
| Dịch vụ ĐT | `treatment-services/` | `service-catalog/` |
| Vật tư | `consumables/` | `consumable/` |
| Thuốc (+ Excel) | `medicines/` | `medicine/` |
| Công thức | `prescription-formulas/` | `prescription-formula-template/` |
| Cài đặt / quyền | `settings/` | `staff/`, `clinic/`, `bank-account/`, `auth/permissions*` |
| Auth | `auth/` + `services/authService` | `auth/` |

---

## Phụ lục B — Command cheat sheet

```bash
# FE
cd TYV-CRM_fe && pnpm dev
pnpm typecheck && pnpm lint

# BE
cd TYV-CRM_be && pnpm run start:dev
npx prisma migrate dev --name <name>
npx prisma studio
pnpm run seed:staff
pnpm test
```

---

*Đã cập nhật theo codebase hiện tại (cookie JWT + StaffPermission + PermissionsGuard + medicines import). Khi auth/API/permission đổi, ưu tiên sửa mục 5–6 và 9.*

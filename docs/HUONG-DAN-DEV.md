# Hướng dẫn phát triển — Thượng Y Viên CRM

Tài liệu kỹ thuật cho developer làm việc với hệ thống CRM phòng khám Đông Y.

| Repo     | Path         | Vai trò                         |
| -------- | ------------ | ------------------------------- |
| Frontend | `TYV-CRM_fe` | Vite + React 19 SPA             |
| Backend  | `TYV-CRM_be` | NestJS 11 + Prisma + PostgreSQL |

Tài liệu người dùng cuối: [`HUONG-DAN-SU-DUNG.md`](./HUONG-DAN-SU-DUNG.md).

---

## Mục lục

1. [Tổng quan kiến trúc](#1-tổng-quan-kiến-trúc)
2. [Yêu cầu môi trường](#2-yêu-cầu-môi-trường)
3. [Chạy local](#3-chạy-local)
4. [Biến môi trường](#4-biến-môi-trường)
5. [Auth & session (cookie JWT)](#5-auth--session-cookie-jwt)
6. [Backend — NestJS](#6-backend--nestjs)
7. [Frontend — React](#7-frontend--react)
8. [API map FE ↔ BE](#8-api-map-fe--be)
9. [Database (Prisma)](#9-database-prisma)
10. [Phân quyền & scope cơ sở](#10-phân-quyền--scope-cơ-sở)
11. [Quy ước code](#11-quy-ước-code)
12. [Thêm tính năng mới (checklist)](#12-thêm-tính-năng-mới-checklist)
13. [Testing](#13-testing)
14. [Deploy](#14-deploy)
15. [Debug thường gặp](#15-debug-thường-gặp)
16. [Drift cần biết](#16-drift-cần-biết)

---

## 1. Tổng quan kiến trúc

```
┌─────────────────────┐         cookie httpOnly          ┌──────────────────────┐
│  TYV-CRM_fe         │  ────── access_token ──────────► │  TYV-CRM_be          │
│  Vite :5173         │     credentials: include         │  NestJS :3003        │
│  React 19           │ ◄──── JSON (no token in body) ── │  JwtAuthGuard global │
│  TanStack Query     │                                  │  Prisma → Postgres   │
│  Zustand (user/clinic)                                 │  Supabase Storage    │
└─────────────────────┘                                  └──────────────────────┘
```

**Luồng nghiệp vụ chính**

```
Patient → MedicalVisit / MedicalCase
       → PatientServiceRecord → PatientTreatmentSession (+ consumables)
       → PatientPayment
Appointment / StaffShift / FollowUp (clinic-scoped)
Catalog: ServiceGroup, CatalogService, Medicine, Formula, Consumable
Admin: Staff, Clinic, BankAccount
```

Không có API prefix (`/api`). CORS `credentials: true`. FE và BE khác origin (dev và Cloud Run).

---

## 2. Yêu cầu môi trường

| Tool            | Gợi ý                                            |
| --------------- | ------------------------------------------------ |
| Node.js         | 20+ (Docker BE dùng `node:20-alpine`)            |
| Package manager | `pnpm` hoặc `npm` (cả hai repo có lockfile)      |
| PostgreSQL      | 16 (local qua `docker-compose` BE) hoặc Supabase |
| Browser         | Chromium-based để debug cookie                   |

---

## 3. Chạy local

### 3.1. Backend (`TYV-CRM_be`)

```bash
cd TYV-CRM_be

# Postgres local (tuỳ chọn)
docker compose up -d

# Cài deps (postinstall chạy prisma generate)
pnpm install   # hoặc npm ci

# .env — xem mục 4
cp .env   # tự tạo nếu chưa có (không có .env.example)

# Migrate — LUÔN dùng migrate, KHÔNG db push trên DB dùng chung
npx prisma migrate dev

# Seed nhân sự demo (admin/doctor/assistant/staff @tyv.vn / 123456)
pnpm run seed:staff

# Dev server
pnpm run start:dev
# → http://localhost:3003
```

**Scripts quan trọng**

| Script                       | Lệnh                            |
| ---------------------------- | ------------------------------- |
| `start:dev`                  | `nest start --watch`            |
| `build`                      | `prisma generate && nest build` |
| `start:prod`                 | `node dist/main`                |
| `prisma:migrate`             | `prisma migrate dev`            |
| `prisma:studio`              | Prisma Studio                   |
| `prisma:seed` / `seed:staff` | Seed data                       |
| `test`                       | Jest unit                       |
| `lint` / `format`            | ESLint / Prettier               |

### 3.2. Frontend (`TYV-CRM_fe`)

```bash
cd TYV-CRM_fe
pnpm install

# .env.development / .env.production đã có sẵn (VITE_API_URL=/api)
# Override local (không commit): tạo .env hoặc .env.local

pnpm dev
# → http://localhost:5173
```

| Script      | Lệnh                               |
| ----------- | ---------------------------------- |
| `dev`       | `vite`                             |
| `build`     | `tsc -b && vite build`             |
| `typecheck` | `tsc --noEmit`                     |
| `lint`      | `eslint .`                         |
| `format`    | `prettier --write "**/*.{ts,tsx}"` |
| `preview`   | `vite preview`                     |

### 3.3. Tài khoản demo (sau `seed:staff`)

| Email              | Password | Role      |
| ------------------ | -------- | --------- |
| `admin@tyv.vn`     | `123456` | ADMIN     |
| `doctor@tyv.vn`    | `123456` | DOCTOR    |
| `assistant@tyv.vn` | `123456` | ASSISTANT |
| `staff@tyv.vn`     | `123456` | STAFF     |

---

## 4. Biến môi trường

### Backend

| Key                         | Bắt buộc     | Mô tả                                                             |
| --------------------------- | ------------ | ----------------------------------------------------------------- |
| `DATABASE_URL`              | Có           | Prisma connection (pooler OK)                                     |
| `DIRECT_URL`                | Có           | Direct URL cho migrate / transaction                              |
| `JWT_SECRET`                | Có (prod)    | Fallback code: `dev-secret-change-me`                             |
| `JWT_EXPIRES_IN`            | Không        | Mặc định `7d`                                                     |
| `PORT`                      | Không        | Mặc định `3003` (Docker `8080`)                                   |
| `NODE_ENV`                  | Không        | Ảnh hưởng cookie `secure` / `sameSite`                            |
| `CORS_ORIGIN`               | Prod         | Comma-separated; dev mặc định `localhost:5173` + `127.0.0.1:5173` |
| `SUPABASE_URL`              | Ảnh lâm sàng | Storage                                                           |
| `SUPABASE_SERVICE_ROLE_KEY` | Ảnh lâm sàng | Service role                                                      |
| `SUPABASE_CLINICAL_BUCKET`  | Không        | Mặc định `clinical-images`                                        |

`ConfigModule` load `.env` từ root project BE.

### Frontend

| File                 | Commit? | Mô tả                                              |
| -------------------- | ------- | -------------------------------------------------- |
| `.env.development`   | Có      | `pnpm dev` — config public                         |
| `.env.production`    | Có      | `pnpm build` / Vercel — config public              |
| `.env` / `.env.local`| Không   | Override local hoặc secret (gitignore)             |

| Key            | Mô tả                                                         |
| -------------- | ------------------------------------------------------------- |
| `VITE_API_URL` | Base URL axios (`/api` — same-origin qua Vite/Vercel proxy)   |

Chỉ biến `VITE_*` được inject vào client. Không đặt secret trong `VITE_*`.

---

## 5. Auth & session (cookie JWT)

### 5.1. Cơ chế hiện tại (nguồn sự thật = code)

|                | Chi tiết                                                              |
| -------------- | --------------------------------------------------------------------- |
| Cookie name    | `access_token` (`AUTH_COOKIE_NAME`)                                   |
| Cookie flags   | `httpOnly: true`; prod: `secure + sameSite=none`; dev: `sameSite=lax` |
| Max age        | 7 ngày                                                                |
| Login body     | `{ user }` — **không** trả token JSON                                 |
| Token location | **Chỉ cookie** — `JwtAuthGuard` đọc `request.cookies.access_token`    |
| FE axios       | `withCredentials: true` — **không** gắn `Authorization` header        |
| Persist FE     | Zustand `tyv-auth` chỉ lưu `{ user }`, không lưu token                |

**File BE**

- `src/auth/auth-cookie.ts` — cookie options
- `src/auth/auth.controller.ts` — `POST /auth/login`, `POST /auth/logout`, `GET /auth/me`
- `src/auth/jwt-auth.guard.ts` — verify JWT từ cookie
- `src/auth/roles.guard.ts` + `@Roles()` / `@Public()` / `@CurrentUser()`

**File FE**

- `src/services/httpService.ts` — axios instance + 401 → `resetSession()`
- `src/services/authService.ts` — `login`, `logout`, `fetchMe`
- `src/stores/auth-store.ts` — `useAuthStore`
- `src/lib/reset-session.ts` — clear query + auth + clinic + POST logout
- `src/components/auth/ProtectedRoute.tsx` — `meQueryOptions` trước khi render layout
- `src/queries/auth-query.ts` — `authKeys`, `meQueryOptions` (`staleTime` 5 phút)

### 5.2. Luồng login

```
LoginPage
  → POST /auth/login { email, password }  (credentials include)
  → BE set cookie access_token, return { user }
  → setAuth(user) + setQueryData(authKeys.me(), user)
  → syncClinicFromUser(user)
  → navigate /medical-record
```

### 5.3. Luồng bảo vệ route & 401

```
ProtectedRoute: GET /auth/me
  success → setUser + syncClinic → MainLayout
  fail    → Navigate /login

Axios 401 → resetSession() → window.location /login
Sidebar logout → await resetSession() → navigate /login
```

### 5.4. JWT payload

Signed: `{ sub, email, role, fullName }`.

`AuthUser` trả về client:

```ts
{
  id, email, fullName, role,
  clinicIds: string[],
  allClinics: boolean  // true nếu ADMIN
}
```

---

## 6. Backend — NestJS

### 6.1. Entry & global setup (`src/main.ts`)

- `helmet` (CORP `cross-origin`, CSP off)
- `compression`, `cookie-parser`
- Static `/uploads/`
- `ValidationPipe`: `whitelist`, `transform`, `forbidNonWhitelisted: false`, implicit conversion
- `AllExceptionsFilter` → `{ statusCode, message, error }`
- CORS `credentials: true`
- Listen `PORT || 3003`

### 6.2. AppModule — modules

Đăng ký trong `src/app.module.ts`:

`ConfigModule`, `ScheduleModule`, `ThrottlerModule`, `CacheModule`, `PrismaModule`, `SupabaseModule`, `AuthModule`, `PatientModule`, `MedicalVisitModule`, `MedicalCaseModule`, `PatientFollowUpModule`, `ServiceCatalogModule`, `ReferrerModule`, `AppointmentModule`, `StaffModule`, `MedicineModule`, `PatientServiceModule`, `PatientPaymentModule`, `PatientTreatmentModule`, `StaffShiftModule`, `PrescriptionFormulaTemplateModule`, `BankAccountModule`, `ClinicModule`, `ConsumableModule`

**Global guards:** `JwtAuthGuard`, `RolesGuard` (`APP_GUARD`).

> `ThrottlerModule` được import nhưng **chưa** gắn `ThrottlerGuard` global.

### 6.3. Cấu trúc module domain

```
src/<domain>/
  <domain>.module.ts
  <domain>.controller.ts
  <domain>.service.ts
  dto/                 # create / update / query
  mappers/             # pure map Prisma → response
  <domain>.rules.ts    # optional — pure business rules (+ *.spec.ts)
```

**Quy tắc**

- Controller mỏng — không business logic
- Service chứa logic; inject `PrismaService` (`PrismaModule` `@Global()`)
- Multi-step write: `prisma.$transaction`
- Không trả `passwordHash`
- UUID path: `@Param('id', ParseUUIDPipe)`
- Exception: `NotFoundException`, `BadRequestException`, `ForbiddenException`, …

### 6.4. Controllers & routes (tóm tắt)

Không có global prefix.

| Base                                          | Ghi chú chính                                                        |
| --------------------------------------------- | -------------------------------------------------------------------- |
| `GET /`                                       | Public hello                                                         |
| `/auth`                                       | login, logout (public), me                                           |
| `/patients`                                   | CRUD + `GET :id/medical-record`                                      |
| `/patients/:patientId/medical-case`           | GET, PUT                                                             |
| `/patients/:patientId/visits`                 | CRUD + clinical images                                               |
| `/patients/:patientId/services`               | CRUD / cancel                                                        |
| `/patients/:patientId/payments`               | list, create, refunds                                                |
| `/patients/:patientId/.../treatment-sessions` | sessions + images                                                    |
| `/follow-ups`                                 | upcoming, pending-assessment, schedule/assessment/reschedule         |
| `/appointments`                               | CRUD + check-in                                                      |
| `/referrers`                                  | CRUD                                                                 |
| `/catalog-services`, `/service-groups`        | danh mục dịch vụ                                                     |
| `/medicines`                                  | CRUD                                                                 |
| `/prescription-formula-templates`             | CRUD                                                                 |
| `/staff`                                      | class `@Roles(ADMIN)`; `GET options` mở rộng role                    |
| `/staff-shifts`                               | `@Roles(ADMIN)`                                                      |
| `/clinics`                                    | ADMIN; `GET options` mọi staff                                       |
| `/bank-accounts`                              | tương tự clinics                                                     |
| `/consumables`                                | list/usage/options; create/update/adjust ADMIN; stock-in ADMIN+STAFF |

### 6.5. Response & pagination

- Success: trả data trực tiếp (không wrapper global)
- List phân trang: `{ data, meta }` qua `buildPaginatedMeta` / `paginateArray`
- Query: `PaginationQueryDto` — `page`/`limit`, default 1/20, max 100 (`src/common/dto/pagination-query.dto.ts`)

### 6.6. Storage

- Local static: `uploads/`
- Clinical images: `SupabaseStorageService` (`src/supabase/`)

---

## 7. Frontend — React

### 7.1. Stack

| Layer        | Lib                                                  |
| ------------ | ---------------------------------------------------- |
| Bundler      | Vite 8                                               |
| UI           | React 19, Tailwind 4, shadcn/ui (radix-nova), lucide |
| Router       | react-router-dom 6 (`createBrowserRouter`)           |
| Server state | TanStack Query 5                                     |
| Client state | Zustand 5                                            |
| Forms        | react-hook-form + Zod 4 + `@hookform/resolvers`      |
| Table        | TanStack Table 8                                     |
| HTTP         | axios                                                |
| Toast        | sonner                                               |

Path alias: `@/*` → `src/*` (`tsconfig` + `vite.config`).

### 7.2. Cây thư mục

```
src/
  main.tsx, App.tsx, index.css
  router/routes.tsx
  app/<feature>/          # feature modules
  components/
    ui/                   # shadcn
    FieldCustom/          # FormInput, FormSelect, FormDate, ...
    UiCustom/             # PageHeader, FormDialog, DialogConfirm, ...
    layouts/              # MainLayout, Sidebar
    data-table/
    auth/ProtectedRoute.tsx
    pages/ComingSoonPage.tsx
  constants/              # apiPaths, urlPaths, common
  services/               # httpService, auth, clinic, staff, bank
  stores/                 # auth-store, clinic-store
  queries/                # auth-query, clinic-query (cross-feature)
  lib/                    # query-client, reset-session, utils, sync-clinic
  interfaces/, hooks/, utils/, types/
```

### 7.3. Feature module pattern

Ví dụ `appointments/`:

```
src/app/appointments/
  components/     AppointmentsPage, AppointmentDialog, WeeklyCalendar…
  constants/
  hooks/          use-appointment-mutations.ts
  queries/        appointment-query.ts   # *Keys + *QueryOptions
  schemas/        appointment-form.ts    # Zod
  services/       appointmentService.ts  # axios calls — không React
  utils/
```

Feature lớn hơn (`medical-records/`): thêm `mappers/`, `context/`, `interfaces/`, nhiều query/mutation files.

**Quy tắc**

- Route path chỉ lấy từ `urlPaths` — không hardcode string
- API path chỉ lấy từ `API_PATHS`
- Server data → TanStack Query; client UI state → Zustand
- Không gọi axios trong component — chỉ trong `services/`
- Mutation hook: invalidate keys + `toast.success` / `toast.error`

### 7.4. Routing

File: `src/router/routes.tsx`.

```
/login                     LoginPage (public)
ProtectedRoute → MainLayout
  /                        → redirect /medical-record
  /medical-record          danh sách
  /medical-record/create   tạo hồ sơ
  /medical-record/:id      hồ sơ bệnh án
  /appointments
  /staff-schedules
  /standard-medical-records
  /treatment-services
  /consumables
  /herbs-products
  /prescription-formulas
  /settings                (UI gate ADMIN trong page/Sidebar)
  /dashboard, /revenue-kpi, /commission-payroll  → ComingSoonPage
  /patients                alias MedicalRecords
  /referrers               stub
```

### 7.5. TanStack Query

Client: `src/lib/query-client.ts`

- Default: `staleTime: 0`, `gcTime: 5min`, `refetchOnWindowFocus: false`, `retry: 1`
- Mutations: `retry: 0`

Pattern:

```ts
export const appointmentKeys = {
  all: ["appointments"] as const,
  week: (branch, from, to) =>
    [...appointmentKeys.all, "week", branch, from, to] as const,
}

export function weekAppointmentsQueryOptions(params) {
  return queryOptions({
    queryKey: appointmentKeys.week(...),
    queryFn: () => fetchAppointments(params),
    staleTime: 30_000,
  })
}
```

Cross-feature invalidation ví dụ: check-in appointment → invalidate `appointmentKeys` + `medicalRecordKeys.detail(patientId)`.

### 7.6. Zustand

| Store            | Persist             | Mục đích              |
| ---------------- | ------------------- | --------------------- |
| `useAuthStore`   | `tyv-auth` (`user`) | Session user          |
| `useClinicStore` | Không               | `activeClinicId`      |
| `useStore`       | —                   | Demo counter (legacy) |

Clinic helpers:

- `useActiveClinic()` — options + validate active id + `canSwitchBranch`
- `syncClinicFromUser(user)` — non-admin → `clinicIds[0]`
- `getUserClinicIds` / `userHasAllClinics` — `src/lib/auth-user-clinics.ts`

### 7.7. Forms

1. Schema Zod trong `schemas/`
2. Export: `*FormSchema`, `*FormInput` (`z.input`), `*FormValues` (`z.output`), `*FormDefaultValues`
3. `useForm({ resolver: zodResolver(...), defaultValues })`
4. Field wrappers: `FormInput`, `FormSelect`, `FormDate`, `FormDatetime`, `FormPatientSearch`, …
5. Dialog: `FormDialog` / pattern `open` + `onOpenChange`
6. `z.coerce.number()` cho input số; disable submit khi `isSubmitting`

### 7.8. Shared UI đáng nhớ

| Component                      | Dùng cho                |
| ------------------------------ | ----------------------- |
| `DataTable` + pagination       | Danh sách phân trang    |
| `FormDialog` / `DialogConfirm` | Form / xác nhận xoá     |
| `PageHeader`                   | Tiêu đề trang           |
| `AppointmentStatusBadge`       | Badge trạng thái lịch   |
| `ComingSoonPage`               | Dashboard / KPI / lương |

---

## 8. API map FE ↔ BE

Nguồn FE: `src/constants/apiPaths.ts`. Base URL: `VITE_API_URL`.

| FE key                           | HTTP path                                     |
| -------------------------------- | --------------------------------------------- |
| `AUTH.LOGIN/LOGOUT/ME`           | `/auth/login`, `/auth/logout`, `/auth/me`     |
| `patients.*`                     | `/patients`, `/patients/:id`                  |
| medical record (service riêng)   | `/patients/:id/medical-record`                |
| visits                           | `/patients/:id/visits`…                       |
| medical case                     | `/patients/:id/medical-case`                  |
| `patientServices.*`              | `/patients/:id/services`…                     |
| `patientPayments.*`              | `/patients/:id/payments`, `.../refunds`       |
| `patientTreatment.*`             | `.../treatment-sessions`, images              |
| `followUps.*`                    | `/follow-ups/...`                             |
| `appointments.*`                 | `/appointments`, `.../check-in`               |
| `serviceCatalog.groups/services` | `/service-groups`, `/catalog-services`        |
| `medicines.*`                    | `/medicines`                                  |
| `prescriptionFormulaTemplates.*` | `/prescription-formula-templates`             |
| `staffShifts.*`                  | `/staff-shifts`                               |
| `consumables.*`                  | `/consumables`, usage, stock-in, stock-adjust |
| `clinics.*`                      | `/clinics`, `/clinics/options`                |

Staff / bank accounts gọi qua `src/services/` (settings) — paths `/staff`, `/bank-accounts`.

Khi thêm endpoint: cập nhật **cùng lúc** controller BE + `API_PATHS` + service FE.

---

## 9. Database (Prisma)

### 9.1. Schema

File: `TYV-CRM_be/prisma/schema.prisma`

- PostgreSQL, UUID `@default(uuid())`
- Snake_case DB qua `@map` / `@@map`
- Enums trong schema → import `@prisma/client`

### 9.2. Model chính

```
Staff ──< StaffClinic >── Clinic
Staff ── StaffShift
Patient (clinicId, referrer?, assignedDoctors/Assistants M2M)
  ├── MedicalCase (1:1)
  ├── MedicalVisit → VisitHerb, VisitClinicalImage
  ├── PatientFollowUp
  ├── Appointment
  └── PatientServiceRecord
        ├── PatientTreatmentSession → images, TreatmentSessionConsumable
        └── (payments link qua PatientPayment / lines)

Referrer, BankAccount
ServiceGroup → CatalogService
Medicine
PrescriptionFormulaTemplate → PrescriptionFormulaHerb
Consumable
```

**Enum role:** `StaffRole` = `ADMIN | DOCTOR | ASSISTANT | STAFF`

### 9.3. Migrate — bắt buộc

```bash
npx prisma migrate dev --name <ten_mo_ta>
```

- **Không** dùng `prisma db push` trên DB dùng chung (Supabase) — gây drift, đồng đội `migrate` lỗi.
- Commit kèm thư mục `prisma/migrations/`.

---

## 10. Phân quyền & scope cơ sở

### 10.1. Layers

1. **JWT global** — mọi route trừ `@Public()`
2. **`@Roles(StaffRole.…)`** — chỉ khi decorator có mặt; không có decorator = mọi role đã login
3. **ADMIN-only controllers:** staff (trừ options), clinics, bank-accounts, staff-shifts
4. **Resource helpers** (`src/auth/clinic-access.ts`, patient access):
   - ADMIN → full clinics (`allClinics` / unrestricted)
   - Khác → `StaffClinic` + (với patient) assignment bác sĩ/trợ lý

### 10.2. FE enforcement

- Menu **Cài đặt** + page Settings: chỉ `user.role === "ADMIN"`
- Non-admin vào `/settings` → redirect danh sách khách hàng
- Đổi cơ sở: Sidebar khi `canSwitchBranch` (ADMIN hoặc >1 clinic)
- Hầu hết trang vận hành **không** gate theo role trên FE — dựa BE

### 10.3. Clinic filter trên FE

Hầu hết list query nhận `clinicId` từ `useActiveClinic()` / `useClinicStore`. Đổi cơ sở → query key đổi → refetch.

---

## 11. Quy ước code

### Backend (`.cursor/rules/backend.mdc`)

- TS only, no `any`; kebab-case files; Prisma enums / `as const`
- Thin controller / fat service / pure mapper
- DTO class-validator; user-facing errors tiếng Việt OK
- Migrate only — never `db push` shared DB

### Frontend (`.cursor/rules/frontend.mdc`)

- Named exports; PascalCase components; kebab-case utils
- Feature layout dưới `src/app/<feature>/`
- `urlPaths` + `API_PATHS`; Query key factories; Zod+RHF FieldCustom
- English code/comments; Vietnamese labels/toasts

### Chung (ponytail)

- Ít file / ít abstraction nhất đủ dùng
- Fix gốc dùng chung, không patch từng caller
- Không thêm dependency nếu stdlib / lib sẵn có đủ

---

## 12. Thêm tính năng mới (checklist)

### Backend

1. Schema Prisma (nếu cần) → `migrate dev --name ...` → commit migrations
2. Module: `dto/` → `service` → `controller` → đăng ký `*.module.ts` trong `AppModule`
3. `@Roles` / clinic-patient assert khi cần
4. Mapper nếu response phức tạp
5. Unit test rules/service nếu logic không tầm thường
6. Message lỗi tiếng Việt rõ cho FE toast

### Frontend

1. Thêm path vào `apiPaths.ts` (+ `urlPaths` nếu trang mới)
2. `services/` gọi API
3. `queries/` — keys + `queryOptions`
4. `hooks/use-*-mutations.ts` — invalidate + toast
5. `schemas/` Zod nếu có form
6. `components/` page + dialog
7. Đăng ký route trong `routes.tsx`
8. Thêm item Sidebar nếu cần (gate ADMIN nếu quản trị)
9. `pnpm typecheck` + `pnpm lint`

### End-to-end sanity

- Login cookie (Network tab: `Set-Cookie`, request có `Cookie`)
- Đổi cơ sở → data đổi đúng
- Role non-admin không vào Settings
- 401 → về login sạch (không stale query)

---

## 13. Testing

### Backend

- Jest: `*.spec.ts` — hiện có:
  - `src/appointment/appointment-overlap.rules.spec.ts`
  - `src/staff-shift/staff-shift.rules.spec.ts`
- Helpers: `test/helpers/` (một phần legacy naming)
- `test:e2e` trỏ `test/jest-e2e.json` — **file hiện không có**; e2e chưa setup đầy đủ
- Rule yêu cầu unit mỗi public service method + e2e mỗi endpoint — coverage thực tế còn mỏng

```bash
pnpm test
pnpm test:watch
pnpm test:cov
```

### Frontend

- **Chưa có** Vitest/Jest/Playwright trong `package.json`
- Rely `typecheck` + `lint` + manual QA

---

## 14. Deploy

### Backend

- `Dockerfile`: multi-stage Node 20 Alpine → `PORT=8080`, `node dist/main.js` (Cloud Run–style)
- Prod cookie: `secure` + `sameSite=none` → FE/BE HTTPS khác origin OK nếu CORS đúng
- Set `CORS_ORIGIN` = origin FE thật
- `.dockerignore` loại `.env`, test, scripts, md…

### Frontend

- Build: `pnpm build` → static assets
- Runtime cần `VITE_API_URL` trỏ API prod **lúc build** (Vite bake-in)
- Host static (Cloud Run / CDN / tương đương) cùng origin policy với cookie CORS

### DB

- Supabase Postgres + Storage bucket ảnh lâm sàng
- Migrate chạy trong CI/CD hoặc bước deploy — không `db push`

---

## 15. Debug thường gặp

| Triệu chứng                    | Nguyên nhân / cách xử lý                                               |
| ------------------------------ | ---------------------------------------------------------------------- |
| Login OK nhưng request sau 401 | Thiếu `withCredentials` / CORS không `credentials` / `CORS_ORIGIN` sai |
| Cookie không set cross-origin  | Prod thiếu `secure+sameSite=none` hoặc FE không HTTPS                  |
| List trống sau đổi cơ sở       | `activeClinicId` không khớp data; check `useActiveClinic`              |
| CORS blocked                   | Thêm origin FE vào `CORS_ORIGIN`                                       |
| Prisma migrate conflict        | Đồng đội dùng `db push` → reset theo migrations, tránh push            |
| Ảnh lâm sàng fail              | Thiếu `SUPABASE_*` env                                                 |
| Settings 404/redirect          | User không phải ADMIN                                                  |
| Types lệch sau pull schema     | `pnpm prisma generate` ở BE; FE type từ mapper/interface               |

**DevTools checklist**

1. Application → Cookies → `access_token` (HttpOnly)
2. Network → request có `Cookie: access_token=...`
3. Response login: body chỉ `{ user }`, header `Set-Cookie`

---

## 16. Drift cần biết

Một số chỗ **rule / README cũ** không khớp code hiện tại — ưu tiên code:

| Nguồn cũ nói                     | Code thực tế                                |
| -------------------------------- | ------------------------------------------- |
| Bearer `Authorization`           | Cookie `access_token` only                  |
| Login `{ accessToken, user }`    | Cookie + `{ user }`                         |
| JWT có `clinicBranch`            | `{ sub, email, role, fullName }`            |
| bcrypt cost ≥ 12                 | `hash(..., 10)` trong staff service         |
| ThrottlerGuard global            | Module có, guard chưa gắn                   |
| FE rule nhắc `getAuthToken`      | Không còn token trong store                 |
| Package name “talent management” | Legacy naming trong `package.json` / README |

Khi sửa auth docs hoặc rule Cursor, cập nhật theo cookie flow.

---

## Phụ lục A — Domain folder map nhanh

| Nghiệp vụ UI    | FE `src/app/...`                 | BE `src/...`                                  |
| --------------- | -------------------------------- | --------------------------------------------- |
| Khách hàng / BA | `medical-records/`               | `patient/`, `medical-visit/`, `medical-case/` |
| Lịch hẹn        | `appointments/`                  | `appointment/`                                |
| Lịch làm việc   | `staff-schedule/`                | `staff-shift/`                                |
| Bệnh án chuẩn   | `standard-medical-record/`       | `patient-follow-up/`                          |
| Dịch vụ ĐT      | `treatment-services/`            | `service-catalog/`                            |
| Vật tư          | `consumables/`                   | `consumable/`                                 |
| Thuốc           | `medicines/`                     | `medicine/`                                   |
| Công thức       | `prescription-formulas/`         | `prescription-formula-template/`              |
| Cài đặt         | `settings/`                      | `staff/`, `clinic/`, `bank-account/`          |
| Auth            | `auth/` + `services/authService` | `auth/`                                       |

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

_Tài liệu phản ánh codebase tại thời điểm viết. Khi auth/API đổi, cập nhật mục 5–8 trước._

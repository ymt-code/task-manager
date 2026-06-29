# Task Manager API

یک پروژه CRUD ساده با **NestJS** که شامل احراز هویت (Authentication) با JWT و اتصال به **PostgreSQL** از طریق **Prisma** است. این پروژه برای یادگیری پایه‌های NestJS، Auth و کار با دیتابیس ساخته شده.

## تکنولوژی‌های استفاده‌شده

- **NestJS** – فریمورک اصلی بک‌اند
- **PostgreSQL** – دیتابیس (داخل Docker)
- **Prisma (v6)** – ORM برای ارتباط با دیتابیس
- **JWT** (`@nestjs/jwt`, `passport-jwt`) – احراز هویت
- **bcrypt** – هش کردن پسورد
- **class-validator** – اعتبارسنجی ورودی‌ها (DTO)

## پیش‌نیازها

- Node.js (نسخه ۱۸ یا بالاتر)
- Docker و Docker Compose
- npm

## نصب و راه‌اندازی

### ۱. نصب پکیج‌ها

```bash
npm install
```

### ۲. تنظیم متغیرهای محیطی

یک فایل `.env` در ریشه پروژه بساز:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/task_manager?schema=public"
JWT_SECRET="change-this-to-a-long-random-string"
JWT_EXPIRES_IN="1d"
PORT=3000
```

### ۳. بالا آوردن دیتابیس با Docker

```bash
docker compose up -d
```

> توجه: پورت دیتابیس روی `5433` تنظیم شده (نه ۵۴۳۲ پیش‌فرض) تا با نصب احتمالی Postgres روی خود سیستم تداخل نداشته باشد. این مقدار از طریق متغیر `PGPORT` در `docker-compose.yml` تنظیم می‌شود.

### ۴. اجرای Migration

```bash
npx prisma migrate dev --name init
```

### ۵. اجرای پروژه

```bash
npm run start:dev
```

سرور روی آدرس `http://localhost:3000` بالا می‌آید.

## ساختار پوشه‌ها

```
task-manager-api/
├── docker-compose.yml
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── src/
│   ├── common/
│   │   ├── decorators/
│   │   │   └── current-user.decorator.ts
│   │   └── guards/
│   │       └── jwt-auth.guard.ts
│   ├── prisma/
│   │   ├── prisma.service.ts
│   │   └── prisma.module.ts
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── dto/
│   │   │   ├── strategies/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   └── auth.module.ts
│   │   └── tasks/
│   │       ├── dto/
│   │       ├── tasks.controller.ts
│   │       ├── tasks.service.ts
│   │       └── tasks.module.ts
│   ├── app.module.ts
│   └── main.ts
└── .env
```

## مدل‌های دیتابیس

- **User**: `id`, `email`, `password` (هش‌شده), `name`, `tasks[]`
- **Task**: `id`, `title`, `description`, `completed`, `userId` (مالک تسک)

هر کاربر فقط به تسک‌های خودش دسترسی دارد (در سطح Service چک می‌شود).

## مستندات API

### Auth

| متد | مسیر | نیاز به توکن | توضیح |
|---|---|---|---|
| POST | `/auth/register` | ❌ | ثبت‌نام کاربر جدید |
| POST | `/auth/login` | ❌ | ورود و گرفتن توکن |
| GET | `/auth/profile` | ✅ | گرفتن اطلاعات کاربر لاگین‌شده |

**نمونه ثبت‌نام:**

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"123456","name":"Test User"}'
```

**نمونه ورود:**

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"123456"}'
```

پاسخ هر دو شامل `access_token` است که باید در درخواست‌های بعدی به‌صورت زیر ارسال شود:

```
Authorization: Bearer <access_token>
```

### Tasks

تمام مسیرهای زیر نیاز به توکن معتبر دارند.

| متد | مسیر | توضیح |
|---|---|---|
| POST | `/tasks` | ساخت تسک جدید |
| GET | `/tasks` | لیست تسک‌های کاربر فعلی |
| GET | `/tasks/:id` | گرفتن یک تسک خاص |
| PATCH | `/tasks/:id` | ویرایش تسک |
| DELETE | `/tasks/:id` | حذف تسک |

**نمونه ساخت تسک:**

```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"title":"یادگیری Nest","description":"تمرین CRUD و Auth"}'
```

**نمونه آپدیت تسک:**

```bash
curl -X PATCH http://localhost:3000/tasks/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"completed":true}'
```

## دستورهای مفید Docker

```bash
docker compose up -d              # بالا آوردن دیتابیس
docker compose down -v            # پایین آوردن + حذف دیتا
docker compose logs -f postgres   # دیدن لاگ‌های زنده
npx prisma studio                 # دیدن دیتابیس به‌صورت گرافیکی
```

## نکات معماری

- ساختار پروژه بر اساس الگوی **Feature-based Module** است: هر قابلیت (auth, tasks) ماژول جدای خودش را دارد، و موارد زیرساختی مشترک (prisma, common) بیرون از `modules/` قرار دارند.
- `PrismaModule` به‌صورت `@Global()` تعریف شده تا نیازی به import تکراری در هر ماژول نباشد.
- منطق اصلی همیشه در `Service` نوشته می‌شود؛ `Controller` فقط مسئول گرفتن/برگرداندن request است.
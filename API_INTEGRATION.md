# 🏢 Web Dormitory - Frontend

ระบบจัดการหอพักออนไลน์ (Frontend) เชื่อมต่อกับ Backend API

## 🚀 การติดตั้งและรัน

### 1. ติดตั้ง Dependencies

```bash
npm install
```

### 2. ตั้งค่า Environment Variables (Optional)

Backend รองรับ CORS แล้ว! Frontend จะเรียก API โดยตรงที่ `http://localhost:3001/api`

ถ้าต้องการเปลี่ยน API URL สามารถสร้างไฟล์ `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

**หมายเหตุ:** Backend ต้องรันที่ port 3001

### 3. รันโปรเจกต์

```bash
npm run dev
```

เปิดเว็บที่ [http://localhost:3000](http://localhost:3000)

## 📚 API Documentation

- **Backend API**: https://backend-dormitory.vercel.app/
- **API Docs**: https://backend-dormitory.vercel.app/api-docs
- **GitHub**: https://github.com/Non2412/backend_dormitory

## ✨ ฟีเจอร์ที่เชื่อมต่อกับ API แล้ว

### ✅ Authentication
- **Login** - เข้าสู่ระบบด้วย JWT
- **Register** - สมัครสมาชิกใหม่
- **Auto Login Check** - ตรวจสอบ session อัตโนมัติ
- **Logout** - ออกจากระบบ

### ✅ Rooms Management
- **ดูรายการห้องพัก** - ดึงข้อมูลห้องพักจาก API
- **กรองห้องว่าง** - แสดงเฉพาะห้องที่พร้อมให้บริการ
- **แสดงสถานะห้อง** - AVAILABLE, OCCUPIED, MAINTENANCE

### ✅ Booking System
- **จองห้องพัก** - สร้างการจองผ่าน API
- **เลือกวันที่** - กำหนดวันเริ่มต้น-สิ้นสุด
- **ตรวจสอบ Authentication** - ต้อง login ก่อนจอง

## 🔐 การทดสอบ

### สมัครสมาชิกใหม่
1. ไปที่หน้า `/signup`
2. กรอกข้อมูล:
   - ชื่อ
   - นามสกุล
   - อีเมล
   - เบอร์โทรศัพท์
   - รหัสผ่าน (อย่างน้อย 6 ตัวอักษร)
3. กดสมัครสมาชิก

### เข้าสู่ระบบ
1. ไปที่หน้า `/login`
2. ใช้อีเมลและรหัสผ่านที่สมัครไว้
3. กด Log In

### จองห้องพัก
1. เข้าสู่ระบบก่อน
2. ไปที่หน้า `/book`
3. เลือกห้องที่ต้องการ
4. กดปุ่ม "จองห้อง"
5. เลือกวันที่เริ่มต้นและสิ้นสุด
6. ยืนยันการจอง

## 📁 โครงสร้างโปรเจกต์

```
web-dormitory/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx           # Landing Page
│   │   ├── login/             # Login Page
│   │   ├── signup/            # Signup Page
│   │   ├── book/              # Rooms & Booking Page
│   │   └── layout.tsx         # Root Layout with AuthProvider
│   │
│   ├── components/            # React Components
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── SlipReader.tsx     # QR & OCR Slip Reader
│   │
│   ├── contexts/              # React Contexts
│   │   └── AuthContext.tsx    # Authentication Context
│   │
│   └── lib/                   # Utilities
│       └── api.ts             # API Client & Types
│
├── public/                    # Static Files
└── package.json
```

## 🔧 เทคโนโลยีที่ใช้

- **Next.js 16** - React Framework
- **React 19** - UI Library
- **TypeScript** - Type Safety
- **CSS Modules** - Styling
- **JWT** - Authentication
- **Tesseract.js** - OCR
- **jsQR** - QR Code Reader

## 🌐 API Endpoints ที่ใช้

### Authentication
- `POST /api/auth/register` - สมัครสมาชิก
- `POST /api/auth/login` - เข้าสู่ระบบ
- `GET /api/auth/me` - ดึงข้อมูลผู้ใช้
- `POST /api/auth/logout` - ออกจากระบบ

### Rooms
- `GET /api/rooms` - ดึงรายการห้องพัก
- `GET /api/rooms/:id` - ดึงข้อมูลห้องพักตาม ID

### Bookings
- `GET /api/bookings` - ดึงรายการจอง
- `POST /api/bookings` - สร้างการจองใหม่
- `GET /api/bookings/:id` - ดึงข้อมูลการจอง

## 📝 หมายเหตุ

- ระบบใช้ JWT Token สำหรับ Authentication
- Token จะถูกเก็บใน localStorage
- ต้อง login ก่อนจองห้องพัก
- รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร

## 🐛 การแก้ไขปัญหา

### ไม่สามารถเชื่อมต่อ API ได้
- ตรวจสอบว่า Backend API ทำงานอยู่
- ตรวจสอบ `.env.local` ว่าตั้งค่า `NEXT_PUBLIC_API_URL` ถูกต้อง

### Token หมดอายุ
- ออกจากระบบและเข้าสู่ระบบใหม่

### ไม่สามารถจองห้องได้
- ตรวจสอบว่า login แล้ว
- ตรวจสอบว่าห้องยังว่างอยู่
- ตรวจสอบว่าเลือกวันที่ถูกต้อง

## 📞 ติดต่อ

- GitHub: [Non2412/backend_dormitory](https://github.com/Non2412/backend_dormitory)
- API Docs: [https://backend-dormitory.vercel.app/api-docs](https://backend-dormitory.vercel.app/api-docs)

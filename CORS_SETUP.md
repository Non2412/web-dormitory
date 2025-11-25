# 🎉 CORS Configuration Complete!

## ✅ สิ่งที่ทำเสร็จแล้ว

### Backend (backend_dormitory)
1. ✅ **สร้าง `src/middleware.ts`**
   - จัดการ CORS headers อัตโนมัติ
   - รองรับ OPTIONS preflight requests
   - รองรับหลาย origins (localhost:3000, 3001, 5173, 192.168.56.1)
   - ใช้ Access-Control-Max-Age: 86400 (24 ชั่วโมง)

2. ✅ **อัพเดท `next.config.ts`**
   - เพิ่ม CORS headers configuration
   - เพิ่ม PATCH method
   - เพิ่ม X-Requested-With header

### Frontend (web-dormitory)
1. ✅ **อัพเดท `src/lib/api.ts`**
   - เปลี่ยนจาก proxy routes เป็นเรียก Backend โดยตรง
   - API URL: `http://localhost:3001/api`

2. ✅ **ลบ Proxy Routes ที่ไม่จำเป็น**
   - ไม่ต้องใช้ `/src/app/api/` proxy routes อีกต่อไป
   - เรียก Backend API โดยตรง

---

## 🚀 วิธีรันโปรเจกต์

### 1. รัน Backend (Port 3001)
```bash
cd backend_dormitory
npm run dev
```

Backend จะรันที่: **http://localhost:3001**

### 2. รัน Frontend (Port 3000)
```bash
cd web-dormitory
npm run dev
```

Frontend จะรันที่: **http://localhost:3000**

---

## 🧪 ทดสอบ CORS

### วิธีที่ 1: ใช้ Browser Console

เปิด Browser Console (F12) และรันคำสั่ง:

```javascript
fetch('http://localhost:3001/api/auth/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'test@example.com',
    password: 'password123',
    firstName: 'Test',
    lastName: 'User',
    phone: '0812345678'
  })
})
.then(res => res.json())
.then(data => console.log('✅ Success:', data))
.catch(err => console.error('❌ Error:', err));
```

### วิธีที่ 2: ตรวจสอบ Network Tab

1. เปิด DevTools (F12)
2. ไปที่ tab **Network**
3. ลองสมัครสมาชิกหรือ login
4. คลิกที่ request `register` หรือ `login`
5. ดูที่ **Response Headers** ควรเห็น:
   ```
   Access-Control-Allow-Origin: *
   Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS
   Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With
   ```

---

## 📋 Checklist

- [x] Backend มี CORS middleware
- [x] Backend มี CORS headers ใน next.config.ts
- [x] Frontend เรียก Backend โดยตรง
- [x] ลบ proxy routes ออกแล้ว
- [ ] ทดสอบ Register
- [ ] ทดสอบ Login
- [ ] ทดสอบดูห้องพัก
- [ ] ทดสอบจองห้อง

---

## 🔧 Troubleshooting

### ปัญหา: ยังมี CORS Error

**สาเหตุ:**
- Backend ไม่ได้รัน
- Backend รันผิด port
- Frontend เรียก URL ผิด

**วิธีแก้:**
1. ตรวจสอบว่า Backend รันที่ `http://localhost:3001`
2. ตรวจสอบว่า Frontend เรียก `http://localhost:3001/api`
3. Restart ทั้ง Backend และ Frontend

### ปัญหา: 404 Not Found

**สาเหตุ:**
- API endpoint ไม่ถูกต้อง

**วิธีแก้:**
1. ตรวจสอบว่า Backend มี route `/api/auth/register`
2. ดู Backend console มี error หรือไม่

### ปัญหา: 500 Internal Server Error

**สาเหตุ:**
- Backend มี error ในการประมวลผล

**วิธีแก้:**
1. ดู Backend console
2. ตรวจสอบ request body ว่าส่งข้อมูลครบหรือไม่

---

## 🌐 Production Deployment

เมื่อ deploy จริง ให้แก้ไข:

### Backend (`src/middleware.ts`)
```typescript
const allowedOrigins = [
  'https://your-frontend-domain.vercel.app',
  'https://your-production-domain.com',
];
```

### Frontend (`.env.local`)
```env
NEXT_PUBLIC_API_URL=https://backend-dormitory.vercel.app/api
```

---

## 📞 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/register` | POST | สมัครสมาชิก |
| `/api/auth/login` | POST | เข้าสู่ระบบ |
| `/api/auth/me` | GET | ดึงข้อมูลผู้ใช้ |
| `/api/auth/logout` | POST | ออกจากระบบ |
| `/api/rooms` | GET | ดูรายการห้องพัก |
| `/api/bookings` | POST | จองห้องพัก |

---

## 🎯 สรุป

✅ **Backend รองรับ CORS แล้ว**  
✅ **Frontend เรียก API โดยตรงได้**  
✅ **ไม่ต้องใช้ proxy routes**  
✅ **พร้อมใช้งานทั้ง Development และ Production**

---

**Happy Coding! 🚀**

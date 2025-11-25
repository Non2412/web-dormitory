import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    // Mock dashboard activities
    return NextResponse.json({
        success: true,
        data: {
            activities: [
                { type: "แจ้งซ่อม", detail: "ห้อง 101 แจ้งแอร์ไม่เย็น", time: "10 นาทีที่แล้ว" },
                { type: "ชำระเงิน", detail: "ห้อง 202 ชำระค่าเช่า", time: "1 ชั่วโมงที่แล้ว" },
                { type: "ย้ายเข้า", detail: "ห้อง 305 ทำสัญญาใหม่", time: "3 ชั่วโมงที่แล้ว" },
                { type: "แจ้งเตือน", detail: "ครบกำหนดชำระค่าไฟ", time: "เมื่อวาน" },
                { type: "ระบบ", detail: "สำรองข้อมูลอัตโนมัติ", time: "เมื่อวาน" }
            ]
        }
    });
}

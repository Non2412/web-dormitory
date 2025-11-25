import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    // Mock data
    const rooms = [
        {
            id: '1',
            roomNumber: '101',
            dormitoryId: '1',
            floor: 1,
            capacity: 2,
            price: 4500,
            status: 'AVAILABLE',
            dormitory: {
                id: '1',
                name: 'Dormitory A'
            },
            image: '/room1.jpg',
            name: 'ห้องโปรด (Standard)',
            type: 'Standard Room',
            description: 'ห้องพักแบบสตูดิโอ ออกแบบทันสมัยพร้อมเฟอร์นิเจอร์คุณภาพ เหมาะสำหรับนักศึกษา 1-2 คน',
            size: 25,
            maxOccupancy: 2,
            amenities: ["เตียงนอน", "แอร์ (Air Conditioner)", "ตู้เสื้อผ้าในตัว", "โต๊ะเรียน", "ห้องน้ำส่วนตัว", "WiFi ฟรี", "หน้าต่างขนาดใหญ่"],
            details: [
                "ห้องมีสไตล์โดเมสติก ตกแต่งอย่างเรียบร้อย",
                "ระบบแสงสว่างดี มีหน้าต่างให้อากาศหมุนเวียน",
                "ตู้เสื้อผ้าบิวท์อิน ทำให้เนื้อที่ว่างมากขึ้น",
                "เหมาะสำหรับคนรักษณภาพ และผู้ชื่นชอบพื้นที่กะทัดรัด",
                "ใกล้สิ่งอำนวยความสะดวกในหอพัก"
            ]
        },
        {
            id: '2',
            roomNumber: '102',
            dormitoryId: '1',
            floor: 1,
            capacity: 2,
            price: 6500,
            status: 'AVAILABLE',
            dormitory: {
                id: '1',
                name: 'Dormitory A'
            },
            image: '/room2.jpg',
            name: 'ห้องมาตรฐาน (Economy)',
            type: 'Economy Room',
            description: 'ห้องพักขนาดกลาง สมบูรณ์ด้วยเฟอร์นิเจอร์พื้นฐาน เหมาะสำหรับนักศึกษา 1-2 คน พื้นที่กว้างขวาง',
            size: 35,
            maxOccupancy: 2,
            amenities: ["เตียงนอน", "ตู้เสื้อผ้า", "โต๊ะแต่งตัว", "โต๊ะเรียน", "ห้องน้ำส่วนตัว", "โทรทัศน์", "WiFi ฟรี", "ระเบียงส่วนตัว"],
            details: [
                "ห้องสว่าง มีประตูเปิดออกไปยังระเบียง",
                "พื้นปูด้วยปูนเรียบสีขาว ทำให้ห้องดูกว้างขวาง",
                "ตู้เสื้อผ้าแบบหลายช่องเก็บของได้เยอะ",
                "พื้นที่นั่งพักผ่อนพอเหมาะ",
                "โทรทัศน์ขนาดกลาง เหมาะสำหรับดูหนัง"
            ]
        },
        {
            id: '3',
            roomNumber: '201',
            dormitoryId: '1',
            floor: 2,
            capacity: 4,
            price: 8500,
            status: 'AVAILABLE',
            dormitory: {
                id: '1',
                name: 'Dormitory A'
            },
            image: '/room3.jpg',
            name: 'ห้องพรีเมียม (Premium)',
            type: 'Premium Room',
            description: 'ห้องพักหรูหรา ตกแต่งแบบโรงแรม พร้อมสิ่งอำนวยความสะดวกครบครัน ถึง 3-4 คน',
            size: 45,
            maxOccupancy: 4,
            amenities: ["เตียงนอนคู่ (Queen/Twin)", "เตียงเสริม", "แอร์ (Air Conditioner)", "ตู้เสื้อผ้าหลายลัดดา", "โต๊ะแต่งตัว", "ห้องน้ำ", "โทรทัศน์ขนาดใหญ่", "ชั้นวางของ", "WiFi ฟรี", "ระเบียงส่วนตัว"],
            details: [
                "ห้องกว้างขวาง มีเตียงนอนคู่พร้อมเตียงเสริม",
                "พื้นลามิเนตแบบลายไม้ ทำให้ห้องดูอบอุ่นและหรูหรา",
                "แสงสว่างจากหน้าต่างกว้าง ระเบียงให้ทัศนียวิทยา",
                "ทีวีขนาดใหญ่พร้อมสัญญาณชัดเจน",
                "ตู้เสื้อผ้าจำนวนมาก พื้นที่เก็บของเพียงพอ",
                "เหมาะสำหรับกลุ่มเพื่อน หรือ ครอบครัวเล็ก"
            ]
        }
    ];

    let filteredRooms = rooms;
    if (status) {
        filteredRooms = rooms.filter(room => room.status === status);
    }

    return NextResponse.json({
        success: true,
        data: filteredRooms
    });
}

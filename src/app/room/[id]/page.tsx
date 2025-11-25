"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import Navbar from "@/components/Navbar";

interface Room {
  id: number;
  name: string;
  type: string;
  price: number;
  image: string;
  description: string;
  size: number;
  maxOccupancy: number;
  amenities: string[];
  available: boolean;
  details: string[];
}

const roomsData: Record<number, Room> = {
  1: {
    id: 1,
    name: "ห้องโปรด (Standard)",
    type: "Standard Room",
    price: 5000,
    image: "/room1.jpg",
    description: "ห้องพักแบบสตูดิโอ ออกแบบทันสมัยพร้อมเฟอร์นิเจอร์คุณภาพ เหมาะสำหรับนักศึกษา 1-2 คน",
    size: 25,
    maxOccupancy: 2,
    amenities: ["เตียงนอน", "แอร์ (Air Conditioner)", "ตู้เสื้อผ้าในตัว", "โต๊ะเรียน", "ห้องน้ำส่วนตัว", "WiFi ฟรี", "หน้าต่างขนาดใหญ่"],
    available: true,
    details: [
      "ห้องมีสไตล์โดเมสติก ตกแต่งอย่างเรียบร้อย",
      "ระบบแสงสว่างดี มีหน้าต่างให้อากาศหมุนเวียน",
      "ตู้เสื้อผ้าบิวท์อิน ทำให้เนื้อที่ว่างมากขึ้น",
      "เหมาะสำหรับคนรักษณภาพ และผู้ชื่นชอบพื้นที่กะทัดรัด",
      "ใกล้สิ่งอำนวยความสะดวกในหอพัก"
    ]
  },
  2: {
    id: 2,
    name: "ห้องมาตรฐาน (Economy)",
    type: "Economy Room",
    price: 6500,
    image: "/room2.jpg",
    description: "ห้องพักขนาดกลาง สมบูรณ์ด้วยเฟอร์นิเจอร์พื้นฐาน เหมาะสำหรับนักศึกษา 1-2 คน พื้นที่กว้างขวาง",
    size: 35,
    maxOccupancy: 2,
    amenities: ["เตียงนอน", "ตู้เสื้อผ้า", "โต๊ะแต่งตัว", "โต๊ะเรียน", "ห้องน้ำส่วนตัว", "โทรทัศน์", "WiFi ฟรี", "ระเบียงส่วนตัว"],
    available: true,
    details: [
      "ห้องสว่าง มีประตูเปิดออกไปยังระเบียง",
      "พื้นปูด้วยปูนเรียบสีขาว ทำให้ห้องดูกว้างขวาง",
      "ตู้เสื้อผ้าแบบหลายช่องเก็บของได้เยอะ",
      "พื้นที่นั่งพักผ่อนพอเหมาะ",
      "โทรทัศน์ขนาดกลาง เหมาะสำหรับดูหนัง"
    ]
  },
  3: {
    id: 3,
    name: "ห้องพรีเมียม (Premium)",
    type: "Premium Room",
    price: 8500,
    image: "/room3.jpg",
    description: "ห้องพักหรูหรา ตกแต่งแบบโรงแรม พร้อมสิ่งอำนวยความสะดวกครบครัน ถึง 3-4 คน",
    size: 45,
    maxOccupancy: 4,
    amenities: ["เตียงนอนคู่ (Queen/Twin)", "เตียงเสริม", "แอร์ (Air Conditioner)", "ตู้เสื้อผ้าหลายลัดดา", "โต๊ะแต่งตัว", "ห้องน้ำ", "โทรทัศน์ขนาดใหญ่", "ชั้นวางของ", "WiFi ฟรี", "ระเบียงส่วนตัว"],
    available: true,
    details: [
      "ห้องกว้างขวาง มีเตียงนอนคู่พร้อมเตียงเสริม",
      "พื้นลามิเนตแบบลายไม้ ทำให้ห้องดูอบอุ่นและหรูหรา",
      "แสงสว่างจากหน้าต่างกว้าง ระเบียงให้ทัศนียวิทยา",
      "ทีวีขนาดใหญ่พร้อมสัญญาณชัดเจน",
      "ตู้เสื้อผ้าจำนวนมาก พื้นที่เก็บของเพียงพอ",
      "เหมาะสำหรับกลุ่มเพื่อน หรือ ครอบครัวเล็ก"
    ]
  }
};

export default function RoomDetail() {
  const params = useParams();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);

  const idParam = params?.id as string;
  let room: Room | undefined = undefined;
  // Try to match by number id
  const numId = parseInt(idParam);
  if (!isNaN(numId) && roomsData[numId]) {
    room = roomsData[numId];
  } else {
    // Try to match by string id (for future API or string keys)
    room = Object.values(roomsData).find(r => r.id.toString() === idParam || r.name === idParam);
  }

  if (!room) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <h1>ไม่พบห้องพัก</h1>
        <Link href="/" style={{ marginTop: '20px', color: '#007bff', textDecoration: 'underline' }}>
          กลับไปหน้าหลัก
        </Link>
      </div>
    );
  }

  const handleBook = () => {
    alert(`จองห้อง ${room.name} จำนวน ${quantity} ห้อง สำเร็จ!`);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      {/* Navigation Header */}
      <Navbar />

      {/* Room Detail Container */}
      <div style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 20px' }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          overflow: 'hidden',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          {/* Room Image */}
          <div style={{ height: '450px', overflow: 'hidden', backgroundColor: '#e0e0e0' }}>
            <img
              src={room.image}
              alt={room.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          </div>

          {/* Room Info */}
          <div style={{ padding: '40px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '40px' }}>
              {/* Left Column - Details */}
              <div>
                <h1 style={{ margin: '0 0 10px 0', fontSize: '32px', color: '#000' }}>{room.name}</h1>
                <p style={{ color: '#999', fontSize: '16px', margin: '0 0 25px 0' }}>{room.type}</p>

                <div style={{
                  backgroundColor: '#e3f2fd',
                  padding: '20px',
                  borderRadius: '8px',
                  marginBottom: '35px',
                  borderLeft: '5px solid #1976d2'
                }}>
                  <h3 style={{ marginTop: 0, marginBottom: '10px', color: '#000' }}>📝 รายละเอียด</h3>
                  <p style={{ margin: '0 0 15px 0', lineHeight: '1.6', color: '#000', fontWeight: '500' }}>{room.description}</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div style={{ padding: '12px', backgroundColor: 'white', borderRadius: '6px' }}>
                      <strong style={{ color: '#000' }}>📐 ขนาดห้อง:</strong> <span style={{ color: '#000', fontWeight: '500' }}>{room.size} ตร.ม.</span>
                    </div>
                    <div style={{ padding: '12px', backgroundColor: 'white', borderRadius: '6px' }}>
                      <strong style={{ color: '#000' }}>👥 ความจุสูงสุด:</strong> <span style={{ color: '#000', fontWeight: '500' }}>{room.maxOccupancy} คน</span>
                    </div>
                  </div>
                </div>

                <h3 style={{ marginBottom: '15px', color: '#000' }}>✨ สิ่งอำนวยความสะดวก</h3>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '12px',
                  marginBottom: '35px'
                }}>
                  {room.amenities.map((amenity, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '12px 15px',
                        backgroundColor: '#c8e6c9',
                        borderRadius: '6px',
                        border: '1px solid #81c784',
                        display: 'flex',
                        alignItems: 'center',
                        fontSize: '14px'
                      }}
                    >
                      <span style={{ marginRight: '8px', color: '#2e7d32', fontWeight: 'bold' }}>✓</span>
                      <span style={{ color: '#000', fontWeight: '500' }}>{amenity}</span>
                    </div>
                  ))}
                </div>

                <h3 style={{ marginBottom: '15px', color: '#000' }}>💡 ลักษณะเฉพาะของห้อง</h3>
                <div style={{
                  backgroundColor: '#f9f9f9',
                  padding: '20px',
                  borderRadius: '8px',
                  borderLeft: '4px solid #27ae60'
                }}>
                  <ul style={{ margin: 0, paddingLeft: '20px', lineHeight: '1.8' }}>
                    {room.details.map((detail, idx) => (
                      <li key={idx} style={{ marginBottom: '10px', color: '#000', fontWeight: '500' }}>
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>


            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{
        backgroundColor: '#333',
        color: 'white',
        padding: '40px 20px',
        marginTop: '60px'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <p>&copy; 2025 Dormitory Management System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
"use client";

import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
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
  const searchParams = useSearchParams();
  const [quantity, setQuantity] = useState(1);

  const roomId = parseInt(params?.id as string);
  const room = roomsData[roomId];
  const isBookingMode = searchParams.get('mode') === 'book';

  if (!room || isNaN(roomId)) {
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
            <div style={{
              display: 'grid',
              gridTemplateColumns: isBookingMode ? '2fr 1fr' : '1fr',
              gap: '40px',
              alignItems: 'start'
            }}>
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

              {/* Right Column - Booking Card (Only show if isBookingMode is true) */}
              {isBookingMode && (
                <div style={{
                  backgroundColor: 'white',
                  padding: '30px',
                  borderRadius: '16px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                  border: '1px solid #eee',
                  position: 'sticky',
                  top: '100px'
                }}>
                  <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                    <span style={{ fontSize: '16px', color: '#666' }}>ราคาเริ่มต้น</span>
                    <div style={{ fontSize: '36px', fontWeight: '800', color: '#667eea' }}>
                      ฿{room.price.toLocaleString()}
                      <span style={{ fontSize: '16px', fontWeight: '500', color: '#999' }}>/เดือน</span>
                    </div>
                  </div>

                  <div style={{ marginBottom: '25px' }}>
                    <label style={{ display: 'block', marginBottom: '10px', fontWeight: '600', color: '#333' }}>จำนวนห้อง</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '8px',
                          border: '1px solid #ddd',
                          background: 'white',
                          cursor: 'pointer',
                          fontSize: '18px',
                          color: '#333'
                        }}
                      >
                        -
                      </button>
                      <input
                        type="number"
                        value={quantity}
                        readOnly
                        style={{
                          width: '60px',
                          height: '40px',
                          textAlign: 'center',
                          border: '1px solid #ddd',
                          borderRadius: '8px',
                          fontSize: '16px',
                          fontWeight: '600',
                          color: '#000',
                          backgroundColor: 'white'
                        }}
                      />
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '8px',
                          border: '1px solid #ddd',
                          background: 'white',
                          cursor: 'pointer',
                          fontSize: '18px',
                          color: '#333'
                        }}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div style={{ marginBottom: '25px', padding: '15px', background: '#f8f9fa', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <span style={{ color: '#666' }}>ค่ามัดจำ</span>
                      <span style={{ fontWeight: '600', color: '#333' }}>฿{(room.price * 2).toLocaleString()}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <span style={{ color: '#666' }}>ค่าเช่าล่วงหน้า</span>
                      <span style={{ fontWeight: '600', color: '#333' }}>฿{room.price.toLocaleString()}</span>
                    </div>
                    <div style={{ borderTop: '1px solid #ddd', margin: '10px 0' }}></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px' }}>
                      <strong style={{ color: '#333' }}>รวมแรกเข้า</strong>
                      <strong style={{ color: '#667eea' }}>฿{(room.price * 3 * quantity).toLocaleString()}</strong>
                    </div>
                  </div>

                  <button
                    onClick={handleBook}
                    style={{
                      width: '100%',
                      padding: '16px',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      fontSize: '18px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.5)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
                    }}
                  >
                    จองห้องพัก
                  </button>

                  <p style={{ marginTop: '15px', fontSize: '12px', color: '#999', textAlign: 'center' }}>
                    *ราคานี้ยังไม่รวมค่าน้ำและค่าไฟ
                  </p>
                </div>
              )}
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
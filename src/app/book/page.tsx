"use client";

import { useState, useEffect } from "react";
import { api, Room } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import styles from "./book.module.css";

export default function BookingPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bookingRoom, setBookingRoom] = useState<Room | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingDates, setBookingDates] = useState({
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await api.getRooms({ status: 'AVAILABLE' });
      if (response.success) {
        setRooms(response.data);
      }
    } catch (err: any) {
      console.error("Error fetching rooms:", err);
      setError("ไม่สามารถโหลดข้อมูลห้องพักได้");
    } finally {
      setLoading(false);
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'AVAILABLE':
        return 'ว่าง';
      case 'OCCUPIED':
        return 'เต็ม';
      case 'MAINTENANCE':
        return 'ปิดปรับปรุง';
      default:
        return status;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'AVAILABLE':
        return styles.available;
      case 'OCCUPIED':
        return styles.booked;
      case 'MAINTENANCE':
        return styles.maintenance;
      default:
        return '';
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div style={{ textAlign: 'center', padding: '50px', color: '#fff' }}>
          <h2>กำลังโหลดข้อมูลห้องพัก...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div style={{ textAlign: 'center', padding: '50px', color: '#ff4444' }}>
          <h2>{error}</h2>
          <button onClick={fetchRooms} style={{ marginTop: '20px', padding: '10px 20px', cursor: 'pointer' }}>
            ลองอีกครั้ง
          </button>
        </div>
      </div>
    );
  }

  const handleBooking = (roomId: string) => {
    router.push(`/room/${roomId}`);
  };

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <h1 className={styles.title}>ประเภทห้อง</h1>
        <table className={styles.table}>
          <thead>
            <tr>
              <th></th>
              <th>ประเภท</th>
              <th>รูปแบบห้อง</th>
              <th>ขนาด</th>
              <th>รายเดือน<br />(สัญญา 1 ปี)</th>
              <th>ค่าเช่ารายวัน</th>
              <th>สัญญาต่ำกว่า 1 ปี</th>
              <th>สถานะ</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((room) => (
              <tr key={room.id}>
                <td className={styles.arrow}>&gt;</td>
                <td>{room.roomNumber}</td>
                <td>{room.dormitory?.name || '-'}</td>
                <td>{room.floor}</td>
                <td>{room.price}</td>
                <td>{room.capacity}</td>
                <td
                  className={styles.link}
                  onClick={() => handleBooking(room.id)}
                  style={{ cursor: 'pointer' }}
                >
                  จองห้อง
                </td>
                <td>
                  <span
                    className={getStatusClass(room.status)}
                  >
                    {getStatusText(room.status)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

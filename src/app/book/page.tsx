"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api, Room } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
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

  const handleBookRoom = (room: Room) => {
    if (!isAuthenticated) {
      alert("กรุณาเข้าสู่ระบบก่อนจองห้องพัก");
      router.push("/login");
      return;
    }

    setBookingRoom(room);
    setShowBookingModal(true);
  };

  const handleConfirmBooking = async () => {
    if (!bookingRoom || !bookingDates.startDate || !bookingDates.endDate) {
      alert("กรุณาเลือกวันที่เริ่มต้นและสิ้นสุด");
      return;
    }

    try {
      const response = await api.createBooking({
        roomId: bookingRoom.id,
        startDate: bookingDates.startDate,
        endDate: bookingDates.endDate,
      });

      if (response.success) {
        alert("จองห้องพักสำเร็จ!");
        setShowBookingModal(false);
        setBookingRoom(null);
        setBookingDates({ startDate: "", endDate: "" });
        fetchRooms(); // Refresh room list
      }
    } catch (err: any) {
      console.error("Booking error:", err);
      alert(err.message || "เกิดข้อผิดพลาดในการจองห้องพัก");
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
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem("currentUser");
    if (!user) {
      router.push("/login");
    }
  }, [router]);

  const rooms = [
    {
      _id: "1",
      type: "ห้องมาตรฐานพร้อมระเบียง",
      roomStyle: "สตูดิโอ",
      size: "30 ตร.ม.",
      priceRange: "6,600 - 12,900 บาท",
      daily: "800 - 950 บาท",
      contract: "สั่งจอง",
      status: "booked",
    },
    {
      _id: "2",
      type: "ห้องมาตรฐานพิเศษ พร้อมระเบียง",
      roomStyle: "สตูดิโอ",
      size: "30 ตร.ม.",
      priceRange: "6,900 - 15,000 บาท",
      daily: "850 - 1,000 บาท",
      contract: "สั่งจอง",
      status: "booked",
    },
    {
      _id: "3",
      type: "ห้องซูพีเรีย พร้อมระเบียงและครัว",
      roomStyle: "1 ห้องนอน",
      size: "40 ตร.ม.",
      priceRange: "8,700 - 18,000 บาท",
      daily: "900 - 1,100 บาท",
      contract: "สั่งจอง",
      status: "available",
    },
  ];

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
              <tr key={room._id}>
                <td className={styles.arrow}>&gt;</td>
                <td>{room.type}</td>
                <td>{room.roomStyle}</td>
                <td>{room.size}</td>
                <td>{room.priceRange}</td>
                <td>{room.daily}</td>
                <td
                  className={styles.link}
                  onClick={() => handleBooking(room._id)}
                  style={{ cursor: 'pointer' }}
                >
                  {room.contract}
                </td>
                <td>
                  <span
                    className={
                      room.status === "available"
                        ? styles.available
                        : styles.booked
                    }
                  >
                    {room.status === "available" ? "ว่าง" : "เต็ม"}
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

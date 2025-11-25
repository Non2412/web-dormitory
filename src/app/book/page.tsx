"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api, Room } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
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

  return (
    <div className={styles.container}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 className={styles.title}>ห้องพักที่พร้อมให้บริการ</h1>
        {user && (
          <div style={{ color: '#fff', fontSize: '14px' }}>
            ยินดีต้อนรับ, {user.firstName} {user.lastName}
          </div>
        )}
      </div>

      {rooms.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px', color: '#fff' }}>
          <h2>ไม่มีห้องพักว่างในขณะนี้</h2>
        </div>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th></th>
              <th>หมายเลขห้อง</th>
              <th>ชั้น</th>
              <th>ความจุ (คน)</th>
              <th>ราคา/เดือน</th>
              <th>สถานะ</th>
              <th>การจัดการ</th>
            </tr>
          </thead>

          <tbody>
            {rooms.map((room) => (
              <tr key={room.id}>
                <td className={styles.arrow}>&gt;</td>
                <td>{room.roomNumber}</td>
                <td>{room.floor}</td>
                <td>{room.capacity}</td>
                <td>{room.price.toLocaleString('th-TH')} บาท</td>
                <td>
                  <span className={getStatusClass(room.status)}>
                    {getStatusText(room.status)}
                  </span>
                </td>
                <td>
                  {room.status === 'AVAILABLE' && (
                    <button
                      onClick={() => handleBookRoom(room)}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: '#4CAF50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '14px',
                      }}
                    >
                      จองห้อง
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Booking Modal */}
      {showBookingModal && bookingRoom && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            backgroundColor: '#1a1a2e',
            padding: '30px',
            borderRadius: '12px',
            maxWidth: '500px',
            width: '90%',
            color: '#fff',
          }}>
            <h2 style={{ marginBottom: '20px' }}>จองห้อง {bookingRoom.roomNumber}</h2>

            <div style={{ marginBottom: '15px' }}>
              <p><strong>ชั้น:</strong> {bookingRoom.floor}</p>
              <p><strong>ความจุ:</strong> {bookingRoom.capacity} คน</p>
              <p><strong>ราคา:</strong> {bookingRoom.price.toLocaleString('th-TH')} บาท/เดือน</p>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>วันที่เริ่มต้น:</label>
              <input
                type="date"
                value={bookingDates.startDate}
                onChange={(e) => setBookingDates({ ...bookingDates, startDate: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                  backgroundColor: '#fff',
                  color: '#000',
                }}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>วันที่สิ้นสุด:</label>
              <input
                type="date"
                value={bookingDates.endDate}
                onChange={(e) => setBookingDates({ ...bookingDates, endDate: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                  backgroundColor: '#fff',
                  color: '#000',
                }}
                min={bookingDates.startDate || new Date().toISOString().split('T')[0]}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={handleConfirmBooking}
                style={{
                  flex: 1,
                  padding: '12px',
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '16px',
                }}
              >
                ยืนยันการจอง
              </button>
              <button
                onClick={() => {
                  setShowBookingModal(false);
                  setBookingRoom(null);
                  setBookingDates({ startDate: "", endDate: "" });
                }}
                style={{
                  flex: 1,
                  padding: '12px',
                  backgroundColor: '#f44336',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '16px',
                }}
              >
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

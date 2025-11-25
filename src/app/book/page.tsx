"use client";

import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import styles from "./book.module.css";

export default function BookingPage() {
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
    router.push(`/room/${roomId}?mode=book`);
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

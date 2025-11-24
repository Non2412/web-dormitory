"use client";

import styles from "./book.module.css";

export default function BookingPage() {
  const rooms = [
    {
      _id: "1",
      type: "ห้องมาตรฐานพร้อมระเบียง",
      roomStyle: "สตูดิโอ",
      size: "30 ตร.ม.",
      priceRange: "6,600 - 12,900 บาท",
      daily: "800 - 950 บาท",
      contract: "ดูราคาระยะสั้น",
      status: "booked",
    },
    {
      _id: "2",
      type: "ห้องมาตรฐานพิเศษ พร้อมระเบียง",
      roomStyle: "สตูดิโอ",
      size: "30 ตร.ม.",
      priceRange: "6,900 - 15,000 บาท",
      daily: "850 - 1,000 บาท",
      contract: "ดูราคาระยะสั้น",
      status: "booked",
    },
    {
      _id: "3",
      type: "ห้องซูพีเรีย พร้อมระเบียงและครัว",
      roomStyle: "1 ห้องนอน",
      size: "40 ตร.ม.",
      priceRange: "8,700 - 18,000 บาท",
      daily: "900 - 1,100 บาท",
      contract: "ดูราคาระยะสั้น",
      status: "available",
    },
  ];

  return (
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
              <td className={styles.link}>{room.contract}</td>
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
  );
}

"use client";

import styles from "./dashboard.module.css";

import SlipVerifier from "./SlipVerifier";

export default function AdminDashboard() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>ระบบจัดการหอพัก</h1>

      {/* แถวแรก: หัวข้อห้องพัก */}
      <div className={styles.cardRow}>
        <div className={styles.card}>
          <h3>ห้องทั้งหมด</h3>
          <p className={styles.value}>50</p>
          <span className={styles.sub}>ห้องพักในระบบ</span>
        </div>

        <div className={styles.card}>
          <h3>ห้องมีผู้เข้าพัก</h3>
          <p className={styles.value}>38</p>
          <span className={styles.sub}>76.0% อัตราการเข้าพัก</span>
        </div>

        <div className={styles.card}>
          <h3>ห้องว่าง</h3>
          <p className={styles.value}>10</p>
          <span className={styles.sub}>พร้อมให้เข้า</span>
        </div>

        <div className={styles.card}>
          <h3>ซ่อมบำรุง</h3>
          <p className={styles.value}>2</p>
          <span className={styles.sub}>กำลังซ่อมแซม</span>
        </div>
      </div>

      {/* แถวสอง: รายได้ */}
      <div className={styles.cardRow}>
        <div className={styles.bigCard}>
          <h3>รายได้ประจำเดือน</h3>
          <p className={styles.bigValue}>฿285,000</p>
          <span className={styles.positive}>+12.5% จากเดือนที่แล้ว</span>
        </div>

        <div className={styles.bigCard}>
          <h3>รายได้ประจำปี</h3>
          <p className={styles.bigValue}>฿3,200,000</p>
          <span className={styles.positive}>+8.3% จากปีก่อน</span>
        </div>

        <div className={styles.bigCard}>
          <h3>ยอดค้างชำระ</h3>
          <p className={styles.bigValue}>฿45,000</p>
          <span className={styles.warning}>3 รายการค้างชำระเงิน</span>
        </div>
      </div>

      {/* กิจกรรมล่าสุด */}
      <div className={styles.section}>
        <h2>กิจกรรมล่าสุด</h2>
        <div className={styles.listBox}>
          <div className={styles.listItem}>
            <strong>เช็คอิน</strong> — ห้อง 101 (สมชาย ใจดี)
            <span>10:30</span>
          </div>

          <div className={styles.listItem}>
            <strong>ชำระเงิน</strong> — ห้อง 205 (สมหญิง มีสุข)
            <span>09:15</span>
          </div>

          <div className={styles.listItem}>
            <strong>แจ้งซ่อม</strong> — ห้อง 304 (สมศักดิ์ รักดี)
            <span>08:45</span>
          </div>
        </div>
      </div>

      {/* การชำระเงินที่ใกล้ครบกำหนด */}
      <div className={styles.section}>
        <h2>การชำระเงินที่ใกล้ครบกำหนด</h2>

        <div className={styles.listBox}>
          <div className={styles.paymentRow}>
            <p>ห้อง 201 — สมพร ใจดี</p>
            <span>฿7,500</span>
          </div>

          <div className={styles.paymentRow}>
            <p>ห้อง 305 — สมหมาย ลึกลับ</p>
            <span>฿8,000</span>
          </div>

          <div className={styles.paymentRow}>
            <p>ห้อง 102 — สมชาย ทองดี</p>
            <span>฿7,500</span>
          </div>
        </div>
      </div>

      {/* ระบบตรวจสอบสลิป */}
      <SlipVerifier />
    </div>
  );
}

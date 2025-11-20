"use client";

import { useState } from "react";
import styles from "./dashboard.module.css";

// Types
interface RoomStatus {
  total: number;
  occupied: number;
  available: number;
  maintenance: number;
}

interface RevenueData {
  monthly: number;
  yearly: number;
  pending: number;
}

export default function Dashboard() {
  const [roomStatus] = useState<RoomStatus>({
    total: 50,
    occupied: 38,
    available: 10,
    maintenance: 2,
  });

  const [revenue] = useState<RevenueData>({
    monthly: 285000,
    yearly: 3200000,
    pending: 45000,
  });

  const [activeTab, setActiveTab] = useState("overview");

  // Mock data for recent activities
  const recentActivities = [
    { id: 1, action: "เช็คอิน", room: "101", resident: "สมชาย ใจดี", time: "10:30" },
    { id: 2, action: "ชำระเงิน", room: "205", resident: "สมหญิง มีสุข", time: "09:15" },
    { id: 3, action: "แจ้งซ่อม", room: "304", resident: "สมศักดิ์ รักดี", time: "08:45" },
    { id: 4, action: "เช็คเอาท์", room: "102", resident: "สมใจ ดีงาม", time: "07:30" },
  ];

  // Mock data for upcoming payments
  const upcomingPayments = [
    { id: 1, room: "201", resident: "สมพร ใจเย็น", dueDate: "25 พ.ย. 2568", amount: 7500 },
    { id: 2, room: "305", resident: "สมปอง ดีมาก", dueDate: "26 พ.ย. 2568", amount: 8000 },
    { id: 3, room: "102", resident: "สมบูรณ์ สบาย", dueDate: "27 พ.ย. 2568", amount: 7500 },
  ];

  return (
    <div className={styles.dashboardContainer}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1>🏠 ระบบจัดการหอพัก</h1>
          <div className={styles.userInfo}>
            <span>ผู้ดูแลระบบ</span>
            <div className={styles.userAvatar}>A</div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className={styles.navbar}>
        <button
          className={`${styles.navButton} ${activeTab === "overview" ? styles.active : ""}`}
          onClick={() => setActiveTab("overview")}
        >
          📊 ภาพรวม
        </button>
        <button
          className={`${styles.navButton} ${activeTab === "rooms" ? styles.active : ""}`}
          onClick={() => setActiveTab("rooms")}
        >
          🚪 ห้องพัก
        </button>
        <button
          className={`${styles.navButton} ${activeTab === "residents" ? styles.active : ""}`}
          onClick={() => setActiveTab("residents")}
        >
          👥 ผู้เข้าพัก
        </button>
        <button
          className={`${styles.navButton} ${activeTab === "finance" ? styles.active : ""}`}
          onClick={() => setActiveTab("finance")}
        >
          💰 การเงิน
        </button>
        <button
          className={`${styles.navButton} ${activeTab === "maintenance" ? styles.active : ""}`}
          onClick={() => setActiveTab("maintenance")}
        >
          🔧 ซ่อมบำรุง
        </button>
      </nav>

      {/* Main Content */}
      <main className={styles.mainContent}>
        {/* Stats Cards */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>🏠</div>
            <div className={styles.statInfo}>
              <h3>ห้องทั้งหมด</h3>
              <p className={styles.statNumber}>{roomStatus.total}</p>
              <span className={styles.statDetail}>ห้องพักในระบบ</span>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={`${styles.statIcon} ${styles.occupied}`}>✅</div>
            <div className={styles.statInfo}>
              <h3>ห้องที่มีผู้เข้าพัก</h3>
              <p className={styles.statNumber}>{roomStatus.occupied}</p>
              <span className={styles.statDetail}>
                {((roomStatus.occupied / roomStatus.total) * 100).toFixed(1)}% อัตราการเข้าพัก
              </span>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={`${styles.statIcon} ${styles.available}`}>🔓</div>
            <div className={styles.statInfo}>
              <h3>ห้องว่าง</h3>
              <p className={styles.statNumber}>{roomStatus.available}</p>
              <span className={styles.statDetail}>พร้อมให้เช่า</span>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={`${styles.statIcon} ${styles.maintenance}`}>🔧</div>
            <div className={styles.statInfo}>
              <h3>ซ่อมบำรุง</h3>
              <p className={styles.statNumber}>{roomStatus.maintenance}</p>
              <span className={styles.statDetail}>กำลังซ่อมแซม</span>
            </div>
          </div>
        </div>

        {/* Revenue Section */}
        <div className={styles.revenueSection}>
          <div className={styles.revenueCard}>
            <h3>💵 รายได้ประจำเดือน</h3>
            <p className={styles.revenueAmount}>
              ฿{revenue.monthly.toLocaleString()}
            </p>
            <span className={styles.revenueGrowth}>+12.5% จากเดือนที่แล้ว</span>
          </div>

          <div className={styles.revenueCard}>
            <h3>📈 รายได้ประจำปี</h3>
            <p className={styles.revenueAmount}>
              ฿{revenue.yearly.toLocaleString()}
            </p>
            <span className={styles.revenueGrowth}>+8.3% จากปีที่แล้ว</span>
          </div>

          <div className={styles.revenueCard}>
            <h3>⏳ รอการชำระ</h3>
            <p className={styles.revenueAmount}>
              ฿{revenue.pending.toLocaleString()}
            </p>
            <span className={styles.revenuePending}>3 รายการรอชำระเงิน</span>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className={styles.twoColumnLayout}>
          {/* Recent Activities */}
          <div className={styles.activityCard}>
            <h3>📋 กิจกรรมล่าสุด</h3>
            <div className={styles.activityList}>
              {recentActivities.map((activity) => (
                <div key={activity.id} className={styles.activityItem}>
                  <div className={styles.activityInfo}>
                    <span className={styles.activityAction}>{activity.action}</span>
                    <span className={styles.activityDetails}>
                      ห้อง {activity.room} - {activity.resident}
                    </span>
                  </div>
                  <span className={styles.activityTime}>{activity.time}</span>
                </div>
              ))}
            </div>
            <button className={styles.viewAllButton}>ดูทั้งหมด →</button>
          </div>

          {/* Upcoming Payments */}
          <div className={styles.paymentCard}>
            <h3>💳 การชำระเงินที่ใกล้ครบกำหนด</h3>
            <div className={styles.paymentList}>
              {upcomingPayments.map((payment) => (
                <div key={payment.id} className={styles.paymentItem}>
                  <div className={styles.paymentInfo}>
                    <span className={styles.paymentRoom}>ห้อง {payment.room}</span>
                    <span className={styles.paymentResident}>{payment.resident}</span>
                    <span className={styles.paymentDue}>ครบกำหนด: {payment.dueDate}</span>
                  </div>
                  <span className={styles.paymentAmount}>
                    ฿{payment.amount.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
            <button className={styles.viewAllButton}>ดูทั้งหมด →</button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className={styles.quickActions}>
          <h3>⚡ การดำเนินการด่วน</h3>
          <div className={styles.actionButtons}>
            <button className={styles.actionButton}>
              <span className={styles.actionIcon}>➕</span>
              เพิ่มผู้เข้าพักใหม่
            </button>
            <button className={styles.actionButton}>
              <span className={styles.actionIcon}>🔍</span>
              ค้นหาห้องว่าง
            </button>
            <button className={styles.actionButton}>
              <span className={styles.actionIcon}>📝</span>
              บันทึกการชำระเงิน
            </button>
            <button className={styles.actionButton}>
              <span className={styles.actionIcon}>🛠️</span>
              แจ้งซ่อม
            </button>
            <button className={styles.actionButton}>
              <span className={styles.actionIcon}>📊</span>
              ออกรายงาน
            </button>
            <button className={styles.actionButton}>
              <span className={styles.actionIcon}>⚙️</span>
              ตั้งค่าระบบ
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import Sidebar from "../components/Sidebar";
import styles from "./dashboard.module.css";
import SlipVerifier from "./SlipVerifier";

export default function AdminDashboard() {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [stats, setStats] = useState<any>(null);
    const [payments, setPayments] = useState<any[]>([]);
    const [activities, setActivities] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("adminToken");
        if (!token) {
            router.push("/login");
        } else {
            setIsAuthorized(true);
            // Fetch dashboard stats and payments
            (async () => {
                try {
                    const statsRes = await api.getDashboardStats();
                    setStats(statsRes.data);
                    const paymentsRes = await api.getPayments();
                    setPayments(paymentsRes.data);
                    // Example: fetch activities from /dashboard endpoint if available
                    try {
                        const dashboardRes = await api.getDashboard();
                        setActivities(dashboardRes.data.activities || []);
                    } catch {}
                } catch (err) {
                    console.error("Dashboard API error:", err);
                } finally {
                    setLoading(false);
                }
            })();
        }
    }, [router]);

    if (!isAuthorized || loading) {
        return null;
    }

    return (
        <>
            <Sidebar />
            <div className={styles.mainContent}>
                <div className={styles.container}>
                    <div className={styles.headerBar}>
                        <h1 className={styles.title}>ระบบจัดการหอพัก</h1>
                        <button
                            className={styles.utilitiesBtn}
                            onClick={() => router.push("/admin/utilities")}
                        >
                            ⚡ จัดการค่าน้ำค่าไฟ
                        </button>
                    </div>

                    {/* แถวแรก: หัวข้อห้องพัก (API) */}
                    <div className={styles.cardRow}>
                        <div className={styles.card}>
                            <h3>ห้องทั้งหมด</h3>
                            <p className={styles.value}>{stats?.totalRooms ?? '-'}</p>
                            <span className={styles.sub}>ห้องพักในระบบ</span>
                        </div>
                        <div className={styles.card}>
                            <h3>ห้องมีผู้เข้าพัก</h3>
                            <p className={styles.value}>{stats?.occupiedRooms ?? '-'}</p>
                            <span className={styles.sub}>{stats?.occupancyRate ? `${stats.occupancyRate}%` : '-'} อัตราการเข้าพัก</span>
                        </div>
                        <div className={styles.card}>
                            <h3>ห้องว่าง</h3>
                            <p className={styles.value}>{stats?.availableRooms ?? '-'}</p>
                            <span className={styles.sub}>พร้อมให้เข้า</span>
                        </div>
                        <div className={styles.card}>
                            <h3>ซ่อมบำรุง</h3>
                            <p className={styles.value}>{stats?.maintenanceRooms ?? '-'}</p>
                            <span className={styles.sub}>กำลังซ่อมแซม</span>
                        </div>
                    </div>

                    {/* แถวสอง: รายได้ (API) */}
                    <div className={styles.cardRow}>
                        <div className={styles.bigCard}>
                            <h3>รายได้ประจำเดือน</h3>
                            <p className={styles.bigValue}>{stats?.monthlyRevenue ? `฿${stats.monthlyRevenue.toLocaleString()}` : '-'}</p>
                            <span className={styles.positive}>{stats?.monthlyRevenueChange ? `${stats.monthlyRevenueChange}% จากเดือนที่แล้ว` : ''}</span>
                        </div>
                        <div className={styles.bigCard}>
                            <h3>รายได้ประจำปี</h3>
                            <p className={styles.bigValue}>{stats?.annualRevenue ? `฿${stats.annualRevenue.toLocaleString()}` : '-'}</p>
                            <span className={styles.positive}>{stats?.annualRevenueChange ? `${stats.annualRevenueChange}% จากปีก่อน` : ''}</span>
                        </div>
                        <div className={styles.bigCard}>
                            <h3>ยอดค้างชำระ</h3>
                            <p className={styles.bigValue}>{stats?.totalDue ? `฿${stats.totalDue.toLocaleString()}` : '-'}</p>
                            <span className={styles.warning}>{stats?.dueCount ? `${stats.dueCount} รายการค้างชำระเงิน` : ''}</span>
                        </div>
                    </div>

                    {/* กิจกรรมล่าสุด (API) */}
                    <div className={styles.section}>
                        <h2>กิจกรรมล่าสุด</h2>
                        <div className={styles.listBox}>
                            {activities.length > 0 ? (
                                activities.map((activity, idx) => (
                                    <div className={styles.listItem} key={idx}>
                                        <strong>{activity.type}</strong> — {activity.detail}
                                        <span>{activity.time}</span>
                                    </div>
                                ))
                            ) : (
                                <div className={styles.listItem}>ไม่พบกิจกรรมล่าสุด</div>
                            )}
                        </div>
                    </div>

                    {/* การชำระเงินที่ใกล้ครบกำหนด (API) */}
                    <div className={styles.section}>
                        <h2>การชำระเงินที่ใกล้ครบกำหนด</h2>
                        <div className={styles.listBox}>
                            {payments.length > 0 ? (
                                payments.filter(p => p.status === "DUE").map((payment, idx) => (
                                    <div className={styles.paymentRow} key={idx}>
                                        <p>ห้อง {payment.roomNumber} — {payment.tenantName}</p>
                                        <span>฿{payment.amount.toLocaleString()}</span>
                                    </div>
                                ))
                            ) : (
                                <div className={styles.paymentRow}>ไม่พบข้อมูลค้างชำระ</div>
                            )}
                        </div>
                    </div>

                    {/* ระบบตรวจสอบสลิป */}
                    <SlipVerifier />
                </div>
            </div>
        </>
    );
}

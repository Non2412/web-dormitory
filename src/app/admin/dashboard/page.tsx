"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import Sidebar from "../components/Sidebar";
import styles from "./dashboard.module.css";
import SlipVerifier from "./SlipVerifier";

import { useAuth } from "@/contexts/AuthContext";

interface DashboardStats {
    totalRooms: number;
    occupiedRooms: number;
    availableRooms: number;
    maintenanceRooms: number;
    occupancyRate: number;
    monthlyRevenue: number;
    monthlyRevenueChange: number;
    annualRevenue: number;
    annualRevenueChange: number;
    totalDue: number;
    dueCount: number;
}

interface Payment {
    id: string;
    date: string;
    roomNumber: string;
    tenantName: string;
    amount: number;
    status: string;
    paymentMethod: string;
    bookingId: string;
    slipUrl?: string;
}

interface Activity {
    type: string;
    detail: string;
    time: string;
}

export default function AdminDashboard() {
    const router = useRouter();
    const { user, isAuthenticated, loading: authLoading } = useAuth();

    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [payments, setPayments] = useState<Payment[]>([]);
    const [activities, setActivities] = useState<Activity[]>([]);
    const [dataLoading, setDataLoading] = useState(true);

    useEffect(() => {
        if (!authLoading) {
            if (!isAuthenticated || user?.role !== 'ADMIN') {
                router.push("/login");
            } else {
                // Fetch dashboard stats and payments
                (async () => {
                    try {
                        const statsRes = await api.getDashboardStats();
                        setStats(statsRes.data as unknown as DashboardStats);

                        // Fetch dashboard data for activities
                        try {
                            const dashboardRes = await api.getDashboard();
                            if (dashboardRes.data.recentBookings) {
                                // Convert recent bookings to activities
                                const acts: Activity[] = dashboardRes.data.recentBookings.slice(0, 5).map((booking: { status: string; startDate: string; room?: { roomNumber: string } }) => ({
                                    type: 'การจอง',
                                    detail: `ห้อง ${booking.room?.roomNumber || 'N/A'} - ${booking.status}`,
                                    time: new Date(booking.startDate).toLocaleDateString('th-TH')
                                }));
                                setActivities(acts);
                            }
                        } catch (e) {
                            console.error('Failed to fetch activities:', e);
                        }

                        // Fetch payments
                        try {
                            const paymentsRes = await api.getPayments();
                            setPayments(paymentsRes.data as Payment[] || []);
                        } catch (e) {
                            console.error('Failed to fetch payments:', e);
                        }
                    } catch (err) {
                        console.error("Dashboard API error:", err);
                    } finally {
                        setDataLoading(false);
                    }
                })();
            }
        }
    }, [isAuthenticated, user, authLoading, router]);

    if (authLoading || dataLoading) {
        return <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>;
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
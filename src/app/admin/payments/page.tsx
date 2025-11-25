"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import styles from "./payments.module.css";

interface Payment {
    id: string;
    date: string;
    roomNumber: string;
    tenantName: string;
    amount: number;
    status: "Pending" | "Verified" | "Rejected";
    slipUrl: string;
}

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function PaymentHistoryPage() {
    const router = useRouter();
    const { user, isAuthenticated, loading: authLoading } = useAuth();
    const [payments, setPayments] = useState<Payment[]>([]);
    const [selectedSlip, setSelectedSlip] = useState<string | null>(null);

    useEffect(() => {
        if (!authLoading) {
            if (!isAuthenticated || user?.role !== 'ADMIN') {
                router.push("/login");
            } else {
                // Load payments from localStorage
                const savedPayments = localStorage.getItem("payments");
                if (savedPayments) {
                    setPayments(JSON.parse(savedPayments));
                } else {
                    // Initial mock data
                    const mockPayments: Payment[] = [
                        {
                            id: "1",
                            date: "2024-03-25",
                            roomNumber: "101",
                            tenantName: "สมชาย ใจดี",
                            amount: 4500,
                            status: "Pending",
                            slipUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=1000",
                        },
                        {
                            id: "2",
                            date: "2024-03-24",
                            roomNumber: "202",
                            tenantName: "วิภาดา รักสงบ",
                            amount: 5200,
                            status: "Verified",
                            slipUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=1000",
                        },
                        {
                            id: "3",
                            date: "2024-03-23",
                            roomNumber: "305",
                            tenantName: "กานดา มีสุข",
                            amount: 4800,
                            status: "Rejected",
                            slipUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=1000",
                        },
                    ];
                    setPayments(mockPayments);
                    localStorage.setItem("payments", JSON.stringify(mockPayments));
                }
            }
        }
    }, [isAuthenticated, user, authLoading, router]);

    if (authLoading) {
        return <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>;
    }

    const handleVerify = (id: string) => {
        const updatedPayments = payments.map((p) =>
            p.id === id ? { ...p, status: "Verified" as const } : p
        );
        setPayments(updatedPayments);
        localStorage.setItem("payments", JSON.stringify(updatedPayments));
        setSelectedSlip(null);
    };

    const handleReject = (id: string) => {
        const updatedPayments = payments.map((p) =>
            p.id === id ? { ...p, status: "Rejected" as const } : p
        );
        setPayments(updatedPayments);
        localStorage.setItem("payments", JSON.stringify(updatedPayments));
        setSelectedSlip(null);
    };

    return (
        <>
            <Sidebar />
            <div className={styles.mainContent}>
                <div className={styles.header}>
                    <h1>ประวัติการชำระเงิน (Payment History)</h1>
                </div>

                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>วันที่</th>
                                <th>ห้องพัก</th>
                                <th>ผู้เช่า</th>
                                <th>ยอดชำระ</th>
                                <th>สถานะ</th>
                                <th>หลักฐาน</th>
                            </tr>
                        </thead>
                        <tbody>
                            {payments.map((payment) => (
                                <tr key={payment.id}>
                                    <td>{payment.date}</td>
                                    <td>
                                        <span style={{ fontWeight: 600 }}>ห้อง {payment.roomNumber}</span>
                                    </td>
                                    <td className={styles.tenantName}>{payment.tenantName}</td>
                                    <td className={styles.amount}>฿{payment.amount.toLocaleString()}</td>
                                    <td>
                                        <span
                                            className={`${styles.statusBadge} ${payment.status === "Pending"
                                                ? styles.statusPending
                                                : payment.status === "Verified"
                                                    ? styles.statusVerified
                                                    : styles.statusRejected
                                                }`}
                                        >
                                            {payment.status === "Pending"
                                                ? "รอตรวจสอบ"
                                                : payment.status === "Verified"
                                                    ? "ตรวจสอบแล้ว"
                                                    : "ปฏิเสธ"}
                                        </span>
                                    </td>
                                    <td>
                                        <button
                                            className={styles.viewSlipBtn}
                                            onClick={() => setSelectedSlip(payment.slipUrl)}
                                        >
                                            📄 ดูสลิป
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {selectedSlip && (
                    <div className={styles.modalOverlay} onClick={() => setSelectedSlip(null)}>
                        <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                            <div className={styles.modalHeader}>
                                <h2>หลักฐานการโอนเงิน</h2>
                                <button
                                    className={styles.closeButton}
                                    onClick={() => setSelectedSlip(null)}
                                >
                                    ✕
                                </button>
                            </div>

                            <div className={styles.slipImageContainer}>
                                <img src={selectedSlip} alt="Transfer Slip" className={styles.slipImage} />
                            </div>

                            <div className={styles.modalActions}>
                                <button
                                    className={`${styles.actionButton} ${styles.rejectButton}`}
                                    onClick={() => {
                                        // Find the payment associated with this slip to reject
                                        const payment = payments.find(p => p.slipUrl === selectedSlip);
                                        if (payment) handleReject(payment.id);
                                    }}
                                >
                                    ปฏิเสธ
                                </button>
                                <button
                                    className={`${styles.actionButton} ${styles.verifyButton}`}
                                    onClick={() => {
                                        // Find the payment associated with this slip to verify
                                        const payment = payments.find(p => p.slipUrl === selectedSlip);
                                        if (payment) handleVerify(payment.id);
                                    }}
                                >
                                    ยืนยันถูกต้อง
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

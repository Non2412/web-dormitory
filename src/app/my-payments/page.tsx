"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import styles from "./my-payments.module.css";

interface Payment {
    id: string;
    date: string;
    roomNumber: string;
    tenantName: string;
    amount: number;
    status: "Pending" | "Verified" | "Rejected";
    slipUrl: string;
}

export default function MyPaymentsPage() {
    const router = useRouter();
    const { user, isAuthenticated, loading: authLoading } = useAuth();
    const [payments, setPayments] = useState<Payment[]>([]);
    const [selectedSlip, setSelectedSlip] = useState<string | null>(null);

    useEffect(() => {
        if (!authLoading) {
            if (!isAuthenticated) {
                router.push("/login");
            } else {
                // Load payments from localStorage
                const savedPayments = localStorage.getItem("payments");
                if (savedPayments) {
                    const allPayments = JSON.parse(savedPayments);
                    // Filter to show only user's payments
                    const userPayments = allPayments.filter((p: Payment) =>
                        p.tenantName === `${user?.firstName} ${user?.lastName}`
                    );
                    setPayments(userPayments);
                } else {
                    // No payments yet
                    setPayments([]);
                }
            }
        }
    }, [isAuthenticated, user, authLoading, router]);

    if (authLoading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.spinner}></div>
                <p>กำลังโหลด...</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <Navbar />

            <div className={styles.content}>
                <div className={styles.header}>
                    <h1>📋 ประวัติการชำระเงินของฉัน</h1>
                    <p className={styles.subtitle}>ตรวจสอบสถานะการชำระเงินและสลิปของคุณ</p>
                </div>

                {payments.length === 0 ? (
                    <div className={styles.emptyState}>
                        <div className={styles.emptyIcon}>📭</div>
                        <h2>ยังไม่มีประวัติการชำระเงิน</h2>
                        <p>เมื่อคุณทำการชำระเงิน ประวัติจะแสดงที่นี่</p>
                        <button
                            className={styles.bookButton}
                            onClick={() => router.push('/book')}
                        >
                            🏠 จองห้องพัก
                        </button>
                    </div>
                ) : (
                    <div className={styles.paymentsGrid}>
                        {payments.map((payment) => (
                            <div key={payment.id} className={styles.paymentCard}>
                                <div className={styles.cardHeader}>
                                    <div className={styles.roomBadge}>
                                        🏠 ห้อง {payment.roomNumber}
                                    </div>
                                    <span
                                        className={`${styles.statusBadge} ${payment.status === "Pending"
                                                ? styles.statusPending
                                                : payment.status === "Verified"
                                                    ? styles.statusVerified
                                                    : styles.statusRejected
                                            }`}
                                    >
                                        {payment.status === "Pending"
                                            ? "⏳ รอตรวจสอบ"
                                            : payment.status === "Verified"
                                                ? "✅ ตรวจสอบแล้ว"
                                                : "❌ ปฏิเสธ"}
                                    </span>
                                </div>

                                <div className={styles.cardBody}>
                                    <div className={styles.infoRow}>
                                        <span className={styles.label}>📅 วันที่ชำระ:</span>
                                        <span className={styles.value}>{payment.date}</span>
                                    </div>
                                    <div className={styles.infoRow}>
                                        <span className={styles.label}>💰 ยอดชำระ:</span>
                                        <span className={styles.amount}>฿{payment.amount.toLocaleString()}</span>
                                    </div>
                                    <div className={styles.infoRow}>
                                        <span className={styles.label}>👤 ผู้ชำระ:</span>
                                        <span className={styles.value}>{payment.tenantName}</span>
                                    </div>
                                </div>

                                <div className={styles.cardFooter}>
                                    <button
                                        className={styles.viewSlipButton}
                                        onClick={() => setSelectedSlip(payment.slipUrl)}
                                    >
                                        📄 ดูสลิปการโอนเงิน
                                    </button>
                                </div>

                                {payment.status === "Rejected" && (
                                    <div className={styles.rejectedNote}>
                                        <strong>หมายเหตุ:</strong> สลิปของคุณถูกปฏิเสธ กรุณาติดต่อเจ้าหน้าที่หรือชำระเงินใหม่
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Slip Modal */}
                {selectedSlip && (
                    <div className={styles.modalOverlay} onClick={() => setSelectedSlip(null)}>
                        <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                            <div className={styles.modalHeader}>
                                <h2>📄 หลักฐานการโอนเงิน</h2>
                                <button
                                    className={styles.closeButton}
                                    onClick={() => setSelectedSlip(null)}
                                >
                                    ✕
                                </button>
                            </div>

                            <div className={styles.slipImageContainer}>
                                <img
                                    src={selectedSlip}
                                    alt="Transfer Slip"
                                    className={styles.slipImage}
                                />
                            </div>

                            <div className={styles.modalFooter}>
                                <button
                                    className={styles.closeModalButton}
                                    onClick={() => setSelectedSlip(null)}
                                >
                                    ปิด
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

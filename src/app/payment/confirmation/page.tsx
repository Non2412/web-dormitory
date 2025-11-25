"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import styles from "./confirmation.module.css";

function ConfirmationContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [countdown, setCountdown] = useState(5);

    const roomName = searchParams?.get('roomName');
    const amount = searchParams?.get('amount');

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    router.push('/');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [router]);

    const handleGoHome = () => {
        router.push('/');
    };

    return (
        <div className={styles.confirmationWrapper}>
            <div className={styles.confirmationCard}>
                {/* Success Animation */}
                <div className={styles.successAnimation}>
                    <div className={styles.checkmarkCircle}>
                        <div className={styles.checkmark}>✓</div>
                    </div>
                </div>

                {/* Success Message */}
                <h1 className={styles.title}>ชำระเงินสำเร็จ!</h1>
                <p className={styles.subtitle}>
                    ขอบคุณที่ใช้บริการของเรา เราได้รับข้อมูลการจองของคุณแล้ว
                </p>

                {/* Booking Details */}
                <div className={styles.detailsCard}>
                    <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>ห้องพัก:</span>
                        <span className={styles.detailValue}>{roomName || 'ไม่ระบุ'}</span>
                    </div>
                    <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>ยอดชำระ:</span>
                        <span className={styles.detailValue}>
                            ฿{amount ? parseInt(amount).toLocaleString() : '0'}
                        </span>
                    </div>
                    <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>สถานะ:</span>
                        <span className={`${styles.detailValue} ${styles.statusPending}`}>
                            รอการตรวจสอบ
                        </span>
                    </div>
                    <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>วันที่ทำรายการ:</span>
                        <span className={styles.detailValue}>
                            {new Date().toLocaleDateString('th-TH', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </span>
                    </div>
                </div>

                {/* Next Steps */}
                <div className={styles.nextSteps}>
                    <h3>ขั้นตอนต่อไป</h3>
                    <div className={styles.stepsList}>
                        <div className={styles.step}>
                            <div className={styles.stepNumber}>1</div>
                            <div className={styles.stepContent}>
                                <strong>รอการตรวจสอบ</strong>
                                <p>เจ้าหน้าที่จะตรวจสอบการชำระเงินของคุณภายใน 24 ชั่วโมง</p>
                            </div>
                        </div>
                        <div className={styles.step}>
                            <div className={styles.stepNumber}>2</div>
                            <div className={styles.stepContent}>
                                <strong>รับการยืนยัน</strong>
                                <p>คุณจะได้รับอีเมลยืนยันการจองพร้อมรายละเอียดเพิ่มเติม</p>
                            </div>
                        </div>
                        <div className={styles.step}>
                            <div className={styles.stepNumber}>3</div>
                            <div className={styles.stepContent}>
                                <strong>เข้าพักได้เลย</strong>
                                <p>นำเอกสารยืนยันมาแสดงในวันเข้าพักตามที่กำหนด</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact Info */}
                <div className={styles.contactInfo}>
                    <p>
                        <strong>หากมีข้อสงสัย ติดต่อเราได้ที่:</strong>
                    </p>
                    <div className={styles.contactDetails}>
                        <div className={styles.contactItem}>
                            <span className={styles.contactIcon}>📞</span>
                            <span>02-123-4567</span>
                        </div>
                        <div className={styles.contactItem}>
                            <span className={styles.contactIcon}>📧</span>
                            <span>support@dormitory.com</span>
                        </div>
                        <div className={styles.contactItem}>
                            <span className={styles.contactIcon}>💬</span>
                            <span>Line: @dormitory</span>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className={styles.actions}>
                    <button onClick={handleGoHome} className={styles.primaryButton}>
                        กลับหน้าหลัก
                    </button>
                    <button
                        onClick={() => window.print()}
                        className={styles.secondaryButton}
                    >
                        พิมพ์ใบยืนยัน
                    </button>
                </div>

                {/* Auto Redirect Notice */}
                {countdown > 0 && (
                    <p className={styles.redirectNotice}>
                        จะกลับหน้าหลักอัตโนมัติใน {countdown} วินาที...
                    </p>
                )}
            </div>
        </div>
    );
}

export default function PaymentConfirmation() {
    return (
        <div className={styles.container}>
            <Navbar />
            <Suspense fallback={
                <div className={styles.confirmationWrapper}>
                    <div className={styles.confirmationCard}>
                        <div style={{ textAlign: 'center', padding: '40px' }}>
                            <div className={styles.spinner}></div>
                            <p>กำลังโหลด...</p>
                        </div>
                    </div>
                </div>
            }>
                <ConfirmationContent />
            </Suspense>
        </div>
    );
}

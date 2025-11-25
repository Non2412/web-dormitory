"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import styles from "./payment.module.css";

interface PaymentFormData {
    // ข้อมูลส่วนตัว
    firstName: string;
    lastName: string;
    idCard: string;
    phone: string;
    email: string;
    emergencyContact: string;
    emergencyPhone: string;

    // ข้อมูลการจอง
    moveInDate: string;
    duration: string;

    // ข้อมูลการชำระเงิน
    paymentMethod: string;
    slipImage: File | null;
}

function PaymentContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const roomId = searchParams?.get('roomId');
    const roomName = searchParams?.get('roomName');
    const price = searchParams?.get('price');
    const quantity = searchParams?.get('quantity') || '1';

    const [formData, setFormData] = useState<PaymentFormData>({
        firstName: "",
        lastName: "",
        idCard: "",
        phone: "",
        email: "",
        emergencyContact: "",
        emergencyPhone: "",
        moveInDate: "",
        duration: "1",
        paymentMethod: "transfer",
        slipImage: null,
    });

    const [slipPreview, setSlipPreview] = useState<string>("");
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const totalAmount = price ? parseInt(price) * 3 * parseInt(quantity) : 0;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData(prev => ({ ...prev, slipImage: file }));

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setSlipPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        // Validate personal info
        if (!formData.firstName.trim()) newErrors.firstName = "กรุณากรอกชื่อ";
        if (!formData.lastName.trim()) newErrors.lastName = "กรุณากรอกนามสกุล";
        if (!formData.idCard.trim()) newErrors.idCard = "กรุณากรอกเลขบัตรประชาชน";
        else if (!/^\d{13}$/.test(formData.idCard)) newErrors.idCard = "เลขบัตรประชาชนต้องเป็นตัวเลข 13 หลัก";

        if (!formData.phone.trim()) newErrors.phone = "กรุณากรอกเบอร์โทรศัพท์";
        else if (!/^0\d{9}$/.test(formData.phone)) newErrors.phone = "เบอร์โทรศัพท์ไม่ถูกต้อง";

        if (!formData.email.trim()) newErrors.email = "กรุณากรอกอีเมล";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "อีเมลไม่ถูกต้อง";

        if (!formData.emergencyContact.trim()) newErrors.emergencyContact = "กรุณากรอกชื่อผู้ติดต่อฉุกเฉิน";
        if (!formData.emergencyPhone.trim()) newErrors.emergencyPhone = "กรุณากรอกเบอร์ผู้ติดต่อฉุกเฉิน";
        else if (!/^0\d{9}$/.test(formData.emergencyPhone)) newErrors.emergencyPhone = "เบอร์โทรศัพท์ไม่ถูกต้อง";

        // Validate booking info
        if (!formData.moveInDate) newErrors.moveInDate = "กรุณาเลือกวันที่เข้าพัก";
        if (!formData.duration) newErrors.duration = "กรุณาเลือกระยะเวลาเช่า";

        // Validate payment
        if (formData.paymentMethod === "transfer" && !formData.slipImage) {
            newErrors.slipImage = "กรุณาอัพโหลดสลิปการโอนเงิน";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            // Scroll to first error
            const firstError = document.querySelector('.error-message');
            firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }

        setIsSubmitting(true);

        // Simulate API call
        setTimeout(() => {
            // In real app, send data to backend
            console.log("Payment Data:", formData);

            // Redirect to confirmation page
            router.push(`/payment/confirmation?roomName=${roomName}&amount=${totalAmount}`);
        }, 2000);
    };

    if (!roomId || !roomName || !price) {
        return (
            <div className={styles.errorContainer}>
                <h1>ข้อมูลไม่ครบถ้วน</h1>
                <p>กรุณาเลือกห้องพักก่อนทำการชำระเงิน</p>
                <button onClick={() => router.push('/')} className={styles.backButton}>
                    กลับหน้าหลัก
                </button>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <Navbar />

            <div className={styles.paymentWrapper}>
                <div className={styles.paymentContainer}>
                    {/* Header */}
                    <div className={styles.header}>
                        <h1 className={styles.title}>ชำระเงินและกรอกข้อมูล</h1>
                        <p className={styles.subtitle}>กรุณากรอกข้อมูลให้ครบถ้วนเพื่อดำเนินการจองห้องพัก</p>
                    </div>

                    {/* Booking Summary */}
                    <div className={styles.bookingSummary}>
                        <h2>สรุปการจอง</h2>
                        <div className={styles.summaryDetails}>
                            <div className={styles.summaryRow}>
                                <span>ห้องพัก:</span>
                                <strong>{roomName}</strong>
                            </div>
                            <div className={styles.summaryRow}>
                                <span>จำนวน:</span>
                                <strong>{quantity} ห้อง</strong>
                            </div>
                            <div className={styles.summaryRow}>
                                <span>ค่ามัดจำ:</span>
                                <strong>฿{(parseInt(price) * 2 * parseInt(quantity)).toLocaleString()}</strong>
                            </div>
                            <div className={styles.summaryRow}>
                                <span>ค่าเช่าล่วงหน้า:</span>
                                <strong>฿{(parseInt(price) * parseInt(quantity)).toLocaleString()}</strong>
                            </div>
                            <div className={`${styles.summaryRow} ${styles.total}`}>
                                <span>ยอดรวมทั้งหมด:</span>
                                <strong>฿{totalAmount.toLocaleString()}</strong>
                            </div>
                        </div>
                    </div>

                    {/* Payment Form */}
                    <form onSubmit={handleSubmit} className={styles.form}>
                        {/* Personal Information */}
                        <section className={styles.formSection}>
                            <h3 className={styles.sectionTitle}>
                                <span className={styles.sectionIcon}>👤</span>
                                ข้อมูลส่วนตัว
                            </h3>

                            <div className={styles.formGrid}>
                                <div className={styles.formGroup}>
                                    <label htmlFor="firstName">ชื่อ <span className={styles.required}>*</span></label>
                                    <input
                                        type="text"
                                        id="firstName"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleInputChange}
                                        className={errors.firstName ? styles.inputError : ''}
                                        placeholder="กรอกชื่อ"
                                    />
                                    {errors.firstName && <span className="error-message" style={{ color: '#e74c3c', fontSize: '14px' }}>{errors.firstName}</span>}
                                </div>

                                <div className={styles.formGroup}>
                                    <label htmlFor="lastName">นามสกุล <span className={styles.required}>*</span></label>
                                    <input
                                        type="text"
                                        id="lastName"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleInputChange}
                                        className={errors.lastName ? styles.inputError : ''}
                                        placeholder="กรอกนามสกุล"
                                    />
                                    {errors.lastName && <span className="error-message" style={{ color: '#e74c3c', fontSize: '14px' }}>{errors.lastName}</span>}
                                </div>

                                <div className={styles.formGroup}>
                                    <label htmlFor="idCard">เลขบัตรประชาชน <span className={styles.required}>*</span></label>
                                    <input
                                        type="text"
                                        id="idCard"
                                        name="idCard"
                                        value={formData.idCard}
                                        onChange={handleInputChange}
                                        className={errors.idCard ? styles.inputError : ''}
                                        placeholder="1234567890123"
                                        maxLength={13}
                                    />
                                    {errors.idCard && <span className="error-message" style={{ color: '#e74c3c', fontSize: '14px' }}>{errors.idCard}</span>}
                                </div>

                                <div className={styles.formGroup}>
                                    <label htmlFor="phone">เบอร์โทรศัพท์ <span className={styles.required}>*</span></label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className={errors.phone ? styles.inputError : ''}
                                        placeholder="0812345678"
                                        maxLength={10}
                                    />
                                    {errors.phone && <span className="error-message" style={{ color: '#e74c3c', fontSize: '14px' }}>{errors.phone}</span>}
                                </div>

                                <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
                                    <label htmlFor="email">อีเมล <span className={styles.required}>*</span></label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className={errors.email ? styles.inputError : ''}
                                        placeholder="example@email.com"
                                    />
                                    {errors.email && <span className="error-message" style={{ color: '#e74c3c', fontSize: '14px' }}>{errors.email}</span>}
                                </div>
                            </div>
                        </section>

                        {/* Emergency Contact */}
                        <section className={styles.formSection}>
                            <h3 className={styles.sectionTitle}>
                                <span className={styles.sectionIcon}>🚨</span>
                                ผู้ติดต่อฉุกเฉิน
                            </h3>

                            <div className={styles.formGrid}>
                                <div className={styles.formGroup}>
                                    <label htmlFor="emergencyContact">ชื่อผู้ติดต่อฉุกเฉิน <span className={styles.required}>*</span></label>
                                    <input
                                        type="text"
                                        id="emergencyContact"
                                        name="emergencyContact"
                                        value={formData.emergencyContact}
                                        onChange={handleInputChange}
                                        className={errors.emergencyContact ? styles.inputError : ''}
                                        placeholder="ชื่อ-นามสกุล"
                                    />
                                    {errors.emergencyContact && <span className="error-message" style={{ color: '#e74c3c', fontSize: '14px' }}>{errors.emergencyContact}</span>}
                                </div>

                                <div className={styles.formGroup}>
                                    <label htmlFor="emergencyPhone">เบอร์โทรศัพท์ <span className={styles.required}>*</span></label>
                                    <input
                                        type="tel"
                                        id="emergencyPhone"
                                        name="emergencyPhone"
                                        value={formData.emergencyPhone}
                                        onChange={handleInputChange}
                                        className={errors.emergencyPhone ? styles.inputError : ''}
                                        placeholder="0812345678"
                                        maxLength={10}
                                    />
                                    {errors.emergencyPhone && <span className="error-message" style={{ color: '#e74c3c', fontSize: '14px' }}>{errors.emergencyPhone}</span>}
                                </div>
                            </div>
                        </section>

                        {/* Booking Details */}
                        <section className={styles.formSection}>
                            <h3 className={styles.sectionTitle}>
                                <span className={styles.sectionIcon}>📅</span>
                                รายละเอียดการจอง
                            </h3>

                            <div className={styles.formGrid}>
                                <div className={styles.formGroup}>
                                    <label htmlFor="moveInDate">วันที่เข้าพัก <span className={styles.required}>*</span></label>
                                    <input
                                        type="date"
                                        id="moveInDate"
                                        name="moveInDate"
                                        value={formData.moveInDate}
                                        onChange={handleInputChange}
                                        className={errors.moveInDate ? styles.inputError : ''}
                                        min={new Date().toISOString().split('T')[0]}
                                    />
                                    {errors.moveInDate && <span className="error-message" style={{ color: '#e74c3c', fontSize: '14px' }}>{errors.moveInDate}</span>}
                                </div>

                                <div className={styles.formGroup}>
                                    <label htmlFor="duration">ระยะเวลาเช่า <span className={styles.required}>*</span></label>
                                    <select
                                        id="duration"
                                        name="duration"
                                        value={formData.duration}
                                        onChange={handleInputChange}
                                        className={errors.duration ? styles.inputError : ''}
                                    >
                                        <option value="1">1 เดือน</option>
                                        <option value="3">3 เดือน</option>
                                        <option value="6">6 เดือน</option>
                                        <option value="12">12 เดือน</option>
                                    </select>
                                    {errors.duration && <span className="error-message" style={{ color: '#e74c3c', fontSize: '14px' }}>{errors.duration}</span>}
                                </div>
                            </div>
                        </section>

                        {/* Payment Method */}
                        <section className={styles.formSection}>
                            <h3 className={styles.sectionTitle}>
                                <span className={styles.sectionIcon}>💳</span>
                                วิธีการชำระเงิน
                            </h3>

                            <div className={styles.paymentMethods}>
                                <label className={styles.paymentMethod}>
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="transfer"
                                        checked={formData.paymentMethod === "transfer"}
                                        onChange={handleInputChange}
                                    />
                                    <div className={styles.methodContent}>
                                        <span className={styles.methodIcon}>🏦</span>
                                        <div>
                                            <strong>โอนเงินผ่านธนาคาร</strong>
                                            <p>โอนเงินผ่านบัญชีธนาคาร</p>
                                        </div>
                                    </div>
                                </label>

                                <label className={styles.paymentMethod}>
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="promptpay"
                                        checked={formData.paymentMethod === "promptpay"}
                                        onChange={handleInputChange}
                                    />
                                    <div className={styles.methodContent}>
                                        <span className={styles.methodIcon}>📱</span>
                                        <div>
                                            <strong>พร้อมเพย์ (PromptPay)</strong>
                                            <p>สแกน QR Code เพื่อชำระเงิน</p>
                                        </div>
                                    </div>
                                </label>
                            </div>

                            {/* Bank Details */}
                            {formData.paymentMethod === "transfer" && (
                                <div className={styles.bankDetails}>
                                    <h4>ข้อมูลบัญชีสำหรับโอนเงิน</h4>
                                    <div className={styles.bankInfo}>
                                        <p><strong>ธนาคาร:</strong> ธนาคารกสิกรไทย</p>
                                        <p><strong>ชื่อบัญชี:</strong> หอพักนักศึกษา</p>
                                        <p><strong>เลขที่บัญชี:</strong> 123-4-56789-0</p>
                                        <p><strong>จำนวนเงิน:</strong> ฿{totalAmount.toLocaleString()}</p>
                                    </div>
                                </div>
                            )}

                            {/* PromptPay QR Code */}
                            {formData.paymentMethod === "promptpay" && (
                                <div className={styles.promptpayDetails}>
                                    <h4>สแกน QR Code เพื่อชำระเงิน</h4>
                                    <div className={styles.qrCodeContainer}>
                                        <img
                                            src="/Rickrolling_QR_code.png"
                                            alt="PromptPay QR Code"
                                            className={styles.qrCode}
                                        />
                                        <div className={styles.qrInfo}>
                                            <p><strong>จำนวนเงิน:</strong> ฿{totalAmount.toLocaleString()}</p>
                                            <p className={styles.qrNote}>กรุณาสแกน QR Code ด้านบนเพื่อชำระเงิน</p>
                                        </div>
                                    </div>
                                </div>
                            )}


                            {/* Upload Slip */}
                            <div className={styles.formGroup} style={{ marginTop: '20px' }}>
                                <label htmlFor="slipImage">
                                    อัพโหลดสลิปการโอนเงิน <span className={styles.required}>*</span>
                                </label>
                                <div className={styles.fileUpload}>
                                    <input
                                        type="file"
                                        id="slipImage"
                                        name="slipImage"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className={styles.fileInput}
                                    />
                                    <label htmlFor="slipImage" className={styles.fileLabel}>
                                        <span className={styles.uploadIcon}>📎</span>
                                        {formData.slipImage ? formData.slipImage.name : 'เลือกไฟล์รูปภาพ'}
                                    </label>
                                </div>
                                {errors.slipImage && <span className="error-message" style={{ color: '#e74c3c', fontSize: '14px' }}>{errors.slipImage}</span>}

                                {slipPreview && (
                                    <div className={styles.imagePreview}>
                                        <img src={slipPreview} alt="Slip Preview" />
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* Submit Button */}
                        <div className={styles.submitSection}>
                            <button
                                type="submit"
                                className={styles.submitButton}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <span className={styles.spinner}></span>
                                        กำลังดำเนินการ...
                                    </>
                                ) : (
                                    'ยืนยันการชำระเงิน'
                                )}
                            </button>

                            <button
                                type="button"
                                className={styles.cancelButton}
                                onClick={() => router.back()}
                                disabled={isSubmitting}
                            >
                                ยกเลิก
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default function PaymentPage() {
    return (
        <Suspense fallback={<div className={styles.loadingContainer}>Loading...</div>}>
            <PaymentContent />
        </Suspense>
    );
}

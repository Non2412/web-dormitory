"use client";

import { useState, useRef } from "react";
import Tesseract from "tesseract.js";
import styles from "./dashboard.module.css";

export default function SlipVerifier() {
    const [image, setImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<{
        text: string;
        amount: string | null;
        date: string | null;
        time: string | null;
    } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setImage(imageUrl);
            setResult(null); // Reset previous result
        }
    };

    const verifySlip = async () => {
        if (!image) return;

        setLoading(true);
        try {
            const { data: { text } } = await Tesseract.recognize(image, "tha+eng", {
                logger: (m) => console.log(m),
            });

            // Simple regex extraction (can be improved based on slip format)
            // Amount: Look for numbers with commas and decimals, possibly preceded by "Amount" or similar
            const amountMatch = text.match(/[\d,]+\.\d{2}/);

            // Date: Look for DD/MM/YYYY or DD MMM YYYY patterns
            // This is a basic example, might need adjustment for Thai months
            const dateMatch = text.match(/(\d{1,2}\s+[A-Za-z\u0E00-\u0E7F]+\s+\d{4})|(\d{1,2}\/\d{1,2}\/\d{4})/);

            // Time: Look for HH:MM pattern
            const timeMatch = text.match(/\d{1,2}:\d{2}/);

            setResult({
                text: text,
                amount: amountMatch ? amountMatch[0] : null,
                date: dateMatch ? dateMatch[0] : null,
                time: timeMatch ? timeMatch[0] : null,
            });
        } catch (error) {
            console.error("OCR Error:", error);
            alert("เกิดข้อผิดพลาดในการตรวจสอบสลิป");
        } finally {
            setLoading(false);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className={styles.section}>
            <h2>ตรวจสอบสลิปโอนเงิน (OCR)</h2>
            <div className={styles.verifierContainer}>
                <div className={styles.uploadArea}>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        ref={fileInputRef}
                        style={{ display: "none" }}
                    />

                    {image ? (
                        <div className={styles.previewContainer}>
                            <img src={image} alt="Slip Preview" className={styles.previewImage} />
                            <button className={styles.changeBtn} onClick={triggerFileInput}>
                                เปลี่ยนรูปภาพ
                            </button>
                        </div>
                    ) : (
                        <div className={styles.uploadPlaceholder} onClick={triggerFileInput}>
                            <p>คลิกเพื่ออัพโหลดสลิป</p>
                            <span>รองรับไฟล์ JPG, PNG</span>
                        </div>
                    )}
                </div>

                <div className={styles.resultArea}>
                    {loading ? (
                        <div className={styles.loading}>
                            <div className={styles.spinner}></div>
                            <p>กำลังตรวจสอบข้อมูล...</p>
                        </div>
                    ) : result ? (
                        <div className={styles.resultCard}>
                            <h3>ผลการตรวจสอบ</h3>
                            <div className={styles.resultRow}>
                                <span>จำนวนเงิน:</span>
                                <strong className={result.amount ? styles.valid : styles.invalid}>
                                    {result.amount || "ไม่พบข้อมูล"}
                                </strong>
                            </div>
                            <div className={styles.resultRow}>
                                <span>วันที่:</span>
                                <strong>{result.date || "ไม่พบข้อมูล"}</strong>
                            </div>
                            <div className={styles.resultRow}>
                                <span>เวลา:</span>
                                <strong>{result.time || "ไม่พบข้อมูล"}</strong>
                            </div>

                            <div className={styles.rawText}>
                                <details>
                                    <summary>ดูข้อความทั้งหมดที่อ่านได้</summary>
                                    <pre>{result.text}</pre>
                                </details>
                            </div>
                        </div>
                    ) : (
                        <div className={styles.emptyState}>
                            <p>อัพโหลดสลิปและกดปุ่มตรวจสอบเพื่อดูผลลัพธ์</p>
                        </div>
                    )}

                    <button
                        className={styles.verifyBtn}
                        onClick={verifySlip}
                        disabled={!image || loading}
                    >
                        {loading ? "กำลังประมวลผล..." : "ตรวจสอบสลิป"}
                    </button>
                </div>
            </div>
        </div>
    );
}

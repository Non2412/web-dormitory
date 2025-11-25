"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./utilities.module.css";
import Sidebar from "../components/Sidebar";

import { useAuth } from "@/contexts/AuthContext";

export default function UtilitiesPage() {
    const router = useRouter();
    const { user, isAuthenticated, loading: authLoading } = useAuth();

    // Rates
    const [waterRate, setWaterRate] = useState("18");
    const [electricityRate, setElectricityRate] = useState("7");

    // Calculator
    const [selectedRoom, setSelectedRoom] = useState("101");
    const [prevWater, setPrevWater] = useState("");
    const [currentWater, setCurrentWater] = useState("");
    const [prevElectricity, setPrevElectricity] = useState("");
    const [currentElectricity, setCurrentElectricity] = useState("");
    const [calculatedBill, setCalculatedBill] = useState<{
        waterUnits: number;
        electricityUnits: number;
        waterCost: number;
        electricityCost: number;
        total: number;
    } | null>(null);

    useEffect(() => {
        if (!authLoading) {
            if (!isAuthenticated || user?.role !== 'ADMIN') {
                router.push("/login");
            } else {
                // Use setTimeout to avoid synchronous state update warning
                setTimeout(() => {
                    // Load saved rates
                    const savedWaterRate = localStorage.getItem("waterRate");
                    const savedElectricityRate = localStorage.getItem("electricityRate");
                    if (savedWaterRate) setWaterRate(savedWaterRate);
                    if (savedElectricityRate) setElectricityRate(savedElectricityRate);
                }, 0);
            }
        }
    }, [isAuthenticated, user, authLoading, router]);

    const saveRates = () => {
        localStorage.setItem("waterRate", waterRate);
        localStorage.setItem("electricityRate", electricityRate);
        alert("บันทึกอัตราค่าน้ำค่าไฟสำเร็จ!");
    };

    const calculateBill = () => {
        const waterUnits = parseFloat(currentWater) - parseFloat(prevWater);
        const electricityUnits = parseFloat(currentElectricity) - parseFloat(prevElectricity);

        if (waterUnits < 0 || electricityUnits < 0) {
            alert("เลขมิเตอร์ปัจจุบันต้องมากกว่าเลขมิเตอร์ก่อนหน้า!");
            return;
        }

        const waterCost = waterUnits * parseFloat(waterRate);
        const electricityCost = electricityUnits * parseFloat(electricityRate);
        const total = waterCost + electricityCost;

        setCalculatedBill({
            waterUnits,
            electricityUnits,
            waterCost,
            electricityCost,
            total,
        });
    };

    if (authLoading) {
        return <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>;
    }

    return (
        <>
            <Sidebar />
            <div className={styles.mainContent}>
                <div className={styles.container}>
                    <div className={styles.header}>
                        <h1 className={styles.title}>จัดการค่าน้ำค่าไฟ</h1>
                        <button className={styles.backBtn} onClick={() => router.push("/admin/dashboard")}>
                            ← กลับหน้าหลัก
                        </button>
                    </div>

                    <div className={styles.grid}>
                        {/* Rate Settings Section */}
                        <div className={styles.card}>
                            <h2 className={styles.cardTitle}>ตั้งค่าอัตราค่าน้ำค่าไฟ</h2>

                            <div className={styles.formGroup}>
                                <label>อัตราค่าน้ำ (฿/หน่วย)</label>
                                <input
                                    type="number"
                                    value={waterRate}
                                    onChange={(e) => setWaterRate(e.target.value)}
                                    className={styles.input}
                                    step="0.01"
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>อัตราค่าไฟ (฿/หน่วย)</label>
                                <input
                                    type="number"
                                    value={electricityRate}
                                    onChange={(e) => setElectricityRate(e.target.value)}
                                    className={styles.input}
                                    step="0.01"
                                />
                            </div>

                            <button className={styles.saveBtn} onClick={saveRates}>
                                บันทึกอัตรา
                            </button>
                        </div>

                        {/* Bill Calculator Section */}
                        <div className={styles.card}>
                            <h2 className={styles.cardTitle}>คำนวณค่าน้ำค่าไฟ</h2>

                            <div className={styles.formGroup}>
                                <label>เลือกห้อง</label>
                                <select
                                    value={selectedRoom}
                                    onChange={(e) => setSelectedRoom(e.target.value)}
                                    className={styles.input}
                                >
                                    {Array.from({ length: 50 }, (_, i) => i + 101).map((room) => (
                                        <option key={room} value={room}>
                                            ห้อง {room}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className={styles.row}>
                                <div className={styles.formGroup}>
                                    <label>มิเตอร์น้ำก่อนหน้า</label>
                                    <input
                                        type="number"
                                        value={prevWater}
                                        onChange={(e) => setPrevWater(e.target.value)}
                                        className={styles.input}
                                        placeholder="0"
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>มิเตอร์น้ำปัจจุบัน</label>
                                    <input
                                        type="number"
                                        value={currentWater}
                                        onChange={(e) => setCurrentWater(e.target.value)}
                                        className={styles.input}
                                        placeholder="0"
                                    />
                                </div>
                            </div>

                            <div className={styles.row}>
                                <div className={styles.formGroup}>
                                    <label>มิเตอร์ไฟก่อนหน้า</label>
                                    <input
                                        type="number"
                                        value={prevElectricity}
                                        onChange={(e) => setPrevElectricity(e.target.value)}
                                        className={styles.input}
                                        placeholder="0"
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>มิเตอร์ไฟปัจจุบัน</label>
                                    <input
                                        type="number"
                                        value={currentElectricity}
                                        onChange={(e) => setCurrentElectricity(e.target.value)}
                                        className={styles.input}
                                        placeholder="0"
                                    />
                                </div>
                            </div>

                            <button className={styles.calculateBtn} onClick={calculateBill}>
                                คำนวณ
                            </button>

                            {calculatedBill && (
                                <div className={styles.result}>
                                    <h3>ผลการคำนวณ - ห้อง {selectedRoom}</h3>
                                    <div className={styles.resultRow}>
                                        <span>น้ำ: {calculatedBill.waterUnits.toFixed(2)} หน่วย</span>
                                        <strong>฿{calculatedBill.waterCost.toFixed(2)}</strong>
                                    </div>
                                    <div className={styles.resultRow}>
                                        <span>ไฟ: {calculatedBill.electricityUnits.toFixed(2)} หน่วย</span>
                                        <strong>฿{calculatedBill.electricityCost.toFixed(2)}</strong>
                                    </div>
                                    <div className={styles.resultTotal}>
                                        <span>รวมทั้งหมด</span>
                                        <strong>฿{calculatedBill.total.toFixed(2)}</strong>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

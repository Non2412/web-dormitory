"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import styles from "./tenants.module.css";

interface Tenant {
    id: string;
    name: string;
    roomNumber: string;
    phone: string;
    email: string;
    moveInDate: string;
    status: "Active" | "Moving Out";
}

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function TenantsPage() {
    const router = useRouter();
    const { user, isAuthenticated, loading: authLoading } = useAuth();
    const [tenants, setTenants] = useState<Tenant[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newTenant, setNewTenant] = useState<Partial<Tenant>>({
        status: "Active",
    });

    useEffect(() => {
        if (!authLoading) {
            if (!isAuthenticated || user?.role !== 'ADMIN') {
                router.push("/login");
            } else {
                // Use setTimeout to avoid synchronous state update warning
                setTimeout(() => {
                    // Load tenants from localStorage
                    const savedTenants = localStorage.getItem("tenants");
                    if (savedTenants) {
                        setTenants(JSON.parse(savedTenants));
                    } else {
                        // Initial dummy data
                        const initialTenants: Tenant[] = [
                            {
                                id: "1",
                                name: "สมชาย ใจดี",
                                roomNumber: "101",
                                phone: "081-234-5678",
                                email: "somchai@example.com",
                                moveInDate: "2024-01-15",
                                status: "Active",
                            },
                            {
                                id: "2",
                                name: "วิภาดา รักสงบ",
                                roomNumber: "202",
                                phone: "089-987-6543",
                                email: "wipada@example.com",
                                moveInDate: "2024-02-01",
                                status: "Active",
                            },
                        ];
                        setTenants(initialTenants);
                        localStorage.setItem("tenants", JSON.stringify(initialTenants));
                    }
                }, 0);
            }
        }
    }, [isAuthenticated, user, authLoading, router]);

    if (authLoading) {
        return <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>;
    }

    const handleSaveTenant = () => {
        if (!newTenant.name || !newTenant.roomNumber) return;

        const tenant: Tenant = {
            id: Date.now().toString(),
            name: newTenant.name,
            roomNumber: newTenant.roomNumber,
            phone: newTenant.phone || "",
            email: newTenant.email || "",
            moveInDate: newTenant.moveInDate || new Date().toISOString().split("T")[0],
            status: newTenant.status as "Active" | "Moving Out",
        };

        const updatedTenants = [...tenants, tenant];
        setTenants(updatedTenants);
        localStorage.setItem("tenants", JSON.stringify(updatedTenants));
        setIsModalOpen(false);
        setNewTenant({ status: "Active" });
    };

    const handleDeleteTenant = (id: string) => {
        if (confirm("คุณแน่ใจหรือไม่ที่จะลบข้อมูลผู้เช่ารายนี้?")) {
            const updatedTenants = tenants.filter((tenant) => tenant.id !== id);
            setTenants(updatedTenants);
            localStorage.setItem("tenants", JSON.stringify(updatedTenants));
        }
    };

    return (
        <>
            <Sidebar />
            <div className={styles.mainContent}>
                <div className={styles.header}>
                    <h1>จัดการผู้เช่า (Tenants)</h1>
                    <button
                        className={styles.addButton}
                        onClick={() => setIsModalOpen(true)}
                    >
                        + เพิ่มผู้เช่าใหม่
                    </button>
                </div>

                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>ชื่อ-นามสกุล</th>
                                <th>ห้องพัก</th>
                                <th>ข้อมูลติดต่อ</th>
                                <th>วันที่เข้าพัก</th>
                                <th>สถานะ</th>
                                <th>จัดการ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tenants.map((tenant) => (
                                <tr key={tenant.id}>
                                    <td>
                                        <div className={styles.tenantName}>
                                            <div className={styles.avatar}>
                                                {tenant.name.charAt(0)}
                                            </div>
                                            {tenant.name}
                                        </div>
                                    </td>
                                    <td>
                                        <span className={styles.roomBadge}>
                                            ห้อง {tenant.roomNumber}
                                        </span>
                                    </td>
                                    <td>
                                        <div className={styles.contactInfo}>
                                            <span>📞 {tenant.phone}</span>
                                            <span>📧 {tenant.email}</span>
                                        </div>
                                    </td>
                                    <td>{tenant.moveInDate}</td>
                                    <td>
                                        <span
                                            className={`${styles.statusBadge} ${tenant.status === "Active"
                                                ? styles.statusActive
                                                : styles.statusMovingOut
                                                }`}
                                        >
                                            {tenant.status === "Active" ? "พักอาศัย" : "ย้ายออก"}
                                        </span>
                                    </td>
                                    <td>
                                        <div className={styles.actions}>
                                            <button className={styles.actionButton}>แก้ไข</button>
                                            <button
                                                className={`${styles.actionButton} ${styles.deleteButton}`}
                                                onClick={() => handleDeleteTenant(tenant.id)}
                                            >
                                                ลบ
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {isModalOpen && (
                    <div className={styles.modalOverlay}>
                        <div className={styles.modal}>
                            <h2>เพิ่มผู้เช่าใหม่</h2>
                            <div className={styles.formGroup}>
                                <label>ชื่อ-นามสกุล</label>
                                <input
                                    type="text"
                                    className={styles.input}
                                    placeholder="ชื่อ-นามสกุล"
                                    value={newTenant.name || ""}
                                    onChange={(e) =>
                                        setNewTenant({ ...newTenant, name: e.target.value })
                                    }
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>หมายเลขห้อง</label>
                                <input
                                    type="text"
                                    className={styles.input}
                                    placeholder="เช่น 101"
                                    value={newTenant.roomNumber || ""}
                                    onChange={(e) =>
                                        setNewTenant({ ...newTenant, roomNumber: e.target.value })
                                    }
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>เบอร์โทรศัพท์</label>
                                <input
                                    type="tel"
                                    className={styles.input}
                                    placeholder="08x-xxx-xxxx"
                                    value={newTenant.phone || ""}
                                    onChange={(e) =>
                                        setNewTenant({ ...newTenant, phone: e.target.value })
                                    }
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>อีเมล</label>
                                <input
                                    type="email"
                                    className={styles.input}
                                    placeholder="email@example.com"
                                    value={newTenant.email || ""}
                                    onChange={(e) =>
                                        setNewTenant({ ...newTenant, email: e.target.value })
                                    }
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>วันที่เข้าพัก</label>
                                <input
                                    type="date"
                                    className={styles.input}
                                    value={newTenant.moveInDate || ""}
                                    onChange={(e) =>
                                        setNewTenant({ ...newTenant, moveInDate: e.target.value })
                                    }
                                />
                            </div>
                            <div className={styles.modalActions}>
                                <button
                                    className={styles.cancelButton}
                                    onClick={() => setIsModalOpen(false)}
                                >
                                    ยกเลิก
                                </button>
                                <button className={styles.saveButton} onClick={handleSaveTenant}>
                                    บันทึก
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

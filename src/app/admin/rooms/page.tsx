"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import styles from "./rooms.module.css";

type RoomStatus = "Available" | "Occupied" | "Maintenance";

interface Room {
    id: string;
    number: string;
    price: number;
    status: RoomStatus;
    tenant?: string;
}

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function RoomsPage() {
    const router = useRouter();
    const { user, isAuthenticated, loading: authLoading } = useAuth();
    const [rooms, setRooms] = useState<Room[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newRoom, setNewRoom] = useState<Partial<Room>>({
        status: "Available",
    });

    useEffect(() => {
        if (!authLoading) {
            if (!isAuthenticated || user?.role !== 'ADMIN') {
                router.push("/login");
            } else {
                // Use setTimeout to avoid synchronous state update warning
                setTimeout(() => {
                    // Load rooms from localStorage
                    const savedRooms = localStorage.getItem("rooms");
                    if (savedRooms) {
                        setRooms(JSON.parse(savedRooms));
                    } else {
                        // Initial dummy data
                        const initialRooms: Room[] = [
                            { id: "1", number: "101", price: 4500, status: "Occupied", tenant: "John Doe" },
                            { id: "2", number: "102", price: 4500, status: "Available" },
                            { id: "3", number: "201", price: 5000, status: "Available" },
                        ];
                        setRooms(initialRooms);
                        localStorage.setItem("rooms", JSON.stringify(initialRooms));
                    }
                }, 0);
            }
        }
    }, [isAuthenticated, user, authLoading, router]);

    if (authLoading) {
        return <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>;
    }

    const handleSaveRoom = () => {
        if (!newRoom.number || !newRoom.price) return;

        const room: Room = {
            id: Date.now().toString(),
            number: newRoom.number,
            price: Number(newRoom.price),
            status: newRoom.status as RoomStatus,
        };

        const updatedRooms = [...rooms, room];
        setRooms(updatedRooms);
        localStorage.setItem("rooms", JSON.stringify(updatedRooms));
        setIsModalOpen(false);
        setNewRoom({ status: "Available" });
    };

    const handleDeleteRoom = (id: string) => {
        if (confirm("Are you sure you want to delete this room?")) {
            const updatedRooms = rooms.filter((room) => room.id !== id);
            setRooms(updatedRooms);
            localStorage.setItem("rooms", JSON.stringify(updatedRooms));
        }
    };

    return (
        <>
            <Sidebar />
            <div className={styles.mainContent}>
                <div className={styles.header}>
                    <h1>จัดการห้องพัก (Rooms)</h1>
                    <button
                        className={styles.addButton}
                        onClick={() => setIsModalOpen(true)}
                    >
                        + เพิ่มห้องพัก
                    </button>
                </div>

                <div className={styles.grid}>
                    {rooms.map((room) => (
                        <div key={room.id} className={styles.card}>
                            <div className={styles.cardHeader}>
                                <span className={styles.roomNumber}>ห้อง {room.number}</span>
                                <span
                                    className={`${styles.statusBadge} ${room.status === "Available"
                                        ? styles.statusAvailable
                                        : room.status === "Occupied"
                                            ? styles.statusOccupied
                                            : styles.statusMaintenance
                                        }`}
                                >
                                    {room.status === "Available"
                                        ? "ว่าง"
                                        : room.status === "Occupied"
                                            ? "มีผู้เช่า"
                                            : "ปรับปรุง"}
                                </span>
                            </div>

                            <div className={styles.cardBody}>
                                <div className={styles.infoRow}>
                                    <span>ราคา:</span>
                                    <span className={styles.price}>{room.price.toLocaleString()} บาท</span>
                                </div>
                                {room.tenant && (
                                    <div className={styles.infoRow}>
                                        <span>ผู้เช่า:</span>
                                        <span>{room.tenant}</span>
                                    </div>
                                )}
                            </div>

                            <div className={styles.cardActions}>
                                <button className={styles.actionButton}>แก้ไข</button>
                                <button
                                    className={`${styles.actionButton} ${styles.deleteButton}`}
                                    onClick={() => handleDeleteRoom(room.id)}
                                >
                                    ลบ
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {isModalOpen && (
                    <div className={styles.modalOverlay}>
                        <div className={styles.modal}>
                            <h2>เพิ่มห้องพักใหม่</h2>
                            <div className={styles.formGroup}>
                                <label>หมายเลขห้อง</label>
                                <input
                                    type="text"
                                    className={styles.input}
                                    placeholder="เช่น 101"
                                    value={newRoom.number || ""}
                                    onChange={(e) =>
                                        setNewRoom({ ...newRoom, number: e.target.value })
                                    }
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>ราคา (บาท/เดือน)</label>
                                <input
                                    type="number"
                                    className={styles.input}
                                    placeholder="เช่น 4500"
                                    value={newRoom.price || ""}
                                    onChange={(e) =>
                                        setNewRoom({ ...newRoom, price: Number(e.target.value) })
                                    }
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>สถานะ</label>
                                <select
                                    className={styles.select}
                                    value={newRoom.status}
                                    onChange={(e) =>
                                        setNewRoom({
                                            ...newRoom,
                                            status: e.target.value as RoomStatus,
                                        })
                                    }
                                >
                                    <option value="Available">ว่าง</option>
                                    <option value="Occupied">มีผู้เช่า</option>
                                    <option value="Maintenance">ปรับปรุง</option>
                                </select>
                            </div>
                            <div className={styles.modalActions}>
                                <button
                                    className={styles.cancelButton}
                                    onClick={() => setIsModalOpen(false)}
                                >
                                    ยกเลิก
                                </button>
                                <button className={styles.saveButton} onClick={handleSaveRoom}>
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
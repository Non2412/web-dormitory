"use client";

import { useRouter, usePathname } from "next/navigation";
import styles from "./Sidebar.module.css";

export default function Sidebar() {
    const router = useRouter();
    const pathname = usePathname();

    const handleLogout = () => {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("currentUser");
        router.push("/login");
    };

    const menuItems = [
        { name: "Dashboard", path: "/admin/dashboard", icon: "📊" },
        { name: "ค่าน้ำค่าไฟ", path: "/admin/utilities", icon: "⚡" },
        { name: "ห้องพัก", path: "/admin/rooms", icon: "🏠" },
        { name: "ผู้เช่า", path: "/admin/tenants", icon: "👥" },
        { name: "ประวัติการชำระเงิน", path: "/admin/payments", icon: "📝" },
    ];

    return (
        <div className={styles.sidebar}>
            <div className={styles.logo}>
                <h2>🏢 ระบบหอพัก</h2>
            </div>

            <nav className={styles.nav}>
                {menuItems.map((item) => (
                    <button
                        key={item.path}
                        className={`${styles.navItem} ${pathname === item.path ? styles.active : ""}`}
                        onClick={() => router.push(item.path)}
                    >
                        <span className={styles.icon}>{item.icon}</span>
                        <span>{item.name}</span>
                    </button>
                ))}
            </nav>

            <div className={styles.footer}>
                <button className={styles.logoutBtn} onClick={handleLogout}>
                    🚪 ออกจากระบบ
                </button>
            </div>
        </div>
    );
}

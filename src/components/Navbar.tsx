'use client';

import Link from "next/link";
import styles from "../app/landing.module.css";

export default function Navbar() {
  return (
    <>
      {/* Navigation Bar */}
      <nav className={styles.navbar}>
        <div className={styles.navContent}>
          <div className={styles.logo}>
            <h2>ระบบจัดการหอพัก</h2>
            <p>Dormitory Management System</p>
          </div>

          <div className={styles.navLinks}>
            <a href="#home" className={styles.navLink}>Home</a>
            <a href="#book" className={styles.navLink}>รายการห้องพัก</a>
            <a href="#about" className={styles.navLink}>About</a>
            <a href="#contact" className={styles.navLink}>Contact</a>

            <Link href="/login" className={styles.loginButton}>
              Log In
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
}

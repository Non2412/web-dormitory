"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./landing.module.css";

export default function Home() {
  const router = useRouter();

  return (
    <div className={styles.container}>
      {/* Navigation Bar */}
      <nav className={styles.navbar}>
        <div className={styles.navContent}>
          <button 
            onClick={() => router.push("/dormitory")}
            className={styles.logo}
            style={{ background: "none", border: "none", cursor: "pointer" }}
          >
            <h2>ระบบจัดการหอพัก</h2>
            <p>Dormitory Management System</p>
          </button>
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

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              ระบบจัดการหอพักที่ทันสมัย
              <br />
              Modern Dormitory Living
            </h1>
            <p className={styles.heroSubtitle}>
              Be Bold. Design Your Life.
            </p>
            <div className={styles.heroButtons}>
              <Link href="/login" className={styles.primaryButton}>
                จองห้องพัก
              </Link>
              <a href="#about" className={styles.secondaryButton}>
                เรียนรู้เพิ่มเติม
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <div className={styles.featuresContent}>
          <h2 className={styles.sectionTitle}>จุดเด่นของเรา</h2>
          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🏠</div>
              <h3>ห้องพักที่ทันสมัย</h3>
              <p>ห้องพักครบครันพร้อมเฟอร์นิเจอร์และสิ่งอำนวยความสะดวกครบครัน</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🔒</div>
              <h3>ความปลอดภัย</h3>
              <p>ระบบรักษาความปลอดภัยตลอด 24 ชั่วโมง พร้อมกล้องวงจรปิด</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>💰</div>
              <h3>ราคาสมเหตุสมผล</h3>
              <p>ค่าเช่าที่เหมาะสมกับคุณภาพที่ได้รับ ไม่มีค่าใช้จ่ายแอบแฝง</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>📱</div>
              <h3>จัดการออนไลน์</h3>
              <p>ระบบจัดการออนไลน์ที่ทันสมัย ใช้งานง่าย สะดวกสบาย</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerSection}>
            <h3>ระบบจัดการหอพัก</h3>
            <p>ที่พักอาศัยที่ดีที่สุดสำหรับคุณ</p>
          </div>
          <div className={styles.footerSection}>
            <h4>ติดต่อเรา</h4>
            <p>📧 info@dormitory.com</p>
            <p>📞 02-123-4567</p>
          </div>
          <div className={styles.footerSection}>
            <h4>ที่อยู่</h4>
            <p>123 ถนนสุขุมวิท</p>
            <p>กรุงเทพมหานคร 10110</p>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p>&copy; 2025 Dormitory Management System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

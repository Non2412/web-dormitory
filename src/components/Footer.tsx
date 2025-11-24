'use client';

import styles from "../app/landing.module.css";

export default function Footer() {
  return (
    <>
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
    </>
  );
}

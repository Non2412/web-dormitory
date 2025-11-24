"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "./landing.module.css";

export default function Home() {
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null);
  const router = useRouter();

  const galleryImages = [
    { id: 1, src: "/room1.jpg", name: "ห้องโปรด" },
    { id: 2, src: "/room2.jpg", name: "ห้องมาตรฐาน" },
    { id: 3, src: "/room3.jpg", name: "ห้องพรีเมียม" }
  ];

  const handleRoomClick = (roomId: number) => {
    router.push(`/room/${roomId}`);
  }; 

  return (
    <div className={styles.container}>
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
              <a href="#book" className={styles.secondaryButton}>
                เรียนรู้เพิ่มเติม
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Rooms Gallery Section */}
      <section id="book" style={{ padding: '80px 30px', background: '#f8f9fa' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <h2 className={styles.sectionTitle} style={{ marginBottom: '50px' }}>รายการห้องพัก</h2>
          
          {/* Equal Size Grid Gallery */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '30px',
            marginBottom: '50px'
          }}>
            {galleryImages.map((room) => (
              <div
                key={room.id}
                onClick={() => handleRoomClick(room.id)}
                style={{
                  position: 'relative',
                  overflow: 'hidden',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  backgroundColor: '#e0e0e0',
                  aspectRatio: '1 / 1',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-8px)';
                  (e.currentTarget as HTMLDivElement).style.boxShadow = '0 12px 30px rgba(0,0,0,0.2)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                  (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
                }}
              >
                <img
                  src={room.src}
                  alt={room.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLImageElement).style.transform = 'scale(1.08)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLImageElement).style.transform = 'scale(1)';
                  }}
                />
                
                {/* Overlay */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'rgba(0,0,0,0)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.background = 'rgba(0,0,0,0.4)';
                  const icon = (e.currentTarget as HTMLDivElement).querySelector('span');
                  const text = (e.currentTarget as HTMLDivElement).querySelector('p');
                  if (icon) {
                    (icon as HTMLSpanElement).style.opacity = '1';
                    (icon as HTMLSpanElement).style.transform = 'scale(1)';
                  }
                  if (text) {
                    (text as HTMLParagraphElement).style.opacity = '1';
                    (text as HTMLParagraphElement).style.transform = 'translateY(0)';
                  }
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.background = 'rgba(0,0,0,0)';
                  const icon = (e.currentTarget as HTMLDivElement).querySelector('span');
                  const text = (e.currentTarget as HTMLDivElement).querySelector('p');
                  if (icon) {
                    (icon as HTMLSpanElement).style.opacity = '0';
                    (icon as HTMLSpanElement).style.transform = 'scale(0.8)';
                  }
                  if (text) {
                    (text as HTMLParagraphElement).style.opacity = '0';
                    (text as HTMLParagraphElement).style.transform = 'translateY(10px)';
                  }
                }}
                >
                  <span style={{
                    fontSize: '40px',
                    transition: 'all 0.3s ease',
                    opacity: 0,
                    transform: 'scale(0.8)',
                    marginBottom: '10px'
                  }}>
                    🔍
                  </span>
                  <p style={{
                    color: 'white',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    transition: 'all 0.3s ease',
                    opacity: 0,
                    transform: 'translateY(10px)',
                    margin: 0
                  }}>
                    ดูรายละเอียด
                  </p>
                </div>
              </div>
            ))}
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
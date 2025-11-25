"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import styles from "./landing.module.css";

export default function Home() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setCurrentUser(user);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('adminToken');
    setCurrentUser(null);
    setShowUserMenu(false);
    router.push('/login');
  };

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
            <Link href="/book" className={styles.navLink}>รายการห้องพัก</Link>
            <Link href="/about" className={styles.navLink}>เกี่ยวกับ</Link>
            <a href="#contact" className={styles.navLink}>Contact</a>
            {currentUser ? (
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: '500',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  }}
                >
                  👤 {currentUser.fullName} ▼
                </button>
                {showUserMenu && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    marginTop: '8px',
                    background: 'white',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    minWidth: '180px',
                    overflow: 'hidden',
                    zIndex: 1000
                  }}>
                    <button
                      onClick={handleLogout}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        background: 'none',
                        border: 'none',
                        textAlign: 'left',
                        cursor: 'pointer',
                        fontSize: '14px',
                        color: '#333',
                        transition: 'background 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#f5f5f5';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'none';
                      }}
                    >
                      🚪 ออกจากระบบ
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" className={styles.loginButton}>
                Log In
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className={styles.hero} id="home">
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
              <Link href="/book" className={styles.primaryButton}>
                จองห้องพัก
              </Link>
              <Link href="/book" className={styles.secondaryButton}>
                เรียนรู้เพิ่มเติม
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Rooms Gallery Section */}
      <section id="book" className={styles.roomsSection}>
        <div className={styles.roomsContent}>
          <h2 className={styles.sectionTitle}>รายการห้องพัก</h2>

          {/* Equal Size Grid Gallery */}
          <div className={styles.roomsGrid}>
            {galleryImages.map((room) => (
              <div
                key={room.id}
                onClick={() => handleRoomClick(room.id)}
                className={styles.roomCard}
                style={{ cursor: 'pointer' }}
              >
                <div className={styles.roomImageBox}>
                  {/* Using roomSvg class for consistent sizing if needed, or just img */}
                  <img
                    src={room.src}
                    alt={room.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      position: 'absolute',
                      top: 0,
                      left: 0
                    }}
                  />
                  {/* Overlay for hover effect */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.4)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: 0,
                    transition: 'opacity 0.3s ease'
                  }}
                    className="hover-overlay"
                    onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                    onMouseLeave={(e) => e.currentTarget.style.opacity = '0'}
                  >
                    <span style={{ fontSize: '40px', marginBottom: '10px' }}>🔍</span>
                    <p style={{ color: 'white', fontWeight: 'bold', margin: 0 }}>ดูรายละเอียด</p>
                  </div>
                </div>
                <div className={styles.roomInfo}>
                  <h3>{room.name}</h3>
                  <p className={styles.roomNameEn}>Premium Room</p>
                  <div className={styles.roomPrice}>
                    <span className={styles.price}>฿4,500</span>
                    <span className={styles.priceMonth}>/ เดือน</span>
                  </div>
                  <ul className={styles.roomFeatures}>
                    <li>เตียง 6 ฟุต</li>
                    <li>เครื่องปรับอากาศ</li>
                    <li>เฟอร์นิเจอร์ครบ</li>
                    <li>ฟรี Wi-Fi</li>
                  </ul>
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
      <footer className={styles.footer} id="contact">
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
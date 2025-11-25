'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import styles from "../app/dormitory/landing.module.css";

export default function Navbar() {
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
            <Link href="/dormitory" className={styles.navLink}>Home</Link>
            <Link href={currentUser ? "/book" : "/login"} className={styles.navLink}>รายการห้องพัก</Link>
            <Link href="/about" className={styles.navLink}>About</Link>
            <Link href="/qr_check" className={styles.navLink}>OCR</Link>

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
    </>
  );
}

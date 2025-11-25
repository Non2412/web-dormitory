"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import React from "react";

export default function AboutPage() {
    return (
        <div style={{ background: '#fff', color: '#222', minHeight: '100vh', paddingTop: '100px' }}>
            <Navbar />

            {/* Hero image */}
            <header style={{ maxWidth: 1200, margin: '0 auto 24px', padding: '0 20px' }}>
                <div style={{
                    height: 380,
                    borderRadius: 4,
                    overflow: 'hidden',
                    backgroundImage: `url('https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=2071')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <h1 style={{ color: 'white', fontSize: 48, fontWeight: 700, textShadow: '0 6px 18px rgba(0,0,0,0.4)' }}>ระบบจัดการหอพัก</h1>
                </div>
            </header>

            {/* Main content two-column */}
            <main style={{ maxWidth: 1100, margin: '40px auto', padding: '0 20px', display: 'grid', gridTemplateColumns: '1fr 420px', gap: 40, alignItems: 'start' }}>
                <section>
                    <h2 style={{ fontSize: 20, marginBottom: 16 }}>เกี่ยวกับเว็บไซต์ของเรา</h2>
                    <p style={{ lineHeight: 1.8, color: '#444' }}>
                        เว็บนี้เป็นระบบจัดการหอพักออกแบบมาเพื่อให้เจ้าของหอและผู้เช่าสามารถจัดการงานที่เกี่ยวข้องกับหอพักได้ง่ายขึ้น —
                        เช่น การจ่ายค่าเช่า การจัดการค่าน้ำค่าไฟ การจองห้องออนไลน์ รวมถึงการดูประวัติการชำระเงินและสถานะห้องพักแบบเรียลไทม์。
                    </p>

                    <p style={{ lineHeight: 1.8, color: '#444' }}>
                        ความสามารถหลักของระบบ:
                    </p>
                    <ul style={{ color: '#444', lineHeight: 1.8 }}>
                        <li>ระบบจองห้องพักออนไลน์</li>
                        <li>การคำนวณค่าเช่าและบิลค่าน้ำ ค่าไฟ</li>
                        <li>การแจ้งเตือนการชำระเงินและประวัติการชำระ</li>
                        <li>หน้าจัดการผู้เช่าและสถานะห้องพัก</li>
                        <li>ออกแบบให้รองรับการใช้งานทั้งมือถือและเดสก์ท็อป</li>
                    </ul>

                    <p style={{ marginTop: 18, color: '#444' }}>
                        หากต้องการทดลองใช้งาน ให้คลิกปุ่ม "จองห้องพัก" บนเมนูเพื่อไปยังหน้าจองห้องหรือเลื่อนลงไปยังส่วนติดต่อ (Contact) เพื่อสอบถามข้อมูลเพิ่มเติม
                    </p>
                </section>

                <aside style={{ display: 'flex', justifyContent: 'center' }}>
                    <img src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&q=60" alt="decor" style={{ width: '100%', borderRadius: 6, boxShadow: '0 6px 20px rgba(0,0,0,0.08)' }} />
                </aside>
            </main>

            <Footer />
        </div>
    );
}

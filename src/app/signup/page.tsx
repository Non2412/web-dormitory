"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./signup.module.css";

export default function SignUp() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert("รหัสผ่านไม่ตรงกัน!");
      return;
    }
    
    // Handle signup logic here
    console.log("Sign up with:", formData);
  };

  return (
    <div className={styles.container}>
      <div className={styles.signupCard}>
        <div className={styles.header}>
          <h1>SIGN UP</h1>
          <p>สมัครสมาชิก</p>
        </div>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <input
              type="text"
              name="fullName"
              placeholder="ชื่อ-นามสกุล"
              value={formData.fullName}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <input
              type="email"
              name="email"
              placeholder="อีเมล"
              value={formData.email}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <input
              type="tel"
              name="phone"
              placeholder="เบอร์โทรศัพท์"
              value={formData.phone}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <input
              type="password"
              name="password"
              placeholder="รหัสผ่าน"
              value={formData.password}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <input
              type="password"
              name="confirmPassword"
              placeholder="ยืนยันรหัสผ่าน"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </div>

          <button type="submit" className={styles.signupButton}>
            สมัครสมาชิก
          </button>

          <div className={styles.loginText}>
            มีบัญชีอยู่แล้ว? <Link href="/login">เข้าสู่ระบบ</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

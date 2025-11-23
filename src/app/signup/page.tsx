"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./signup.module.css";

export default function SignUp() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert("รหัสผ่านไม่ตรงกัน!");
      return;
    }
    
    setIsLoading(true);
    
    // เก็บข้อมูลการสมัครใน localStorage
    const userData = {
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      createdAt: new Date().toISOString(),
    };
    
    try {
      // เก็บข้อมูลผู้ใช้
      const existingUsers = localStorage.getItem('users');
      const users = existingUsers ? JSON.parse(existingUsers) : [];
      
      // ตรวจสอบว่าอีเมลซ้ำหรือไม่
      const emailExists = users.some((user: any) => user.email === formData.email);
      if (emailExists) {
        alert("อีเมลนี้มีอยู่ในระบบแล้ว!");
        setIsLoading(false);
        return;
      }
      
      // เพิ่มผู้ใช้ใหม่
      users.push(userData);
      localStorage.setItem('users', JSON.stringify(users));
      
      console.log("Sign up success:", userData);
      alert("สมัครสมาชิกสำเร็จ! กำลังไปหน้าเข้าสู่ระบบ...");
      
      // ไปหน้า login หลังจาก 1 วินาที
      setTimeout(() => {
        router.push('/login');
      }, 1000);
      
    } catch (error) {
      console.error("Error saving user data:", error);
      alert("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
      setIsLoading(false);
    }
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

          <button type="submit" className={styles.signupButton} disabled={isLoading}>
            {isLoading ? "กำลังสมัครสมาชิก..." : "สมัครสมาชิก"}
          </button>

          <div className={styles.loginText}>
            มีบัญชีอยู่แล้ว? <Link href="/login">เข้าสู่ระบบ</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

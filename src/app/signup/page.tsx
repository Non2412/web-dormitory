"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import styles from "./signup.module.css";

export default function SignUp() {
  const router = useRouter();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("รหัสผ่านไม่ตรงกัน!");
      return;
    }

    if (formData.password.length < 6) {
      setError("รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร");
      return;
    }

    setIsLoading(true);

    try {
      await register({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
      });

      alert("สมัครสมาชิกสำเร็จ! กำลังไปหน้าห้องพัก...");
      router.push('/book');

    } catch (err: unknown) {
      console.error("Error signing up:", err);
      const errorMessage = err instanceof Error ? err.message : "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง";
      setError(errorMessage);
    } finally {
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
          {error && (
            <div style={{
              padding: '10px',
              marginBottom: '15px',
              backgroundColor: 'rgba(255, 0, 0, 0.1)',
              border: '1px solid rgba(255, 0, 0, 0.3)',
              borderRadius: '8px',
              color: '#ff4444',
              fontSize: '14px',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}

          <div className={styles.inputGroup}>
            <input
              type="text"
              name="firstName"
              placeholder="ชื่อ"
              value={formData.firstName}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <input
              type="text"
              name="lastName"
              placeholder="นามสกุล"
              value={formData.lastName}
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
              placeholder="รหัสผ่าน (อย่างน้อย 6 ตัวอักษร)"
              value={formData.password}
              onChange={handleChange}
              className={styles.input}
              required
              minLength={6}
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
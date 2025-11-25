"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import styles from "./login.module.css";

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const user = await login(email, password);

      if (user) {
        alert("เข้าสู่ระบบสำเร็จ!");
        if (user.role === 'ADMIN') {
          router.push("/admin/dashboard");
        } else {
          router.push("/book");
        }
      } else {
        // Should not happen if login throws on error, but good for safety
        throw new Error("Login failed");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "อีเมลหรือรหัสผ่านไม่ถูกต้อง");
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginCard}>
        <div className={styles.header}>
          <h1>LOGIN</h1>
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
              type="email"
              placeholder="EMAIL"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <input
              type="password"
              placeholder="PASSWORD"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              required
            />
          </div>
          <button type="submit" className={styles.loginButton} disabled={isLoading}>
            {isLoading ? "กำลังเข้าสู่ระบบ..." : "Log In"}
          </button>
          <div className={styles.signupText}>
            ยังไม่มีบัญชี? <Link href="/signup">สมัครสมาชิก</Link>
          </div>
          <div style={{ marginTop: '20px', fontSize: '12px', color: 'rgba(255,255,255,0.5)', textAlign: 'center' }}>
            <p>เชื่อมต่อกับ Backend API แล้ว ✅</p>
          </div>
        </form>
      </div>
    </div>
  );
}
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./login.module.css";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // ดึงข้อมูลผู้ใช้จาก localStorage
      const existingUsers = localStorage.getItem('users');
      
      if (!existingUsers) {
        alert("ไม่พบผู้ใช้ในระบบ กรุณาสมัครสมาชิกก่อน");
        setIsLoading(false);
        return;
      }
      
      const users = JSON.parse(existingUsers);
      
      // ตรวจสอบข้อมูล login
      const user = users.find((u: any) => u.email === email && u.password === password);
      
      if (user) {
        // Login สำเร็จ
        localStorage.setItem('currentUser', JSON.stringify({
          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
          loginTime: new Date().toISOString(),
        }));
        
        console.log("Login success:", user);
        alert(`เข้าสู่ระบบสำเร็จ!\nยินดีต้อนรับคุณ ${user.fullName}`);
        
        // TODO: Redirect to dashboard or home page
        // router.push('/dashboard');
        
      } else {
        alert("อีเมลหรือรหัสผ่านไม่ถูกต้อง!");
      }
      
    } catch (error) {
      console.error("Login error:", error);
      alert("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    } finally {
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
        </form>
      </div>
    </div>
  );
}

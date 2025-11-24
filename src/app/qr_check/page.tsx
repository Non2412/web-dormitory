"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./qr.module.css";

export default function QRCheckPage() {
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<any>(null);

  useEffect(() => {
    let mounted = true;
    let scanner: any = null;

    (async () => {
      try {
        const mod = await import("html5-qrcode");
        const { Html5QrcodeScanner } = mod;

        if (!mounted) return;

        scanner = new Html5QrcodeScanner(
          "qr-reader",
          { fps: 10, qrbox: 250 },
          false
        );

        scannerRef.current = scanner;

        scanner.render(
          (decodedText: string) => {
            setResult(decodedText);
            // stop scanning after first success
            try {
              scanner.clear().catch(() => {});
            } catch {}
          },
          (errorMessage: any) => {
            // optional error callback
            // console.debug("QR scan error", errorMessage);
          }
        );
      } catch (e: any) {
        setError(
          "ไม่สามารถเริ่มสแกนได้ — กรุณาติดตั้ง dependency หรือใช้เบราว์เซอร์ที่รองรับกล้อง"
        );
        console.error(e);
      }
    })();

    return () => {
      mounted = false;
      if (scannerRef.current) {
        try {
          scannerRef.current.clear();
        } catch (e) {}
      }
    };
  }, []);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setResult(null);

    try {
      const mod = await import("html5-qrcode");
      const { Html5Qrcode } = mod;
      const html5Qr = new Html5Qrcode("qr-reader-file");

      try {
        // scanFileV2 รับ argument แค่ file เดียว (ไม่มี config object)
        const decoded = await html5Qr.scanFileV2(file, true);

        // Handle different return types
        let decodedText: string | null = null;

        if (typeof decoded === "string") {
          decodedText = decoded;
        } else if (decoded && typeof decoded === "object") {
          // Try different property names that the library might use
          decodedText = (decoded as any).decodedText ?? (decoded as any).text ?? null;
        }

        if (decodedText) {
          setResult(decodedText);
        } else {
          setError("ไม่พบ QR Code ในภาพ");
        }
      } catch (scanError: any) {
        console.error("Scan error:", scanError);
        setError("ไม่สามารถสแกน QR Code จากไฟล์นี้ได้");
      } finally {
        try {
          await html5Qr.clear();
        } catch (e) {
          // ignore cleanup errors
        }
      }
    } catch (err) {
      console.error(err);
      setError("เกิดข้อผิดพลาดในการโหลดไลบรารี");
    }
  };

  return (
    <div className={styles.container}>
      <h1>ตรวจสอบ QR Code</h1>

      <div className={styles.scannerArea}>
        <div id="qr-reader" className={styles.reader} />

        <div className={styles.controls}>
          <label className={styles.fileLabel}>
            อัปโหลดรูปเพื่อสแกน
            <input type="file" accept="image/*" onChange={handleFile} />
          </label>
          <div id="qr-reader-file" className={styles.hidden} />
        </div>
      </div>

      <div className={styles.resultCard}>
        <h3>ผลลัพธ์</h3>
        {result ? (
          <pre className={styles.resultText}>{result}</pre>
        ) : error ? (
          <div className={styles.error}>{error}</div>
        ) : (
          <div className={styles.placeholder}>ยังไม่มีผลลัพธ์</div>
        )}
      </div>
    </div>
  );
}
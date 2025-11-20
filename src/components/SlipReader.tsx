'use client';

import { useState, useRef, useEffect } from 'react';
import jsQR from 'jsqr';
import Tesseract from 'tesseract.js';
import styles from './SlipReader.module.css';

interface QRData {
  merchantID: string;
  amount: string;
  reference: string;
  billPaymentRef1: string;
  billPaymentRef2: string;
}

interface OCRData {
  amount: string | null;
  fee: string | null;
  date: string | null;
  time: string | null;
  reference: string | null;
  ref1: string | null;
  ref2: string | null;
  transactionNo: string | null;
  fromAccount: string | null;
  toAccount: string | null;
  transferType: string | null;
}

interface SlipData {
  slip_data: {
    ocr_data: OCRData | null;
    qr_data: QRData | null;
  };
  timestamp: string;
  success: boolean;
}

export default function SlipReader() {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState({ message: '', percent: 0 });
  const [qrData, setQrData] = useState<QRData | null>(null);
  const [ocrData, setOcrData] = useState<OCRData | null>(null);
  const [ocrTextFull, setOcrTextFull] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showOcrText, setShowOcrText] = useState(false);
  const [jsonOutput, setJsonOutput] = useState<SlipData | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [dragging, setDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('กรุณาเลือกไฟล์รูปภาพเท่านั้น');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewImage(e.target?.result as string);
      setError(null);
      setQrData(null);
      setOcrData(null);
      setOcrTextFull('');
      setJsonOutput(null);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  useEffect(() => {
    if (previewImage && imageRef.current) {
      processImage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [previewImage]);

  const processImage = async () => {
    setLoading(true);
    setProgress({ message: 'กำลังประมวลผล...', percent: 0 });

    try {
      setProgress({ message: 'กำลังอ่าน QR Code...', percent: 25 });
      const qr = await scanQRCode();
      setQrData(qr);

      setProgress({ message: 'กำลังอ่านข้อความจากสลิป...', percent: 50 });
      const ocr = await performOCR();
      setOcrData(ocr);

      setProgress({ message: 'กำลังประมวลผลข้อมูล...', percent: 90 });
      await new Promise((resolve) => setTimeout(resolve, 500));

      const output: SlipData = {
        slip_data: {
          ocr_data: ocr,
          qr_data: qr,
        },
        timestamp: new Date().toISOString(),
        success: !!(qr || ocr),
      };
      setJsonOutput(output);

      setProgress({ message: 'เสร็จสิ้น!', percent: 100 });
      setTimeout(() => setLoading(false), 1000);
    } catch (err) {
      setError('เกิดข้อผิดพลาดในการประมวลผล: ' + (err as Error).message);
      setLoading(false);
    }
  };

  const scanQRCode = (): Promise<QRData | null> => {
    return new Promise((resolve) => {
      if (!canvasRef.current || !imageRef.current) {
        resolve(null);
        return;
      }

      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const img = imageRef.current;

      if (!ctx) {
        resolve(null);
        return;
      }

      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height);

      if (code) {
        resolve(parsePromptPayData(code.data));
      } else {
        resolve(null);
      }
    });
  };

  const performOCR = async (): Promise<OCRData | null> => {
    try {
      if (!previewImage) return null;

      const result = await Tesseract.recognize(previewImage, 'tha+eng', {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            const progressPercent = Math.round(m.progress * 100);
            setProgress({
              message: `กำลังอ่านข้อความ... ${progressPercent}%`,
              percent: 50 + progressPercent * 0.4,
            });
          }
        },
      });

      setOcrTextFull(result.data.text);
      return extractSlipInfo(result.data.text);
    } catch (err) {
      console.error('OCR Error:', err);
      return null;
    }
  };

  const parsePromptPayData = (data: string): QRData | null => {
    try {
      const info: QRData = {
        merchantID: '',
        amount: '',
        reference: '',
        billPaymentRef1: '',
        billPaymentRef2: '',
      };

      let i = 0;
      while (i < data.length) {
        const tag = data.substring(i, i + 2);
        i += 2;

        const length = parseInt(data.substring(i, i + 2));
        i += 2;

        const value = data.substring(i, i + length);
        i += length;

        if (tag === '29' && value.length > 0) {
          let j = 0;
          while (j < value.length) {
            const subTag = value.substring(j, j + 2);
            j += 2;
            const subLength = parseInt(value.substring(j, j + 2));
            j += 2;
            const subValue = value.substring(j, j + subLength);
            j += subLength;

            if (subTag === '01') {
              info.merchantID = formatPromptPayID(subValue);
            }
          }
        }

        if (tag === '54') {
          info.amount = value;
        }

        if (tag === '62' && value.length > 0) {
          let j = 0;
          while (j < value.length) {
            const subTag = value.substring(j, j + 2);
            j += 2;
            const subLength = parseInt(value.substring(j, j + 2));
            j += 2;
            const subValue = value.substring(j, j + subLength);
            j += subLength;

            if (subTag === '05') {
              info.reference = subValue;
            }
            if (subTag === '01') {
              info.billPaymentRef1 = subValue;
            }
            if (subTag === '02') {
              info.billPaymentRef2 = subValue;
            }
          }
        }
      }

      return info;
    } catch {
      return null;
    }
  };

  const formatPromptPayID = (id: string): string => {
    if (id.length === 15 && id.startsWith('00')) {
      const citizenID = id.substring(2);
      return citizenID.replace(/(\d{1})(\d{4})(\d{5})(\d{2})(\d{1})/, '$1-$2-$3-$4-$5');
    }
    if (id.length === 13 && id.startsWith('66')) {
      const phoneNumber = '0' + id.substring(2);
      return phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
    }
    if (id.length === 15 && id.startsWith('01')) {
      return id.substring(2);
    }
    return id;
  };

  const extractSlipInfo = (text: string): OCRData => {
    const info: OCRData = {
      amount: null,
      fee: null,
      date: null,
      time: null,
      reference: null,
      ref1: null,
      ref2: null,
      transactionNo: null,
      fromAccount: null,
      toAccount: null,
      transferType: null,
    };

    const cleanText = text
      .replace(/[^\u0E00-\u0E7Fa-zA-Z0-9\s\.\,\:\-\/\(\)\฿]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    const amountPatterns = [
      /(?:จำนวนเงิน|จ่าย|ยอดเงิน|โอน)[:\s]+([0-9]{1,3}(?:,?[0-9]{3})*\.[0-9]{2})/i,
      /(?:Amount|Total|Pay)[:\s]+([0-9]{1,3}(?:,?[0-9]{3})*\.[0-9]{2})/i,
      /THB[:\s]+([0-9]{1,3}(?:,?[0-9]{3})*\.[0-9]{2})/i,
      /฿[:\s]*([0-9]{1,3}(?:,?[0-9]{3})*\.[0-9]{2})/,
      /([0-9]{1,3}(?:,?[0-9]{3})*\.[0-9]{2})\s*(?:บาท|Baht)/i,
      /\b([1-9][0-9]{0,2}(?:,?[0-9]{3})*\.[0-9]{2})\b/,
    ];

    for (const pattern of amountPatterns) {
      const match = cleanText.match(pattern);
      if (match) {
        const amount = match[1].replace(/,/g, '');
        const numAmount = parseFloat(amount);
        if (!isNaN(numAmount) && numAmount >= 0.01 && numAmount <= 10000000) {
          info.amount = amount;
          break;
        }
      }
    }

    const feePatterns = [
      /(?:ค่าธรรมเนียม|ค่าบริการ)[:\s]+([0-9]+(?:\.[0-9]{2})?)/i,
      /(?:Fee|Service\s*Charge)[:\s]+([0-9]+(?:\.[0-9]{2})?)/i,
    ];

    for (const pattern of feePatterns) {
      const match = cleanText.match(pattern);
      if (match) {
        const fee = match[1].replace(/,/g, '');
        const numFee = parseFloat(fee);
        if (!isNaN(numFee) && numFee >= 0 && numFee <= 1000) {
          info.fee = fee;
          break;
        }
      }
    }

    const datePatterns = [
      /(\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{4})/i,
      /(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{4})/,
      /(\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2})/,
    ];

    for (const pattern of datePatterns) {
      const match = text.match(pattern);
      if (match) {
        info.date = match[1];
        break;
      }
    }

    const timePatterns = [
      /(\d{1,2}:\d{2}:\d{2}(?:\s*(?:AM|PM|น\.|am|pm))?)/i,
      /(\d{1,2}:\d{2}(?:\s*(?:AM|PM|น\.|am|pm))?)/i,
    ];

    for (const pattern of timePatterns) {
      const match = text.match(pattern);
      if (match) {
        info.time = match[1];
        break;
      }
    }

    const refPatterns = [
      /(?:เลขที่อ้างอิง|หมายเลขอ้างอิง|อ้างอิง|Reference|Ref\s*No\.?|Ref\.?)[:\s]*([A-Z0-9]{10,})/i,
      /(?:Transaction\s*(?:ID|No|Number))[:\s]*([A-Z0-9]{10,})/i,
      /\b([A-Z]{3,6}[0-9]{8,})\b/,
    ];

    for (const pattern of refPatterns) {
      const match = text.match(pattern);
      if (match && match[1] && match[1].length >= 10 && match[1].length <= 50) {
        info.reference = match[1].trim();
        break;
      }
    }

    const accountPattern = /\b(\d{3}-?\d{1}-?\d{5}-?\d{1})\b/g;
    const accounts = text.match(accountPattern);
    if (accounts && accounts.length >= 1) {
      info.fromAccount = accounts[0];
      if (accounts.length >= 2) {
        info.toAccount = accounts[1];
      }
    }

    const lowerText = text.toLowerCase();
    if (lowerText.includes('promptpay') || text.includes('พร้อมเพย์')) {
      info.transferType = 'PromptPay';
    } else if (text.includes('โอน') || lowerText.includes('transfer')) {
      info.transferType = 'โอนเงิน';
    }

    return info;
  };

  const formatDateTime = (dateStr: string | null, timeStr: string | null): string | null => {
    if (!dateStr) return null;

    const monthsEN: { [key: string]: string } = {
      jan: '01', january: '01', feb: '02', february: '02',
      mar: '03', march: '03', apr: '04', april: '04',
      may: '05', jun: '06', june: '06', jul: '07',
      july: '07', aug: '08', august: '08', sep: '09',
      sept: '09', september: '09', oct: '10', october: '10',
      nov: '11', november: '11', dec: '12', december: '12',
    };

    let day, month, year;

    let match = dateStr.match(/(\d{1,2})\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+(\d{4})/i);
    if (match) {
      day = match[1].padStart(2, '0');
      month = monthsEN[match[2].toLowerCase()];
      year = match[3];
    }

    if (!month) {
      match = dateStr.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})/);
      if (match) {
        day = match[1].padStart(2, '0');
        month = match[2].padStart(2, '0');
        year = match[3].length === 2 ? '20' + match[3] : match[3];
      }
    }

    if (!month) return dateStr + (timeStr ? ' ' + timeStr : '');

    let formattedTime = '00:00:00';
    if (timeStr) {
      const timeMatch = timeStr.match(/(\d{1,2}):(\d{2})(?::(\d{2}))?/);
      if (timeMatch) {
        const hours = timeMatch[1].padStart(2, '0');
        const minutes = timeMatch[2];
        const seconds = timeMatch[3] || '00';
        formattedTime = `${hours}:${minutes}:${seconds}`;
      }
    }

    return `${month}/${day}/${year} ${formattedTime}`;
  };

  const copyJsonToClipboard = () => {
    if (!jsonOutput) return;

    const jsonString = JSON.stringify(jsonOutput, null, 2);
    navigator.clipboard.writeText(jsonString).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }).catch(() => {
      alert('ไม่สามารถคัดลอกได้');
    });
  };

  const resetUpload = () => {
    setPreviewImage(null);
    setQrData(null);
    setOcrData(null);
    setOcrTextFull('');
    setError(null);
    setJsonOutput(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.row}>
          <div className={styles.col}>
            <div className={styles.card}>
              <div className={styles.cardBody}>
                <h1 className={styles.title}>🏦 ตัวอ่านสลิปธนาคาร</h1>
                <p className={styles.subtitle}>
                  อัปโหลดสลิปเพื่ออ่านข้อมูลด้วย QR Code และ OCR
                </p>

                <div
                  className={`${styles.dropzone} ${dragging ? styles.dropzoneDragging : ''}`}
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <div className={styles.dropzoneIcon}>📄</div>
                  <div className={styles.dropzoneText}>
                    คลิกเพื่ออัปโหลดสลิป หรือลากไฟล์มาวางที่นี่
                  </div>
                  <div className={styles.dropzoneSubtext}>
                    รองรับไฟล์ JPG, PNG (อ่าน QR Code, จำนวนเงิน, Ref No., วันที่-เวลา)
                  </div>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  className={styles.fileInput}
                  accept="image/*"
                  onChange={handleFileSelect}
                />

                {previewImage && (
                  <div className={styles.previewSection}>
                    <div className={styles.imagePreview}>
                      <img
                        ref={imageRef}
                        src={previewImage}
                        alt="Preview"
                        className={styles.previewImage}
                      />
                    </div>
                    <canvas ref={canvasRef} className={styles.hiddenCanvas}></canvas>

                    {loading && (
                      <div className={styles.progressCard}>
                        <h6 className={styles.progressTitle}>
                          {progress.message}
                        </h6>
                        <div className={styles.progressBar}>
                          <div
                            className={styles.progressFill}
                            style={{ width: `${progress.percent}%` }}
                          ></div>
                        </div>
                        <div className={styles.progressPercent}>
                          {progress.percent}%
                        </div>
                      </div>
                    )}

                    {error && (
                      <div className={styles.errorAlert}>
                        ❌ {error}
                      </div>
                    )}

                    {ocrData && !loading && (
                      <div className={styles.dataCard}>
                        <h5 className={styles.dataCardTitle}>
                          📄 ข้อมูลจากการอ่านสลิป (OCR)
                        </h5>

                        {ocrData.amount && (
                          <div className={styles.dataItem}>
                            <small className={styles.dataLabel}>💰 จำนวนเงิน</small>
                            <div className={styles.dataValueLarge}>
                              {parseFloat(ocrData.amount).toLocaleString('th-TH', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })} บาท
                            </div>
                          </div>
                        )}

                        {ocrData.fee && (
                          <div className={styles.dataItem}>
                            <small className={styles.dataLabel}>💳 ค่าธรรมเนียม</small>
                            <div className={styles.dataValue}>
                              {parseFloat(ocrData.fee).toLocaleString('th-TH', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })} บาท
                            </div>
                          </div>
                        )}

                        {ocrData.date && (
                          <div className={styles.dataItem}>
                            <small className={styles.dataLabel}>📅 วันที่-เวลาทำรายการ</small>
                            <div className={styles.dataValue}>{formatDateTime(ocrData.date, ocrData.time)}</div>
                          </div>
                        )}

                        {ocrData.reference && (
                          <div className={styles.dataItem}>
                            <small className={styles.dataLabel}>🔖 หมายเลขอ้างอิง</small>
                            <div className={styles.dataValue}>
                              <span className={styles.badge}>{ocrData.reference}</span>
                            </div>
                          </div>
                        )}

                        {ocrData.transactionNo && (
                          <div className={styles.dataItem}>
                            <small className={styles.dataLabel}>🆔 เลขที่ธุรกรรม</small>
                            <div className={styles.dataValue}>
                              <span className={styles.badge}>{ocrData.transactionNo}</span>
                            </div>
                          </div>
                        )}

                        {ocrData.transferType && (
                          <div className={styles.dataItem}>
                            <small className={styles.dataLabel}>📱 ประเภทการโอน</small>
                            <div className={styles.dataValue}>{ocrData.transferType}</div>
                          </div>
                        )}

                        {ocrData.fromAccount && (
                          <div className={styles.dataItem}>
                            <small className={styles.dataLabel}>🏦 บัญชีต้นทาง</small>
                            <div className={styles.dataValue}>{ocrData.fromAccount}</div>
                          </div>
                        )}

                        {ocrData.toAccount && (
                          <div className={styles.dataItem}>
                            <small className={styles.dataLabel}>🏦 บัญชีปลายทาง</small>
                            <div className={styles.dataValue}>{ocrData.toAccount}</div>
                          </div>
                        )}

                        {ocrTextFull && (
                          <div className={styles.ocrTextSection}>
                            <button
                              className={styles.toggleButton}
                              onClick={() => setShowOcrText(!showOcrText)}
                            >
                              📝 {showOcrText ? 'ซ่อน' : 'ดู'}ข้อความที่อ่านได้ทั้งหมด
                            </button>
                            {showOcrText && (
                              <pre className={styles.ocrText}>
                                {ocrTextFull}
                              </pre>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {qrData && !loading && (
                      <div className={styles.qrCard}>
                        <h5 className={styles.qrCardTitle}>📱 ข้อมูลจาก QR Code</h5>

                        {qrData.amount && (
                          <div className={styles.qrItem}>
                            <small className={styles.qrLabel}>💰 จำนวนเงิน</small>
                            <div className={styles.qrValueLarge}>
                              {parseFloat(qrData.amount).toLocaleString('th-TH', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })} บาท
                            </div>
                          </div>
                        )}

                        {qrData.merchantID && (
                          <div className={styles.qrItem}>
                            <small className={styles.qrLabel}>👤 PromptPay ID (ผู้รับเงิน)</small>
                            <div className={styles.qrValue}>{qrData.merchantID}</div>
                          </div>
                        )}

                        {qrData.reference && (
                          <div className={styles.qrItem}>
                            <small className={styles.qrLabel}>🔖 เลขอ้างอิง</small>
                            <div className={styles.qrValue}>
                              <span className={styles.qrBadge}>{qrData.reference}</span>
                            </div>
                          </div>
                        )}

                        {qrData.billPaymentRef1 && (
                          <div className={styles.qrItem}>
                            <small className={styles.qrLabel}>📋 Ref 1</small>
                            <div className={styles.qrValue}>
                              <span className={styles.qrBadge}>{qrData.billPaymentRef1}</span>
                            </div>
                          </div>
                        )}

                        {qrData.billPaymentRef2 && (
                          <div className={styles.qrItem}>
                            <small className={styles.qrLabel}>📋 Ref 2</small>
                            <div className={styles.qrValue}>
                              <span className={styles.qrBadge}>{qrData.billPaymentRef2}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {jsonOutput && !loading && (
                      <div className={styles.jsonCard}>
                        <div className={styles.jsonHeader}>
                          <h6 className={styles.jsonTitle}>📋 JSON Output</h6>
                          <button
                            className={`${styles.copyButton} ${copySuccess ? styles.copyButtonSuccess : ''}`}
                            onClick={copyJsonToClipboard}
                          >
                            {copySuccess ? '✓ Copied!' : '📋 Copy JSON'}
                          </button>
                        </div>
                        <pre className={styles.jsonContent}>
                          {JSON.stringify(jsonOutput, null, 2)}
                        </pre>
                      </div>
                    )}

                    {!loading && (
                      <div className={styles.resetSection}>
                        <button
                          className={styles.resetButton}
                          onClick={resetUpload}
                        >
                          📤 อัปโหลดสลิปใหม่
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
"use client";

import { useState, useEffect } from "react";
import { signOut } from "next-auth/react";

export default function CheckInClient() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);
  const [sessionName, setSessionName] = useState("");
  const [checkedInTime, setCheckedInTime] = useState(null);
  const [confirming, setConfirming] = useState(false);

  const fetchStatus = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkin");
      const data = await res.json();
      if (res.ok && data.success) {
        setUserData(data.user);
        setSessionName(data.sessionName);
        if (data.user.checkedInTime) {
          setCheckedInTime(data.user.checkedInTime);
        }
      } else {
        setError(data.error || "เกิดข้อผิดพลาดในการดึงข้อมูล / Failed to fetch user data.");
      }
    } catch (err) {
      setError("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ / Connection error.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleConfirm = async () => {
    setConfirming(true);
    setError(null);
    try {
      const res = await fetch("/api/checkin", { method: "POST" });
      const data = await res.json();
      if (res.ok && data.success) {
        setCheckedInTime(data.time);
        setUserData((prev) => ({ ...prev, checkedInTime: data.time }));
      } else {
        setError(data.error || "เช็คอินไม่สำเร็จ / Check-in failed.");
      }
    } catch (err) {
      setError("ไม่สามารถบันทึกการเช็คอินได้ / Check-in connection error.");
    } finally {
      setConfirming(false);
    }
  };

  return (
    <>
      {/* Logout button - fixed in top right, accessible at all times */}
      <button className="btn-logout" onClick={() => signOut({ callbackUrl: "/" })}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
        ออกจากระบบ / Logout
      </button>

      {loading && (
        <div className="screen active">
          <div className="card centered">
            <div className="loc-spinner" style={{ display: "flex" }}>
              <div className="spinner-ring" />
              <p>
                กำลังดึงข้อมูลผู้ใช้งาน…
                <br />
                <em>Fetching user data...</em>
              </p>
            </div>
          </div>
        </div>
      )}

      {!loading && error && (
        <div className="screen active">
          <div className="card centered">
            <div className="status-icon err">✕</div>
            <div className="status-title err">เกิดข้อผิดพลาด</div>
            <p className="status-msg">{error}</p>
            <button className="btn btn-primary" onClick={fetchStatus}>
              ลองอีกครั้ง / Try Again
            </button>
            <div className="corner">ERROR</div>
          </div>
        </div>
      )}

      {!loading && !error && !checkedInTime && (
        <div className="screen active">
          <div className="card">
            <div className="badge">
              <span className="dot" /> ตรวจสอบข้อมูล
            </div>
            <div className="headline headline-small" style={{ marginBottom: "12px" }}>
              ข้อมูลผู้เช็คอิน
            </div>
            <p className="sub" style={{ marginBottom: "24px" }}>
              กรุณาตรวจสอบรายละเอียดของคุณด้านล่าง และกดปุ่มเพื่อยืนยันการเช็คอิน
            </p>

            <div className="user-details">
              <div className="detail-item">
                <span className="detail-label">ชื่อเล่น:</span>
                <span className="detail-value">{userData?.nickname || "-"}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">หน้าที่:</span>
                <span className="detail-value">{userData?.job || "-"}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">รอบการเช็คอิน:</span>
                <span className="detail-value">{sessionName || "-"}</span>
              </div>
            </div>

            <button className="btn btn-primary" onClick={handleConfirm} disabled={confirming}>
              {confirming ? "กำลังบันทึกเวลาเช็คอิน..." : "ยืนยัน"}
            </button>
            <div className="corner">CONFIRM</div>
          </div>
        </div>
      )}

      {!loading && !error && checkedInTime && (
        <div className="screen active">
          <div className="card centered">
            <div className="checkmark-wrapper">
              <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none" />
                <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
              </svg>
            </div>
            <div className="status-title ok">เช็คอินสำเร็จ</div>
            <p
              className="status-msg"
              style={{
                fontSize: "18px",
                fontWeight: "600",
                color: "var(--text)",
                marginBottom: "24px"
              }}
            >
              เวลา {checkedInTime}
            </p>

            <div className="user-details" style={{ marginTop: "10px" }}>
              <div className="detail-item">
                <span className="detail-label">ชื่อเล่น:</span>
                <span className="detail-value">{userData?.nickname || "-"}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">หน้าที่:</span>
                <span className="detail-value">{userData?.job || "-"}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">รอบการเช็คอิน:</span>
                <span className="detail-value">{sessionName || "-"}</span>
              </div>
            </div>
            <div className="corner">SUCCESS</div>
          </div>
        </div>
      )}
    </>
  );
}

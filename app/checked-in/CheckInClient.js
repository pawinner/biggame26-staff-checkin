"use client";

import { useState, useEffect } from "react";
import { signOut } from "next-auth/react";

export default function CheckInClient({ userEmail }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);
  const [sessionName, setSessionName] = useState("");
  const [checkedInTime, setCheckedInTime] = useState(null);
  const [confirming, setConfirming] = useState(false);

  const [isRegistrationMode, setIsRegistrationMode] = useState(false);
  const [unlinkedUsers, setUnlinkedUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isLinking, setIsLinking] = useState(false);

  const fetchUnlinkedUsers = async () => {
    try {
      const res = await fetch("/api/checkin/unlinked");
      const data = await res.json();
      if (res.ok && data.success) {
        setUnlinkedUsers(data.users || []);
      }
    } catch (err) {
      console.error("Failed to fetch unlinked users:", err);
    }
  };

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
        setIsRegistrationMode(false);
      } else if (data.emailNotFound) {
        setIsRegistrationMode(true);
        fetchUnlinkedUsers();
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
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchStatus();
  }, []);

  const handleConfirm = async () => {
    // Create and pre-warm the audio object inside the user interaction call stack
    const audio = new Audio("/sounds/applepay.mp3");
    audio.muted = true;

    let hasFinishedCheckIn = false;

    // Play and immediately pause to unlock the audio context on iOS Safari
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          if (!hasFinishedCheckIn) {
            audio.pause();
            audio.currentTime = 0;
            audio.muted = false;
          }
        })
        .catch((err) => {
          console.log("Audio pre-warming status:", err);
          audio.muted = false;
        });
    }

    setConfirming(true);
    setError(null);
    try {
      const res = await fetch("/api/checkin", { method: "POST" });
      const data = await res.json();
      if (res.ok && data.success) {
        hasFinishedCheckIn = true;
        setCheckedInTime(data.time);
        setUserData((prev) => ({ ...prev, checkedInTime: data.time }));
        // Play the pre-warmed audio (unmuted)
        audio.muted = false;
        audio.currentTime = 0;
        audio.play().catch((err) => {
          console.warn("Audio play failed after checkin:", err);
        });
      } else {
        audio.muted = false;
        setError(data.error || "เช็คอินไม่สำเร็จ / Check-in failed.");
      }
    } catch (err) {
      audio.muted = false;
      setError("ไม่สามารถบันทึกการเช็คอินได้ / Check-in connection error.");
    } finally {
      setConfirming(false);
    }
  };

  const handleLinkEmail = async () => {
    if (!selectedUser) return;
    setIsLinking(true);
    setError(null);
    try {
      const res = await fetch("/api/checkin/link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: selectedUser.name,
          surname: selectedUser.surname,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setIsRegistrationMode(false);
        setSelectedUser(null);
        setSearchQuery("");
        fetchStatus();
      } else {
        setError(data.error || "ไม่สามารถเชื่อมโยงอีเมลได้ / Failed to link email.");
        setIsRegistrationMode(false);
      }
    } catch (err) {
      setError("เกิดข้อผิดพลาดในการเชื่อมต่อ / Linking connection error.");
      setIsRegistrationMode(false);
    } finally {
      setIsLinking(false);
    }
  };

  const handleCancelSelection = () => {
    setSelectedUser(null);
  };

  const filteredUsers = searchQuery.length >= 2
    ? unlinkedUsers.filter((user) => {
        const query = searchQuery.toLowerCase().trim();
        return (
          user.name.toLowerCase().includes(query) ||
          user.surname.toLowerCase().includes(query) ||
          user.nickname.toLowerCase().includes(query)
        );
      })
    : [];

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
            <p className="contact-info">
              Any problems? Please contact{" "}
              <a href="mailto:pawinner@docchula.com">pawinner@docchula.com</a>
            </p>
            <div className="corner">ERROR</div>
          </div>
        </div>
      )}

      {!loading && !error && isRegistrationMode && !selectedUser && (
        <div className="screen active">
          <div className="card">
            <div className="badge">
              <span className="dot" /> ลงทะเบียนสตาฟ / Staff Registration
            </div>
            <div className="headline headline-small" style={{ marginBottom: "12px" }}>
              <strong>ค้นหาชื่อของคุณ</strong><br />
              <span>Find your name</span>
            </div>
            <p className="sub" style={{ marginBottom: "24px" }}>
              ไม่พบอีเมลของคุณในระบบ กรุณาค้นหาชื่อของคุณเพื่อลงทะเบียนเชื่อมโยงกับอีเมลนี้
              <br />
              <em>We couldn&apos;t find your email in our system. Please search for your name to link it to this email.</em>
            </p>

            <div className="search-container" style={{ position: "relative", width: "100%", marginBottom: "24px" }}>
              <input
                type="text"
                className="input-text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="พิมพ์ชื่อ นามสกุล หรือชื่อเล่น..."
              />
              {searchQuery.length >= 2 && (
                <div className="results-list">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user, idx) => (
                      <div
                        key={idx}
                        className="result-item"
                        onClick={() => setSelectedUser(user)}
                      >
                        {user.name} {user.surname} ({user.nickname})
                      </div>
                    ))
                  ) : (
                    <div className="no-results">ไม่พบรายชื่อผู้ใช้ที่ตรงกัน / No matching users found</div>
                  )}
                </div>
              )}
            </div>

            <p className="search-hint" style={{ fontSize: "12px", color: "var(--muted)", textAlign: "left" }}>
              * พิมพ์อย่างน้อย 2 ตัวอักษรเพื่อค้นหา
              <br />
              <em>* Type at least 2 letters to search</em>
            </p>

            <p className="contact-info" style={{ marginTop: "24px" }}>
              พบปัญหาติดต่อ / Any problems? Please contact{" "}
              <a href="mailto:pawinner@docchula.com">pawinner@docchula.com</a>
            </p>
            <div className="corner">REGISTER</div>
          </div>
        </div>
      )}

      {!loading && !error && isRegistrationMode && selectedUser && (
        <div className="screen active">
          <div className="card">
            <div className="badge">
              <span className="dot" /> ยืนยันข้อมูล / Confirm Registration
            </div>
            <div className="headline headline-small" style={{ marginBottom: "12px" }}>
              <strong>ยืนยันการเชื่อมอีเมล</strong><br />
              <span>Confirm Email</span>
            </div>
            <p className="sub" style={{ marginBottom: "24px" }}>
              กรุณาตรวจสอบข้อมูลเพื่อความถูกต้องก่อนยืนยัน
              <br />
              <em>Please double check your information before confirming.</em>
            </p>

            <div className="user-details" style={{ marginBottom: "24px" }}>
              <div className="detail-item">
                <span className="detail-label">ชื่อ-นามสกุล:</span>
                <span className="detail-value">{selectedUser.name} {selectedUser.surname}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">ชื่อเล่น:</span>
                <span className="detail-value">{selectedUser.nickname || "-"}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">เชื่อมโยงกับอีเมล:</span>
                <span className="detail-value" style={{ fontSize: "14px", wordBreak: "break-all" }}>{userEmail}</span>
              </div>
            </div>

            <button className="btn btn-blue" onClick={handleLinkEmail} disabled={isLinking}>
              {isLinking ? "กำลังบันทึกข้อมูล..." : "ยืนยันการเชื่อมอีเมล"}
            </button>
            <button className="btn btn-ghost" onClick={handleCancelSelection} disabled={isLinking}>
              ยกเลิก / Cancel
            </button>

            <p className="contact-info" style={{ marginTop: "24px" }}>
              พบปัญหาติดต่อ / Any problems? Please contact{" "}
              <a href="mailto:pawinner@docchula.com">pawinner@docchula.com</a>
            </p>
            <div className="corner">CONFIRM</div>
          </div>
        </div>
      )}

      {!loading && !error && !checkedInTime && !isRegistrationMode && (
        <div className="screen active">
          <div className="card">
            <div className="badge">
              <span className="dot" /> ตรวจสอบข้อมูล
            </div>
            <div className="headline headline-small" style={{ marginBottom: "12px" }}>
              <strong>ข้อมูลผู้เช็คอิน</strong>
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

            <button className="btn btn-success" onClick={handleConfirm} disabled={confirming}>
              {confirming ? "กำลังบันทึกเวลาเช็คอิน..." : "ยืนยัน"}
            </button>
            <p className="contact-info">
              Any problems? Please contact{" "}
              <a href="mailto:pawinner@docchula.com">pawinner@docchula.com</a>
            </p>
            <div className="corner">CONFIRM</div>
          </div>
        </div>
      )}

      {!loading && !error && checkedInTime && !isRegistrationMode && (
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
            <p className="contact-info">
              Any problems? Please contact{" "}
              <a href="mailto:pawinner@docchula.com">pawinner@docchula.com</a>
            </p>
            <div className="corner">SUCCESS</div>
          </div>
        </div>
      )}
    </>
  );
}

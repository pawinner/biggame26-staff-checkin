"use client";

import { useState, useEffect } from "react";

const SCREENSHOTS = [
  "/images/screen1.jpg",
  "/images/screen2.jpg",
  "/images/screen3.jpg",
  "/images/screen4.jpg",
  "/images/screen5.jpg"
];

export default function QRPage() {
  const [timeString, setTimeString] = useState("");
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [sessionName, setSessionName] = useState("");

  // Fetch Check-In Round name
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await fetch("/api/checkin/session");
        const data = await res.json();
        if (res.ok && data.success) {
          setSessionName(data.sessionName);
        }
      } catch (err) {
        console.error("Failed to fetch session name:", err);
      }
    };

    fetchSession();
    // Poll every 30 seconds to update if the check-in round changes
    const interval = setInterval(fetchSession, 30000);
    return () => clearInterval(interval);
  }, []);

  // Live Clock Effect
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const options = {
        timeZone: "Asia/Bangkok",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
      };
      const formatter = new Intl.DateTimeFormat("en-US", options);
      setTimeString(formatter.format(now));
    };

    updateClock();
    const clockInterval = setInterval(updateClock, 1000);
    return () => clearInterval(clockInterval);
  }, []);

  // Slideshow Effect (4 seconds per screenshot)
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setActiveImageIndex((prevIndex) => (prevIndex + 1) % SCREENSHOTS.length);
    }, 4000);
    return () => clearInterval(slideInterval);
  }, []);

  return (
    <div className="qr-page">
      {/* HEADER SECTION */}
      <header className="qr-header">
        <div className="qr-logo-container">
          <div className="badge">
            <span className="dot" /> Big Game 2026
          </div>
          <h1 className="qr-logo-text">
            Hello Staff &amp; <span>P&apos;Demo</span>
          </h1>
        </div>

        {/* RIGHT: Check-in Round Badge */}
        <div className="qr-round-badge">
          <span className="qr-round-label">รอบการเช็คอิน / Check-In Round</span>
          <div className="qr-round-value">
            <span className="qr-round-dot" />
            {sessionName || "Loading..."}
          </div>
        </div>
      </header>

      {/* MAIN LAYOUT */}
      <main className="qr-main">
        <div className="qr-container">
          {/* LEFT: Phone Simulator Slideshow */}
          <div className="phone-section">
            <div className="phone-frame">
              <div className="phone-camera-pill" />
              <div className="phone-slideshow">
                {SCREENSHOTS.map((src, index) => (
                  <img
                    key={src}
                    src={src}
                    alt={`App Screen Mockup ${index + 1}`}
                    className={`slideshow-img ${index === activeImageIndex ? "active" : ""}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: QR Code & Instructions */}
          <div className="qr-content-section">
            {/* Main card grouping QR on Left and Clock on Right */}
            <div className="qr-main-card">
              {/* QR Code and Title */}
              <div className="qr-display-box">
                <h2 className="qr-title">
                  Scan to <span>Check-in</span>
                </h2>
                <div className="qr-code-wrapper">
                  <img
                    src="/images/qr.svg"
                    alt="Check-in Link QR Code"
                    className="qr-code-image"
                  />
                </div>
                <p className="qr-subtitle-link">
                  <a
                    href="https://biggame26-checkin.vercel.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="qr-link"
                  >
                    https://biggame26-checkin.vercel.app
                  </a>
                </p>
              </div>

              {/* Digital Clock */}
              <div className="clock-display-box">
                <div className="clock-text" id="clock" aria-label="Current Time">
                  {timeString || "00:00:00"}
                </div>
              </div>
            </div>

            {/* Bottom Caution Block */}
            <div className="qr-caution-container">
              <div className="qr-caution-header">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                Caution / ข้อควรระวัง
              </div>
              <ul className="qr-caution-list">
                <li className="qr-caution-item">
                  <strong>🇹🇭</strong> กรุณาเปิดการเข้าถึงตำแหน่งพิกัด <em>GPS (Location Services)</em> บนโทรศัพท์และยืนยันว่าอยู่ภายในบริเวณ <strong>คณะแพทยศาสตร์ จุฬาฯ</strong> เท่านั้นก่อนกดปุ่มลงทะเบียนเช็คอิน
                </li>
                <li className="qr-caution-item">
                  <strong>🇹🇭</strong> ระบบอนุญาตสิทธิ์เฉพาะการลงชื่อเข้าใช้ด้วยบัญชีอีเมลสตาฟ <strong>@docchula.com</strong> เท่านั้น
                </li>
                <li className="qr-caution-item">
                  <strong>🇬🇧</strong> To ensure successful registration, verify that you have enabled <em>GPS location services</em> on your mobile device and are physically present in the <strong>Faculty of Medicine, Chulalongkorn University</strong> zone.
                </li>
                <li className="qr-caution-item">
                  <strong>🇬🇧</strong> Access is strictly restricted. You must log in using your official <strong>@docchula.com</strong> email account.
                </li>
              </ul>
            </div>

            {/* Troubleshooting contact info */}
            <div className="qr-contact-box">
              พบปัญหาการใช้งานติดต่อ / Any problems? Please contact{" "}
              <a href="mailto:pawinner@docchula.com">pawinner@docchula.com</a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const TARGET_LAT = 13.733552040952299;
const TARGET_LNG = 100.53617267849575;
const RADIUS_M = 500;

function GoogleIcon() {
  return (
    <svg className="g-icon" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.36-8.16 2.36-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
      <path fill="none" d="M0 0h48v48H0z" />
    </svg>
  );
}

function PinIcon({ size = 18 }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 2a7 7 0 0 1 7 7c0 5.25-7 13-7 13S5 14.25 5 9a7 7 0 0 1 7-7z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  );
}

function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const toRad = d => d * Math.PI / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function Home() {
  return (
    <Suspense fallback={null}>
      <HomeContent />
    </Suspense>
  );
}

function HomeContent() {
  const searchParams = useSearchParams();
  const authError = searchParams.get("error");

  const goTo = id => {
    document.querySelectorAll(".screen").forEach(screen => screen.classList.remove("active"));
    document.getElementById(id)?.classList.add("active");
  };

  const checkLocation = () => {
    // Development bypass
    if (process.env.NODE_ENV === "development" || searchParams.get("dev") === "true") {
      goTo("screen-loc-ok");
      return;
    }

    if (!navigator.geolocation) {
      window.alert("เบราว์เซอร์ของคุณไม่รองรับ Geolocation / Browser does not support geolocation.");
      return;
    }

    const button = document.getElementById("btn-check-loc");
    const checking = document.getElementById("loc-checking");
    button.style.display = "none";
    checking.style.display = "block";

    navigator.geolocation.getCurrentPosition(
      pos => {
        const dist = haversine(pos.coords.latitude, pos.coords.longitude, TARGET_LAT, TARGET_LNG);
        if (dist <= RADIUS_M) {
          goTo("screen-loc-ok");
        } else {
          const km = (dist / 1000).toFixed(2);
          document.getElementById("err-dist").textContent =
            `ระยะห่างของคุณจากสถานที่จัดงาน: ~${km} กม. (ต้องอยู่ภายใน 500 ม.)`;
          goTo("screen-loc-err");
        }
        button.style.display = "flex";
        checking.style.display = "none";
      },
      err => {
        button.style.display = "flex";
        checking.style.display = "none";
        let msg = "ไม่สามารถรับตำแหน่งได้ / Could not get location.";
        if (err.code === 1) {
          msg = "คุณปฏิเสธการเข้าถึงตำแหน่ง กรุณาอนุญาตและลองใหม่ / Location permission denied.";
        }
        window.alert(msg);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <>
      <div className="screen active" id="screen-welcome">
        <div className="card">
          <div className="badge"><span className="dot" /> Big Game 2026 · Staff Portal</div>
          <div className="headline">Hello<br />Staff &amp;<br /><span>P&apos;Demo</span></div>
          <p className="sub">ยินดีต้อนรับสู่ระบบเช็คอินสตาฟ<br /><strong>Big Game 2026</strong> — กรุณายืนยันตัวตนก่อนเริ่มงาน</p>
          <button className="btn btn-primary" onClick={() => goTo("screen-location")}>
            <PinIcon />
            เริ่มเช็คอิน / Start Check-in
          </button>
          {authError === "AccessDenied" && (
            <p className="auth-error">กรุณาเข้าสู่ระบบด้วยบัญชี @docchula.com เท่านั้น</p>
          )}
          <div className="corner">v2026.1</div>
        </div>
      </div>

      <div className="screen" id="screen-location">
        <div className="card">
          <div className="steps">
            <div className="step done" />
            <div className="step active" />
            <div className="step" />
          </div>
          <div className="badge"><span className="dot" /> ขั้นตอนที่ 1 · Step 1</div>
          <div className="headline headline-small">ตรวจสอบ<br /><span>ตำแหน่ง</span></div>

          <div className="disclaimer">
            <div className="disclaimer-title">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              Privacy Notice · นโยบายความเป็นส่วนตัว
            </div>
            <p><strong className="plain-strong">🇬🇧</strong> This website does <strong className="gold-strong">not</strong> collect, store, or share your location data. Your coordinates are used <em>only in real-time within your browser</em> to verify that you are within the event area. Nothing is sent to any server.</p>
            <p><strong className="plain-strong">🇹🇭</strong> เว็บไซต์นี้ <strong className="gold-strong">ไม่เก็บ ไม่บันทึก และไม่ส่งต่อ</strong> ข้อมูลตำแหน่งของคุณ ระบบจะใช้พิกัดเพื่อตรวจสอบว่าคุณอยู่ในบริเวณงานเท่านั้น โดยประมวลผลในเบราว์เซอร์ของคุณเอง ไม่มีข้อมูลถูกส่งออกไปยังเซิร์ฟเวอร์ใด ๆ</p>
          </div>

          <button className="btn btn-primary" id="btn-check-loc" onClick={checkLocation}>
            <PinIcon />
            อนุญาตและตรวจสอบตำแหน่ง
          </button>
          <button className="btn btn-ghost" onClick={() => goTo("screen-welcome")}>← ย้อนกลับ</button>

          <div id="loc-checking" className="loc-checking">
            <div className="loc-spinner">
              <div className="spinner-ring" />
              <p>กำลัง<strong>ตรวจสอบตำแหน่ง</strong>…<br /><em>Checking your location</em></p>
            </div>
          </div>

          <div className="corner">LOCATION</div>
        </div>
      </div>

      <div className="screen" id="screen-loc-ok">
        <div className="card centered">
          <div className="steps">
            <div className="step done" />
            <div className="step done" />
            <div className="step active" />
          </div>
          <div className="status-icon ok">✓</div>
          <div className="status-title ok">Location OK</div>
          <p className="status-msg">ยืนยันแล้ว — คุณอยู่ในบริเวณ<strong className="plain-strong"> คณะแพทยศาสตร์ จุฬาลงกรณ์มหาวิทยาลัย</strong><br /><span>Confirmed — you are within the Faculty of Medicine, Chulalongkorn University event zone.</span></p>

          <div className="divider">เข้าสู่ระบบเพื่อเช็คอิน · Sign in to continue</div>

          <button className="btn btn-google" onClick={() => signIn("google", { callbackUrl: "/checked-in", prompt: "select_account" })}>
            <GoogleIcon />
            Sign in with Docchula
          </button>
          <p className="signin-note">ลงชื่อเข้าใช้ด้วยบัญชี Docchula ของคุณ<br />เพื่อบันทึกการเข้าร่วมงาน Big Game 2026</p>
          <div className="corner">SIGN IN</div>
        </div>
      </div>

      <div className="screen" id="screen-loc-err">
        <div className="card centered">
          <div className="status-icon err">✕</div>
          <div className="status-title err">ตำแหน่งไม่ถูกต้อง</div>
          <p className="status-msg">คุณต้องอยู่ในบริเวณคณะแพทย์จุฬาฯ<br />จึงจะสามารถเช็คอินได้<br /><span>You must be within the Faculty of Medicine,<br />Chulalongkorn University to check in.</span></p>
          <p id="err-dist" className="err-dist" />
          <button className="btn btn-primary" onClick={() => goTo("screen-location")}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <polyline points="1 4 1 10 7 10" />
              <path d="M3.51 15a9 9 0 1 0 .49-4.5" />
            </svg>
            ลองอีกครั้ง / Try Again
          </button>
          <div className="corner">ERROR</div>
        </div>
      </div>
    </>
  );
}

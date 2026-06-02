"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const TARGET_LAT = 13.733483;
const TARGET_LNG = 100.537590;
const RADIUS_M = 200;

function GoogleIcon() {
  return (
    <svg className="g-icon" viewBox="0 0 268.152 273.883" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id="a">
          <stop offset="0" stopColor="#0fbc5c" />
          <stop offset="1" stopColor="#0cba65" />
        </linearGradient>
        <linearGradient id="g">
          <stop offset=".231" stopColor="#0fbc5f" />
          <stop offset=".312" stopColor="#0fbc5f" />
          <stop offset=".366" stopColor="#0fbc5e" />
          <stop offset=".458" stopColor="#0fbc5d" />
          <stop offset=".54" stopColor="#12bc58" />
          <stop offset=".699" stopColor="#28bf3c" />
          <stop offset=".771" stopColor="#38c02b" />
          <stop offset=".861" stopColor="#52c218" />
          <stop offset=".915" stopColor="#67c30f" />
          <stop offset="1" stopColor="#86c504" />
        </linearGradient>
        <linearGradient id="h">
          <stop offset=".142" stopColor="#1abd4d" />
          <stop offset=".248" stopColor="#6ec30d" />
          <stop offset=".312" stopColor="#8ac502" />
          <stop offset=".366" stopColor="#a2c600" />
          <stop offset=".446" stopColor="#c8c903" />
          <stop offset=".54" stopColor="#ebcb03" />
          <stop offset=".616" stopColor="#f7cd07" />
          <stop offset=".699" stopColor="#fdcd04" />
          <stop offset=".771" stopColor="#fdce05" />
          <stop offset=".861" stopColor="#ffce0a" />
        </linearGradient>
        <linearGradient id="f">
          <stop offset=".316" stopColor="#ff4c3c" />
          <stop offset=".604" stopColor="#ff692c" />
          <stop offset=".727" stopColor="#ff7825" />
          <stop offset=".885" stopColor="#ff8d1b" />
          <stop offset="1" stopColor="#ff9f13" />
        </linearGradient>
        <linearGradient id="b">
          <stop offset=".231" stopColor="#ff4541" />
          <stop offset=".312" stopColor="#ff4540" />
          <stop offset=".458" stopColor="#ff4640" />
          <stop offset=".54" stopColor="#ff473f" />
          <stop offset=".699" stopColor="#ff5138" />
          <stop offset=".771" stopColor="#ff5b33" />
          <stop offset=".861" stopColor="#ff6c29" />
          <stop offset="1" stopColor="#ff8c18" />
        </linearGradient>
        <linearGradient id="d">
          <stop offset=".408" stopColor="#fb4e5a" />
          <stop offset="1" stopColor="#ff4540" />
        </linearGradient>
        <linearGradient id="c">
          <stop offset=".132" stopColor="#0cba65" />
          <stop offset=".21" stopColor="#0bb86d" />
          <stop offset=".297" stopColor="#09b479" />
          <stop offset=".396" stopColor="#08ad93" />
          <stop offset=".477" stopColor="#0aa6a9" />
          <stop offset=".568" stopColor="#0d9cc6" />
          <stop offset=".667" stopColor="#1893dd" />
          <stop offset=".769" stopColor="#258bf1" />
          <stop offset=".859" stopColor="#3086ff" />
        </linearGradient>
        <linearGradient id="e">
          <stop offset=".366" stopColor="#ff4e3a" />
          <stop offset=".458" stopColor="#ff8a1b" />
          <stop offset=".54" stopColor="#ffa312" />
          <stop offset=".616" stopColor="#ffb60c" />
          <stop offset=".771" stopColor="#ffcd0a" />
          <stop offset=".861" stopColor="#fecf0a" />
          <stop offset=".915" stopColor="#fecf08" />
          <stop offset="1" stopColor="#fdcd01" />
        </linearGradient>
        <linearGradient href="#a" id="s" x1="219.7" x2="254.467" y1="329.535" y2="329.535" gradientUnits="userSpaceOnUse" />
        <radialGradient href="#b" id="m" cx="109.627" cy="135.862" r="71.46" fx="109.627" fy="135.862" gradientTransform="matrix(-1.93688 1.043 1.45573 2.55542 290.525 -400.634)" gradientUnits="userSpaceOnUse" />
        <radialGradient href="#c" id="n" cx="45.259" cy="279.274" r="71.46" fx="45.259" fy="279.274" gradientTransform="matrix(-3.5126 -4.45809 -1.69255 1.26062 870.8 191.554)" gradientUnits="userSpaceOnUse" />
        <radialGradient href="#d" id="l" cx="304.017" cy="118.009" r="47.854" fx="304.017" fy="118.009" gradientTransform="matrix(2.06435 0 0 2.59204 -297.679 -151.747)" gradientUnits="userSpaceOnUse" />
        <radialGradient href="#e" id="o" cx="181.001" cy="177.201" r="71.46" fx="181.001" fy="177.201" gradientTransform="matrix(-.24858 2.08314 2.96249 .33417 -255.146 -331.164)" gradientUnits="userSpaceOnUse" />
        <radialGradient href="#f" id="p" cx="207.673" cy="108.097" r="41.102" fx="207.673" fy="108.097" gradientTransform="matrix(-1.2492 1.34326 -3.89684 -3.4257 880.501 194.905)" gradientUnits="userSpaceOnUse" />
        <radialGradient href="#g" id="r" cx="109.627" cy="135.862" r="71.46" fx="109.627" fy="135.862" gradientTransform="matrix(-1.93688 -1.043 1.45573 -2.55542 290.525 838.683)" gradientUnits="userSpaceOnUse" />
        <radialGradient href="#h" id="j" cx="154.87" cy="145.969" r="71.46" fx="154.87" fy="145.969" gradientTransform="matrix(-.0814 -1.93722 2.92674 -.11625 -215.135 632.86)" gradientUnits="userSpaceOnUse" />
        <filter id="q" width="1.097" height="1.116" x="-.048" y="-.058" colorInterpolationFilters="sRGB">
          <feGaussianBlur stdDeviation="1.701" />
        </filter>
        <filter id="k" width="1.033" height="1.02" x="-.017" y="-.01" colorInterpolationFilters="sRGB">
          <feGaussianBlur stdDeviation=".242" />
        </filter>
        <clipPath id="i" clipPathUnits="userSpaceOnUse">
          <path d="M371.378 193.24H237.083v53.438h77.167c-1.241 7.563-4.026 15.003-8.105 21.786-4.674 7.773-10.451 13.69-16.373 18.196-17.74 13.498-38.42 16.258-52.783 16.258-36.283 0-67.283-23.286-79.285-54.928-.484-1.149-.805-2.335-1.197-3.507a81.115 81.115 0 0 1-4.101-25.448c0-9.226 1.569-18.057 4.43-26.398 11.285-32.897 42.985-57.467 80.179-57.467 7.481 0 14.685.884 21.517 2.648a77.668 77.668 0 0 1 33.425 18.25l40.834-39.712c-24.839-22.616-57.219-36.32-95.844-36.32-30.878 0-59.386 9.553-82.748 25.7-18.945 13.093-34.483 30.625-44.97 50.985-9.753 18.879-15.094 39.8-15.094 62.294 0 22.495 5.35 43.633 15.103 62.337v.126c10.302 19.857 25.368 36.954 43.678 49.988 15.997 11.386 44.68 26.551 84.031 26.551 22.63 0 42.687-4.051 60.375-11.644 12.76-5.478 24.065-12.622 34.301-21.804 13.525-12.132 24.117-27.139 31.347-44.404 7.23-17.265 11.097-36.79 11.097-57.957 0-9.858-.998-19.87-2.689-28.968Z" />
        </clipPath>
      </defs>
      <g clipPath="url(#i)" transform="matrix(.95792 0 0 .98525 -90.174 -78.856)">
        <path fill="url(#j)" d="M92.076 219.958c.148 22.14 6.501 44.983 16.117 63.424v.127c6.949 13.392 16.445 23.97 27.26 34.452l65.327-23.67c-12.36-6.235-14.246-10.055-23.105-17.026-9.054-9.066-15.802-19.473-20.004-31.677h-.17l.17-.127c-2.765-8.058-3.037-16.613-3.14-25.503Z" filter="url(#k)" />
        <path fill="url(#l)" d="M237.083 79.025c-6.456 22.526-3.988 44.421 0 57.161 7.457.006 14.64.888 21.45 2.647a77.662 77.662 0 0 1 33.424 18.25l41.88-40.726c-24.81-22.59-54.667-37.297-96.754-37.332Z" filter="url(#k)" />
        <path fill="url(#m)" d="M236.943 78.847c-31.67 0-60.91 9.798-84.871 26.359a145.533 145.533 0 0 0-24.332 21.15c-1.904 17.744 14.257 39.551 46.262 39.37 15.528-17.936 38.495-29.542 64.056-29.542l.07.002-1.044-57.335c-.048 0-.093-.004-.14-.004Z" filter="url(#k)" />
        <path fill="url(#n)" d="m341.475 226.379-28.268 19.285c-1.24 7.562-4.028 15.002-8.107 21.786-4.674 7.772-10.45 13.69-16.373 18.196-17.702 13.47-38.328 16.244-52.687 16.255-14.842 25.102-17.444 37.675 1.043 57.934 22.877-.016 43.157-4.117 61.046-11.796 12.931-5.551 24.388-12.792 34.761-22.097 13.706-12.295 24.442-27.503 31.769-45 7.327-17.497 11.245-37.282 11.245-58.734Z" filter="url(#k)" />
        <path fill="#3086ff" d="M234.996 191.21v57.498h136.006c1.196-7.874 5.152-18.064 5.152-26.5 0-9.858-.996-21.899-2.687-30.998Z" filter="url(#k)" />
        <path fill="url(#o)" d="M128.39 124.327c-8.394 9.119-15.564 19.326-21.249 30.364-9.753 18.879-15.094 41.83-15.094 64.324 0 .317.026.627.029.944 4.32 8.224 59.666 6.649 62.456 0-.004-.31-.039-.613-.039-.924 0-9.226 1.57-16.026 4.43-24.367 3.53-10.289 9.056-19.763 16.123-27.926 1.602-2.031 5.875-6.397 7.121-9.016.475-.997-.862-1.557-.937-1.908-.083-.393-1.876-.077-2.277-.37-1.275-.929-3.8-1.414-5.334-1.845-3.277-.921-8.708-2.953-11.725-5.06-9.536-6.658-24.417-14.612-33.505-24.216Z" filter="url(#k)" />
        <path fill="url(#p)" d="M162.099 155.857c22.112 13.301 28.471-6.714 43.173-12.977l-25.574-52.664a144.74 144.74 0 0 0-26.543 14.504c-12.316 8.512-23.192 18.9-32.176 30.72Z" filter="url(#q)" />
        <path fill="url(#r)" d="M171.099 290.222c-29.683 10.641-34.33 11.023-37.062 29.29a144.806 144.806 0 0 0 16.792 13.984c15.996 11.386 46.766 26.551 86.118 26.551.046 0 .09-.004.137-.004v-59.157l-.094.002c-14.736 0-26.512-3.843-38.585-10.527-2.977-1.648-8.378 2.777-11.123.799-3.786-2.729-12.9 2.35-16.183-.938Z" filter="url(#k)" />
        <path fill="url(#s)" d="M219.7 299.023v59.996c5.506.64 11.236 1.028 17.247 1.028 6.026 0 11.855-.307 17.52-.872v-59.748a105.119 105.119 0 0 1-17.477 1.461c-5.932 0-11.7-.686-17.29-1.865Z" filter="url(#k)" opacity=".5" />
      </g>
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
            `ระยะห่างของคุณจากสถานที่จัดงาน: ~${km} กม. (ต้องอยู่ภายใน 200 ม.)`;
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
          <p className="contact-info">
            พบปัญหาติดต่อ / Any problems? Please contact{" "}
            <a href="mailto:pawinner@docchula.com">pawinner@docchula.com</a>
          </p>
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

          <p className="contact-info">
            พบปัญหาติดต่อ / Any problems? Please contact{" "}
            <a href="mailto:pawinner@docchula.com">pawinner@docchula.com</a>
          </p>
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
          <p className="contact-info">
            พบปัญหาติดต่อ / Any problems? Please contact{" "}
            <a href="mailto:pawinner@docchula.com">pawinner@docchula.com</a>
          </p>
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
          <p className="contact-info">
            พบปัญหาติดต่อ / Any problems? Please contact{" "}
            <a href="mailto:pawinner@docchula.com">pawinner@docchula.com</a>
          </p>
          <div className="corner">ERROR</div>
        </div>
      </div>
    </>
  );
}

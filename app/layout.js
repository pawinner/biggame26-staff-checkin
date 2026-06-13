import "./styles.css";
import { Analytics } from "@vercel/analytics/next";

export const metadata = {
  title: "Big Game 2026 - Staff Check-in",
  description: "Staff check-in portal for Big Game 2026",
  icons: {
    icon: "/images/icon.png",
    shortcut: "/images/icon.png",
    apple: "/images/icon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}


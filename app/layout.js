import "./styles.css";

export const metadata = {
  title: "Big Game 2026 - Staff Check-in",
  description: "Staff check-in portal for Big Game 2026"
};

export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <body>{children}</body>
    </html>
  );
}

import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  subsets: ["vietnamese", "latin"],
  weight: ["400", "600", "700", "800", "900"],
  variable: "--font-nunito",
});

export const metadata: Metadata = {
  title: { default: "English Practice", template: "%s | English Practice" },
  description: "A friendly, secure English practice test for Grade 2 students.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi" className={nunito.variable}>
      <body className={nunito.className}>{children}</body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "English Practice", template: "%s | English Practice" },
  description: "A friendly, secure English practice test for Grade 2 students.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

"use client";

import { Poppins } from "next/font/google";
import "../globals.css";

const font = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function PracticeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={`${font.className} min-h-screen bg-darkmode`}>
      {children}
    </div>
  );
}

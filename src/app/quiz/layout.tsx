"use client";

import { Poppins } from "next/font/google";
import "../globals.css";
import ProtectedRoute from "@/components/Auth/ProtectedRoute";

const font = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function QuizLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ProtectedRoute>
      <div className={`${font.className} min-h-screen bg-darkmode`}>
        {children}
      </div>
    </ProtectedRoute>
  );
}

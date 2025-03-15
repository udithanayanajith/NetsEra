"use client";

import { usePathname } from "next/navigation";
import { Poppins } from "next/font/google";
import "../globals.css";
import ProtectedRoute from "@/components/Auth/ProtectedRoute";

const font = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function QuizLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();

  // Return children directly for all quiz content pages except the main menu
  if (pathname && (pathname.startsWith('/quiz/lab') || pathname.startsWith('/quiz/normal'))) {
    return (
      <ProtectedRoute>
        <div className={`${font.className} min-h-screen bg-darkmode`}>
          {children}
        </div>
      </ProtectedRoute>
    );
  }

  // Wrap main quiz menu with container
  return (
    <ProtectedRoute>
      <div className={`${font.className} min-h-screen bg-darkmode`}>
        {children}
      </div>
    </ProtectedRoute>
  );
}

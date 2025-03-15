"use client";

import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import { usePathname } from "next/navigation";

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isStandalonePage = pathname === "/practice" || 
                          pathname?.startsWith("/practice/configuration") ||
                          pathname?.startsWith("/quiz/lab") || 
                          pathname?.startsWith("/quiz/normal");

  if (isStandalonePage) {
    return children;
  }

  return (
    <>
      <Header />
      {children}
      <Footer />
      <ScrollToTop />
    </>
  );
}

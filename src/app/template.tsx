"use client";

import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import { usePathname } from "next/navigation";

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPracticePage = pathname === "/practice";

  if (isPracticePage) {
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

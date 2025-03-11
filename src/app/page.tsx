import React from "react";
import Hero from "@/components/Home/Hero";
import Features from "@/components/Home/Features";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "NetsEra",
};

export default function Home() {
  return (
    <main>
      <Hero />
      <Features />
    </main>
  );
}

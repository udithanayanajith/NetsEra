import { HeaderItem } from "@/types/menu";

export const headerData: HeaderItem[] = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "#about-section" },
  { 
    label: "Learn", 
    href: "/learn",
    submenu: [
      { label: "Router Configuration", href: "/learn/router" },
      { label: "PC Configuration", href: "/learn/pc" },
      { label: "Switch Configuration", href: "/learn/switch" }
    ]
  },
  { label: "Practice", href: "/practice" },
  { label: "Quiz", href: "#quiz-section" },
];

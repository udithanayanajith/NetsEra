interface MenuItem {
  id: number;
  label: string;
  href: string;
  submenu?: SubmenuItem[];
}

interface SubmenuItem {
  label: string;
  href: string;
  newTab?: boolean;
}

export const headerData: MenuItem[] = [
  {
    id: 1,
    label: "Home",
    href: "/",
  },
  {
    id: 2,
    label: "About Us",
    href: "#about-section",
  },
  { 
    id: 3,
    label: "Learn", 
    href: "/learn",
    submenu: [
      { label: "Router Configuration", href: "/learn/router" },
      { label: "PC Configuration", href: "/learn/pc" },
      { label: "Switch Configuration", href: "/learn/switch" }
    ]
  },
  {
    id: 4,
    label: "Practice",
    href: "#",
    submenu: [
      { label: "Basic Practice", href: "/practice" },
      { label: "Configuration Practice", href: "/practice/configuration" }
    ]
  },
  {
    id: 5,
    label: "Quiz", 
    href: "#",
    submenu: [
      { label: "Lab Quiz", href: "/quiz/lab" },
      { label: "Normal Quiz", href: "/quiz/normal" }
    ]
  },
];

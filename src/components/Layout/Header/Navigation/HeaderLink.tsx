"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface HeaderLinkProps {
  item: {
    label: string;
    href: string;
    openInNewWindow?: boolean;
    submenu?: {
      label: string;
      href: string;
    }[];
  };
}

const HeaderLink = ({ item }: HeaderLinkProps) => {
  const pathUrl = usePathname();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (item.submenu) {
    return (
      <div className="relative group" ref={dropdownRef}>
        <button
          className={`text-lg font-medium text-white hover:text-orange-500 transition-colors duration-300 flex items-center ${
            pathUrl.startsWith(item.href) ? "text-orange-500" : ""
          }`}
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          {item.label}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 ml-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
        {isDropdownOpen && (
          <div
            className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 z-10"
          >
            <div className="py-1">
              {item.submenu.map((subItem, index) => (
                <Link
                  key={index}
                  href={subItem.href}
                  className={`block px-4 py-2 text-sm text-white hover:bg-gray-700 ${
                    pathUrl === subItem.href ? "bg-gray-700" : ""
                  }`}
                  onClick={() => setIsDropdownOpen(false)}
                >
                  {subItem.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      href={item.href}
      target={item.openInNewWindow ? "_blank" : undefined}
      rel={item.openInNewWindow ? "noopener noreferrer" : undefined}
      className={`text-lg font-medium text-white hover:text-orange-500 transition-colors duration-300 ${
        pathUrl === item.href ? "text-orange-500" : ""
      }`}
    >
      {item.label}
    </Link>
  );
};

export default HeaderLink;
